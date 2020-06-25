import changePassword from '../../../src/pages/api/changePassword';
import { getMockRequestAndResponse } from '../../testData/mockData';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import { USER_COOKIE } from '../../../src/constants';
import * as auth from '../../../src/data/cognito';

describe('changePassword', () => {
    const updateUserPasswordSpy = jest.spyOn(auth, 'updateUserPassword');
    const initiateAuthSpy = jest.spyOn(auth, 'initiateAuth');

    const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
    const getAttributeSpy = jest.spyOn(apiUtils, 'getAttributeFromIdToken');

    beforeEach(() => {
        updateUserPasswordSpy.mockImplementation(() => Promise.resolve());
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const writeHeadMock = jest.fn();

    it('should set the USER_COOKIE and redirect to /passwordUpdated when password update is successful', async () => {
        getAttributeSpy.mockImplementation(() => 'fake.address@email.com');
        initiateAuthSpy.mockImplementation(() => Promise.resolve({ AuthenticationResult: {} }));
        const { req, res } = getMockRequestAndResponse(
            {},
            { oldPassword: 'iLoveBuses', newPassword: 'iReallyLoveBuses', confirmNewPassword: 'iReallyLoveBuses' },
            {},
            writeHeadMock,
        );
        await changePassword(req, res);
        expect(setCookieSpy).toHaveBeenCalledWith(
            USER_COOKIE,
            JSON.stringify({ redirectFrom: '/changePassword' }),
            req,
            res,
        );
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/passwordUpdated',
        });
    });

    it('should redirect to the error page when the ID_TOKEN_COOKIE is missing the username attribute', async () => {
        getAttributeSpy.mockImplementation(() => null);
        initiateAuthSpy.mockImplementation(() => Promise.resolve({ AuthenticationResult: {} }));
        const { req, res } = getMockRequestAndResponse({}, {}, {}, writeHeadMock);
        await changePassword(req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/error',
        });
    });

    it.each([
        [
            'the user enters nothing',
            { oldPassword: '', newPassword: '', confirmNewPassword: '' },
            [
                { id: 'old-password', errorMessage: 'Enter your current password' },
                { id: 'new-password', errorMessage: 'Enter a new password' },
            ],
            1,
        ],
        [
            'the user enters an incorrect old password',
            { oldPassword: 'iLoveBuses', newPassword: 'iReallyLoveBuses', confirmNewPassword: 'iReallyLoveBuses' },
            [{ id: 'old-password', errorMessage: 'Your old password is incorrect' }],
            0,
        ],
        [
            'the user enters no new password',
            { oldPassword: 'iLoveBuses', newPassword: '', confirmNewPassword: '' },
            [{ id: 'new-password', errorMessage: 'Enter a new password' }],
            1,
        ],
        [
            "the 'new-password' input is too short",
            { oldPassword: 'iLoveBuses', newPassword: 'short', confirmNewPassword: 'short' },
            [{ id: 'new-password', errorMessage: 'Password must be at least 8 characters long' }],
            1,
        ],
        [
            "the 'new-password' and 'confirm-new-password' inputs do no match",
            { oldPassword: 'iLoveBuses', newPassword: 'iReallyLoveBuses', confirmNewPassword: 'iQuiteLikeBuses' },
            [{ id: 'new-password', errorMessage: 'Passwords do not match' }],
            1,
        ],
    ])('should set an error and redirect back to the page when %s', async (_case, input, inputChecks, authResponse) => {
        getAttributeSpy.mockImplementation(() => 'fake.address@email.com');
        initiateAuthSpy.mockImplementation(() => {
            if (authResponse === 0) {
                throw new Error();
            }
            return Promise.resolve({ AuthenticationResult: {} });
        });

        const { req, res } = getMockRequestAndResponse({}, input, {}, writeHeadMock);
        await changePassword(req, res);

        expect(setCookieSpy).toHaveBeenCalledWith(USER_COOKIE, JSON.stringify({ inputChecks }), req, res);
        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/changePassword',
        });
    });
});
