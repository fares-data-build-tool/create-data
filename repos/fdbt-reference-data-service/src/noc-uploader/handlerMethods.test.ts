import AWS from "aws-sdk";
import * as mocks from "./test-data/test-data";
import {
    writeBatchesToDynamo,
    fetchDataFromS3AsString,
    csvParser,
    formatDynamoWriteRequest,
    setDbTableEnvVariable,
    lists3Objects,
    Lists3ObjectsParameters,
    mergeArrayObjects
    , ParsedData, S3ObjectParameters } from "./handler";


jest.mock("aws-sdk");

describe("fetchDataFromS3AsAString", () => {
    const mockS3GetObject = jest.fn();
    const s3Params: S3ObjectParameters = {
        Bucket: "thisIsMyBucket",
        Key: "andThisIsTheNameOfTheThing"
    };

    beforeEach(() => {
        mockS3GetObject.mockReset();
        (AWS.S3 as any) = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject
            };
        });
        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: mocks.testCsv });
            }
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns a string", async () => {
        const fetchedData = await fetchDataFromS3AsString(s3Params);
        expect(fetchedData).toBe(mocks.testCsv);
    });

    it("calls get object from S3 using params provided", async () => {
        await fetchDataFromS3AsString(s3Params);
        expect(mockS3GetObject).toHaveBeenCalledWith(s3Params);
    });
});

describe("csvParser", () => {
    it("parses CSV into JSON", () => {
        const returnedValue = csvParser(mocks.testCsv);
        expect(mocks.isJSON(returnedValue)).toBeTruthy;
    });
});

describe("formatDynamoWriteRequest", () => {
    it("should return data in correct format as a DynamoDB WriteRequest", () => {
        const mockNocData = {
            id: "",
            NOCCODE: "dan",
            OperatorPublicName: "",
            VOSA_PSVLicenseName: "",
            OpId: 1,
            PubNmId: 1,
            Mode: "",
            TTRteEnq: "",
            FareEnq: "",
            ComplEnq: "",
            Website: ""
        };
        const reformattedMockNocData = {
            Partition: "dan",
            id: "",
            NOCCODE: "dan",
            OperatorPublicName: "",
            VOSA_PSVLicenseName: "",
            OpId: 1,
            PubNmId: 1,
            Mode: "",
            TTRteEnq: "",
            FareEnq: "",
            ComplEnq: "",
            Website: ""
        };
        const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
            1,
            reformattedMockNocData
        );
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch);
        const testArrayOfItems: ParsedData[] = mocks.createArray(
            1,
            mockNocData
        );
        console.log({testArrayOfItems})
        const result = formatDynamoWriteRequest(testArrayOfItems);
        console.log({result})
        console.log({arrayOfBatches})
        expect(result).toEqual(arrayOfBatches);
    });

    it("should return an array of <25 when given <25 items", () => {
        const mockNocData = {
            id: "",
            NOCCODE: "dan",
            OperatorPublicName: "",
            VOSA_PSVLicenseName: "",
            OpId: 1,
            PubNmId: 1,
            Mode: "",
            TTRteEnq: "",
            FareEnq: "",
            ComplEnq: "",
            Website: ""
        };
        const reformattedMockNocData = {
            Partition: "dan",
            id: "",
            NOCCODE: "dan",
            OperatorPublicName: "",
            VOSA_PSVLicenseName: "",
            OpId: 1,
            PubNmId: 1,
            Mode: "",
            TTRteEnq: "",
            FareEnq: "",
            ComplEnq: "",
            Website: ""
        };
        const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
            23,
            reformattedMockNocData
        );
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch);
        const testArrayOfItems: ParsedData[] = mocks.createArray(
            23,
            mockNocData
        );
        const result = formatDynamoWriteRequest(testArrayOfItems);
        expect(result).toEqual(arrayOfBatches);
    });

    it("should return an array of >25 when given >25 items", () => {
        const mockNocData = {
            id: "",
            NOCCODE: "dan",
            OperatorPublicName: "",
            VOSA_PSVLicenseName: "",
            OpId: 1,
            PubNmId: 1,
            Mode: "",
            TTRteEnq: "",
            FareEnq: "",
            ComplEnq: "",
            Website: ""
        };
        const reformattedMockNocData = {
            Partition: "dan",
            id: "",
            NOCCODE: "dan",
            OperatorPublicName: "",
            VOSA_PSVLicenseName: "",
            OpId: 1,
            PubNmId: 1,
            Mode: "",
            TTRteEnq: "",
            FareEnq: "",
            ComplEnq: "",
            Website: ""
        };
        const batch1: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
            25,
            reformattedMockNocData
        );
        const batch2: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
            7,
            reformattedMockNocData
        );
        const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
        arrayOfBatches.push(batch1, batch2);
        const testArrayOfItems: ParsedData[] = mocks.createArray(
            32,
            mockNocData
        );
        const result = formatDynamoWriteRequest(testArrayOfItems);
        expect(result).toEqual(arrayOfBatches);
    });
});

