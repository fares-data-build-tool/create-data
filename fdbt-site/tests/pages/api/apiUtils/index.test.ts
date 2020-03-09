/* eslint-disable global-require */
import mockReqRes, { mockRequest, mockResponse } from 'mock-req-res';
import MockReq from 'mock-req';
import Cookies from 'cookies';
import {
    getDomain,
    setCookieOnResponseObject,
    // isSessionValid,
    // isCookiesUUIDMatch,
    // getUuidFromCookie,
} from '../../../../src/pages/api/apiUtils';
// import { OPERATOR_COOKIE, SERVICE_COOKIE, FARETYPE_COOKIE, JOURNEY_COOKIE } from '../../../../src/constants';
import * as index from '../../../../src/pages/api/apiUtils/index';
import * as csvData from '../../../testData/csvFareTriangleData';
import * as s3 from '../../../../src/data/s3';
import * as csvUpload from '../../../../src/pages/api/csvUpload';

const mockCookiesSet = jest.fn();
jest.mock('cookies', () => {
    return jest.fn().mockImplementation(() => {
        return { set: mockCookiesSet };
    });
});
jest.spyOn(s3, 'putStringInS3');
// const mockCookie = `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%2C%22nocCode%22%3A%22HCTY%22%7D; ${FARETYPE_COOKIE}=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%2213%2322%2F07%2F2019%22%2C%22uuid%22%3A%22780e3459-6305-4ae5-9082-b925b92cb46c%22%7D`;

describe('apiUtils', () => {
    let res: mockReqRes.ResponseOutput;
    // let writeHeadMock: jest.Mock;

    describe('getDomain', () => {
        it('should return the domain without a port number', () => {
            const expected = 'localhost';
            const req = new MockReq({
                headers: {
                    host: 'localhost:3000',
                    origin: 'localhost:3000',
                },
            });
            const result = getDomain(req);
            expect(result).toEqual(expected);
        });
    });

    describe('setCookieOnResponseObject', () => {
        it('to call set cookie library', () => {
            // create the objects to be passed in

            const domain = 'localhost';
            const cookieName = 'test';
            const cookieValue = 'cookieValue';
            const req = mockRequest();
            res = mockResponse();

            // mock the library and its implementation of the set cookie method

            // call our method with the consts we set above
            setCookieOnResponseObject(domain, cookieName, cookieValue, req, res);
            // making sure our mock is being called with what we passed it
            expect(Cookies).toBeCalled();
            expect(mockCookiesSet).toBeCalledWith(cookieName, cookieValue, {
                domain,
                path: '/',
                maxAge: 1000 * (3600 * 24),
                sameSite: 'strict',
            });
        });
    });

    // describe('getUuidFromCookie', () => {
    //     it('should get the uuid from the cookie', () => {
    //         res = mockResponse({
    //             writeHead: writeHeadMock,
    //         });
    //         const req = mockRequest({
    //             headers: {
    //                 cookie: mockCookie,
    //             },
    //         });

    //         const result = getUuidFromCookie(req, res);

    //         expect(result).toBe('780e3459-6305-4ae5-9082-b925b92cb46c');
    //     });
    // });
});

describe('validator', () => {
    let res: mockReqRes.ResponseOutput;
    let writeHeadMock: jest.Mock;

    // describe('isSessionvalid', () => {
    //     it('should return true when there is an operator cookie', () => {
    //         const expected = true;
    //         const req = mockRequest({
    //             connection: {
    //                 encrypted: true,
    //             },
    //             body: {},
    //             headers: {
    //                 host: 'localhost:5000',
    //                 cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D;${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`,
    //             },
    //         });
    //         res = mockResponse();
    //         const result = isSessionValid(req, res);
    //         expect(result).toEqual(expected);
    //     });
    //     it('should return false when there is no operator cookie', () => {
    //         const expected = false;
    //         const req = mockRequest({
    //             connection: {
    //                 encrypted: true,
    //             },
    //             body: {},
    //             headers: {
    //                 host: 'localhost:5000',
    //                 cookie: `${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`,
    //             },
    //         });
    //         res = mockResponse();
    //         const result = isSessionValid(req, res);
    //         expect(result).toEqual(expected);
    //     });
    // });

    // describe('isCookiesUUIDMatch', () => {

    //     it('should return true if uuids match', () => {
    //         const expected = true;
    //         const req = mockRequest({
    //             connection: {
    //                 encrypted: true,
    //             },
    //             body: {},
    //             headers: {
    //                 host: 'localhost:5000',
    //                 cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D;${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D;${FARETYPE_COOKIE}=%7B%22faretype%22%3A%22single%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D;${JOURNEY_COOKIE}=%7B%22journey%22%3A%22single%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D`,
    //             },
    //         });
    //         res = mockResponse();
    //         const result = isCookiesUUIDMatch(req, res);
    //         expect(result).toEqual(expected);
    //     });

    //     it('should return false id uuids do not match', () => {
    //         const expected = false;
    //         const req = mockRequest({
    //             connection: {
    //                 encrypted: true,
    //             },
    //             body: {},
    //             headers: {
    //                 host: 'localhost:5000',
    //                 cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8x0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`,
    //             },
    //         });
    //         res = mockResponse();
    //         const result = isCookiesUUIDMatch(req, res);
    //         expect(result).toEqual(expected);
    //     });
    // });

    describe('csvFileisValid', () => {
        let outputData = '';

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

            jest.spyOn(index, 'getFormData')
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

            jest.spyOn(index, 'getFormData')
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
            expect(outputData).toBe(
                'File is too large. Uploaded file is 999999999999999 Bytes, max size is 5242880 Bytes',
            );
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

            jest.spyOn(index, 'getFormData')
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
            expect(outputData).toBe('File not of allowed type, uploaded file is text/pdf');
        });
    });
});
