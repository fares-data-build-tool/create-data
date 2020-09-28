import cookies, { CookiePolicy, oneYearInMilliseconds } from '../../../src/pages/api/cookies';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { getMockRequestAndResponse } from '../../testData/mockData';
import { COOKIES_POLICY_COOKIE, COOKIE_PREFERENCES_COOKIE, COOKIE_SETTINGS_SAVED_COOKIE } from '../../../src/constants';

describe('cookies', () => {
    const writeHeadMock = jest.fn();
    const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should redirect back to itself (i.e. /cookies) when no tracking selection is sent to the API', () => {
        const { req, res } = getMockRequestAndResponse({ body: {}, mockWriteHeadFn: writeHeadMock });
        cookies(req, res);
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/cookies' });
    });

    it("should update all cookies, with the cookie policy 'usage' as false when the user disables tracking", () => {
        const mockCookiePolicy: CookiePolicy = { essential: true, usage: false };
        const { req, res } = getMockRequestAndResponse({
            body: {
                tracking: 'off',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        cookies(req, res);
        expect(setCookieSpy).toHaveBeenNthCalledWith(1, COOKIE_SETTINGS_SAVED_COOKIE, 'true', req, res);
        expect(setCookieSpy).toHaveBeenNthCalledWith(
            2,
            COOKIE_PREFERENCES_COOKIE,
            'true',
            req,
            res,
            oneYearInMilliseconds,
        );
        expect(setCookieSpy).toHaveBeenNthCalledWith(
            3,
            COOKIES_POLICY_COOKIE,
            JSON.stringify(mockCookiePolicy),
            req,
            res,
            oneYearInMilliseconds,
        );
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/cookies' });
    });

    it("should update all cookies, with the cookie policy 'usage' as true when the user enables tracking", () => {
        const mockCookiePolicy: CookiePolicy = { essential: true, usage: true };
        const { req, res } = getMockRequestAndResponse({
            body: {
                tracking: 'on',
            },
            mockWriteHeadFn: writeHeadMock,
        });
        cookies(req, res);
        expect(setCookieSpy).toHaveBeenNthCalledWith(1, COOKIE_SETTINGS_SAVED_COOKIE, 'true', req, res);
        expect(setCookieSpy).toHaveBeenNthCalledWith(
            2,
            COOKIE_PREFERENCES_COOKIE,
            'true',
            req,
            res,
            oneYearInMilliseconds,
        );
        expect(setCookieSpy).toHaveBeenNthCalledWith(
            3,
            COOKIES_POLICY_COOKIE,
            JSON.stringify(mockCookiePolicy),
            req,
            res,
            oneYearInMilliseconds,
        );
        expect(writeHeadMock).toBeCalledWith(302, { Location: '/cookies' });
    });
});
