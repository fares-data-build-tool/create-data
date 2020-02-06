import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import { WriteRequest } from 'aws-sdk/clients/dynamodb';

import csvParse from 'csv-parse/lib/sync';

export type ParsedData = dynamoDBData;

export interface s3ObjectParameters {
    Bucket: string;
    Key: string;
}

interface dynamoDBData {
    Partition?: string;
    ATCOCode: string;
    NaptanCode: string;
    CommonName: string;
    Street: string;
    Indicator: string;
    IndicatorLang: string;
    Bearing: string;
    NptgLocalityCode: string;
    LocalityName: string;
    ParentLocalityName: string;
    LocalityCentre: string;
    GridType: string;
    Easting: string;
    Northing: string;
    Longitude: string;
    Latitude: string;
    StopType: string;
    BusStopType: string;
    TimingStatus: string;
}

interface PushToDyanmoInput {
    parsedLines: ParsedData[];
    tableName: string;
}

export const fetchDataFromS3AsString = async (parameters: s3ObjectParameters): Promise<string> => {
    const s3 = new AWS.S3();
    const data = await s3.getObject(parameters).promise();
    const dataAsString = data.Body?.toString('utf-8')!;
    return dataAsString;
};

export const csvParser = (csvData: string): ParsedData[] => {
    const parsedData: ParsedData[] = csvParse(csvData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ',',
    });
    return parsedData;
};

export const formatDynamoWriteRequest = (parsedLines: dynamoDBData[]): AWS.DynamoDB.WriteRequest[][] => {
    const parsedDataMapper = (parsedDataItem: ParsedData): AWS.DynamoDB.DocumentClient.WriteRequest => ({
        PutRequest: {
            Item: {
                ...parsedDataItem,
                Partition: parsedDataItem.ATCOCode,
            },
        },
    });

    const dynamoWriteRequests = parsedLines.map(parsedDataMapper);

    const emptyBatch: WriteRequest[][] = [];
    const batchSize = 25;
    const dynamoWriteRequestBatches = dynamoWriteRequests.reduce((result, _value, index, array) => {
        if (index % batchSize === 0) {
            result.push(array.slice(index, index + batchSize));
        }
        return result;
    }, emptyBatch);
    return dynamoWriteRequestBatches;
};

export const writeBatchesToDynamo = async ({ parsedLines, tableName }: PushToDyanmoInput) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient({
        convertEmptyValues: true,
    });
    const dynamoWriteRequestBatches = formatDynamoWriteRequest(parsedLines);
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

export const setS3ObjectParams = (event: S3Event): s3ObjectParameters => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params: s3ObjectParameters = {
        Bucket: s3BucketName,
        Key: s3FileName,
    };
    return params;
};

export const setDbTableEnvVariable = (): string => {
    const tableName: string | undefined = process.env.NAPTAN_TABLE_NAME;
    if (!tableName) {
        throw new Error('TABLE_NAME environment variable not set.');
    }
    return tableName;
};

export const s3NaptanHandler = async (event: S3Event) => {
    const tableName = setDbTableEnvVariable();

    const params = setS3ObjectParams(event);
    const stringifiedData = await fetchDataFromS3AsString(params);
    const parsedCsvData = csvParser(stringifiedData);
    await writeBatchesToDynamo({
        tableName,
        parsedLines: parsedCsvData,
    });
};
