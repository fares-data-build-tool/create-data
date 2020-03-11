/* eslint-disable global-require */
import MockReq from 'mock-req';
import Cookies from 'cookies';
import { NextApiResponse, NextApiRequest } from 'next';
import {
    getDomain,
    setCookieOnResponseObject,
    isSessionValid,
    isCookiesUUIDMatch,
    getUuidFromCookie,
} from '../../../../src/pages/api/apiUtils';
import * as index from '../../../../src/pages/api/apiUtils/index';
import * as csvData from '../../../testData/csvFareTriangleData';
import * as s3 from '../../../../src/data/s3';
import * as csvUpload from '../../../../src/pages/api/csvUpload';
import { getMockRequestAndResponse } from '../../../testData/mockData';

describe('apiUtils', () => {
    let writeHeadMock: jest.Mock;

    beforeEach(() => {
        jest.spyOn(s3, 'putStringInS3');

        Cookies.prototype.set = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

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
            const { req, res } = getMockRequestAndResponse();

            // mock the library and its implementation of the set cookie method

            // call our method with the consts we set above
            setCookieOnResponseObject(domain, cookieName, cookieValue, req, res);
            // making sure our mock is being called with what we passed it
            // expect(Cookies).toBeCalled();
            expect(Cookies.prototype.set).toBeCalledWith(cookieName, cookieValue, {
                domain,
                path: '/',
                maxAge: 1000 * (3600 * 24),
                sameSite: 'strict',
            });
        });
    });

    describe('getUuidFromCookie', () => {
        it('should get the uuid from the cookie', () => {
            const { req, res } = getMockRequestAndResponse({}, null, {
                operatorUuid: '780e3459-6305-4ae5-9082-b925b92cb46c',
            });

            const result = getUuidFromCookie(req, res);

            expect(result).toBe('780e3459-6305-4ae5-9082-b925b92cb46c');
        });
    });

    describe('validator', () => {
        describe('isSessionvalid', () => {
            it('should return true when there is an operator cookie', () => {
                const expected = true;
                const { req, res } = getMockRequestAndResponse();
                const result = isSessionValid(req, res);
                expect(result).toEqual(expected);
            });
            it('should return false when there is no operator cookie', () => {
                const expected = false;
                const { req, res } = getMockRequestAndResponse({
                    operator: null,
                });
                const result = isSessionValid(req, res);
                expect(result).toEqual(expected);
            });
        });

        describe('isCookiesUUIDMatch', () => {
            it('should return true if uuids match', () => {
                const expected = true;
                const { req, res } = getMockRequestAndResponse();
                const result = isCookiesUUIDMatch(req, res);
                expect(result).toEqual(expected);
            });

            it('should return false id uuids do not match', () => {
                const expected = false;
                const { req, res } = getMockRequestAndResponse({}, null, {
                    operatorUuid: '1e0459b3-082e-4e70-89db-1238ae173e10',
                    faretypeUuid: '1e04fghb3-082e-4e70-89db-96e8ae173e10',
                    serviceUuid: '1e0459344-082e-4e70-89db-96e8ae173e10',
                    journeyUuid: '1e0459b3-082e-r5ty-89db-96e8ae173e10',
                });
                const result = isCookiesUUIDMatch(req, res);
                expect(result).toEqual(expected);
            });
        });

        describe('csvFileisValid', () => {
            let outputData = '';
            let req: NextApiRequest;
            let res: NextApiResponse;

            beforeEach(() => {
                process.env.USER_DATA_BUCKET_NAME = 'fdbt-user-data';
                process.env.RAW_USER_DATA_BUCKET_NAME = 'fdbt-raw-user-data';
                jest.resetAllMocks();
                outputData = '';
                writeHeadMock = jest.fn();
                ({ req, res } = getMockRequestAndResponse({}, null, {}, writeHeadMock));
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

                await csvUpload.default(req, res);

                expect(writeHeadMock).toBeCalledWith(302, {
                    Location: '/error',
                });
                expect(writeHeadMock).toHaveBeenCalledTimes(1);
                expect(outputData).toBe('File not of allowed type, uploaded file is text/pdf');
            });
        });
    });
});
