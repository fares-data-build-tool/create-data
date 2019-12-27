import { NextApiRequest, NextApiResponse } from 'next';

export function getCookies(req: NextApiRequest) {
    const cookies = {};
    req.headers && req.headers.cookie && req.headers.cookie.split(';').forEach(function (cookie) {
        const parts = cookie.match(/(.*?)=(.*)$/)
        cookies[parts[1].trim()] = (parts[2] || '').trim();
    });
    return cookies;
}

export function getDomain(req: NextApiRequest): string {
    const host = req.headers.host;
    return host.split(":")[0];
}

export function setCookieOnResponseObject(domain: string, cookieName: string, cookieValue: string, res: NextApiResponse) {
    const setCookie = require('set-cookie');
    setCookie(cookieName, cookieValue, {
        domain: domain,
        path: "/",
        maxAge: (3600 * 24),
        res: res
    });
}

