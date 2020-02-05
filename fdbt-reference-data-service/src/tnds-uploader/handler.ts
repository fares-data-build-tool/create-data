import omitEmpty from 'omit-empty';
import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import csvParse from 'csv-parse/lib/sync';
import { WriteRequest } from 'aws-sdk/clients/dynamodb';
import { parseString } from 'xml2js';

export type ParsedXmlData = tndsDynamoDBData;
export type ParsedCsvData = servicesDynamoDBData;

interface ExtractedStopPoint {
    StopPointRef: string[];
    CommonName: string[];
    Indicator: string[];
    LocalityName: string[];
    LocalityQualifier: string[];
}

interface ExtractedOperators {
    $: {};
    NationalOperatorCode: string[];
    OperatorCode: string[];
    OperatorShortName: string[];
    OperatorNameOnLicence: string[];
    TradingName: string[];
}

interface StopPointObject {
    StopPointRef: string;
    CommonName: string;
}

export interface s3ObjectParameters {
    Bucket: string;
    Key: string;
}
export interface tndsDynamoDBData {
    Partition?: string;
    Sort?: string;
    LineName: string;
    OperatorShortName: string;
    Description: string;
    StopPoints: StopPointObject[];
}

export interface servicesDynamoDBData {
    NationalOperatorCode: string;
    Partition?: string;
    Sort?: string;
    LineName: string;
    RegionCode: string;
    RegionOperatorCode: string;
    ServiceCode: string;
    Description: string;
    StartDate: string;
}

interface PushToDynamoXmlInput {
    parsedXmlLines: ParsedXmlData[];
    tableName: string;
}

interface PushToDynamoCsvInput {
    parsedCsvLines: ParsedCsvData[];
    tableName: string;
}

export const fetchDataFromS3AsString = async (parameters: s3ObjectParameters): Promise<string> => {
    const s3 = new AWS.S3();
    const data = await s3.getObject(parameters).promise();
    const dataAsString = data.Body?.toString('utf-8')!;
    return dataAsString;
}

export const fileExtensionGetter = (fileName: string) => {
    return fileName.split('.').pop();
}

export const tableChooser = (fileExtension: string) => {
    if (!process.env.SERVICES_TABLE_NAME || !process.env.TNDS_TABLE_NAME) {
        throw new Error('Environment variables for table names have not been set or received.');
    }

    if (fileExtension === 'csv') {
        const tableName = process.env.SERVICES_TABLE_NAME;
        return tableName;
    }
    if (fileExtension === 'xml') {
        const tableName = process.env.TNDS_TABLE_NAME;
        return tableName;
    }
    console.error(`File is not of a supported format type (${fileExtension})`);
    throw new Error(`Unsupported file type ${fileExtension}`);
}

export const removeFirstLineOfString = (xmlData: string): string => {
    return xmlData.substring(xmlData.indexOf('\n') + 1);
}

export const xmlParser = (xmlData: string): Promise<string> => {
    const xmlWithoutFirstLine = removeFirstLineOfString(xmlData);

    return new Promise((resolve, reject) => {
        parseString(xmlWithoutFirstLine, (err, result) => {
            if (err) {
                return reject(new Error(`Parsing xml failed. Error message: ${err.message} and error name: ${err.name}`));
            }
            const noEmptyResult = omitEmpty(result);
            const stringified = JSON.stringify(noEmptyResult) as any;
            return resolve(stringified);
        });
    });
}

export const csvParser = (csvData: string): ParsedCsvData[] => {
    const parsedData: ParsedCsvData[] = csvParse(csvData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ',',
    });
    return parsedData;
}

export const formatDynamoWriteRequest = (parsedLines: servicesDynamoDBData[]): AWS.DynamoDB.WriteRequest[][] => {
    const parsedDataToWriteRequest = (parsedDataItem: ParsedCsvData): WriteRequest => ({
        PutRequest: { Item: parsedDataItem as any },
    });

    const reformattedParsedLines: servicesDynamoDBData[] = [];
    for (let i = 0; i < parsedLines.length; i += 1) {
        const item = parsedLines[i];
        if (item.NationalOperatorCode && item.LineName && item.ServiceCode) {
            const lineNameServiceCode = `${item.LineName}_${item.ServiceCode}`;
            item.Sort = lineNameServiceCode;
            item.Partition = item.NationalOperatorCode;
            reformattedParsedLines.push(item);
        }
    }

    const dynamoWriteRequests = reformattedParsedLines.map(parsedDataToWriteRequest);
    const emptyBatch: WriteRequest[][] = [];
    const batchSize = 25;
    const dynamoWriteRequestBatches = dynamoWriteRequests.reduce((result, _value, index, array) => {
        if (index % batchSize === 0) result.push(array.slice(index, index + batchSize));
        return result;
    }, emptyBatch);
    return dynamoWriteRequestBatches;
}

