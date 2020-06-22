import { NextApiRequest, NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import { redirectTo, redirectToError, setCookieOnResponseObject, checkEmailValid } from './apiUtils';
import { OPERATOR_COOKIE, ID_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../constants';
import { ErrorInfo, CognitoIdToken } from '../../interfaces';
import { getOperatorNameByNocCode } from '../../data/auroradb';
import { initiateAuth } from '../../data/cognito';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const { email, password } = req.body;

        const errors: ErrorInfo[] = [];

        if (!checkEmailValid(email)) {
            errors.push({
                id: 'email',
                errorMessage: 'Enter an email address in the correct format, like name@example.com',
            });
            const cookieContent = JSON.stringify({ errors });
            setCookieOnResponseObject(OPERATOR_COOKIE, cookieContent, req, res);
            redirectTo(res, '/login');

            return;
        }

        if (!password) {
            errors.push({
                id: 'password',
                errorMessage: 'Enter a password',
            });
            const cookieContent = JSON.stringify({ errors });
            setCookieOnResponseObject(OPERATOR_COOKIE, cookieContent, req, res);
            redirectTo(res, '/login');

            return;
        }

        try {
            const authResponse = await initiateAuth(email, password);

            if (authResponse?.AuthenticationResult) {
                const idToken = authResponse.AuthenticationResult.IdToken as string;
                const refreshToken = authResponse.AuthenticationResult.RefreshToken as string;

                const decodedIdToken = decode(idToken) as CognitoIdToken;
                const nocCode = decodedIdToken['custom:noc'];
                const operatorName = await getOperatorNameByNocCode(nocCode);
                const operatorCookieValue = JSON.stringify({ operator: operatorName });
                setCookieOnResponseObject(OPERATOR_COOKIE, operatorCookieValue, req, res);

                setCookieOnResponseObject(ID_TOKEN_COOKIE, idToken, req, res);
                setCookieOnResponseObject(REFRESH_TOKEN_COOKIE, refreshToken, req, res);

                console.info('login successful', { noc: nocCode });
                redirectTo(res, '/fareType');
            } else {
                throw new Error('Auth response invalid');
            }
        } catch (error) {
            console.warn('login failed', { error: error.message });
            errors.push({
                id: 'login',
                errorMessage: 'The email address and/or password are not correct.',
            });
            const cookieContent = JSON.stringify({ errors });
            setCookieOnResponseObject(OPERATOR_COOKIE, cookieContent, req, res);
            redirectTo(res, '/login');
        }
    } catch (error) {
        const message = 'There was a problem signing into your account';
        redirectToError(res, message, error);
    }
};
