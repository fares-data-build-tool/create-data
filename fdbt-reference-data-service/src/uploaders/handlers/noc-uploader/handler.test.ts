import AWS from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import { s3NocHandler } from './handler';
import * as mocks from './test-data/test-data';

const mockS3ListObjectsV2 = jest.fn();
const mockS3GetObject = jest.fn();
const mockDynamoBatchWrite = jest.fn();

describe('s3 handler with csv event', () => {
    beforeEach(() => {
        (AWS.S3 as {}) = jest.fn().mockImplementation(() => ({
            listObjectsV2(...args: string[]): {} {
                mockS3ListObjectsV2(...args);
                return {
                    promise: mockS3ListObjectsV2,
                };
            },
            getObject(...args: string[]): {} {
                mockS3GetObject(...args);
                return {
                    promise: mockS3GetObject,
                };
            },
        }));
        process.env.NOC_TABLE_NAME = 'TestNocTable';

        mockS3ListObjectsV2.mockResolvedValue({ Contents: mocks.mockS3ListThreeKeys });

        mockS3GetObject
            .mockResolvedValue({ Body: mocks.nocLinesCsvData })
            .mockResolvedValueOnce({ Body: mocks.nocTableCsvData })
            .mockResolvedValueOnce({ Body: mocks.publicNameCsvData });

        (AWS.DynamoDB.DocumentClient as {}) = jest.fn(() => {
            return { batchWrite: mockDynamoBatchWrite };
        });

        mockDynamoBatchWrite.mockImplementation(() => ({
            promise(): Promise<{}> {
                return Promise.resolve({});
            },
        }));
    });

    afterEach(() => {
        mockS3GetObject.mockReset();
        mockDynamoBatchWrite.mockReset();
        mockS3ListObjectsV2.mockReset();
    });

    it('sends the data to dynamo when a csv is created', async () => {
        const event: S3Event = mocks.mockS3Event('bucketName', 'fileName.csv');

        await s3NocHandler(event);

        expect(mockDynamoBatchWrite).toHaveBeenCalledTimes(1);
    });
});
