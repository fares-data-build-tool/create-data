import Cookies from 'cookies';
import { NextPageContext } from 'next';
import { IncomingMessage } from 'http';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { OPERATOR_COOKIE } from '../constants';
import { Stop } from '../data/dynamodb';

export const deleteCookieOnServerSide = (ctx: NextPageContext, cookieName: string): void => {
    if (ctx.req && ctx.res) {
        const cookies = new Cookies(ctx.req, ctx.res);
        const date = new Date();
        const host = ctx?.req?.headers?.origin;
        const domain = host && (host as string).replace(/(^\w+:|^)\/\//, '');

        date.setDate(date.getDate() - 1);
        cookies.set(cookieName, '', { overwrite: true, expires: date, domain, path: '/' });
    }
};

export const getHost = (req: IncomingMessage | undefined): string => {
    if (!req) {
        return '';
    }
    const origin = req?.headers?.origin;

    if (origin) {
        const host = (origin as string).replace(/(^\w+:|^)\/\//, '');

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
    const operatorObject = JSON.parse(operatorCookie);
    return operatorObject.uuid;
};

export const getJourneyPatternFromCookies = (ctx: NextPageContext): string | null => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    if (!operatorCookie) {
        return null;
    }
    const operatorObject = JSON.parse(operatorCookie);
    return operatorObject.journeyPattern;
};

export const formatStopName = (stop: Stop): string =>
    `${stop.localityName ? `${stop.localityName}, ` : ''}${stop.indicator ?? ''} ${stop.stopName ?? ''}${
        stop.street ? ` (on ${stop.street})` : ''
    }`;
