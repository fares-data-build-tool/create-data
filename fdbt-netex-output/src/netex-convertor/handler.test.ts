import { S3Event } from 'aws-lambda';
import { netexConvertorHandler } from './handler';
import * as mocks from './test-data/testData';
import * as s3 from './data/s3';
import * as pointToPointTicketNetexGenerator from './point-to-point-tickets/pointToPointTicketNetexGenerator';
import * as periodTicketNetexGenerator from './period-tickets/periodTicketNetexGenerator';

jest.mock('./data/auroradb.ts');
jest.spyOn(s3, 'uploadNetexToS3').mockImplementation(() => Promise.resolve());

describe('netexConvertorHandler', () => {
    const event: S3Event = mocks.mockS3Event('BucketThing', 'TheBigBucketName');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockFetchDataFromS3Spy: any;

    beforeEach(() => {
        mockFetchDataFromS3Spy = jest.spyOn(s3, 'fetchDataFromS3');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call the pointToPointTicketNetexGenerator when a user uploads info for a single ticket', async () => {
        const pointToPointTicketNetexGeneratorSpy = jest.spyOn(pointToPointTicketNetexGenerator, 'default');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        pointToPointTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(mocks.mockSingleTicketMatchingDataUpload));
        await netexConvertorHandler(event);
        expect(pointToPointTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a geozone period ticket', async () => {
        const periodTicketNetexGeneratorSpy = jest.spyOn(periodTicketNetexGenerator, 'default');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        periodTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() =>
            Promise.resolve(mocks.mockPeriodGeoZoneTicketMatchingDataUpload),
        );
        await netexConvertorHandler(event);
        expect(periodTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a multiple services period ticket', async () => {
        const periodTicketNetexGeneratorSpy = jest.spyOn(periodTicketNetexGenerator, 'default');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        periodTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() =>
            Promise.resolve(mocks.mockPeriodMultiServicesTicketMatchingDataUpload),
        );
        await netexConvertorHandler(event);
        expect(periodTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a flat fare ticket', async () => {
        const periodTicketNetexGeneratorSpy = jest.spyOn(periodTicketNetexGenerator, 'default');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        periodTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(mocks.mockFlatFareTicketMatchingDataUpload));
        await netexConvertorHandler(event);
        expect(periodTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should throw an error if the user data uploaded to the fdbt-matching-data bucket does not contain a "type" attribute', async () => {
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(mocks.mockMatchingDataUploadWithNoType));
        await expect(netexConvertorHandler(event)).rejects.toThrow();
    });
});
