/* eslint-disable global-require */

import { mockRequest, mockResponse } from 'mock-req-res';
import MockReq from 'mock-req';
import mockSetCookie from 'set-cookie';
import { getCookies, getDomain, setCookieOnResponseObject } from '../../../../src/pages/api/apiUtils';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../../../../src/constants';

jest.mock('set-cookie');

describe('apiUtils', () => {
    describe('getCookies', () => {
        it('should return cookies when given a request', () => {
            const operatorCookieValue =
                '%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D';
            const serviceCookieValue =
                '%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D';
            const req = mockRequest({
                body: {},
                headers: {
                    host: 'localhost',
                    origin: 'localhost',
                    cookie: `${OPERATOR_COOKIE}=${operatorCookieValue}; ${SERVICE_COOKIE}=${serviceCookieValue}`,
                },
            });
            const result = getCookies(req);
            expect(result[OPERATOR_COOKIE]).toEqual(operatorCookieValue);
            expect(result[SERVICE_COOKIE]).toEqual(serviceCookieValue);
        });
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
            const res = mockResponse();
            // mock the library and its implementation of the set cookie method

            mockSetCookie.mockImplementation();
            // call our method with the consts we set above
            setCookieOnResponseObject(domain, cookieName, cookieValue, res);
            // making sure our mock is being called with what we passed it
            expect(mockSetCookie).toBeCalled();
            expect(mockSetCookie).toBeCalledWith(cookieName, cookieValue, {
                domain,
                path: '/',
                maxAge: 3600 * 24,
                res,
            });
        });
    });
});
