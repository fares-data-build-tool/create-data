import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, validatePassword } from './apiUtils';
import { USER_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { confirmForgotPassword } from '../../data/cognito';
import logger from '../../utils/logger';
import { updateSessionAttribute } from '../../utils/sessions';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const setErrorsAttribute = (inputChecks: ErrorInfo[], regKey: string, username: string, expiry: string): void => {
        updateSessionAttribute(req, USER_ATTRIBUTE, {
            errors: inputChecks,
        });
        redirectTo(res, `/resetPassword?key=${regKey}&user_name=${username}&expiry=${expiry}`);
    };

    try {
        const { username, password, confirmPassword, regKey, expiry } = req.body;

        const inputChecks: ErrorInfo[] = [];

        if (!username || !regKey) {
            inputChecks.push({
                id: 'new-password',
                errorMessage: 'There was a problem resetting your password.',
            });
        }

        const passwordValidityError = validatePassword(password, confirmPassword, 'new-password', true);

        if (passwordValidityError) {
            inputChecks.push(passwordValidityError);
        }

        if (inputChecks.some(el => el.errorMessage !== '')) {
            setErrorsAttribute(inputChecks, regKey, username, expiry);
            return;
        }

        try {
            await confirmForgotPassword(username, regKey, password);
            updateSessionAttribute(req, USER_ATTRIBUTE, {
                redirectFrom: '/resetPassword',
            });
            redirectTo(res, '/passwordUpdated');
        } catch (error) {
            if (error.message === 'ExpiredCodeException') {
                redirectTo(res, '/resetLinkExpired');
                return;
            }

            logger.error(error, {
                context: 'api.resetPassword',
                message: 'reset password failed',
            });
            inputChecks.push({
                id: 'new-password',
                errorMessage: 'There was a problem resetting your password.',
            });

            setErrorsAttribute(inputChecks, regKey, username, expiry);
        }
    } catch (error) {
        const message = 'There was an error resetting password.';
        redirectToError(res, message, 'api.resetPassword', error);
    }
};