describe("writeBatchesToDynamo", () => {
    // Arrange
    const mockNocData = {
        id: "",
        NOCCODE: "dan",
        OperatorPublicName: "",
        VOSA_PSVLicenseName: "",
        OpId: 1,
        PubNmId: 1,
        Mode: "",
        TTRteEnq: "",
        FareEnq: "",
        ComplEnq: "",
        Website: ""
    };
  
    const tableName = "mockTableName";
    const parsedLines: ParsedData[] = [mockNocData];
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

    it("calls dynamodb.batchwrite() only once for a batch size of 25 or less", async () => {
    // Arrange
        mockDynamoDbBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            }
        }));
        // Act
        await writeBatchesToDynamo({ parsedLines, tableName });
        // Assert
        expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(1);
    });

    it("calls dynamodb.batchwrite() more than once for a batch size greater than 25", async () => {
    // Arrange
        const mockNocData = {
            id: "",
            NOCCODE: "dan",
            OperatorPublicName: "",
            VOSA_PSVLicenseName: "",
            OpId: 1,
            PubNmId: 1,
            Mode: "",
            TTRteEnq: "",
            FareEnq: "",
            ComplEnq: "",
            Website: ""
        };
        mockDynamoDbBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            }
        }));
        const parsedLines = mocks.createArray(26, mockNocData);
        // Act
        await writeBatchesToDynamo({ parsedLines, tableName });
        // Assert
        expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(2);
    });

    it("throws an error if it cannot write to DynamoDB", async () => {
    // Arrange
        const mockNocData = {
            id: "",
            NOCCODE: "dan",
            OperatorPublicName: "",
            VOSA_PSVLicenseName: "",
            OpId: 1,
            PubNmId: 1,
            Mode: "",
            TTRteEnq: "",
            FareEnq: "",
            ComplEnq: "",
            Website: ""
        };
        const parsedLines = mocks.createArray(2, mockNocData);
        mockDynamoDbBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.reject({});
            }
        }));
        // Act & Assert
        expect.assertions(1);
        await expect(
            writeBatchesToDynamo({ parsedLines, tableName })
        ).rejects.toThrow("Could not write batch to DynamoDB");
    });
});

describe("setDbTableEnvVariable", () => {
    it("should error when no environment variable is set", () => {
        expect.assertions(1);
        try {
            setDbTableEnvVariable();
        } catch {
            expect(setDbTableEnvVariable).toThrow(
                "TABLE_NAME environment variable not set."
            );
        }
    });
});

describe("listS3Objects", () => {
    const ListS3ObjectsParameters: Lists3ObjectsParameters = {
        Bucket: "thisIsMyBucket",
        Prefix: "andThisIsThePrefixOfTheThing"
    };
    const mockS3ListObjectsV2 = jest.fn();

    beforeEach(() => {
        mockS3ListObjectsV2.mockReset();
        (AWS.S3 as any) = jest.fn().mockImplementation(() => {
            return {
                listObjectsV2: mockS3ListObjectsV2
            };
        });
    });

    it("should return an empty array if not 3 keys present", async () => {
        mockS3ListObjectsV2.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Contents: mocks.mockS3ListOneKey });
            }
        }));
        expect(await lists3Objects(ListS3ObjectsParameters)).toHaveLength(0);
    });
    it("should return a string array of 3 if 3 keys present", async () => {
        mockS3ListObjectsV2.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Contents: mocks.mockS3ListThreeKeys });
            }
        }));
        const objList = await lists3Objects(ListS3ObjectsParameters);
        expect(objList).toHaveLength(3);
    });
});

describe("mergeArrayObjects", () => {
    it("should join nocLine, nocTable and publicName objects on respective matching keys", () => {
        const mergedArray = mergeArrayObjects(mocks.mockNocLineArray, mocks.mockNocTableArray, mocks.mockPublicNameArray);
        expect(mergedArray).toEqual(mocks.mockExpectedMergedArray);
    });
});