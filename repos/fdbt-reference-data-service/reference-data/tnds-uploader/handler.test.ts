import { mockS3Event } from './../noc-uploader/test-data/test-data';
import { s3TndsHandler } from './handler';
let AWS = require("aws-sdk");
import * as mocks from "./test-data/test-data";

describe("s3 handler with csv event", () => {
    const mockS3GetObject = jest.fn();
    const mockDynamoBatchWrite = jest.fn();
    const mockDynamoPut = jest.fn();

    beforeEach(() => {
        process.env.SERVICES_TABLE_NAME = "TestServicesTable";
        process.env.TNDS_TABLE_NAME = "TestTndsTable";

        AWS.S3 = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject
            };
        });

        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: mocks.testCsv });
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
        mockDynamoPut.mockReset();
    });

    it("sends the data to dynamo when an csv is created", async () => {
        const event = mockS3Event("thisIsMyBucket", "andThisIsTheNameOfTheThing.csv");

        await s3TndsHandler(event);

        expect(mockDynamoBatchWrite).toHaveBeenCalledTimes(1);

    });

})

describe("s3 handler with xml event", () => {
    const mockS3GetObject = jest.fn();
    const mockDynamoBatchWrite = jest.fn();
    const mockDynamoPut = jest.fn();

    beforeEach(() => {
        process.env.SERVICES_TABLE_NAME = "TestServicesTable";
        process.env.TNDS_TABLE_NAME = "TestTndsTable";

        AWS.S3 = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject
            };
        });

        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: mocks.testXml });
            }
        }));

        (AWS.DynamoDB.DocumentClient as any) = jest.fn(() => {
            return { put: mockDynamoPut };
        });

        mockDynamoPut.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            }
        }));

    });

    afterEach(() => {
        mockS3GetObject.mockReset();
        mockDynamoBatchWrite.mockReset();
        mockDynamoPut.mockReset();
    });

    it("sends the data to dynamo when an xml is created", async () => {
        const event = mockS3Event("thisIsMyBucket", "andThisIsTheNameOfTheThing.xml");

        await s3TndsHandler(event);

        expect(mockDynamoPut).toHaveBeenCalledTimes(1);

    });

})