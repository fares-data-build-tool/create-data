import Cookies from 'cookies';
import { NextPageContext } from 'next';
import { IncomingMessage } from 'http';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { ALL_COOKIES, OPERATOR_COOKIE } from '../constants/index';

import { Stop } from '../data/auroradb';
import { ErrorInfo } from '../types';

export const setCookieOnServerSide = (ctx: NextPageContext, cookieName: string, cookieValue: string): void => {
    if (ctx.req && ctx.res) {
        const cookies = new Cookies(ctx.req, ctx.res);
        const host = ctx?.req?.headers?.host;
        const domain = host ? host.split(':')[0] : '';

        cookies.set(cookieName, cookieValue, { domain, path: '/' });
    }
};

export const deleteCookieOnServerSide = (ctx: NextPageContext, cookieName: string): void => {
    if (ctx.req && ctx.res) {
        const cookies = new Cookies(ctx.req, ctx.res);
        const host = ctx?.req?.headers?.host;
        const domain = host ? host.split(':')[0] : '';

        cookies.set(cookieName, '', { overwrite: true, maxAge: 0, domain, path: '/' });
    }
};

export const deleteAllCookiesOnServerSide = (ctx: NextPageContext): void => {
    if (ctx.req && ctx.res) {
        const cookies = new Cookies(ctx.req, ctx.res);
        const host = ctx?.req?.headers?.host;
        const domain = host ? host.split(':')[0] : '';

        ALL_COOKIES.map(cookieName => cookies.set(cookieName, '', { overwrite: true, maxAge: 0, domain, path: '/' }));
    }
};

export const getHost = (req: IncomingMessage | undefined): string => {
    if (!req) {
        return '';
    }
    const host = req?.headers?.host;

    if (host) {
        if (host && host.startsWith('localhost')) {
            return `http://${host}`;
        }
        return `https://${host}`;
    }

    return '';
};

export const isSessionValid = async (url: string, req: IncomingMessage | undefined): Promise<boolean> => {
    try {
        const response = await axios.get(url, {
            withCredentials: true,
            headers: {
                Cookie: req?.headers.cookie,
            },
        });

        return response.data.Valid;
    } catch (err) {
        return false;
    }
};

export const getUuidFromCookies = (ctx: NextPageContext): string | null => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    if (!operatorCookie) {
        return null;
    }
    const operatorInfo = JSON.parse(operatorCookie);
    return operatorInfo.uuid;
};

export const getJourneyPatternFromCookies = (ctx: NextPageContext): string | null => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    if (!operatorCookie) {
        return null;
    }
    const operatorInfo = JSON.parse(operatorCookie);
    return operatorInfo.journeyPattern;
};

export const formatStopName = (stop: Stop): string =>
    `${stop.localityName ? `${stop.localityName}, ` : ''}${stop.indicator ?? ''} ${stop.stopName ?? ''}${
        stop.street ? ` (on ${stop.street})` : ''
    }`;

export const buildTitle = (errors: ErrorInfo[], title: string): string => {
    if (errors.length > 0) {
        return `Error: ${title}`;
    }

    return title;
};

export const unescapeAndDecodeCookieServerSide = (
    cookies: {
        [key: string]: string;
    },
    cookieToDecode: string,
): string => {
    return unescape(decodeURI(cookies[cookieToDecode] || ''));
};
