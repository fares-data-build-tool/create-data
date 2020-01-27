import omitEmpty from "omit-empty";
import { S3Handler, S3Event } from "aws-lambda";
import AWS from "aws-sdk";
import util from "util";
import csvParse from "csv-parse/lib/sync";
import { WriteRequest } from "aws-sdk/clients/dynamodb";
import { parseString } from "xml2js";

export type ParsedXmlData = tndsDynamoDBData;
export type ParsedCsvData = servicesDynamoDBData;

export interface s3ObjectParameters {
    Bucket: string;
    Key: string;
}
export interface tndsDynamoDBData {
    Data: {};
    FileName: string;
}

export interface servicesDynamoDBData {
    NationalOperatorCode: string;
    LineName: string;
    RegionCode: string;
    RegionOperatorCode: string;
    ServiceCode: string;
    Description: string;
    StartDate: string;
}

interface PushToDynamoXmlInput {
    parsedXmlLines: ParsedXmlData;
    tableName: string;
}

interface PushToDynamoCsvInput {
    parsedCsvLines: ParsedCsvData[];
    tableName: string;
}

export async function fetchDataFromS3AsString(
    parameters: s3ObjectParameters
): Promise<string> {
    const s3 = new AWS.S3();
    const data = await s3.getObject(parameters).promise();
    const dataAsString = data.Body?.toString("utf-8")!;
    return dataAsString;
}

export function fileExtensionGetter(fileName: string) {
    return fileName.split(".").pop();
}

export function tableChooser(fileExtension: string) {
    if (!process.env.SERVICES_TABLE_NAME || !process.env.TNDS_TABLE_NAME) {
        throw new Error(
            "Environment variables for table names have not been set or received."
        );
    }

    let tableName = "";

    if (fileExtension === "csv") {
        return (tableName = process.env.SERVICES_TABLE_NAME);
    } else if (fileExtension === "xml") {
        return (tableName = process.env.TNDS_TABLE_NAME);
    } else {
        console.error(`File is not of a supported format type (${fileExtension})`);
        throw new Error(`Unsupported file type ${fileExtension}`);
    }
}

export function removeFirstLineOfString(xmlData: string): string {
    return xmlData.substring(xmlData.indexOf("\n") + 1);
}

export async function xmlParser(xmlData: string): Promise<ParsedXmlData> {
    const xmlWithoutFirstLine = removeFirstLineOfString(xmlData);

    return new Promise((resolve, reject) => {
        parseString(xmlWithoutFirstLine, function (err, result) {
            if (err) {
                return reject(
                    "Parsing xml failed. Error message: " +
                    err.message +
                    " and error name: " +
                    err.name
                );
            } else {
                const noEmptyResult = omitEmpty(result);
                const stringified = JSON.stringify(noEmptyResult) as any;
                return resolve(stringified);
            }
        });
    });
}

export function csvParser(csvData: string): ParsedCsvData[] {
    const parsedData: ParsedCsvData[] = csvParse(csvData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ","
    });
    return parsedData;
}

export function formatDynamoWriteRequest(
    parsedLines: servicesDynamoDBData[]
): AWS.DynamoDB.WriteRequest[][] {
    const parsedDataMapper = (parsedDataItem: ParsedCsvData): WriteRequest => ({
        PutRequest: { Item: parsedDataItem as any }
    });
    const dynamoWriteRequests = parsedLines.map(parsedDataMapper);
    const emptyBatch: WriteRequest[][] = [];
    const batchSize = 25;
    const dynamoWriteRequestBatches = dynamoWriteRequests.reduce(function (
        result,
        _value,
        index,
        array
    ) {
        if (index % batchSize === 0)
            result.push(array.slice(index, index + batchSize));
        return result;
    },
        emptyBatch);
    return dynamoWriteRequestBatches;
}

export async function writeCsvBatchesToDynamo({
    parsedCsvLines,
    tableName
}: PushToDynamoCsvInput) {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true
    });

    const dynamoWriteRequestBatches = formatDynamoWriteRequest(parsedCsvLines);
    let count = 0;

    for (const batch of dynamoWriteRequestBatches) {
        console.log("Writing to DynamoDB...");
        console.log(
            "Reading options from event:\n",
            util.inspect(batch, { depth: 5 })
        );
        try {
            await dynamodb
                .batchWrite({
                    RequestItems: {
                        [tableName]: batch
                    }
                })
                .promise();
        } catch {
            console.log("Throwing error....");
            throw new Error("Could not write batch to DynamoDB");
        }
        let batchLength = batch.length;
        console.log(`Wrote batch of ${batch.length} items to Dynamo DB.`);
        count += batchLength;
    }
    console.log(`Wrote ${dynamoWriteRequestBatches.length} batches to DynamoDB`);
    console.log(`Wrote ${count} total items to DynamoDB.`);
}

export async function writeXmlToDynamo({
    parsedXmlLines,
    tableName
}: PushToDynamoXmlInput) {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true
    });

    console.log("Writing entries to dynamo DB.");

    await dynamodb
        .put({
            TableName: tableName,
            Item: parsedXmlLines
        })
        .promise();

    console.log("Dynamo DB put request complete.");
}

export function cleanParsedXmlData(parsedXmlData: any): tndsDynamoDBData {
    const parsedJson = JSON.parse(parsedXmlData);
    let extractedFilename = parsedJson["TransXChange"]["$"]["FileName"];
    extractedFilename = extractedFilename.split(".");
    extractedFilename = extractedFilename[0];
    const creationDateTime = new Date().toISOString().slice(0, 19); // 19 characters limits this to just date and time

    return {
        FileName: extractedFilename + "_" + creationDateTime,
        Data: parsedXmlData
    };
}

export function setS3ObjectParams(event: S3Event): s3ObjectParameters {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(
        event.Records[0].s3.object.key.replace(/\+/g, " ")
    ); // Object key may have spaces or unicode non-ASCII characters
    const params: s3ObjectParameters = {
        Bucket: s3BucketName,
        Key: s3FileName
    };
    return params;
}

export const s3hook = async (event: S3Event) => {
    console.log(
        "Reading options from event:\n",
        util.inspect(event, { depth: 5 })
    );

    const params = setS3ObjectParams(event);

    console.log(
        `Got S3 event for key '${params.Key}' in bucket '${params.Bucket}'`
    );

    const fileExtension = fileExtensionGetter(params.Key);

    if (!fileExtension) {
        throw Error("File Extension could not be retrieved");
    }

    const stringifiedS3Data = await fetchDataFromS3AsString(params);

    const tableName = tableChooser(fileExtension);

    let parsedData;

    if (tableName === process.env.TNDS_TABLE_NAME) {
        parsedData = await xmlParser(stringifiedS3Data);

        if (!parsedData) {
            throw Error(
                "Data parsing has failed, stopping before database writing occurs."
            );
        }

        parsedData = cleanParsedXmlData(parsedData);

        await writeXmlToDynamo({
            tableName: tableName,
            parsedXmlLines: parsedData
        });
    } else if (tableName === process.env.SERVICES_TABLE_NAME) {
        parsedData = csvParser(stringifiedS3Data);

        if (!parsedData) {
            throw Error(
                "Data parsing has failed, stopping before database writing occurs."
            );
        }
        await writeCsvBatchesToDynamo({
            tableName: tableName,
            parsedCsvLines: parsedData
        });
    }
};
