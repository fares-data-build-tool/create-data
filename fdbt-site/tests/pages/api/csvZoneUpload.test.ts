import Cookies from 'cookies';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as csvZoneUpload from '../../../src/pages/api/csvZoneUpload';
import * as fileUpload from '../../../src/pages/api/apiUtils/fileUpload';
import * as csvData from '../../testData/csvZoneData';
import * as s3 from '../../../src/data/s3';
import * as dynamo from '../../../src/data/auroradb';

const putStringInS3Spy = jest.spyOn(s3, 'putStringInS3');

describe('csvZoneUpload', () => {
    const writeHeadMock = jest.fn();
    const { req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
    let outputData = '';

    beforeEach(() => {
        jest.resetAllMocks();
        outputData = '';
        Cookies.prototype.set = jest.fn();
        // eslint-disable-next-line no-return-assign
        const storeLog = (inputs: string): string => (outputData += inputs);
        console.warn = jest.fn(storeLog);
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

            jest.spyOn(fileUpload, 'getFormData')
                .mockImplementation()
                .mockResolvedValue({
                    files: file,
                    fileContents: csv,
                });

            jest.spyOn(dynamo, 'getAtcoCodesByNaptanCodes')
                .mockImplementation()
                .mockResolvedValue([{ atcoCode: 'TestATCO-TC5', naptanCode: 'TestNaptan-TC5' }]);

            await csvZoneUpload.default(req, res);

            expect(putStringInS3Spy.mock.calls).toEqual([
                [
                    'fdbt-raw-user-data-dev',
                    expect.any(String),
                    JSON.stringify(expectedUnprocessed),
                    'text/csv; charset=utf-8',
                ],
                [
                    'fdbt-user-data-dev',
                    expect.any(String),
                    JSON.stringify(expectedProcessed),
                    'application/json; charset=utf-8',
                ],
            ]);
        },
    );

    it('should return 302 redirect to /howManyProducts when valid a valid file is processed and put in S3', async () => {
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

        jest.spyOn(fileUpload, 'getFormData')
            .mockImplementation()
            .mockResolvedValue({
                files: file,
                fileContents: csvData.testCsv,
            });

        await csvZoneUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/howManyProducts',
        });
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

        jest.spyOn(fileUpload, 'getFormData')
            .mockImplementation()
            .mockResolvedValue({
                files: file,
                fileContents: csvData.testCsvWithEmptyCells,
            });

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

            jest.spyOn(fileUpload, 'getFormData')
                .mockImplementation()
                .mockResolvedValue({
                    files: file,
                    fileContents: '',
                });

            await csvZoneUpload.default(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/csvZoneUpload',
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

            jest.spyOn(fileUpload, 'getFormData')
                .mockImplementation()
                .mockResolvedValue({
                    files: file,
                    fileContents: csvData.testCsv,
                });

            await csvZoneUpload.default(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/csvZoneUpload',
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

            jest.spyOn(fileUpload, 'getFormData')
                .mockImplementation()
                .mockResolvedValue({
                    files: file,
                    fileContents: csvData.testCsv,
                });

            await csvZoneUpload.default(req, res);

            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/csvZoneUpload',
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
            jest.spyOn(dynamo, 'getAtcoCodesByNaptanCodes')
                .mockImplementation()
                .mockResolvedValue([]);

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
