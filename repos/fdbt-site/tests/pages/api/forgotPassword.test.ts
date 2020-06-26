import * as auth from '../../../src/data/cognito';
import { FORGOT_PASSWORD_COOKIE } from '../../../src/constants/index';
import * as apiUtils from '../../../src/pages/api/apiUtils';
import forgotPassword from '../../../src/pages/api/forgotPassword';
import { getMockRequestAndResponse } from '../../testData/mockData';

const writeHeadMock = jest.fn();
const authSignInSpy = jest.spyOn(auth, 'forgotPassword');
authSignInSpy.mockImplementation(() => Promise.resolve());

describe('forgotPassword', () => {
    it('redirects the user to reset confirmation given a valid email address format', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test.com',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await forgotPassword(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/resetConfirmation',
        });
    });

    it('redirects the user to forgot password  given a invalid email address format', async () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            body: {
                email: 'test@test',
            },
            uuid: '',
            mockWriteHeadFn: writeHeadMock,
        });
        await forgotPassword(req, res);

        expect(writeHeadMock).toBeCalledWith(302, {
            Location: '/forgotPassword',
        });
    });

    it('should set the FORGOT_PASSWORD_COOKIE when redirecting', async () => {
        const setCookieSpy = jest.spyOn(apiUtils, 'setCookieOnResponseObject');
        const mockBody = { email: 'test@email.com' };
        const { req, res } = getMockRequestAndResponse({ cookieValues: {}, body: mockBody });
        const mockStringifiedInputCheck = JSON.stringify(mockBody);
        await forgotPassword(req, res);
        expect(setCookieSpy).toBeCalledWith(FORGOT_PASSWORD_COOKIE, mockStringifiedInputCheck, req, res);
    });
});
