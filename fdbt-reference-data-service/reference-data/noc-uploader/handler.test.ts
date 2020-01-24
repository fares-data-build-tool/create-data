import * as mocks from "./test-data/test-data";
import AWS from "aws-sdk";
import {
  writeBatchesToDynamo,
  fetchDataFromS3AsString,
  csvParser,
  formatDynamoWriteRequest,
  setDbTableEnvVariable
} from "./handler";
import { ParsedData, s3ObjectParameters } from "./handler";

jest.mock("aws-sdk");

describe("fetchDataFromS3AsAString", () => {
  const mockS3GetObject = jest.fn();
  const s3Params: s3ObjectParameters = {
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

// describe("setS3ObjectParams", () => {
//   // Arrange
//   const bucketName = "fdbt-test-naptan-s3-bucket";
//   const fileName = "fdbt-test-naptan.csv";
//   const s3Event = mocks.mockS3Event(bucketName, fileName);

//   it("sets s3BucketName from S3Event", () => {
//     // Act
//     const s3ObjectParameters = setS3ObjectParams(s3Event);
//     // Assert
//     expect(s3ObjectParameters.Bucket).toEqual(bucketName);
//   });

//   it("sets S3FileName from S3Event", () => {
//     // Act
//     const s3ObjectParameters = setS3ObjectParams(s3Event);
//     // Assert
//     expect(s3ObjectParameters.Key).toEqual(fileName);
//   });

//   it("removes spaces and unicode non-ASCII characters in the S3FileName", () => {
//     // Arrange
//     const fileName = "fdbt%2Ftest+%3A+naptan.csv";
//     const S3Event = mocks.mockS3Event(bucketName, fileName);
//     const params = {
//       Bucket: bucketName,
//       Key: "fdbt/test : naptan.csv"
//     };
//     // Act
//     const s3ObjectParameters = setS3ObjectParams(S3Event);
//     // Arrange
//     expect(s3ObjectParameters).toEqual(params);
//   });
// });

describe("formatDynamoWriteRequest", () => {
  it("should return data in correct format as a DynamoDB WriteRequest", () => {
    const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
      1,
      mocks.mockNocData
    );
    const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
    arrayOfBatches.push(batch);
    const testArrayOfItems: ParsedData[] = mocks.createArray(
      1,
      mocks.mockNocData
    );
    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
  });

  it("should return an array of <25 when given <25 items", () => {
    const batch: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
      23,
      mocks.mockNocData
    );
    const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
    arrayOfBatches.push(batch);
    const testArrayOfItems: ParsedData[] = mocks.createArray(
      23,
      mocks.mockNocData
    );
    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
  });

  it("should return an array of >25 when given >25 items", () => {
    const batch1: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
      25,
      mocks.mockNocData
    );
    const batch2: AWS.DynamoDB.WriteRequest[] = mocks.createBatchOfWriteRequests(
      7,
      mocks.mockNocData
    );
    const arrayOfBatches: AWS.DynamoDB.WriteRequest[][] = [];
    arrayOfBatches.push(batch1, batch2);
    const testArrayOfItems: ParsedData[] = mocks.createArray(
      32,
      mocks.mockNocData
    );
    const result = formatDynamoWriteRequest(testArrayOfItems);
    expect(result).toEqual(arrayOfBatches);
  });
});

describe("writeBatchesToDynamo", () => {
  // Arrange
  const tableName = "mockTableName";
  const parsedLines: ParsedData[] = [mocks.mockNocData];
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
    mockDynamoDbBatchWrite.mockImplementation(() => ({
      promise() {
        return Promise.resolve({});
      }
    }));
    const parsedLines = mocks.createArray(26, mocks.mockNocData);
    // Act
    await writeBatchesToDynamo({ parsedLines, tableName });
    // Assert
    expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(2);
  });

  it("throws an error if it cannot write to DynamoDB", async () => {
    // Arrange
    const parsedLines = mocks.createArray(2, mocks.mockNocData);
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
