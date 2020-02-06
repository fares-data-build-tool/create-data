import AWS from 'aws-sdk';
import {
    csvParser,
    xmlParser,
    fetchDataFromS3AsString,
    formatDynamoWriteRequest,
    ParsedCsvData,
    fileExtensionGetter,
    tableChooser,
    removeFirstLineOfString,
    writeXmlToDynamo,
    cleanParsedXmlData,
    s3ObjectParameters,
    writeBatchesToDynamo,
    setS3ObjectParams,
} from './handler';
import * as mocks from './test-data/test-data';

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

describe('csvParser and xmlParsers', () => {
    it('parses CSV into JSON', () => {
        const returnedValue = csvParser(mocks.testCsv);
        expect(returnedValue.length).toBe(5);
        expect(returnedValue[4]).toEqual({ ...mocks.mockServicesData });
    });

    it('parses XML into JSON', async () => {
        const returnedValue = await xmlParser(mocks.testXml);
        expect(mocks.isParseableToJSON(returnedValue)).toBeTruthy();
    });
});

describe('fileExtensionGetter', () => {
    it('returns a file extension', () => {
        const resultOne = fileExtensionGetter('thisIsAFileName.xml');
        const resultTwo = fileExtensionGetter('thisIsAFileName.csv');

        expect(resultOne).toBe('xml');
        expect(resultTwo).toBe('csv');
    });
});

describe('tableChooser', () => {
    it('sets the table name according to the file extension', () => {
        expect(() => {
            tableChooser('xml');
        }).toThrow(Error);
    });

    it('sets the table name according to the file extension', () => {
        process.env.SERVICES_TABLE_NAME = 'TestServicesTable';
        process.env.TNDS_TABLE_NAME = 'TestTndsTable';

        const xmlResult = tableChooser('xml');
        const csvResult = tableChooser('csv');

        expect(xmlResult).toBe(process.env.TNDS_TABLE_NAME);
        expect(csvResult).toBe(process.env.SERVICES_TABLE_NAME);
    });

    it('sets the table name according to the file extension', () => {
        process.env.SERVICES_TABLE_NAME = 'TestServicesTable';
        process.env.TNDS_TABLE_NAME = 'TestTndsTable';

        expect(() => {
            tableChooser('pdf');
        }).toThrow(Error);
    });
});

describe('xmlFirstLineRemover', () => {
    it('removes the first line of a string', () => {
        const result = removeFirstLineOfString(`A\n B\n C\n D\n`);
        expect(result).toBe(` B\n C\n D\n`);
    });
});

