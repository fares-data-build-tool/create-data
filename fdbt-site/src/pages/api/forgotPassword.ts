import { NextApiRequest, NextApiResponse } from 'next';
import { FORGOT_PASSWORD_COOKIE } from '../../constants/index';
import { setCookieOnResponseObject, redirectTo, redirectToError, checkEmailValid } from './apiUtils';
import { forgotPassword } from '../../data/cognito';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || !email.trim().length) {
            const cookieContent = JSON.stringify({ email, error: 'Enter your email address' });
            setCookieOnResponseObject(FORGOT_PASSWORD_COOKIE, cookieContent, req, res);
            redirectTo(res, '/forgotPassword');
            return;
        }

        if (checkEmailValid(email)) {
            await forgotPassword(email);

            const cookieContent = JSON.stringify({ email });
            setCookieOnResponseObject(FORGOT_PASSWORD_COOKIE, cookieContent, req, res);
            redirectTo(res, '/resetConfirmation');
        } else {
            const cookieContent = JSON.stringify({
                email,
                error: 'Invalid email format - Enter a valid email address',
            });
            setCookieOnResponseObject(FORGOT_PASSWORD_COOKIE, cookieContent, req, res);
            redirectTo(res, '/forgotPassword');
        }
    } catch (error) {
        const message = 'There was a problem with requesting a password reset.';
        redirectToError(res, message, 'api.forgotPassword', error);
    }
};
