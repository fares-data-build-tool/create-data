import { S3Event } from 'aws-lambda';
import { netexConvertorHandler, generateFileName, buildNocList } from './handler';
import {
    singleTicket,
    periodGeoZoneTicket,
    periodMultipleServicesTicket,
    flatFareTicket,
    periodGeoZoneTicketWithNoType,
    schemeOperatorGeoZoneTicket,
    schemeOperatorFlatFareTicket,
    returnNonCircularTicket,
    multiOperatorGeoZoneTicket,
    multiOperatorMultiServiceTicket,
} from '../test-data/matchingData';
import mockS3Event from './test-data/mockS3Event';
import * as s3 from '../data/s3';
import * as netexGenerator from './netexGenerator';
import * as db from '../data/auroradb';
import { PeriodTicket } from '../types';

jest.mock('../data/auroradb.ts');
jest.spyOn(s3, 'uploadNetexToS3').mockImplementation(() => Promise.resolve());
const event: S3Event = mockS3Event('BucketThing', 'TheBigBucketName');
const mockFetchDataFromS3Spy = jest.spyOn(s3, 'fetchDataFromS3');
const mockUploadNetexToS3Spy = jest.spyOn(s3, 'uploadNetexToS3');

mockUploadNetexToS3Spy.mockImplementation(() => Promise.resolve());

const netexGeneratorSpy = jest.spyOn(netexGenerator, 'default');
const dbSpy = jest.spyOn(db, 'getOperatorDataByNocCode');

describe('netexConvertorHandler', () => {
    beforeEach(() => {
        dbSpy.mockImplementation(() =>
            Promise.resolve([
                {
                    nocCode: 'TEST',
                    website: 'www.unittest.com',
                    ttrteEnq: 'aaaaaa',
                    operatorPublicName: 'Test Buses',
                    opId: '7Z',
                    vosaPsvLicenseName: 'CCD',
                    fareEnq: 'SSSS',
                    complEnq: '334',
                    mode: 'test',
                },
            ]),
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call the pointToPointTicketNetexGenerator when a user uploads info for a single ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        netexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(singleTicket));
        await netexConvertorHandler(event);
        expect(netexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a geozone period ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        netexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodGeoZoneTicket));
        await netexConvertorHandler(event);
        expect(netexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a multiple services period ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        netexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodMultipleServicesTicket));
        await netexConvertorHandler(event);
        expect(netexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for a flat fare ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        netexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(flatFareTicket));
        await netexConvertorHandler(event);
        expect(netexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for scheme operator geozone ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        netexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(schemeOperatorGeoZoneTicket));
        await netexConvertorHandler(event);
        expect(netexGeneratorSpy).toHaveBeenCalled();
    });

    it('should call the periodTicketNetexGenerator when a user uploads info for scheme operator flat fare ticket', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        netexGeneratorSpy.mockImplementation(() => ({ generate: (): void => {} }));
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(schemeOperatorFlatFareTicket));
        await netexConvertorHandler(event);
        expect(netexGeneratorSpy).toHaveBeenCalled();
    });

    it('should throw an error if the user data uploaded to the fdbt-matching-data bucket does not contain a "type" attribute', async () => {
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodGeoZoneTicketWithNoType));
        await expect(netexConvertorHandler(event)).rejects.toThrow();
    });

    it('should generate single fare netex with no undefined variables', async () => {
        netexGeneratorSpy.mockRestore();
        dbSpy.mockImplementation(() =>
            Promise.resolve([
                {
                    nocCode: 'MCTR',
                    website: 'www.unittest.com',
                    ttrteEnq: 'aaaaaa',
                    operatorPublicName: 'Test Buses',
                    opId: '7Z',
                    vosaPsvLicenseName: 'CCD',
                    fareEnq: 'SSSS',
                    complEnq: '334',
                    mode: 'test',
                },
            ]),
        );

        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(singleTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate flat fare netex with no undefined variables', async () => {
        netexGeneratorSpy.mockRestore();
        dbSpy.mockImplementation(() =>
            Promise.resolve([
                {
                    nocCode: 'WBTR',
                    website: 'www.unittest.com',
                    ttrteEnq: 'aaaaaa',
                    operatorPublicName: 'Test Buses',
                    opId: '7Z',
                    vosaPsvLicenseName: 'CCD',
                    fareEnq: 'SSSS',
                    complEnq: '334',
                    mode: 'test',
                },
            ]),
        );
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(flatFareTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate multiple services period netex with no undefined variables', async () => {
        netexGeneratorSpy.mockRestore();
        dbSpy.mockImplementation(() =>
            Promise.resolve([
                {
                    nocCode: 'PBLT',
                    website: 'www.unittest.com',
                    ttrteEnq: 'aaaaaa',
                    operatorPublicName: 'Test Buses',
                    opId: '7Z',
                    vosaPsvLicenseName: 'CCD',
                    fareEnq: 'SSSS',
                    complEnq: '334',
                    mode: 'test',
                },
            ]),
        );
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodMultipleServicesTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate geozone period netex with no undefined variables', async () => {
        netexGeneratorSpy.mockRestore();
        dbSpy.mockImplementation(() =>
            Promise.resolve([
                {
                    nocCode: 'BLAC',
                    website: 'www.unittest.com',
                    ttrteEnq: 'aaaaaa',
                    operatorPublicName: 'Test Buses',
                    opId: '7Z',
                    vosaPsvLicenseName: 'CCD',
                    fareEnq: 'SSSS',
                    complEnq: '334',
                    mode: 'test',
                },
            ]),
        );
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodGeoZoneTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate scheme operator geozone netex with no undefined variables', async () => {
        netexGeneratorSpy.mockRestore();
        dbSpy.mockImplementation(() =>
            Promise.resolve([
                {
                    nocCode: 'IW_Buses-Y',
                    website: 'www.unittest.com',
                    ttrteEnq: 'aaaaaa',
                    operatorPublicName: 'Test Buses',
                    opId: '7Z',
                    vosaPsvLicenseName: 'CCD',
                    fareEnq: 'SSSS',
                    complEnq: '334',
                    mode: 'test',
                },
            ]),
        );
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(schemeOperatorGeoZoneTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate scheme operator flat fare netex with no undefined variables', async () => {
        netexGeneratorSpy.mockRestore();
        dbSpy.mockImplementation(() =>
            Promise.resolve([
                {
                    nocCode: 'IW_Buses-Y',
                    website: 'www.unittest.com',
                    ttrteEnq: 'aaaaaa',
                    operatorPublicName: 'Test Buses',
                    opId: '7Z',
                    vosaPsvLicenseName: 'CCD',
                    fareEnq: 'SSSS',
                    complEnq: '334',
                    mode: 'test',
                },
            ]),
        );
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(schemeOperatorFlatFareTicket));
        await netexConvertorHandler(event);
        const generatedNetex: string = mockUploadNetexToS3Spy.mock.calls[0][0];
        expect(generatedNetex.includes('undefined')).toBeFalsy();
    });

    it('should generate the correct filename', () => {
        const mockDate = Date.now();
        jest.spyOn(global.Date, 'now').mockImplementation(() => mockDate);
        const fileName = generateFileName(`DCCL/single/abcdef123_${mockDate}.json`);
        expect(fileName).toEqual(`DCCL/single/abcdef123_${mockDate}.xml`);
    });
});