describe('XML to dynamo writer', () => {
    const mockDynamoPut = jest.fn();

    beforeEach(() => {
        mockDynamoPut.mockReset();
        (AWS.DynamoDB.DocumentClient as any) = jest.fn(() => {
            return { put: mockDynamoPut };
        });
        mockDynamoPut.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            },
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('sends a put request to dynamo', async () => {
        const parsedData = cleanParsedXmlData(await xmlParser(mocks.testXml));

        writeXmlToDynamo({ tableName: 'tableName', parsedXmlLines: parsedData });

        expect(mockDynamoPut).toBeCalled();
    });
});

describe('cleanParsedXmlData', () => {
    it('changes the XML to be of the format required', async () => {
        const xmlToBeCleaned = await xmlParser(mocks.testXml);

        const cleanedXml = cleanParsedXmlData(xmlToBeCleaned);
        expect(cleanedXml).toEqual(mocks.mockCleanedXmlData);
    });
});

it('returns cleanedXmlData which contains the right primary and sort keys', async () => {
    const expectedPartitionKey1 = 'DEWS';
    const expectedPartitionKey2 = 'Dannys';
    const expectedSortKey = '1A#ea_20-1A-A-y08-1.xml';
    const xmlToBeCleaned = await xmlParser(mocks.testXml);
    const cleanedXml = cleanParsedXmlData(xmlToBeCleaned);
    const partition1 = cleanedXml[0].Partition;
    const partition2 = cleanedXml[1].Partition;
    const sort = cleanedXml[0].Sort;
    expect.assertions(4);
    expect(cleanedXml).toHaveLength(2);
    expect(partition1).toEqual(expectedPartitionKey1);
    expect(partition2).toEqual(expectedPartitionKey2);
    expect(sort).toEqual(expectedSortKey);
});

it('returns cleanedXmlData which contains the right StopPointRefs and CommonNames', async () => {
    const expectedStopPoints = [
        { StopPointRef: '0500SBARH011', CommonName: 'Superstore' },
        { StopPointRef: '0500HFENS007', CommonName: 'Rookery Way' },
        { StopPointRef: '0500HFENS006', CommonName: 'Swan Road' },
        { StopPointRef: '0500HFENS003', CommonName: 'Chequer Street' },
        { StopPointRef: '0500SSWAV013', CommonName: 'The Farm' },
    ];
    const xmlToBeCleaned = await xmlParser(mocks.testXml);
    const cleanedXml = cleanParsedXmlData(xmlToBeCleaned);
    const stopPoints = cleanedXml[0].StopPoints;
    expect.assertions(2);
    expect(stopPoints).toHaveLength(5);
    expect(stopPoints).toEqual(expectedStopPoints);
});

describe('formatDynamoWriteRequest', () => {
    it('should return data in correct format as a DynamoDB WriteRequest', () => {
        const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(1, {
            ...mocks.mockReformattedServicesData,
        });
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch);
        const testArrayOfItems: ParsedCsvData[] = mocks.createArray(1, { ...mocks.mockServicesData });
        console.log({ testArrayOfItems });
        const result = formatDynamoWriteRequest(testArrayOfItems);
        console.log({ result });
        expect(result).toEqual(arrayOfBatches);
    });

    it('should return an array of <25 when given <25 items', () => {
        const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(23, {
            ...mocks.mockReformattedServicesData,
        });
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch);
        const testArrayOfItems: ParsedCsvData[] = mocks.createArray(23, { ...mocks.mockServicesData });
        const result = formatDynamoWriteRequest(testArrayOfItems);
        expect(result).toEqual(arrayOfBatches);
    });

    it('should return an array of >25 when given >25 items', () => {
        const batch1: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(25, {
            ...mocks.mockReformattedServicesData,
        });
        const batch2: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(7, {
            ...mocks.mockReformattedServicesData,
        });
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch1, batch2);
        const testArrayOfItems: ParsedCsvData[] = mocks.createArray(32, { ...mocks.mockServicesData });
        const result = formatDynamoWriteRequest(testArrayOfItems);
        expect(result).toEqual(arrayOfBatches);
    });
});

describe('writeBatchesToDynamo', () => {
    // Arrange
    const tableName = 'mockTableName';
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
        const parsedCsvLines: ParsedCsvData[] = [{ ...mocks.mockServicesData }];
        mockDynamoDbBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            },
        }));
        // Act
        await writeBatchesToDynamo({ parsedCsvLines, tableName });
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
        const parsedCsvLines = mocks.createArray(26, { ...mocks.mockServicesData });
        // Act
        await writeBatchesToDynamo({ parsedCsvLines, tableName });
        // Assert
        expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(2);
    });

    it('throws an error if it cannot write to DynamoDB', async () => {
        // Arrange
        const parsedCsvLines = mocks.createArray(2, { ...mocks.mockServicesData });
        mockDynamoDbBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.reject(Error);
            },
        }));
        // Act & Assert
        expect.assertions(1);
        await expect(writeBatchesToDynamo({ parsedCsvLines, tableName })).rejects.toThrow(
            'Could not write batch to DynamoDB',
        );
    });
});

describe('setS3ObjectParams', () => {
    // Arrange
    const bucketName = 'fdbt-test-naptan-s3-bucket';
    const fileName = 'fdbt-test-naptan.csv';
    const s3Event = mocks.mockS3Event(bucketName, fileName);

    it('sets s3BucketName from S3Event', () => {
        // Act
        const s3ObjectParams = setS3ObjectParams(s3Event);
        // Assert
        expect(s3ObjectParams.Bucket).toEqual(bucketName);
    });

    it('sets S3FileName from S3Event', () => {
        // Act
        const s3ObjectParams = setS3ObjectParams(s3Event);
        // Assert
        expect(s3ObjectParams.Key).toEqual(fileName);
    });

    it('removes spaces and unicode non-ASCII characters in the S3FileName', () => {
        // Arrange
        const mockFileName = 'fdbt%2Ftest+%3A+naptan.csv';
        const S3Event = mocks.mockS3Event(bucketName, mockFileName);
        const params = {
            Bucket: bucketName,
            Key: 'fdbt/test : naptan.csv',
        };
        // Act
        const s3ObjectParams = setS3ObjectParams(S3Event);
        // Arrange
        expect(s3ObjectParams).toEqual(params);
    });
});
