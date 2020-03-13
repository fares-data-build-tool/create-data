import * as csvUpload from '../../../src/pages/api/csvUpload';
import * as csvData from '../../testData/csvFareTriangleData';
import * as s3 from '../../../src/data/s3';
import { getMockRequestAndResponse } from '../../testData/mockData';

jest.spyOn(s3, 'putStringInS3');

describe('csvUpload', () => {
    const writeHeadMock = jest.fn();
    const { req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
    let outputData = '';

    beforeEach(() => {
        outputData = '';

        // eslint-disable-next-line no-return-assign
        const storeLog = (inputs: string): string => (outputData += inputs);
        console.warn = jest.fn(storeLog);
    });

    afterEach(() => {
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

        jest.spyOn(csvUpload, 'getFormData')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: '',
            });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('No file attached.');
    });

    it('should return 302 redirect to /error when a the attached file is too large', async () => {
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

        jest.spyOn(csvUpload, 'getFormData')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: csvData.testCsv,
            });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('File is too large. Uploaded file is 999999999999999 Bytes, max size is 5242880 Bytes');
    });

    it('should return 302 redirect to /error when the attached file is not a csv', async () => {
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

        jest.spyOn(csvUpload, 'getFormData')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: csvData.testCsv,
            });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('File not of allowed type, uploaded file is text/pdf');
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

            jest.spyOn(csvUpload, 'getFormData')
                .mockImplementation()
                .mockResolvedValue({
                    Files: file,
                    FileContent: csv,
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

            expect(s3.putStringInS3).toBeCalledTimes(2);
        },
    );

    it('should return 302 redirect to /matching when the happy path is used', async () => {
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

        jest.spyOn(csvUpload, 'getFormData')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: csvData.testCsv,
            });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/matching',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
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

        jest.spyOn(csvUpload, 'getFormData')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: csvData.nonNumericPricesTestCsv,
            });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the fares triangle data has missing prices', async () => {
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

        jest.spyOn(csvUpload, 'getFormData')
            .mockImplementation()
            .mockResolvedValue({
                Files: file,
                FileContent: csvData.missingPricesTestCsv,
            });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
    });
});
