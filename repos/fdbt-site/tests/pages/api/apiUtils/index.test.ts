import Cookies from 'cookies';
import {
    setCookieOnResponseObject,
    getUuidFromCookie,
    redirectOnFareType,
    checkEmailValid,
    getAttributeFromIdToken,
    validateNewPassword,
} from '../../../../src/pages/api/apiUtils';
import * as s3 from '../../../../src/data/s3';
import { getMockRequestAndResponse } from '../../../testData/mockData';
import { ErrorInfo } from '../../../../src/interfaces';

describe('apiUtils', () => {
    const writeHeadMock = jest.fn();

    beforeEach(() => {
        jest.spyOn(s3, 'putStringInS3');

        Cookies.prototype.set = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('checkEmailValid', () => {
        it.each([
            ['@email.com'],
            ['test@email'],
            ['  test@email.com'],
            ['t est@email.com'],
            ['t est@email.com'],
            ['test@email.com   '],
            ['test@email .com'],
        ])('should validate that %s returns false', input => {
            expect(checkEmailValid(input)).toBeFalsy();
        });
    });

    describe('checkEmailValid', () => {
        it.each([['test@email.com'], ['TEST@EMAIL.COM']])('should validate that %s returns true', input => {
            expect(checkEmailValid(input)).toBeTruthy();
        });
    });

    describe('setCookieOnResponseObject', () => {
        it('to call set cookie library', () => {
            const cookieName = 'test';
            const cookieValue = 'cookieValue';
            const { req, res } = getMockRequestAndResponse();
            setCookieOnResponseObject(cookieName, cookieValue, req, res);
            expect(Cookies.prototype.set).toBeCalledWith(cookieName, cookieValue, {
                path: '/',
                maxAge: 1000 * (3600 * 24),
                sameSite: 'strict',
                secure: true,
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
        it('should return 302 redirect to /service when the single ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({ fareType: 'single' }, {}, {}, writeHeadMock);
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/service',
            });
        });

        it('should return 302 redirect to /service when the return ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({ fareType: 'return' }, {}, {}, writeHeadMock);
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/service',
            });
        });

        it('should return 302 redirect to /periodType when the period ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({ fareType: 'period' }, {}, {}, writeHeadMock);
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/periodType',
            });
        });

        it('should return 302 redirect to /serviceList when the flat fare ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({ fareType: 'flatFare' }, {}, {}, writeHeadMock);
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/serviceList',
            });
        });

        it('should throw error if unexpected fare type is selected', () => {
            const { req, res } = getMockRequestAndResponse({ fareType: 'roundabout' }, null, {}, writeHeadMock);

            expect(() => {
                redirectOnFareType(req, res);
            }).toThrowError(new Error('Fare Type we expect was not received.'));
        });
    });

    describe('getAttributeFromIdToken', () => {
        let emailJwt: string;

        beforeEach(() => {
            // This JWT encodes an email of test@example.com
            emailJwt =
                'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.pwd0gdkeSRBqRpoNKxC8lK3SuydPKqKPRRdEE-eNEc0';
        });

        it('should retrieve given attribute if present', () => {
            const { req, res } = getMockRequestAndResponse({
                idToken: emailJwt,
            });
            const email = getAttributeFromIdToken(req, res, 'email');

            expect(email).toBe('test@example.com');
        });

        it('should return null if not present', () => {
            const { req, res } = getMockRequestAndResponse({
                idToken: emailJwt,
            });
            const email = getAttributeFromIdToken(req, res, 'custom:noc');

            expect(email).toBeNull();
        });
    });

    describe('validateNewPassword', () => {
        const noPasswordError = { id: 'new-password', errorMessage: 'Enter a new password' };
        const passwordLengthError = { id: 'new-password', errorMessage: 'Password must be at least 8 characters long' };
        const passwordMatchError = { id: 'new-password', errorMessage: 'Passwords do not match' };
        it.each([
            ['no errors', 'passwords match and are a suitable length', 'iLoveBuses', 'iLoveBuses', []],
            ['a no password error', 'no input is provided', '', '', [noPasswordError]],
            ['a no password error', 'no new password is provided', '', 'iLoveBuses', [noPasswordError]],
            ['a password length error', 'new password is too short', 'bus', 'iLoveBuses', [passwordLengthError]],
            [
                'a password match error',
                'the two passwords do not match',
                'iHateBuses',
                'iLoveBuses',
                [passwordMatchError],
            ],
            ['no errors', 'passwords match and are a suitable length', 'iLoveBuses', 'iLoveBuses', []],
        ])('should return %s when %s', (_errors, _case, newPassword, confirmNewPassword, expectedResult) => {
            const inputChecks: ErrorInfo[] = [];
            const res = validateNewPassword(newPassword, confirmNewPassword, inputChecks);
            expect(res).toEqual(expectedResult);
        });
    });
});
