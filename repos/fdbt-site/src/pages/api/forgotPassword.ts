import { NextApiRequest, NextApiResponse } from 'next';
import { FORGOT_PASSWORD_COOKIE } from '../../constants/index';
import { setCookieOnResponseObject, redirectTo, getDomain, redirectToError, checkEmailValid } from './apiUtils';
import Auth from '../../data/amplify';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || !email.trim().length) {
            const cookieContent = JSON.stringify({ email, error: 'Enter your email address' });
            setCookieOnResponseObject(getDomain(req), FORGOT_PASSWORD_COOKIE, cookieContent, req, res);
            redirectTo(res, '/forgotPassword');
            return;
        }

        if (checkEmailValid(email)) {
            await Auth.forgotPassword(email);

            const cookieContent = JSON.stringify({ email });
            setCookieOnResponseObject(getDomain(req), FORGOT_PASSWORD_COOKIE, cookieContent, req, res);
            redirectTo(res, '/resetConfirmation');
        } else {
            const cookieContent = JSON.stringify({
                email,
                error: 'Invalid email format - Enter a valid email address',
            });
            setCookieOnResponseObject(getDomain(req), FORGOT_PASSWORD_COOKIE, cookieContent, req, res);
            redirectTo(res, '/forgotPassword');
        }
    } catch (error) {
        const message = 'There was a problem with requesting a password reset.';
        redirectToError(res, message, error);
    }
};
