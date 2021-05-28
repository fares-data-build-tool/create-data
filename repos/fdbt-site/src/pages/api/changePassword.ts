import { NextApiResponse } from 'next';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError, getAttributeFromIdToken, validatePassword } from './apiUtils';
import { USER_ATTRIBUTE } from '../../constants/attributes';
import { initiateAuth, updateUserPassword } from '../../data/cognito';
import logger from '../../utils/logger';
import { updateSessionAttribute } from '../../utils/sessions';

const setAttributeAndRedirect = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    inputChecks: ErrorInfo[],
): void => {
    updateSessionAttribute(req, USER_ATTRIBUTE, {
        errors: inputChecks,
    });
    redirectTo(res, '/changePassword');
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
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
            setAttributeAndRedirect(req, res, inputChecks);
            return;
        }
        try {
            const authResponse = await initiateAuth(username, oldPassword);
            if (authResponse?.AuthenticationResult) {
                try {
                    await updateUserPassword(newPassword, username);
                    updateSessionAttribute(req, USER_ATTRIBUTE, {
                        redirectFrom: '/changePassword',
                    });
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
                    setAttributeAndRedirect(req, res, inputChecks);
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
            setAttributeAndRedirect(req, res, inputChecks);
        }
    } catch (error) {
        const message = 'there was an error updating the user password';
        redirectToError(res, message, 'api.changePassword', error);
    }
};
