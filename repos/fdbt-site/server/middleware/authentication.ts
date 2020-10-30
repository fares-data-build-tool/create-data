import Cookies from 'cookies';
import jwksClient from 'jwks-rsa';
import { verify, decode, VerifyOptions, JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import { Request, Response, NextFunction, Express } from 'express';
import { NextApiRequest, NextApiResponse } from 'next';
import {
    ID_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    DISABLE_AUTH_COOKIE,
    OPERATOR_COOKIE,
    COOKIE_PREFERENCES_COOKIE,
    COOKIES_POLICY_COOKIE,
    oneYearInSeconds,
} from '../../src/constants';
import { CognitoIdToken, CookiePolicy } from '../../src/interfaces';
import { globalSignOut, initiateRefreshAuth } from '../../src/data/cognito';
import logger from '../../src/utils/logger';

type Req = NextApiRequest | Request;
type Res = NextApiResponse | Response;

export const deleteCookieOnResponseObject = (cookieName: string, req: Req, res: Res): void => {
    const cookies = new Cookies(req, res);

    cookies.set(cookieName, '', { overwrite: true, maxAge: 0, path: '/' });
};

const setCookieOnResponseObject = (
    cookieName: string,
    cookieValue: string,
    req: Req,
    res: Res,
    lifetime?: number,
    httpOnly = true,
): void => {
    const cookies = new Cookies(req, res);
    // From docs: All cookies are httponly by default, and cookies sent over SSL are secure by
    // default. An error will be thrown if you try to send secure cookies over an insecure socket.
    cookies.set(cookieName, cookieValue, {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: lifetime,
        httpOnly,
    });
};

const signOutUser = async (username: string | null, req: Req, res: Res): Promise<void> => {
    if (username) {
        await globalSignOut(username);
    }

    deleteCookieOnResponseObject(ID_TOKEN_COOKIE, req, res);
    deleteCookieOnResponseObject(REFRESH_TOKEN_COOKIE, req, res);
    deleteCookieOnResponseObject(OPERATOR_COOKIE, req, res);
};

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

            if (!disableAuthCookie || disableAuthCookie === 'false') {
                const cookiePolicy: CookiePolicy = { essential: true, usage: true };

                setCookieOnResponseObject(COOKIE_PREFERENCES_COOKIE, 'true', req, res, oneYearInSeconds, false);
                setCookieOnResponseObject(
                    COOKIES_POLICY_COOKIE,
                    JSON.stringify(cookiePolicy),
                    req,
                    res,
                    oneYearInSeconds,
                    false,
                );
                setCookieOnResponseObject(DISABLE_AUTH_COOKIE, 'true', req, res);
                setCookieOnResponseObject(
                    ID_TOKEN_COOKIE,
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b206bm9jIjoiQkxBQyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.iQTTEOSf0HZNQsNep3P4npgDp1gyJi8uJHpcGKH7PIM',
                    req,
                    res,
                );
                setCookieOnResponseObject(
                    OPERATOR_COOKIE,
                    JSON.stringify({
                        operator: {
                            operatorPublicName: 'Blackpool Transport',
                        },
                        noc: 'BLAC',
                    }),
                    req,
                    res,
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
                logger.error(error, {
                    context: 'server.middleware.authentication',
                    message: 'failed to sign out user',
                });
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
                    logger.info('', {
                        context: 'server.middleware.authentication',
                        message: 'ID Token expired, attempting refresh',
                    });

                    initiateRefreshAuth(username, refreshToken)
                        .then(data => {
                            if (data.AuthenticationResult?.IdToken) {
                                setCookieOnResponseObject(ID_TOKEN_COOKIE, data.AuthenticationResult.IdToken, req, res);
                                logger.info('', {
                                    context: 'server.middleware.authentication',
                                    message: 'successfully refreshed ID Token',
                                });

                                next();

                                return;
                            }

                            logoutAndRedirect(username);
                        })
                        .catch(error => {
                            logger.warn(error, {
                                context: 'server.middleware.authentication',
                                message: 'failed to refresh ID token',
                            });
                            logoutAndRedirect(username);
                        });

                    return;
                }
            }

            logger.warn('', {
                context: 'server.middleware.authentication',
                message: 'ID Token invalid, clearing user session',
            });
            logoutAndRedirect(username);

            return;
        }

        next();
    });
};
