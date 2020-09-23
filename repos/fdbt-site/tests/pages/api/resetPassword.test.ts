import resetPassword from '../../../src/pages/api/resetPassword';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { USER_COOKIE } from '../../../src/constants';
import * as auth from '../../../src/data/cognito';

describe('resetPassword', () => {
    const forgotPasswordSubmitSpy = jest.spyOn(auth, 'confirmForgotPassword');
    const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');

    beforeEach(() => {
        forgotPasswordSubmitSpy.mockImplementation(() => Promise.resolve());
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const writeHeadMock = jest.fn();
    const expiryDate = Math.abs(new Date(2020, 5, 30).getTime() / 1000);

    const cases = [
        [
            'password less than 8 characters',
            {
                username: 'test@test.com',
                password: 'abbb',
                confirmPassword: 'abcdefghi',
                regKey: 'abcdefg',
                expiry: expiryDate,
            },
            {
                inputChecks: [{ id: 'new-password', errorMessage: 'Password must be at least 8 characters long' }],
            },
        ],
        [
            'password is empty',
            {
                username: 'test@test.com',
                password: '',
                confirmPassword: 'abcdefghi',
                regKey: 'abcdefg',
                expiry: expiryDate,
            },
            {
                inputChecks: [{ id: 'new-password', errorMessage: 'Enter a new password' }],
            },
        ],
        [
            'passwords fields do not match',
            {
                username: 'test@test.com',
                password: 'abbadjhfddddd',
                confirmPassword: 'abcdefghi',
                regKey: 'abcdefg',
                expiry: expiryDate,
            },
            {
                inputChecks: [{ id: 'new-password', errorMessage: 'Passwords do not match' }],
            },
        ],
    ];

    test.each(cases)('given %p, sets the correct error cookie', async (_case, testData, expectedCookieValue) => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: testData,
            uuid: {},
            mockWriteHeadFn: writeHeadMock,
        });

        await resetPassword(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(USER_COOKIE, JSON.stringify(expectedCookieValue), req, res);
    });

    it('should redirect when successfully resetting password', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                username: 'test@test.com',
                password: 'jhtgyuiop1',
                confirmPassword: 'jhtgyuiop1',
                regKey: '123ABd$',
                expiry: expiryDate,
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await resetPassword(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(
            USER_COOKIE,
            JSON.stringify({ redirectFrom: '/resetPassword' }),
            req,
            res,
        );
        expect(forgotPasswordSubmitSpy).toHaveBeenCalled();
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passwordUpdated',
        });
    });

    it('should redirect if the password link has expired', async () => {
        forgotPasswordSubmitSpy.mockImplementation(() => {
            throw new Error('ExpiredCodeException');
        });

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                username: 'test@test.com',
                password: 'jhtgyuiop1',
                confirmPassword: 'jhtgyuiop1',
                regKey: '123ABd$',
                expiry: expiryDate,
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await resetPassword(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/resetLinkExpired',
        });
    });

    it('should error when the reset password fails', async () => {
        forgotPasswordSubmitSpy.mockImplementation(() => {
            throw new Error(`Failed to confirm forgotten password`);
        });

        const mockUserCookieValue = {
            inputChecks: [
                {
                    id: 'new-password',
                    errorMessage: 'There was a problem resetting your password.',
                },
            ],
        };

        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                username: 'test@test.com',
                password: 'jhtgyuiop1',
                confirmPassword: 'jhtgyuiop1',
                regKey: '123ABd$',
                expiry: expiryDate,
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });

        await resetPassword(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(USER_COOKIE, JSON.stringify(mockUserCookieValue), req, res);
    });
});
