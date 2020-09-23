import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorInfo } from '../../interfaces';
import {
    redirectTo,
    redirectToError,
    setCookieOnResponseObject,
    getAttributeFromIdToken,
    validatePassword,
} from './apiUtils';
import { USER_COOKIE } from '../../constants';
import { initiateAuth, updateUserPassword } from '../../data/cognito';
import logger from '../../utils/logger';

export const setCookieAndRedirect = (req: NextApiRequest, res: NextApiResponse, inputChecks: ErrorInfo[]): void => {
    const cookieContent = JSON.stringify({ inputChecks });
    setCookieOnResponseObject(USER_COOKIE, cookieContent, req, res);
    redirectTo(res, '/changePassword');
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const username = getAttributeFromIdToken(req, res, 'email');
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        if (!username) {
            throw new Error('Could not retrieve email from ID_TOKEN_COOKIE');
        }
        const inputChecks: ErrorInfo[] = [];

        const newPasswordValidityError = validatePassword(newPassword, confirmNewPassword, 'new-password', true);

        if (!oldPassword) {
            inputChecks.push({ id: 'old-password', errorMessage: 'Enter your current password' });
        }

        if (newPasswordValidityError) {
            inputChecks.push(newPasswordValidityError);
        }

        if (inputChecks.some(el => el.errorMessage !== '')) {
            setCookieAndRedirect(req, res, inputChecks);
            return;
        }
        try {
            const authResponse = await initiateAuth(username, oldPassword);
            if (authResponse?.AuthenticationResult) {
                try {
                    await updateUserPassword(newPassword, username);
                    setCookieOnResponseObject(
                        USER_COOKIE,
                        JSON.stringify({ redirectFrom: '/changePassword' }),
                        req,
                        res,
                    );
                    redirectTo(res, '/passwordUpdated');
                } catch (error) {
                    logger.warn(error, {
                        context: 'api.changePassword',
                        message: 'update password failed',
                    });

                    inputChecks.push({
                        id: 'new-password',
                        errorMessage: 'There was a problem resetting your password',
                    });
                    setCookieAndRedirect(req, res, inputChecks);
                }
            } else {
                throw new Error('Auth response invalid');
            }
        } catch (error) {
            logger.warn(error, {
                context: 'api.changePassword',
                message: 'user authentication failed',
            });
            inputChecks.push({
                id: 'old-password',
                errorMessage: 'Your old password is incorrect',
            });
            setCookieAndRedirect(req, res, inputChecks);
        }
    } catch (error) {
        const message = 'there was an error updating the user password';
        redirectToError(res, message, 'api.changePassword', error);
    }
};
