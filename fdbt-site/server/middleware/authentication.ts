import Cookies, { SetOption } from 'cookies';
import jwksClient from 'jwks-rsa';
import { verify, decode, VerifyOptions, JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import { Request, Response, NextFunction, Express } from 'express';
import { ID_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, DISABLE_AUTH_COOKIE, OPERATOR_COOKIE } from '../../src/constants';
import { signOutUser, setCookieOnResponseObject } from '../../src/pages/api/apiUtils';
import { CognitoIdToken } from '../../src/interfaces';
import { initiateRefreshAuth } from '../../src/data/cognito';

const cognitoUri = `https://cognito-idp.eu-west-2.amazonaws.com/${process.env.FDBT_USER_POOL_ID}`;

const jwks = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${cognitoUri}/.well-known/jwks.json`,
});

const getKey = (header: JwtHeader, callback: SigningKeyCallback): void => {
    jwks.getSigningKey(header.kid ?? '', (err, key) => {
        const signingKey = key?.getPublicKey();
        callback(err ?? null, signingKey);
    });
};

const verifyOptions: VerifyOptions = {
    audience: process.env.FDBT_USER_POOL_CLIENT_ID,
    issuer: cognitoUri,
    algorithms: ['RS256'],
};

export const setDisableAuthCookies = (server: Express): void => {
    server.use((req, res, next) => {
        const isDevelopment = process.env.NODE_ENV === 'development';

        if ((isDevelopment || process.env.ALLOW_DISABLE_AUTH === '1') && req.query.disableAuth === 'true') {
            const cookies = new Cookies(req, res);
            const disableAuthCookie = cookies.get(DISABLE_AUTH_COOKIE);

            const cookieOptions: SetOption = {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: !isDevelopment,
            };

            if (!disableAuthCookie || disableAuthCookie === 'false') {
                cookies.set(DISABLE_AUTH_COOKIE, 'true', cookieOptions);
                cookies.set(
                    ID_TOKEN_COOKIE,
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b206bm9jIjoiQkxBQyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.iQTTEOSf0HZNQsNep3P4npgDp1gyJi8uJHpcGKH7PIM',
                    cookieOptions,
                );
                cookies.set(
                    OPERATOR_COOKIE,
                    JSON.stringify({
                        operator: {
                            operatorPublicName: 'Blackpool Transport',
                        },
                    }),
                    cookieOptions,
                );
            }
        }

        next();
    });
};

export default (req: Request, res: Response, next: NextFunction): void => {
    const logoutAndRedirect = (username: string | null = null): void => {
        signOutUser(username, req, res)
            .then(() => res.redirect('/login'))
            .catch(error => {
                console.error(`failed to sign out user: ${error.stack}`);
                res.redirect('/login');
            });
    };

    const cookies = new Cookies(req, res);
    const disableAuthCookie = cookies.get(DISABLE_AUTH_COOKIE);

    if (
        (process.env.NODE_ENV === 'development' || process.env.ALLOW_DISABLE_AUTH === '1') &&
        (disableAuthCookie === 'true' || req.query.disableAuth === 'true')
    ) {
        next();
        return;
    }

    const idToken = cookies.get(ID_TOKEN_COOKIE) ?? null;

    if (!idToken) {
        res.redirect('/login');
        return;
    }

    verify(idToken, getKey, verifyOptions, err => {
        if (err) {
            const decodedToken = decode(idToken) as CognitoIdToken;
            const username = decodedToken?.['cognito:username'] ?? null;

            if (err.name === 'TokenExpiredError') {
                const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE) ?? null;

                if (refreshToken) {
                    console.info('ID Token expired, attempting refresh...');

                    initiateRefreshAuth(username, refreshToken)
                        .then(data => {
                            if (data.AuthenticationResult?.IdToken) {
                                setCookieOnResponseObject(ID_TOKEN_COOKIE, data.AuthenticationResult.IdToken, req, res);
                                console.info('successfully refreshed ID Token');
                                next();

                                return;
                            }

                            logoutAndRedirect(username);
                        })
                        .catch(error => {
                            console.warn(`failed to refresh ID token: ${error.stack}`);
                            logoutAndRedirect(username);
                        });

                    return;
                }
            }

            console.warn('ID Token invalid, clearing user session...');
            logoutAndRedirect(username);

            return;
        }

        next();
    });
};
