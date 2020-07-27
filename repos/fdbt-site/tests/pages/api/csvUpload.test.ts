import * as csvUpload from '../../../src/pages/api/csvUpload';
import * as fileUpload from '../../../src/pages/api/apiUtils/fileUpload';
import * as csvData from '../../testData/csvFareTriangleData';
import * as s3 from '../../../src/data/s3';
import { getMockRequestAndResponse } from '../../testData/mockData';
import logger from '../../../src/utils/logger';

jest.spyOn(s3, 'putStringInS3');

describe('csvUpload', () => {
    const writeHeadMock = jest.fn();
    const { req, res } = getMockRequestAndResponse({
        cookieValues: {},
        body: null,
        uuid: {},
        mockWriteHeadFn: writeHeadMock,
    });
    const loggerSpy = jest.spyOn(logger, 'warn');

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return 302 redirect to /csvUpload when no file is attached', async () => {
        const file = {
            'csv-upload': {
                size: 2,
                path: 'string',
                name: 'string',
                type: 'string',
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

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(loggerSpy).toBeCalledWith({
            context: 'api.utils.validateFile',
            fileName: 'string',
            message: 'empty CSV Selected',
        });
    });

    it('should return 302 redirect to /csvUpload with an error message when a the attached file is too large', async () => {
        const file = {
            'csv-upload': {
                size: 999999999999999,
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

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(loggerSpy).toBeCalledWith({
            context: 'api.utils.validateFile',
            maxSize: 5242880,
            message: 'file is too large',
            size: 999999999999999,
        });
    });

    it('should return 302 redirect to /csvUpload with an error message when the attached file is not a csv', async () => {
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

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(loggerSpy).toBeCalledWith({
            context: 'api.utils.validateFile',
            message: 'file not of allowed type',
            type: 'text/pdf',
        });
    });

    it.each([
        [csvData.testCsv, csvData.unprocessedObject.Body, csvData.processedObject.Body],
        [csvData.testCsvWithEmptyLines, csvData.unprocessedObjectWithEmptyLines.Body, csvData.processedObject.Body],
    ])(
        'should put the unparsed data in s3 and the parsed data in s3',
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

            await csvUpload.default(req, res);

            expect(s3.putStringInS3).toBeCalledWith(
                'fdbt-raw-user-data-dev',
                expect.any(String),
                JSON.stringify(expectedUnprocessed),
                'text/csv; charset=utf-8',
            );

            expect(s3.putStringInS3).toBeCalledWith(
                'fdbt-user-data-dev',
                expect.any(String),
                JSON.stringify(expectedProcessed),
                'application/json; charset=utf-8',
            );
        },
    );

    it('should return 302 redirect to /outboundMatching when the happy path is used', async () => {
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

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/outboundMatching',
        });
    });

    it('should throw an error if the fares triangle data has non-numerical prices', async () => {
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
                fileContents: csvData.nonNumericPricesTestCsv,
            });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
    });

    it('should return 302 redirect to /csvUpload with an error message if the fares triangle data has missing prices', async () => {
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
                fileContents: csvData.missingPricesTestCsv,
            });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
    });
});
