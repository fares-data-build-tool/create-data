import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { ServerResponse } from 'http';
import { OPERATOR_COOKIE } from '../../../constants';

export const getDomain = (req: NextApiRequest): string => {
    const host = req?.headers?.origin;
    return host ? (host as string).replace(/(^\w+:|^)\/\//, '').split(':')[0] : '';
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
        maxAge: 3600 * 24,
        sameSite: 'strict',
    });
};

export const getUuidFromCookie = (req: NextApiRequest, res: NextApiResponse): string => {
    const cookies = new Cookies(req, res);
    const operatorCookie = unescape(decodeURI(cookies.get(OPERATOR_COOKIE) || ''));
    return JSON.parse(operatorCookie).uuid;
};

export const redirectTo = (res: NextApiResponse | ServerResponse, location: string): void => {
    res.writeHead(302, {
        Location: location,
    });

    res.end();
};

export const redirectToError = (res: NextApiResponse | ServerResponse): void => {
    redirectTo(res, '/error');
};
