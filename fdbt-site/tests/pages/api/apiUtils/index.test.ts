/* eslint-disable global-require */

import { mockRequest, mockResponse } from 'mock-req-res';
import MockReq from 'mock-req';
import Cookies from 'cookies';
import { getDomain, setCookieOnResponseObject } from '../../../../src/pages/api/apiUtils';

const mockCookiesSet = jest.fn();
jest.mock('cookies', () => {
    return jest.fn().mockImplementation(() => {
        return { set: mockCookiesSet };
    });
});

describe('apiUtils', () => {
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
            const res = mockResponse();
            // mock the library and its implementation of the set cookie method

            // call our method with the consts we set above
            setCookieOnResponseObject(domain, cookieName, cookieValue, req, res);
            // making sure our mock is being called with what we passed it
            expect(Cookies).toBeCalled();
            expect(mockCookiesSet).toBeCalledWith(cookieName, cookieValue, {
                domain,
                path: '/',
                maxAge: 3600 * 24,
                sameSite: 'strict',
            });
        });
    });
});
