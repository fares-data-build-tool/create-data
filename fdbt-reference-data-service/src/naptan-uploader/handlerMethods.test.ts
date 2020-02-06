import AWS from 'aws-sdk';
import * as mocks from './test-data/test-data';
import {
    setS3ObjectParams,
    writeBatchesToDynamo,
    fetchDataFromS3AsString,
    csvParser,
    formatDynamoWriteRequest,
    setDbTableEnvVariable,
    ParsedData,
    s3ObjectParameters,
} from './handler';

jest.mock('aws-sdk');

describe('fetchDataFromS3AsAString', () => {
    const mockS3GetObject = jest.fn();
    const s3Params: s3ObjectParameters = {
        Bucket: 'thisIsMyBucket',
        Key: 'andThisIsTheNameOfTheThing',
    };

    beforeEach(() => {
        mockS3GetObject.mockReset();
        (AWS.S3 as any) = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject,
            };
        });
        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: mocks.testCsv });
            },
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns a string', async () => {
        const fetchedData = await fetchDataFromS3AsString(s3Params);
        expect(fetchedData).toBe(mocks.testCsv);
    });

    it('calls get object from S3 using params provided', async () => {
        await fetchDataFromS3AsString(s3Params);
        expect(mockS3GetObject).toHaveBeenCalledWith(s3Params);
    });
});

describe('csvParser', () => {
    it('parses CSV into JSON', () => {
        const returnedValue = csvParser(mocks.testCsv);

        expect(returnedValue.length).toBe(22);
        expect(returnedValue[0]).toEqual({ ...mocks.mockNaptanData });
    });
});

describe('setS3ObjectParams', () => {
    // Arrange
    const bucketName = 'fdbt-test-naptan-s3-bucket';
    const fileName = 'fdbt-test-naptan.csv';
    const s3Event = mocks.mockS3Event(bucketName, fileName);

    it('sets s3BucketName from S3Event', () => {
        // Act
        const params = setS3ObjectParams(s3Event);
        // Assert
        expect(params.Bucket).toEqual(bucketName);
    });

    it('sets S3FileName from S3Event', () => {
        // Act
        const params = setS3ObjectParams(s3Event);
        // Assert
        expect(params.Key).toEqual(fileName);
    });

    it('removes spaces and unicode non-ASCII characters in the S3FileName', () => {
        // Arrange
        const file = 'fdbt%2Ftest+%3A+naptan.csv';
        const S3Event = mocks.mockS3Event(bucketName, file);
        const expectedParams = {
            Bucket: bucketName,
            Key: 'fdbt/test : naptan.csv',
        };
        // Act
        const params = setS3ObjectParams(S3Event);
        // Arrange
        expect(params).toEqual(expectedParams);
    });
});

describe('formatDynamoWriteRequest', () => {
    it('should return data in correct format as a DynamoDB WriteRequest', () => {
        const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(1, {
            ...mocks.mockReformattedNaptanData,
        });
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch);
        const testArrayOfItems: ParsedData[] = mocks.createArray(1, { ...mocks.mockNaptanData });
        const result = formatDynamoWriteRequest(testArrayOfItems);
        expect(result).toEqual(arrayOfBatches);
    });

    it('should return an array of <25 when given <25 items', () => {
        const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(23, {
            ...mocks.mockReformattedNaptanData,
        });
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch);
        const testArrayOfItems: ParsedData[] = mocks.createArray(23, { ...mocks.mockNaptanData });
        const result = formatDynamoWriteRequest(testArrayOfItems);
        expect(result).toEqual(arrayOfBatches);
    });

    it('should return an array of >25 when given >25 items', () => {
        const batch1: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(25, {
            ...mocks.mockReformattedNaptanData,
        });
        const batch2: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(7, {
            ...mocks.mockReformattedNaptanData,
        });
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch1, batch2);
        const testArrayOfItems: ParsedData[] = mocks.createArray(32, { ...mocks.mockNaptanData });
        const result = formatDynamoWriteRequest(testArrayOfItems);
        expect(result).toEqual(arrayOfBatches);
    });
});

describe('writeBatchesToDynamo', () => {
    // Arrange
    const tableName = 'mockTableName';
    const parsedLines: ParsedData[] = [{ ...mocks.mockNaptanData }];
    const mockDynamoDbBatchWrite = jest.fn();

    beforeEach(() => {
        mockDynamoDbBatchWrite.mockReset();
        (AWS.DynamoDB.DocumentClient as any) = jest.fn(() => {
            return { batchWrite: mockDynamoDbBatchWrite };
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('calls dynamodb.batchwrite() only once for a batch size of 25 or less', async () => {
        // Arrange
        mockDynamoDbBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            },
        }));
        // Act
        await writeBatchesToDynamo({ parsedLines, tableName });
        // Assert
        expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(1);
    });

    it('calls dynamodb.batchwrite() more than once for a batch size greater than 25', async () => {
        // Arrange
        mockDynamoDbBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            },
        }));
        const lines = mocks.createArray(26, { ...mocks.mockNaptanData });
        // Act
        await writeBatchesToDynamo({ parsedLines: lines, tableName });
        // Assert
        expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(2);
    });

    it('throws an error if it cannot write to DynamoDB', async () => {
        // Arrange
        const lines = mocks.createArray(2, { ...mocks.mockNaptanData });
        mockDynamoDbBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.reject(new Error());
            },
        }));
        // Act & Assert
        expect.assertions(1);
        await expect(writeBatchesToDynamo({ parsedLines: lines, tableName })).rejects.toThrow(
            'Could not write batch to DynamoDB',
        );
    });
});

describe('setDbTableEnvVariable', () => {
    it('should error when no environment variable is set', () => {
        expect.assertions(1);
        try {
            setDbTableEnvVariable();
        } catch {
            expect(setDbTableEnvVariable).toThrow('TABLE_NAME environment variable not set.');
        }
    });
});
