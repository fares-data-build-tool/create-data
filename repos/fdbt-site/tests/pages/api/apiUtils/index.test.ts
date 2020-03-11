import MockReq from 'mock-req';
import Cookies from 'cookies';
import { getDomain, setCookieOnResponseObject, getUuidFromCookie } from '../../../../src/pages/api/apiUtils';
import * as s3 from '../../../../src/data/s3';
import { getMockRequestAndResponse } from '../../../testData/mockData';

describe('apiUtils', () => {
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
});
