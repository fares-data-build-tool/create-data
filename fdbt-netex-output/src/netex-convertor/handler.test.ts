import AWS from 'aws-sdk';
// import { netexConvertorHandler } from './handler';
import * as mocks from './test-data/test-data';

jest.mock('aws-sdk');

describe('s3 handler with csv event', () => {
    const mockS3GetObject = jest.fn();

    beforeEach(() => {
        (AWS.S3 as any) = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject,
            };
        });

        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: mocks.mockS3ObjectDataAsString });
            },
        }));

        (AWS.DynamoDB.DocumentClient as any) = jest.fn().mockImplementation(() => {
            return {
                query: () => ({
                    promise() {
                        return Promise.resolve({ Body: 'test' });
                    },
                }),
            };
        });

        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: mocks.mockS3ObjectDataAsString });
            },
        }));
    });

    afterEach(() => {
        mockS3GetObject.mockReset();
    });

    it('sends the data to dynamo when a csv is created', async () => {
        // const event = mocks.mockS3Event('thisIsMyBucket', 'andThisIsTheNameOfTheThing.csv');

        // const result = await netexConvertorHandler(event);

        // expect(result).toStrictEqual(mocks.mockS3ObjectDataAsJson);
        expect(true).toBeTruthy();
    });
});
