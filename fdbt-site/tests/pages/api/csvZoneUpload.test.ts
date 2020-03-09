import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import http from 'http';
import * as csvZoneUpload from '../../../src/pages/api/csvZoneUpload';
import * as index from '../../../src/pages/api/apiUtils/index';
import { setCookieOnResponseObject } from '../../../src/pages/api/apiUtils/index';
import * as csvData from '../../testData/csvZoneData';
import * as s3 from '../../../src/data/s3';
import { OPERATOR_COOKIE, FARETYPE_COOKIE, SERVICE_COOKIE } from '../../../src/constants';

http.OutgoingMessage.prototype.setHeader = jest.fn();

jest.spyOn(s3, 'putStringInS3');

describe('csvZoneUpload', () => {
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

    // it.each([
    //     [csvData.testCsv, csvData.unprocessedObject.Body, csvData.processedObject.Body],
    //     [csvData.testCsvWithEmptyCells, csvData.unprocessedObjectWithEmptyCells.Body, csvData.processedObject.Body],
    // ])(
    //     'should put the unparsed data in s3 and the parsed data in s3',
    //     async (csv, expectedUnprocessed, expectedProcessed) => {
    //         const file = {
    //             'csv-upload': {
    //                 size: 999,
    //                 path: 'string',
    //                 name: 'string',
    //                 type: 'text/csv',
    //                 toJSON(): string {
    //                     return '';
    //                 },
    //             },
    //         };

    //         jest.spyOn(index, 'getFormData')
    //             .mockImplementation()
    //             .mockResolvedValue({
    //                 Files: file,
    //                 FileContent: csv,
    //             });

    //         const req = mockRequest({
    //             headers: {
    //                 cookie: mockCookie,
    //             },
    //         });

    //         await csvZoneUpload.default(req, res);

    //         expect(s3.putStringInS3).toBeCalledWith(
    //             'fdbt-raw-user-data',
    //             expect.any(String),
    //             JSON.stringify(expectedUnprocessed),
    //             'text/csv; charset=utf-8',
    //         );

    //         expect(s3.putStringInS3).toBeCalledWith(
    //             'fdbt-user-data',
    //             expect.any(String),
    //             JSON.stringify(expectedProcessed),
    //             'application/json; charset=utf-8',
    //         );

    //         expect(s3.putStringInS3).toBeCalledTimes(2);
    //     },
    // );

    it('should return 302 redirect to /periodProduct when the happy path is used', async () => {
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

        jest.spyOn(index, 'getFormData')
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
        (setCookieOnResponseObject as {}) = jest.fn();
        await csvZoneUpload.default(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/periodProduct',
        });
    });
});
