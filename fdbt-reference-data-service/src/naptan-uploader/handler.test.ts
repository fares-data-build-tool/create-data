import AWS from 'aws-sdk';
import { s3NaptanHandler } from './handler';
import * as mocks from './test-data/test-data';

jest.mock('aws-sdk');

describe('s3 handler with csv event', () => {
    const mockS3GetObject = jest.fn();
    const mockDynamoBatchWrite = jest.fn();

    beforeEach(() => {
        process.env.NAPTAN_TABLE_NAME = 'TestNaptanTable';

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

        (AWS.DynamoDB.DocumentClient as any) = jest.fn(() => {
            return { batchWrite: mockDynamoBatchWrite };
        });

        mockDynamoBatchWrite.mockImplementation(() => ({
            promise() {
                return Promise.resolve({});
            },
        }));
    });

    afterEach(() => {
        mockS3GetObject.mockReset();
        mockDynamoBatchWrite.mockReset();
    });

    it('sends the data to dynamo when a csv is created', async () => {
        const event = mocks.mockS3Event('thisIsMyBucket', 'andThisIsTheNameOfTheThing.csv');

        await s3NaptanHandler(event);

        expect(mockDynamoBatchWrite).toHaveBeenCalledTimes(1);
    });
});
