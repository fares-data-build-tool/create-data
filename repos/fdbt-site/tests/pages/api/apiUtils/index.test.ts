import Cookies from 'cookies';
import {
    setCookieOnResponseObject,
    getUuidFromSession,
    redirectOnFareType,
    checkEmailValid,
    getAttributeFromIdToken,
    validatePassword,
    getSelectedStages,
    getAndValidateSchemeOpRegion,
    isSchemeOperator,
    redirectOnSchoolFareType,
    getFareTypeFromFromAttributes,
} from '../../../../src/pages/api/apiUtils';
import * as apiUtils from '../../../../src/pages/api/apiUtils';
import * as s3 from '../../../../src/data/s3';
import { getMockRequestAndResponse, mockSchemOpIdToken } from '../../../testData/mockData';
import {
    FARE_TYPE_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
} from '../../../../src/constants/attributes';
import * as sessions from '../../../../src/utils/sessions';

describe('apiUtils', () => {
    const writeHeadMock = jest.fn();
    const updateSessionAttributeSpy = jest.spyOn(sessions, 'updateSessionAttribute');

    beforeEach(() => {
        jest.spyOn(s3, 'putStringInS3');

        Cookies.prototype.set = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('checkEmailisInvalid', () => {
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

    describe('getUuidFromSession', () => {
        it('should get the uuid from the session', () => {
            const { req } = getMockRequestAndResponse({
                cookieValues: {},
                body: null,
                uuid: {
                    operatorUuid: '780e3459-6305-4ae5-9082-b925b92cb46c',
                },
            });
            const result = getUuidFromSession(req);
            expect(result).toBe('780e3459-6305-4ae5-9082-b925b92cb46c');
        });
    });

    describe('getFareTypeFromFromAttributes', () => {
        it("should return the fare type from the FARE_TYPE_ATTRIBUTE when fareType is not 'schoolService'", () => {
            const { req } = getMockRequestAndResponse({
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
                },
            });
            const fareType = getFareTypeFromFromAttributes(req);
            expect(fareType).toBe('single');
        });

        it("should return the fare type from the SCHOOL_FARE_TYPE_ATTRIBUTE when fareType is 'schoolService'", () => {
            const { req } = getMockRequestAndResponse({
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'schoolService' },
                    [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'flatFare' },
                },
            });
            const fareType = getFareTypeFromFromAttributes(req);
            expect(fareType).toBe('flatFare');
        });

        it('should throw an error when the fare type is not a valid fare type', () => {
            const { req } = getMockRequestAndResponse({
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'FAKE FARE TYPE' },
                },
            });
            expect(() => getFareTypeFromFromAttributes(req)).toThrowError(
                'Incorrect fare type session attributes found.',
            );
        });

        it("should throw an error when the fare type is 'schoolService', but there is no SCHOOL_FARE_TYPE_ATTRIBUTE", () => {
            const { req } = getMockRequestAndResponse({
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'schoolService' },
                },
            });
            expect(() => getFareTypeFromFromAttributes(req)).toThrowError(
                'Incorrect fare type session attributes found.',
            );
        });
    });

    describe('redirectOnSchoolFareType', () => {
        it.each([
            ['/service', 'single'],
            ['/serviceList', 'period'],
            ['/serviceList', 'flatFare'],
        ])('should return 302 redirect to %s when the %s ticket option is selected', (redirect, schoolFareType) => {
            const { req, res } = getMockRequestAndResponse({
                mockWriteHeadFn: writeHeadMock,
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'schoolService' },
                    [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType },
                },
            });
            redirectOnSchoolFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: redirect,
            });
        });

        it('should update the TICKET_REPRESENTATION_ATTRIBUTE when the period ticket option is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                mockWriteHeadFn: writeHeadMock,
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'schoolService' },
                    [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'period' },
                },
            });
            redirectOnSchoolFareType(req, res);
            expect(updateSessionAttributeSpy).toBeCalledWith(req, TICKET_REPRESENTATION_ATTRIBUTE, {
                name: 'multipleServices',
            });
        });

        it('should throw error if unexpected fare type is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                mockWriteHeadFn: writeHeadMock,
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'schoolService' },
                    [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'roundandaround' },
                },
            });
            expect(() => {
                redirectOnFareType(req, res);
            }).toThrowError(new Error('Did not receive an expected schoolFareType.'));
        });
    });

    describe('redirectOnFareType', () => {
        it.each([
            ['/service', 'single'],
            ['/ticketRepresentation', 'period'],
            ['/service', 'return'],
            ['/serviceList', 'flatFare'],
            ['/ticketRepresentation', 'multiOperator'],
        ])('should return 302 redirect to %s when the %s ticket option is selected', (redirect, fareType) => {
            const { req, res } = getMockRequestAndResponse({
                mockWriteHeadFn: writeHeadMock,
                session: { [FARE_TYPE_ATTRIBUTE]: { fareType } },
            });
            redirectOnFareType(req, res);
            expect(writeHeadMock).toBeCalledWith(302, {
                Location: redirect,
            });
        });

        it('should call redirectOnSchoolFareType when the schoolService ticket option is selected', () => {
            const redirectOnSchoolFareTypeSpy = jest.spyOn(apiUtils, 'redirectOnSchoolFareType');
            const { req, res } = getMockRequestAndResponse({
                mockWriteHeadFn: writeHeadMock,
                session: {
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'schoolService' },
                    [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'single' },
                },
            });
            redirectOnFareType(req, res);
            expect(redirectOnSchoolFareTypeSpy).toBeCalledWith(req, res);
        });

        it('should throw error if unexpected fare type is selected', () => {
            const { req, res } = getMockRequestAndResponse({
                mockWriteHeadFn: writeHeadMock,
                session: { [FARE_TYPE_ATTRIBUTE]: { fareType: 'roundabout' } },
            });

            expect(() => {
                redirectOnFareType(req, res);
            }).toThrowError(new Error('Could not extract fareType from the fare type attribute.'));
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

    describe('getAndValidateSchemeOpRegion', () => {
        it('should return the scheme operator region code when the logged in user is a scheme operator', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {
                    idToken: mockSchemOpIdToken,
                },
                session: {
                    [OPERATOR_ATTRIBUTE]: { name: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                },
            });
            const region = getAndValidateSchemeOpRegion(req, res);
            expect(region).toBe('SCHEME_REGION');
        });

        it('should return null when the logged in user is not a scheme operator', () => {
            const { req, res } = getMockRequestAndResponse();
            const region = getAndValidateSchemeOpRegion(req, res);
            expect(region).toEqual(null);
        });

        it('should throw an error when the idToken and OPERATOR_ATTRIBUTE do not match', () => {
            const { req, res } = getMockRequestAndResponse({ cookieValues: { idToken: mockSchemOpIdToken } });
            expect(() => getAndValidateSchemeOpRegion(req, res)).toThrow();
        });
    });

    describe('isSchemeOperator', () => {
        it('should return true when the user logged in is a scheme operator', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {
                    idToken: mockSchemOpIdToken,
                },
                session: {
                    [OPERATOR_ATTRIBUTE]: { name: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                },
            });
            const result = isSchemeOperator(req, res);
            expect(result).toEqual(true);
        });

        it('should return false when the user logged in is not a scheme operator', () => {
            const { req, res } = getMockRequestAndResponse();
            const result = isSchemeOperator(req, res);
            expect(result).toEqual(false);
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
