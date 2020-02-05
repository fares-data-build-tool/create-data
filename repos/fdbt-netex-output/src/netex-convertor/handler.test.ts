import AWS from 'aws-sdk';
import { s3NetexConvertorHandler } from './handler';
import * as mocks from './test-data/test-data';

jest.mock('aws-sdk');

describe('s3 handler with csv event', () => {
    const mockS3GetObject = jest.fn();

    beforeEach(() => {
        (AWS.S3 as any) = jest.fn().mockImplementation(() => ({
            getObject: () => ({
                promise() {
                    return Promise.resolve({ Body: mocks.mockS3ObjectDataAsString });
                },
            }),
        }));
    });

    afterEach(() => {
        mockS3GetObject.mockReset();
    });

    it('sends the data to dynamo when a csv is created', async () => {
        const event = mocks.mockS3Event('thisIsMyBucket', 'andThisIsTheNameOfTheThing.csv');

        try {
            const result = await s3NetexConvertorHandler(event);

            expect(result).toStrictEqual(mocks.mockS3ObjectDataAsJson);
        } catch (err) {
            console.error(err);
        }
    });
});
