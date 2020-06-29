import { S3Event } from 'aws-lambda';
import { netexConvertorHandler, generateFileName } from './handler';
import {
    singleTicket,
    periodGeoZoneTicket,
    periodMultipleServicesTicket,
    flatFareTicket,
    periodGeoZoneTicketWithNoType,
} from './test-data/matchingData';
import mockS3Event from './test-data/mockS3Event';
import * as s3 from './data/s3';
import * as pointToPointTicketNetexGenerator from './point-to-point-tickets/pointToPointTicketNetexGenerator';
import * as periodTicketNetexGenerator from './period-tickets/periodTicketNetexGenerator';
import * as db from './data/auroradb';

jest.mock('./data/auroradb.ts');
jest.spyOn(s3, 'uploadNetexToS3').mockImplementation(() => Promise.resolve());
const event: S3Event = mockS3Event('BucketThing', 'TheBigBucketName');
const mockFetchDataFromS3Spy = jest.spyOn(s3, 'fetchDataFromS3');
const mockUploadNetexToS3Spy = jest.spyOn(s3, 'uploadNetexToS3');

mockUploadNetexToS3Spy.mockImplementation(() => Promise.resolve());

const pointToPointTicketNetexGeneratorSpy = jest.spyOn(pointToPointTicketNetexGenerator, 'default');
const periodTicketNetexGeneratorSpy = jest.spyOn(periodTicketNetexGenerator, 'default');

describe('netexConvertorHandler', () => {
    beforeEach(() => {
        jest.spyOn(db, 'getOperatorDataByNocCode').mockImplementation(() =>
            Promise.resolve({
                website: 'www.unittest.com',
                ttrteEnq: 'aaaaaa',
                operatorPublicName: 'Test Buses',
                opId: '7Z',
                vosaPsvLicenseName: 'CCD',
                fareEnq: 'SSSS',
                complEnq: '334',
                mode: 'test',
            }),
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call the pointToPointTicketNetexGenerator when a user uploads info for a single ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        pointToPointTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(singleTicket));
        await netexConvertorHandler(event);
        expect(pointToPointTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a geozone period ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        periodTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodGeoZoneTicket));
        await netexConvertorHandler(event);
        expect(periodTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a multiple services period ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        periodTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodMultipleServicesTicket));
        await netexConvertorHandler(event);
        expect(periodTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a flat fare ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        periodTicketNetexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(flatFareTicket));
        await netexConvertorHandler(event);
        expect(periodTicketNetexGeneratorSpy).toHaveBeenCalled();
    });

    it('should throw an error if the user data uploaded to the fdbt-matching-data bucket does not contain a "type" attribute', async () => {
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodGeoZoneTicketWithNoType));
        await expect(netexConvertorHandler(event)).rejects.toThrow();
    });

    it('should generate single fare netex with no undefined variables', async () => {
        pointToPointTicketNetexGeneratorSpy.mockRestore();
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(singleTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate flat fare netex with no undefined variables', async () => {
        periodTicketNetexGeneratorSpy.mockRestore();
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(flatFareTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate multiple services period netex with no undefined variables', async () => {
        periodTicketNetexGeneratorSpy.mockRestore();
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodMultipleServicesTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate geozone period netex with no undefined variables', async () => {
        periodTicketNetexGeneratorSpy.mockRestore();
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodGeoZoneTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate the correct filename', () => {
        const mockDate = Date.now();
        jest.spyOn(global.Date, 'now').mockImplementation(() => mockDate);
        const fileName = generateFileName('DCCL', 'single', 'abcdef123');
        expect(fileName).toEqual(`DCCL/single/abcdef123-${mockDate}.xml`);
    });
});
