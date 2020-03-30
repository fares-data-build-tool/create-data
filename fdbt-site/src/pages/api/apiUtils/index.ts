import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { ServerResponse } from 'http';
import { OPERATOR_COOKIE } from '../../../constants';

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

export const redirectToError = (res: NextApiResponse | ServerResponse, message: string, error: Error): void => {
    console.error(message, error.stack);
    redirectTo(res, '/error');
};
