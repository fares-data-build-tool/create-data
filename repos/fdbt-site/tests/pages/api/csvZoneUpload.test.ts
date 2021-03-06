import Cookies from 'cookies';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as csvZoneUpload from '../../../src/pages/api/csvZoneUpload';
import * as fileUpload from '../../../src/utils/apiUtils/fileUpload';
import * as virusCheck from '../../../src/utils/apiUtils/virusScan';
import * as csvData from '../../testData/csvZoneData';
import * as s3 from '../../../src/data/s3';
import * as sessions from '../../../src/utils/sessions';
import * as dynamo from '../../../src/data/auroradb';
import { FARE_ZONE_ATTRIBUTE, FARE_TYPE_ATTRIBUTE } from '../../../src/constants/attributes';

const putDataInS3Spy = jest.spyOn(s3, 'putDataInS3');
jest.mock('../../../src/data/auroradb');

describe('csvZoneUpload', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');
    const { req, res } = getMockRequestAndResponse({
        cookieValues: {},
        body: null,
        uuid: {},
        mockWriteHeadFn: writeHeadMock,
    });

    beforeEach(() => {
        jest.resetAllMocks();
        Cookies.prototype.set = jest.fn();
    });

    it.each([
        [csvData.testCsv, csvData.unprocessedTestCsv.Body, csvData.processedTestCsv.Body],
        [
            csvData.testCsvWithEmptyCells,
            csvData.unprocessedTestCsvWithEmptyCells.Body,
            csvData.processedTestCsvWithEmptyCells.Body,
        ],
    ])(
        'should put the unprocessed data in S3 as a csv and the processed data in S3 as json',
        async (csv, expectedUnprocessed, expectedProcessed) => {
            const file = {
                'csv-upload': {
                    size: 999,
                    path: 'string',
                    name: 'string',
                    type: 'text/csv',
                    toJSON(): string {
                        return '';
                    },
                },
            };

            jest.spyOn(fileUpload, 'getFormData').mockImplementation().mockResolvedValue({
                name: 'file',
                files: file,
                fileContents: csv,
            });

            jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(false);

            jest.spyOn(dynamo, 'getAtcoCodesByNaptanCodes')
                .mockImplementation()
                .mockResolvedValue([{ atcoCode: 'TestATCO-TC5', naptanCode: 'TestNaptan-TC5' }]);

            await csvZoneUpload.default(req, res);

            expect(putDataInS3Spy.mock.calls).toEqual([
                [expectedUnprocessed, expect.any(String), false],
                [expectedProcessed, expect.any(String), true],
            ]);
        },
    );

    it('should return 302 redirect to /multipleProducts when valid a valid file is processed and put in S3', async () => {
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): string {
                    return '';
                },
            },
        };

        jest.spyOn(fileUpload, 'getFormData').mockImplementation().mockResolvedValue({
            name: 'file',
            files: file,
            fileContents: csvData.testCsv,
        });

        jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(false);

        await csvZoneUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/multipleProducts',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_ZONE_ATTRIBUTE, 'Town Centre');
    });

    it('should return 302 redirect to /searchOperators if fareType is multiOperator, and when valid file is processed and put in S3', async () => {
        const multiOperatorReq = getMockRequestAndResponse({
            cookieValues: {},
            body: null,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
            session: {
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
            },
        }).req;

        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): string {
                    return '';
                },
            },
        };

        jest.spyOn(fileUpload, 'getFormData').mockImplementation().mockResolvedValue({
            name: 'file',
            files: file,
            fileContents: csvData.testCsv,
        });

        jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(false);

        await csvZoneUpload.default(multiOperatorReq, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/reuseOperatorGroup',
        });
        expect(updateSessionAttributeSpy).toBeCalledWith(multiOperatorReq, FARE_ZONE_ATTRIBUTE, 'Town Centre');
    });

    it('should redirect to /error when an error is thrown in the default', async () => {
        const file = {
            'csv-upload': {
                size: 999,
                path: 'string',
                name: 'string',
                type: 'text/csv',
                toJSON(): string {
                    return '';
                },
            },
        };
        const dynamoError = 'Could not fetch data from dynamo in test';

        jest.spyOn(fileUpload, 'getFormData').mockImplementation().mockResolvedValue({
            name: 'file',
            files: file,
            fileContents: csvData.testCsvWithEmptyCells,
        });

        jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(false);

        jest.spyOn(dynamo, 'getAtcoCodesByNaptanCodes').mockImplementation(() => {
            throw new Error(dynamoError);
        });

        await csvZoneUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    describe('fileIsValid', () => {
        it('should return 302 redirect to /csvZoneUpload when an empty file is attached', async () => {
            const file = {
                'csv-upload': {
                    size: 999,
                    path: 'string',
                    name: 'string',
                    type: 'text/csv',
                    toJSON(): string {
                        return '';
                    },
                },
            };

            jest.spyOn(fileUpload, 'getFormData').mockImplementation().mockResolvedValue({
                name: 'file',
                files: file,
                fileContents: '',
            });

            jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(false);

            await csvZoneUpload.default(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/csvZoneUpload',
            });

            expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_ZONE_ATTRIBUTE, {
                errors: [
                    {
                        errorMessage: 'Select a CSV file to upload',
                        id: 'csv-upload',
                    },
                ],
            });
        });

        it('should return 302 redirect to /csvZoneUpload with an error message when file is too big', async () => {
            const file = {
                'csv-upload': {
                    size: 6000000,
                    path: 'string',
                    name: 'string',
                    type: 'text/csv',
                    toJSON(): string {
                        return '';
                    },
                },
            };

            jest.spyOn(fileUpload, 'getFormData').mockImplementation().mockResolvedValue({
                name: 'file',
                files: file,
                fileContents: csvData.testCsv,
            });

            jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(false);

            await csvZoneUpload.default(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/csvZoneUpload',
            });

            expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_ZONE_ATTRIBUTE, {
                errors: [
                    {
                        errorMessage: 'The selected file must be smaller than 5MB',
                        id: 'csv-upload',
                    },
                ],
            });
        });

        it('should return 302 redirect to /csvZoneUpload with an error message when file is not an allowed type', async () => {
            const file = {
                'csv-upload': {
                    size: 999,
                    path: 'string',
                    name: 'string',
                    type: 'text/pdf',
                    toJSON(): string {
                        return '';
                    },
                },
            };

            jest.spyOn(fileUpload, 'getFormData').mockImplementation().mockResolvedValue({
                name: 'file',
                files: file,
                fileContents: csvData.testCsv,
            });

            jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(false);

            await csvZoneUpload.default(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/csvZoneUpload',
            });

            expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_ZONE_ATTRIBUTE, {
                errors: [
                    {
                        errorMessage: 'The selected file must be a .csv or .xlsx',
                        id: 'csv-upload',
                    },
                ],
            });
        });

        it('should return 302 redirect to /csvZoneUpload with an error message when file contains a virus', async () => {
            process.env.ENABLE_VIRUS_SCAN = '1';

            const file = {
                'csv-upload': {
                    size: 999,
                    path: 'string',
                    name: 'string',
                    type: 'text/pdf',
                    toJSON(): string {
                        return '';
                    },
                },
            };

            jest.spyOn(fileUpload, 'getFormData').mockImplementation().mockResolvedValue({
                name: 'file',
                files: file,
                fileContents: 'i am a virus',
            });

            jest.spyOn(virusCheck, 'containsViruses').mockImplementation().mockResolvedValue(true);

            await csvZoneUpload.default(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/csvZoneUpload',
            });

            expect(updateSessionAttributeSpy).toBeCalledWith(req, FARE_ZONE_ATTRIBUTE, {
                errors: [
                    {
                        errorMessage: 'The selected file contains a virus',
                        id: 'csv-upload',
                    },
                ],
            });
        });
    });

    describe('processCsv', () => {
        it.each([
            [csvData.testCsvWithEmptyLines, csvData.processedTestCsvWithEmptyLines.Body],
            [csvData.testCsvWithEmptyLinesAndEmptyCells, csvData.processedTestCsvWithEmptyLinesAndEmptyCells.Body],
        ])('should skip empty lines in the csv', async (fileContent, expectedProcessed) => {
            jest.spyOn(dynamo, 'getAtcoCodesByNaptanCodes')
                .mockImplementation()
                .mockResolvedValue([{ atcoCode: 'TestATCO-TC4', naptanCode: 'TestNaptan-TC4' }]);

            const result = await csvZoneUpload.processCsv(fileContent, req, res);

            expect(result).toEqual(expectedProcessed);
        });

        it('returns null when a csv upload contains no stops info', async () => {
            const fileContent = csvData.testCsvWithNoStopsInfo;
            jest.spyOn(dynamo, 'getAtcoCodesByNaptanCodes').mockImplementation().mockResolvedValue([]);

            const result = await csvZoneUpload.processCsv(fileContent, req, res);

            expect(result).toBeNull();
        });
    });

    describe('getAtcoCodesForStops', () => {
        it('should return an array of UserFareZone objects when called with an array of naptan codes', async () => {
            const mockRawUserFareZones = csvData.partProcessedTestCsvWithEmptyCells.Body;
            const mockNaptanCodesToQuery: string[] = ['TestNaptan-TC5'];
            const expectedUserFareZones = csvData.processedTestCsvWithEmptyCells.Body;

            jest.spyOn(dynamo, 'getAtcoCodesByNaptanCodes')
                .mockImplementation()
                .mockResolvedValue([{ atcoCode: 'TestATCO-TC5', naptanCode: 'TestNaptan-TC5' }]);

            const mockUserFareZones = await csvZoneUpload.getAtcoCodesForStops(
                mockRawUserFareZones,
                mockNaptanCodesToQuery,
            );
            expect(mockUserFareZones).toEqual(expectedUserFareZones);
        });
    });
});
