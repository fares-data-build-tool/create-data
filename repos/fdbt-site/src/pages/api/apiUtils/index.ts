import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { ServerResponse } from 'http';
import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { OPERATOR_COOKIE, FARE_TYPE_COOKIE, ID_TOKEN_COOKIE } from '../../../constants';
import { CognitoIdToken } from '../../../interfaces';

export const getDomain = (req: NextApiRequest): string => {
    const host = req?.headers?.host;
    return host ? host.split(':')[0] : '';
};

export const setCookieOnResponseObject = (
    domain: string,
    cookieName: string,
    cookieValue: string,
    req: NextApiRequest,
    res: NextApiResponse,
): void => {
    const cookieOptions = {
        ...(process.env.NODE_ENV === 'production' ? { secure: true } : null),
    };
    const cookies = new Cookies(req, res, cookieOptions);
    // From docs: All cookies are httponly by default, and cookies sent over SSL are secure by
    // default. An error will be thrown if you try to send secure cookies over an insecure socket.
    cookies.set(cookieName, cookieValue, {
        domain,
        path: '/',
        // The Cookies library applies units of Milliseconds to maxAge. For this reason, maxAge of 24 hours needs to be corrected by a factor of 1000.
        maxAge: 1000 * (3600 * 24),
        sameSite: 'strict',
    });
};

export const deleteCookieOnResponseObject = (
    domain: string,
    cookieName: string,
    req: NextApiRequest,
    res: NextApiResponse,
): void => {
    const cookies = new Cookies(req, res);

    cookies.set(cookieName, '', { overwrite: true, maxAge: 0, domain, path: '/' });
};

export const unescapeAndDecodeCookie = (cookies: Cookies, cookieToDecode: string): string => {
    return unescape(decodeURI(cookies.get(cookieToDecode) || ''));
};

export const getUuidFromCookie = (req: NextApiRequest | Request, res: NextApiResponse | Response): string => {
    const cookies = new Cookies(req, res);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);

    return operatorCookie ? JSON.parse(operatorCookie).uuid : '';
};

export const redirectTo = (res: NextApiResponse | ServerResponse, location: string): void => {
    res.writeHead(302, {
        Location: location,
    });
    res.end();
};

export const redirectToError = (res: NextApiResponse | ServerResponse, message: string, error: Error): void => {
    console.error(message, error.stack);
    redirectTo(res, '/error');
};

export const redirectOnFareType = (req: NextApiRequest, res: NextApiResponse): void => {
    const cookies = new Cookies(req, res);
    const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
    const { fareType } = JSON.parse(fareTypeCookie);

    if (fareType) {
        switch (fareType) {
            case 'period':
                redirectTo(res, '/periodType');
                return;
            case 'single':
                redirectTo(res, '/service');
                return;
            case 'return':
                redirectTo(res, '/service');
                return;
            case 'flatFare':
                redirectTo(res, '/serviceList');
                return;
            default:
                throw new Error('Fare Type we expect was not received.');
        }
    } else {
        throw new Error('Could not extract fareType from the FARE_TYPE_COOKIE.');
    }
};

export const checkEmailValid = (email: string): boolean => {
    const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    return emailRegex.test(email) && email !== '';
};

export const getAttributeFromIdToken = <T extends keyof CognitoIdToken>(
    req: NextApiRequest,
    res: NextApiResponse,
    attribute: T,
): CognitoIdToken[T] | null => {
    const cookies = new Cookies(req, res);
    const idToken = cookies.get(ID_TOKEN_COOKIE);

    if (!idToken) {
        return null;
    }

    const decodedIdToken = decode(idToken) as CognitoIdToken;

    return decodedIdToken[attribute] ?? null;
};

export const getNocFromIdToken = (req: NextApiRequest, res: NextApiResponse): string | null =>
    getAttributeFromIdToken(req, res, 'custom:noc');