describe('buildNocList', () => {
    it('should return an array of nocs for a single ticket', () => {
        const result = buildNocList(singleTicket);
        expect(result).toStrictEqual(['MCTR']);
    });
    it('should return an array of nocs for a return ticket', () => {
        const result = buildNocList(returnNonCircularTicket);
        expect(result).toStrictEqual(['PBLT']);
    });
    it('should return an array of nocs for a period geozone ticket', () => {
        const result = buildNocList(periodGeoZoneTicket);
        expect(result).toStrictEqual(['BLAC']);
    });
    it('should return an array of nocs for a period multiple services ticket', () => {
        const result = buildNocList(periodMultipleServicesTicket);
        expect(result).toStrictEqual(['PBLT']);
    });
    it('should return an array of nocs for a flat fare ticket', () => {
        const result = buildNocList(flatFareTicket as PeriodTicket);
        expect(result).toStrictEqual(['WBTR']);
    });
    it('should return an array of nocs for a scheme operator geozone ticket', () => {
        const result = buildNocList(schemeOperatorGeoZoneTicket);
        expect(result).toStrictEqual(['WBTR', 'DCCL', 'HCTY']);
    });
    it('should return an array of nocs for a scheme operator flat fare ticket', () => {
        const result = buildNocList(schemeOperatorFlatFareTicket);
        expect(result).toStrictEqual(['WBTR', 'DCCL']);
    });
    it('should return an array of nocs for a multi operator geo zone ticket', () => {
        const result = buildNocList(multiOperatorGeoZoneTicket);
        expect(result).toStrictEqual(['WBTR', 'DCCL', 'HHR', 'BLAC']);
    });
    it('should return an array of nocs for a multi operator multi service ticket', () => {
        const result = buildNocList(multiOperatorMultiServiceTicket);
        expect(result).toStrictEqual(['WBTR', 'DCCL', 'BLAC']);
    });
});
