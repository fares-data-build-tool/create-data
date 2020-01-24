import * as mocks from "./mocks/mock-data";
import AWS from "aws-sdk";
import { setS3ObjectParams, writeBatchesToDynamo } from "./handler";
import { ParsedData } from "./handler";
import { write } from "fs";

jest.mock("aws-sdk");

describe("setS3ObjectParams", () => {
  // Arrange
  const bucketName = "fdbt-test-naptan-s3-bucket";
  const fileName = "fdbt-test-naptan.csv";
  const s3Event = mocks.mockS3Event(bucketName, fileName);

  it("sets s3BucketName from S3Event", () => {
    // Act
    const s3ObjectParameters = setS3ObjectParams(s3Event);
    // Assert
    expect(s3ObjectParameters.Bucket).toEqual(bucketName);
  });

  it("sets S3FileName from S3Event", () => {
    // Act
    const s3ObjectParameters = setS3ObjectParams(s3Event);
    // Assert
    expect(s3ObjectParameters.Key).toEqual(fileName);
  });

  it("removes spaces and unicode non-ASCII characters in the S3FileName", () => {
    // Arrange
    const fileName = "fdbt%2Ftest+%3A+naptan.csv";
    const S3Event = mocks.mockS3Event(bucketName, fileName);
    const params = {
      Bucket: bucketName,
      Key: "fdbt/test : naptan.csv"
    };
    // Act
    const s3ObjectParameters = setS3ObjectParams(S3Event);
    // Arrange
    expect(s3ObjectParameters).toEqual(params);
  });
});

describe("writeBatchesToDynamo", () => {
  // Arrange
  const tableName = "mockTableName";
  const parsedLines: ParsedData[] = [mocks.mockNaptanData];
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
    const parsedLines = mocks.createArray(26, mocks.mockNaptanData);
    // Act
    await writeBatchesToDynamo({ parsedLines, tableName });
    // Assert
    expect(mockDynamoDbBatchWrite).toHaveBeenCalledTimes(2);
  });

  it("throws an error if it cannot write to DynamoDB", async () => {
    // Arrange
    const parsedLines = mocks.createArray(2, mocks.mockNaptanData);
    mockDynamoDbBatchWrite.mockImplementation(() => ({
      promise() {
        return Promise.reject({});
      }
    }));
    // Act & Assert
    expect.assertions(1);
    await expect(writeBatchesToDynamo({ parsedLines, tableName })).rejects.toThrow("Could not write batch to DynamoDB")
  });
});
