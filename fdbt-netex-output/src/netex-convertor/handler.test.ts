import { S3Event } from 'aws-lambda';

import { netexConvertorHandler } from './handler';
import * as mocks from './testdata/test-data';
import * as s3 from './data/s3';
import * as singleTicketNetexGenerator from './single-ticket/singleTicketNetexGenerator';
import * as periodTicketNetexGenerator from './period-ticket/periodTicketNetexGenerator';

jest.mock('./data/dynamodb.ts');
jest.spyOn(s3, 'uploadNetexToS3').mockImplementation(() => Promise.resolve());

describe('netexConvertorHandler', () => {
    const event: S3Event = mocks.mockS3Event('BucketThing', 'TheBigBucketName');
    let mockFetchDataFromS3Spy: any;

    beforeEach(() => {
        mockFetchDataFromS3Spy = jest.spyOn(s3, 'fetchDataFromS3');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call the singleTicketNetexGenerator when a user uploads info for a single ticket', async () => {
        const singleTicketNetexGeneratorSpy = jest.spyOn(singleTicketNetexGenerator, 'default');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        singleTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: () => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(mocks.mockSingleTicketMatchingDataUpload));
        await netexConvertorHandler(event);
        expect(singleTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a period ticket', async () => {
        const periodTicketNetexGeneratorSpy = jest.spyOn(periodTicketNetexGenerator, 'default');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        periodTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: () => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(mocks.mockPeriodTicketMatchingDataUpload));
        await netexConvertorHandler(event);
        expect(periodTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should throw an error if the user data uploaded to the fdbt-matching-data bucket does not contain a "type" attribute', async () => {
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(mocks.mockMatchingDataUploadWithNoType));
        await expect(netexConvertorHandler(event)).rejects.toThrow();
    });
});
