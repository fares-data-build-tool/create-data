import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import Auth from '../../data/amplify';
import { getDomain, redirectTo, redirectToError, setCookieOnResponseObject, checkEmailValid } from './apiUtils';
import { OPERATOR_COOKIE, ID_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../constants';
import { ErrorInfo } from '../../types';
import { getOperatorNameByNocCode } from '../../data/auroradb';

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
            setCookieOnResponseObject(getDomain(req), OPERATOR_COOKIE, cookieContent, req, res);
            redirectTo(res, '/login');
        }

        try {
            const user = await Auth.signIn(email, password);
            if (user) {
                const nocCode = user.attributes['custom:noc'];
                const operatorName = await getOperatorNameByNocCode(nocCode);
                const uuid = uuidv4();
                const domain = getDomain(req);
                const operatorCookieValue = JSON.stringify({ operator: operatorName, uuid });
                setCookieOnResponseObject(domain, OPERATOR_COOKIE, operatorCookieValue, req, res);

                const idToken = user.signInUserSession.idToken.jwtToken;
                const refreshToken = user.signInUserSession.refreshToken.token;
                setCookieOnResponseObject(domain, ID_TOKEN_COOKIE, idToken, req, res);
                setCookieOnResponseObject(domain, REFRESH_TOKEN_COOKIE, refreshToken, req, res);

                console.info('login successful', { noc: nocCode });
                redirectTo(res, '/fareType');
            } else {
                throw new Error('User object not returned by Cognito');
            }
        } catch (error) {
            console.warn('login failed', { error: error.message });
            errors.push({
                id: 'login',
                errorMessage: 'The email address and/or password are not correct.',
            });
            const cookieContent = JSON.stringify({ errors });
            setCookieOnResponseObject(getDomain(req), OPERATOR_COOKIE, cookieContent, req, res);
            redirectTo(res, '/login');
        }
    } catch (error) {
        const message = 'There was a problem signing into your account';
        redirectToError(res, message, error);
    }
};
