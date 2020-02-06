import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import csvParse from 'csv-parse/lib/sync';
import { WriteRequest } from 'aws-sdk/clients/dynamodb';

export type ParsedData = DynamoDBData;

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
}

interface DynamoDBData {
    Partition?: string;
    NOCCODE: string;
    OperatorPublicName: string;
    VOSA_PSVLicenseName: string; // eslint-disable-line camelcase
    OpId: number;
    PubNmId: number;
    Mode: string;
    TTRteEnq: string;
    FareEnq: string;
    ComplEnq: string;
    Website: string;
}

interface NocLinesData {
    NOCCODE: string;
    Mode: string;
}

interface NocTableData {
    NOCCODE: string;
    OperatorPublicName: string;
    VOSA_PSVLicenseName: string; // eslint-disable-line camelcase
    OpId: number;
    PubNmId: number;
}

interface PublicNameData {
    // OperatorPublicName: string;
    PubNmId: number;
    TTRteEnq: string;
    FareEnq: string;
    ComplEnq: string;
    Website: string;
}

interface PushToDyanmoInput {
    parsedLines: ParsedData[];
    tableName: string;
}

export interface Lists3ObjectsParameters {
    Bucket: string;
}

export const lists3Objects = async (parameters: Lists3ObjectsParameters): Promise<string[]> => {
    const objlist: string[] = [];
    const s3 = new AWS.S3();
    const s3Data = await s3
        .listObjectsV2(parameters, (err, data) => {
            if (err) {
                throw new Error(`Could not list objects, error message: ${err.message} error name: ${err.name}`);
            } else {
                return data;
            }
        })
        .promise();
    const contents = s3Data.Contents!;
    let itemOne = '';
    let itemTwo = '';
    let itemThree = '';
    try {
        itemOne = contents[0].Key!;
        itemTwo = contents[1].Key!;
        itemThree = contents[2].Key!;
    } catch (Error) {
        return [];
    }
    objlist.push(itemOne, itemTwo, itemThree);
    return objlist;
}

export const fetchDataFromS3AsString = async (parameters: S3ObjectParameters): Promise<string> => {
    const s3 = new AWS.S3();
    const data = await s3.getObject(parameters).promise();
    const dataAsString = data.Body?.toString('utf-8')!;
    return dataAsString;
}

export const csvParser = (csvData: string): any => {
    const parsedData: any = csvParse(csvData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ',',
    });
    return parsedData;
}

export const mergeArrayObjects = (
    nocLinesArray: NocLinesData[],
    nocTableArray: NocTableData[],
    publicNameArray: PublicNameData[],
): ParsedData[] => {
    const firstMerge: (NocLinesData & NocTableData)[] = nocTableArray.map(x =>
        Object.assign(
            x,
            nocLinesArray.find(y => y.NOCCODE === x.NOCCODE),
        ),
    );
    const secondMerge: ParsedData[] = firstMerge.map(x =>
        Object.assign(
            x,
            publicNameArray.find(y => y.PubNmId === x.PubNmId),
        ),
    );
    return secondMerge;
}

export const formatDynamoWriteRequest = (parsedLines: DynamoDBData[]): AWS.DynamoDB.WriteRequest[][] => {
    const parsedDataMapper = (parsedDataItem: ParsedData): AWS.DynamoDB.DocumentClient.WriteRequest => ({
        PutRequest: { Item: {
            ...parsedDataItem,
            Partition: parsedDataItem.NOCCODE
        } },
    });

    const dynamoWriteRequests = parsedLines.map(parsedDataMapper);
    const emptyBatch: WriteRequest[][] = [];
    const batchSize = 25;
    const dynamoWriteRequestBatches = dynamoWriteRequests.reduce((result, _value, index, array) => {
        if (index % batchSize === 0) result.push(array.slice(index, index + batchSize));
        return result;
    }, emptyBatch);
    return dynamoWriteRequestBatches;
}

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
        console.log(`writePromises before if statement is ${writePromises}`)
        count += batch.length;

        if (writePromises.length === 100) {
            console.log(`writePromises inside if statement is ${writePromises}`)
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

export const setDbTableEnvVariable = (): string => {
    const tableName: string | undefined = process.env.NOC_TABLE_NAME;
    if (!tableName) {
        throw new Error('TABLE_NAME environment variable not set.');
    }
    return tableName;
}

export const s3NocHandler = async (event: S3Event) => {
    const tableName = setDbTableEnvVariable();

    const s3BucketName: string = event.Records[0].s3.bucket.name;
    console.log('s3BucketName retrieved from S3 Event is: ', s3BucketName);
    const Lists3ObjectsParameters: Lists3ObjectsParameters = {
        Bucket: s3BucketName
    };

    const s3ObjectsList = await lists3Objects(Lists3ObjectsParameters);
    if (s3ObjectsList.length < 3) {
        throw new Error('Key(s) not available or undefined');
    }

    const filenameKeys = [
        `NOCLines.csv`,
        `NOCTable.csv`,
        `PublicName.csv`,
    ];
    console.log('filenameKeys being used to retrieve data are: ', filenameKeys);
    const nocLineParams: S3ObjectParameters = {
        Bucket: s3BucketName,
        Key: filenameKeys[0],
    };
    const nocTableParams: S3ObjectParameters = {
        Bucket: s3BucketName,
        Key: filenameKeys[1],
    };
    const publicNameParams: S3ObjectParameters = {
        Bucket: s3BucketName,
        Key: filenameKeys[2],
    };

    const nocLineStringifiedData = await fetchDataFromS3AsString(nocLineParams);
    const nocTableStringifiedData = await fetchDataFromS3AsString(nocTableParams);
    const publicNameStringifiedData = await fetchDataFromS3AsString(publicNameParams);

    const nocLineParsedCsv: NocLinesData[] = csvParser(nocLineStringifiedData);
    const nocTableParsedCsv: NocTableData[] = csvParser(nocTableStringifiedData);
    const publicNameParsedCsv: PublicNameData[] = csvParser(publicNameStringifiedData);

    const mergedArray = mergeArrayObjects(nocLineParsedCsv, nocTableParsedCsv, publicNameParsedCsv);

    await writeBatchesToDynamo({
        parsedLines: mergedArray,
        tableName,
    });
};
