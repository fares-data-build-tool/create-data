import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
import { USER_COOKIE } from '../../constants';
import { InputCheck } from '../../interfaces';
import { confirmForgotPassword } from '../../data/cognito';

const validatePassword = (password: string, confirmPassword: string): string => {
    let passwordErrorMessage = '';

    if (password.length < 8) {
        passwordErrorMessage = 'Password cannot be empty or less than 8 characters';
    } else if (confirmPassword !== password) {
        passwordErrorMessage = 'Passwords do not match';
    }

    return passwordErrorMessage;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const setErrorsCookie = (inputChecks: InputCheck[], regKey: string, username: string, expiry: string): void => {
        const cookieContent = JSON.stringify({ inputChecks });
        setCookieOnResponseObject(getDomain(req), USER_COOKIE, cookieContent, req, res);
        redirectTo(res, `/resetPassword?key=${regKey}&user_name=${username}&expiry=${expiry}`);
    };

    try {
        const { username, password, confirmPassword, regKey, expiry } = req.body;

        const inputChecks: InputCheck[] = [];

        if (!username || !regKey) {
            inputChecks.push({
                inputValue: '',
                id: 'password',
                error: 'There was a problem resetting your password.',
            });
        }

        const valid = validatePassword(password, confirmPassword);

        if (valid !== '') {
            inputChecks.push({
                inputValue: '',
                id: 'password',
                error: valid,
            });
        }

        if (inputChecks.some(el => el.error !== '')) {
            setErrorsCookie(inputChecks, regKey, username, expiry);
            return;
        }

        try {
            await confirmForgotPassword(username, regKey, password);
            redirectTo(res, '/resetPasswordSuccess');
        } catch (error) {
            if (error.message === 'ExpiredCodeException') {
                redirectTo(res, '/resetLinkExpired');
                return;
            }

            console.warn('reset password failed', { error: error?.message });
            inputChecks.push({
                inputValue: '',
                id: 'password',
                error: 'There was a problem resetting your password.',
            });

            setErrorsCookie(inputChecks, regKey, username, expiry);
        }
    } catch (error) {
        const message = 'There was an error resetting password.';
        redirectToError(res, message, error);
    }
};
