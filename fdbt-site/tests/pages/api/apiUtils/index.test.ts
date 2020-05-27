import Cookies from 'cookies';
import {
    getDomain,
    setCookieOnResponseObject,
    getUuidFromCookie,
    redirectOnFareType,
} from '../../../../src/pages/api/apiUtils';
import * as s3 from '../../../../src/data/s3';
import { getMockRequestAndResponse } from '../../../testData/mockData';

describe('apiUtils', () => {
    const writeHeadMock = jest.fn();

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
            const { req } = getMockRequestAndResponse();
            const result = getDomain(req);
            expect(result).toEqual(expected);
        });
    });

    describe('setCookieOnResponseObject', () => {
        it('to call set cookie library', () => {
            const domain = 'localhost';
            const cookieName = 'test';
            const cookieValue = 'cookieValue';
            const { req, res } = getMockRequestAndResponse();
            setCookieOnResponseObject(domain, cookieName, cookieValue, req, res);
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

    describe('redirectOnFareType', () => {
        it('should return 302 redirect to /periodType when period is selected', () => {
            const { res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
            const fareType = 'period';
            redirectOnFareType(fareType, res);

            expect(writeHeadMock).toBeCalledWith(302, { Location: '/periodType' });
        });

        it('should return 302 redirect to /service when single is selected', () => {
            const { res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
            const fareType = 'single';
            redirectOnFareType(fareType, res);

            expect(writeHeadMock).toBeCalledWith(302, { Location: '/service' });
        });

        it('should return 302 redirect to /service when return is selected', () => {
            const { res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
            const fareType = 'return';
            redirectOnFareType(fareType, res);

            expect(writeHeadMock).toBeCalledWith(302, { Location: '/service' });
        });

        it('should return 302 redirect to /serviceList when flatFare is selected', () => {
            const { res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
            const fareType = 'flatFare';
            redirectOnFareType(fareType, res);

            expect(writeHeadMock).toBeCalledWith(302, { Location: '/serviceList' });
        });

        it('should throw error if unexpected fare type is selected', () => {
            const { res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
            const fareType = 'roundAbout';

            expect(() => {
                redirectOnFareType(fareType, res);
            }).toThrowError(new Error('Fare Type we expect was not received.'));
        });

        it('should throw error if no fare type is selected', () => {
            const { res } = getMockRequestAndResponse({}, null, {}, writeHeadMock);
            const fareType = '';

            expect(() => {
                redirectOnFareType(fareType, res);
            }).toThrowError(new Error('No fare type received'));
        });
    });
});
