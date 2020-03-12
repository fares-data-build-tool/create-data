/* eslint-disable global-require */

import Cookies from 'cookies';
import { getDomain, setCookieOnResponseObject } from '../../../../src/pages/api/apiUtils';
import { getMockRequestAndResponse } from '../../../testData/mockData';

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
            const { req } = getMockRequestAndResponse();
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

            setCookieOnResponseObject(domain, cookieName, cookieValue, req, res);
            expect(Cookies).toBeCalled();
            expect(mockCookiesSet).toBeCalledWith(cookieName, cookieValue, {
                domain,
                path: '/',
                maxAge: 1000 * (3600 * 24),
                sameSite: 'strict',
            });
        });
    });
});
