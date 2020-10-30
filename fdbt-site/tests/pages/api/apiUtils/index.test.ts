import Cookies from 'cookies';
import {
    setCookieOnResponseObject,
    getUuidFromCookie,
    redirectOnFareType,
    checkEmailValid,
    getAttributeFromIdToken,
    validatePassword,
    getSelectedStages,
} from '../../../../src/pages/api/apiUtils';
import * as s3 from '../../../../src/data/s3';
import { getMockRequestAndResponse } from '../../../testData/mockData';
import { FARE_TYPE_ATTRIBUTE } from '../../../../src/constants';

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
                sameSite: 'strict',
                secure: true,
                httpOnly: true,
                maxAge: undefined,
            });
        });
    });

    describe('getUuidFromCookie', () => {
        it('should get the uuid from the cookie', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                body: null,
                uuid: {
                    operatorUuid: '780e3459-6305-4ae5-9082-b925b92cb46c',
                },
            });
            const result = getUuidFromCookie(req, res);
            expect(result).toBe('780e3459-6305-4ae5-9082-b925b92cb46c');
        });
    });

    describe('redirectOnFareType', () => {
        it('should return 302 redirect to /service when the single ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                body: {},
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
            });
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/service',
            });
        });

        it('should return 302 redirect to /service when the return ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: { fareType: 'return' },
                body: {},
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
                session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' } },
            });
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/service',
            });
        });

        it('should return 302 redirect to /ticketRepresentation when the period ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                body: {},
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
                session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' } },
            });
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/ticketRepresentation',
            });
        });

        it('should return 302 redirect to /serviceList when the flat fare ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                body: {},
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
                session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' } },
            });
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/serviceList',
            });
        });

        it('should return 302 redirect to /ticketRepresentation when the multi operator ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                body: {},
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
                session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' } },
            });
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: '/ticketRepresentation',
            });
        });

        it('should throw error if unexpected fare type is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                body: null,
                uuid: {},
                mockWriteHeadFn: writeHeadMock,
                session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'roundabout' } },
            });

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
                cookieValues: {
                    idToken: emailJwt,
                },
            });
            const email = getAttributeFromIdToken(req, res, 'email');

            expect(email).toBe('test@example.com');
        });

        it('should return null if not present', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {
                    idToken: emailJwt,
                },
            });
            const email = getAttributeFromIdToken(req, res, 'custom:noc');

            expect(email).toBeNull();
        });
    });

    describe('validatePassword', () => {
        const noPasswordError = { id: 'test', errorMessage: 'Enter a new password' };
        const passwordLengthError = { id: 'test', errorMessage: 'Password must be at least 8 characters long' };
        const passwordMatchError = { id: 'test', errorMessage: 'Passwords do not match' };
        const weakPasswordError = {
            id: 'test',
            errorMessage:
                'Your password is too weak. Try adding another word or two. Uncommon words are better. Avoid repeating characters. An example of a strong password is one with three or more uncommon words, one after another.',
        };

        it.each([
            ['no errors', 'passwords match and are a suitable length', 'iLoveBuses', 'iLoveBuses', null],
            ['a no password error', 'no input is provided', '', '', noPasswordError],
            ['a no password error', 'no new password is provided', '', 'iLoveBuses', noPasswordError],
            ['a password length error', 'new password is too short', 'bus', 'iLoveBuses', passwordLengthError],
            [
                'a password match error',
                'the two passwords do not match',
                'iHateBuses',
                'iLoveBuses',
                passwordMatchError,
            ],
            ['a weak password error', 'weak password provided', 'Password', 'Password', weakPasswordError],
            ['a weak password error', 'weak password provided', 'password123', 'password123', weakPasswordError],
        ])('should return %s when %s', (_errors, _case, newPassword, confirmNewPassword, expectedResult) => {
            const res = validatePassword(newPassword, confirmNewPassword, 'test', true);
            expect(res).toEqual(expectedResult);
        });
    });

    describe('getSelectedStages', () => {
        it('should return a string array', () => {
            const { req } = getMockRequestAndResponse({});
            const result = getSelectedStages(req);
            expect(result).toEqual([]);
        });
    });
});
