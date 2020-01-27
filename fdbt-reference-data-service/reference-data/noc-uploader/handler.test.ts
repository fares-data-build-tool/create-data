import { s3NocHandler } from "./handler";
import AWS from "aws-sdk";
import * as mocks from "./test-data/test-data";

jest.mock("aws-sdk");

describe("s3 handler with csv event", () => {
    const mockS3ListObjectsV2 = jest.fn();
    const mockS3GetObject = jest.fn();
    const mockDynamoBatchWrite = jest.fn();
  
    beforeEach(() => {
      process.env.NOC_TABLE_NAME = "TestNocTable";

      (AWS.S3 as any) = jest.fn().mockImplementation(() => {
        return {
          listObjectsV2: mockS3ListObjectsV2
        };
      });

      mockS3ListObjectsV2.mockImplementation(() => ({
        promise() {
          return Promise.resolve({ Contents: mocks.mockS3ListThreeKeys });
        }
      }));
  
      (AWS.S3 as any) = jest.fn().mockImplementation(() => {
        return {
          getObject: mockS3GetObject
        };
      });
  
      mockS3GetObject.mockReturnValueOnce(() => ({
        promise() {
          return Promise.resolve({ Body: mocks.nocLinesCsvData });
        }
      })).mockReturnValueOnce(() => ({
        promise() {
          return Promise.resolve({ Body: mocks.nocTableCsvData });
        }
      })).mockReturnValueOnce(() => ({
        promise() {
          return Promise.resolve({ Body: mocks.publicNameCsvData });
        }
      }));

    
  
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