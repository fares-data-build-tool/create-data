import { s3NocHandler } from "./handler";
import AWS from "aws-sdk";
import * as mocks from "./test-data/test-data";

const mockS3ListObjectsV2 = jest.fn();
const mockS3GetObject = jest.fn();
const mockDynamoBatchWrite = jest.fn();

jest.mock("aws-sdk", () => {
  class S3 {
    public listObjectsV2(...args: any[]) {
      mockS3ListObjectsV2(...args);
      return {
        promise: mockS3ListObjectsV2
      };
    }
    public getObject(...args: any[]) {
      mockS3GetObject(...args);
      return {
        promise: mockS3GetObject
      };
    }
  }
  return { S3, DynamoDB:{} };
});

describe("s3 handler with csv event", () => {

  beforeEach(() => {
    process.env.NOC_TABLE_NAME = "TestNocTable";

    mockS3ListObjectsV2.mockResolvedValue({ Contents: mocks.mockS3ListThreeKeys });
  
    mockS3GetObject.mockResolvedValue({ Body: mocks.nocLinesCsvData })
    .mockResolvedValueOnce({ Body: mocks.nocTableCsvData })
    .mockResolvedValueOnce({ Body: mocks.publicNameCsvData });

    (AWS.DynamoDB.DocumentClient as any) = jest.fn(() => {
      return { batchWrite: mockDynamoBatchWrite };
    });
  
    mockDynamoBatchWrite.mockImplementation(() => ({
      promise() {
        return Promise.resolve({});
      }
    }));
  
  });

  afterEach(() => {
    mockS3GetObject.mockReset();
    mockDynamoBatchWrite.mockReset();
    mockS3ListObjectsV2.mockReset();
  });

  it("sends the data to dynamo when a csv is created", async () => {
    const event = mocks.mockS3Event(
      "bucketName",
      "prefix/fileName.csv"
    );

    await s3NocHandler(event);

    expect(mockDynamoBatchWrite).toHaveBeenCalledTimes(1);
  });
});