export const writeBatchesToDynamo = async ({ parsedCsvLines, tableName }: PushToDynamoCsvInput) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true,
    });
    const dynamoWriteRequestBatches = formatDynamoWriteRequest(parsedCsvLines);
    console.log('Number of batches to write to DynamoDB is: ', dynamoWriteRequestBatches.length);
    let count = 0;

    let writePromises = [];

    /* eslint-disable-next-line no-restricted-syntax */
    for (const batch of dynamoWriteRequestBatches) {
        writePromises.push(
            dynamodb
                .batchWrite({
                    RequestItems: {
                        [tableName]: batch,
                    },
                })
                .promise(),
        );

        count += batch.length;

        if (writePromises.length === 100) {
            try {
                await Promise.all(writePromises); // eslint-disable-line no-await-in-loop
                writePromises = [];

                console.log(`Wrote ${count} items to DynamoDB.`);
            } catch (err) {
                console.log(`Throwing error.... ${err.name} : ${err.message}`);
                throw new Error('Could not write batch to DynamoDB');
            }
        }
    }

    try {
        await Promise.all(writePromises);

        console.log(`Wrote ${dynamoWriteRequestBatches.length} total batches to DynamoDB`);
        console.log(`Wrote ${count} total items to DynamoDB.`);
    } catch (err) {
        console.log(`Throwing error.... ${err.name} : ${err.message}`);
        throw new Error('Could not write batch to DynamoDB');
    }
};

export const writeXmlToDynamo = async ({ parsedXmlLines, tableName }: PushToDynamoXmlInput) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true,
    });

    console.log('Writing entries to dynamo DB.');

    for (let i = 0; i < parsedXmlLines.length; i+=1) {
        await dynamodb
            .put({
                TableName: tableName,
                Item: parsedXmlLines[i],
            })
            .promise();
    }
    console.log('Dynamo DB put request complete.');
}

export const cleanParsedXmlData = (parsedXmlData: string): tndsDynamoDBData[] => {
    const parsedJson = JSON.parse(parsedXmlData);

    const extractedLineName: string = parsedJson.TransXChange.Services[0].Service[0].Lines[0].Line[0].LineName[0];
    const extractedServiceCode: string = parsedJson.TransXChange.Services[0].Service[0].ServiceCode[0];
    const extractedDescription: string = parsedJson.TransXChange.Services[0].Service[0].Description[0];

    const extractedOperators: ExtractedOperators[] = parsedJson.TransXChange.Operators[0].Operator;
    console.log({ extractedOperators });
    const extractedStopPoints: ExtractedStopPoint[] = parsedJson.TransXChange.StopPoints[0].AnnotatedStopPointRef;

    const stopPointsCollection: StopPointObject[] = [];
    for (let i = 0; i < extractedStopPoints.length; i+=1) {
        const stopPointItem: ExtractedStopPoint = extractedStopPoints[i];
        const stopPointRef = stopPointItem.StopPointRef[0];
        const commonName = stopPointItem.CommonName[0];
        const stopPointObject: StopPointObject = {
            StopPointRef: stopPointRef,
            CommonName: commonName,
        };
        stopPointsCollection.push(stopPointObject);
    }

    const cleanedXmlData: tndsDynamoDBData[] = [];
    for (let i = 0; i < extractedOperators.length; i+=1) {
        const operator = extractedOperators[i];
        const nationalOperatorCode: string = operator.NationalOperatorCode[0];
        const operatorShortName: string = operator.OperatorShortName[0];
        const operatorInfo: tndsDynamoDBData = {
            Partition: nationalOperatorCode,
            Sort: `${extractedLineName}_${extractedServiceCode}`,
            LineName: extractedLineName,
            OperatorShortName: operatorShortName,
            Description: extractedDescription,
            StopPoints: stopPointsCollection,
        };
        cleanedXmlData.push(operatorInfo);
    }

    return cleanedXmlData;
}

export const setS3ObjectParams = (event: S3Event): s3ObjectParameters => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' ')); // Object key may have spaces or unicode non-ASCII characters
    const params: s3ObjectParameters = {
        Bucket: s3BucketName,
        Key: s3FileName,
    };
    return params;
}

export const s3TndsHandler = async (event: S3Event) => {
    const params = setS3ObjectParams(event);

    console.log(`Got S3 event for key '${params.Key}' in bucket '${params.Bucket}'`);

    const fileExtension = fileExtensionGetter(params.Key);

    if (!fileExtension) {
        throw Error('File Extension could not be retrieved');
    }

    const stringifiedS3Data = await fetchDataFromS3AsString(params);

    const tableName = tableChooser(fileExtension);

    if (tableName === process.env.TNDS_TABLE_NAME) {
        const parsedXmlData: string = await xmlParser(stringifiedS3Data);

        if (!parsedXmlData) {
            throw Error('Data parsing has failed, stopping before database writing occurs.');
        }

        const cleanedXmlData = cleanParsedXmlData(parsedXmlData);

        await writeXmlToDynamo({
            tableName,
            parsedXmlLines: cleanedXmlData,
        });
    } else if (tableName === process.env.SERVICES_TABLE_NAME) {
        const parsedCsvData = csvParser(stringifiedS3Data);

        if (!parsedCsvData) {
            throw Error('Data parsing has failed, stopping before database writing occurs.');
        }
        await writeBatchesToDynamo({
            tableName,
            parsedCsvLines: parsedCsvData,
        });
    }
};
