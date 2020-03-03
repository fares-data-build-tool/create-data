import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import * as csvUpload from '../../../src/pages/api/csvUpload';
import { getUuidFromCookie } from '../../../src/pages/api/apiUtils';
import * as csvData from '../../testData/csvData';
import * as s3 from '../../../src/data/s3';
import { OPERATOR_COOKIE, FARETYPE_COOKIE, SERVICE_COOKIE } from '../../../src/constants';

jest.spyOn(s3, 'putStringInS3');

describe('csvUpload', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;
    let outputData = '';
    const mockCookie = `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; ${FARETYPE_COOKIE}=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D`;

    beforeEach(() => {
        process.env.USER_DATA_BUCKET_NAME = 'fdbt-user-data';
        process.env.RAW_USER_DATA_BUCKET_NAME = 'fdbt-raw-user-data';
        jest.resetAllMocks();
        outputData = '';
        writeHeadMock = jest.fn();
        res = mockResponse({
            writeHead: writeHeadMock,
        });
        // eslint-disable-next-line no-return-assign
        const storeLog = (inputs: string): string => (outputData += inputs);
        console.warn = jest.fn(storeLog);
    });

    it('should return 302 redirect to /csvUpload when no file is attached', async () => {
        const file = {
            'file-upload-1': {
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

        const req = mockRequest({});

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/csvUpload',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('No file attached.');
    });

    it('should return 302 redirect to /error when a the attached file is too large', async () => {
        const file = {
            'file-upload-1': {
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

        const req = mockRequest({});

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('File is too large. Uploaded file is 999999999999999 Bytes, max size is 5242880 Bytes');
    });

    it('should return 302 redirect to /error when the attached file is not a csv', async () => {
        const file = {
            'file-upload-1': {
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

        const req = mockRequest({});

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
        expect(writeHeadMock).toHaveBeenCalledTimes(1);
        expect(outputData).toBe('File must be of type text/csv, uploaded file is text/pdf');
    });

    it('should get the uuid from the cookie', () => {
        const req = mockRequest({
            headers: {
                cookie: mockCookie,
            },
        });

        const result = getUuidFromCookie(req, res);

        expect(result).toBe('780e3459-6305-4ae5-9082-b925b92cb46c');
    });

    it('should put the unparsed data in s3 and the parsed data in s3', async () => {
        const file = {
            'file-upload-1': {
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

        const req = mockRequest({
            headers: {
                cookie: mockCookie,
            },
        });

        await csvUpload.default(req, res);

        expect(s3.putStringInS3).toBeCalledWith(
            'fdbt-raw-user-data',
            expect.any(String),
            JSON.stringify(csvData.unprocessedObject.Body),
            'text/csv; charset=utf-8',
        );

        expect(s3.putStringInS3).toBeCalledWith(
            'fdbt-user-data',
            expect.any(String),
            JSON.stringify(csvData.processedObject.Body),
            'application/json; charset=utf-8',
        );

        expect(s3.putStringInS3).toBeCalledTimes(2);
    });

    it('should return 302 redirect to /matching when the happy path is used', async () => {
        const file = {
            'file-upload-1': {
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

        const req = mockRequest({
            headers: {
                cookie: mockCookie,
            },
        });

        await csvUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/matching',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the fares triangle data has non-numerical prices', async () => {
        const file = {
            'file-upload-1': {
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

        const req = mockRequest({
            headers: {
                cookie: mockCookie,
            },
        });

        await expect(csvUpload.default(req, res)).rejects.toThrow();

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the fares triangle data has missing prices', async () => {
        const file = {
            'file-upload-1': {
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

        const req = mockRequest({
            headers: {
                cookie: mockCookie,
            },
        });

        await expect(csvUpload.default(req, res)).rejects.toThrow();

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });

        expect(writeHeadMock).toHaveBeenCalledTimes(1);
    });
});
