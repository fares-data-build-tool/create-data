import omitEmpty from 'omit-empty';
import { Context, S3Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import util from 'util';
import csvParse from "csv-parse/lib/sync";
import { WriteRequest, PutRequest } from 'aws-sdk/clients/dynamodb';
import { parseString } from 'xml2js';

type ParsedXmlData = tndsDynamoDBData;
type ParsedCsvData = servicesDynamoDBData;

interface s3ObjectParameters {
    Bucket: string;
    Key: string;
}

interface tndsDynamoDBData {
    FileName: string
}

interface servicesDynamoDBData {
    NationalOperatorCode: string,
    LineName: string,
    RegionCode: string,
    RegionOperatorCode: string,
    ServiceCode: string,
    Description: string,
    StartDate: string
}

interface PushToDynamoXmlInput {
    parsedXmlLines: ParsedXmlData;
    tableName: string;
}

interface PushToDynamoCsvInput {
    parsedCsvLines: ParsedCsvData[];
    tableName: string;
}


export async function fetchDataFromS3AsString(parameters: s3ObjectParameters): Promise<string> {
    const s3 = new AWS.S3();
    const data = await s3.getObject(parameters).promise();
    const dataAsString = data.Body?.toString("utf-8")!;
    return dataAsString;
}

export function fileExtensionGetter(fileName: string) {
    return fileName.split('.').pop();
}

export function tableChooser(fileExtension: string) {

    if (!process.env.SERVICES_TABLE_NAME || !process.env.TNDS_TABLE_NAME) {
        throw new Error("Environment variables for table names have not been set or received.")
    }

    let tableName = "";

    if (fileExtension === "csv") {
        return tableName = process.env.SERVICES_TABLE_NAME;
    } else if (fileExtension === "xml") {
        return tableName = process.env.TNDS_TABLE_NAME;
    } else {
        console.error(`File is not of a supported format type (${fileExtension})`);
        throw new Error(`Unsupported file type ${fileExtension}`);
    }

}

export async function xmlParser(xmlData: string): Promise<ParsedXmlData> {

    let xmlWithoutFirstLine = xmlData.substring(xmlData.indexOf("\n") + 1);

    return new Promise((resolve, reject) => {
        parseString(xmlWithoutFirstLine, function (err, result) {
            if (err) {
                return reject("Parsing xml failed. Error message: " + err.message + " and error name: " + err.name)
            } else {
                const noEmptyResult = omitEmpty(result);
                const stringified = JSON.stringify(noEmptyResult) as any;;
                return resolve(stringified);
            }
        });
    });
}

export function csvParser(csvData: string) {
    const parsedData: ParsedCsvData[] = csvParse(csvData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ","
    });
    return parsedData;
}

export async function writeCsvBatchesToDynamo({ parsedCsvLines, tableName }: PushToDynamoCsvInput) {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true
    });
    const parsedDataMapper = (parsedDataItem: ParsedCsvData): WriteRequest => ({
        PutRequest: { Item: parsedDataItem as any }
    });
    const dynamoWriteRequests = parsedCsvLines.map(parsedDataMapper);

    const emptyBatch: WriteRequest[][] = [];
    const batchSize = 25;
    const dynamoWriteRequestBatches = dynamoWriteRequests.reduce(function (result, _value, index, array) {
        if (index % batchSize === 0)
            result.push(array.slice(index, index + batchSize));
        return result;
    }, emptyBatch);

    for (const batch of dynamoWriteRequestBatches) {
        console.log("Writing to DynamoDB...");
        console.log(
            "Reading options from event:\n",
            util.inspect(batch, { depth: 5 })
        );
        await dynamodb
            .batchWrite({
                RequestItems: {
                    [tableName]: batch
                }
            })
            .promise();
        console.log(`Wrote batch of ${batch.length} items to Dynamo DB.`);
    }
    console.log(`Wrote ${dynamoWriteRequestBatches.length} batches to DynamoDB`);
}

export async function writeXmlToDynamo({ parsedXmlLines, tableName }: PushToDynamoXmlInput) {

    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true
    });

    console.log("Writing entries to dynamo DB.")

    await dynamodb.put(
        {
            TableName: tableName,
            Item: parsedXmlLines
        }
    ).promise();

    console.log("Dynamo DB put request complete.")

}

export function cleanParsedXmlData(parsedXmlData: any) {
    const parsedJson = JSON.parse(parsedXmlData);
    let extractedFilename = parsedJson["TransXChange"]["$"]["FileName"];
    extractedFilename = extractedFilename.split(".");
    extractedFilename = extractedFilename[0];
    const creationDateTime = new Date().toISOString().slice(0, 19); // 19 characters limits this to just date and time
    parsedJson["FileName"] = extractedFilename + "_" + creationDateTime;
    return parsedJson;
}

export const s3hook: S3Handler = async (event: any, context: Context) => {

    console.log("Reading options from event:\n", util.inspect(event, { depth: 5 }));

    const s3FileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const s3BucketName = event.Records[0].s3.bucket.name;

    console.log(`Got S3 event for key '${s3FileName}' in bucket '${s3BucketName}'`);

    const fileExtension = fileExtensionGetter(s3FileName);

    if (!fileExtension) {
        throw Error("File Extension could not be retrieved");
    }

    const params: s3ObjectParameters = {
        Bucket: s3BucketName,
        Key: s3FileName
    };

    const stringifiedS3Data = await fetchDataFromS3AsString(params);

    const tableName = tableChooser(fileExtension);

    let parsedData;

    if (tableName === process.env.TNDS_TABLE_NAME) {
        parsedData = await xmlParser(stringifiedS3Data);

        if (!parsedData) {
            throw Error("Data parsing has failed, stopping before database writing occurs.")
        }

        parsedData = cleanParsedXmlData(parsedData);

        await writeXmlToDynamo({ tableName: tableName, parsedXmlLines: parsedData });

    } else if (tableName === process.env.SERVICES_TABLE_NAME) {
        parsedData = csvParser(stringifiedS3Data);

        if (!parsedData) {
            throw Error("Data parsing has failed, stopping before database writing occurs.")
        }
        await writeCsvBatchesToDynamo({ tableName: tableName, parsedCsvLines: parsedData });
    }

}