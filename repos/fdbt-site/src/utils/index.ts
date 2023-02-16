import Cookies from 'cookies';
import { NextPageContext } from 'next';
import { IncomingMessage } from 'http';
import { parseCookies, destroyCookie } from 'nookies';
import { decode } from 'jsonwebtoken';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import {
    ID_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    DISABLE_AUTH_COOKIE,
    COOKIES_POLICY_COOKIE,
    COOKIE_PREFERENCES_COOKIE,
    CSRF_COOKIE,
    EXPRESS_SESSION_COOKIE,
    purchaseMethodsValuesMap,
} from '../constants';
import { OPERATOR_ATTRIBUTE } from '../constants/attributes';
import { getSessionAttribute } from './sessions';
import {
    ErrorInfo,
    CognitoIdToken,
    NextPageContextWithSession,
    DocumentContextWithSession,
    ResponseWithLocals,
} from '../interfaces';
import dateFormat from 'dateformat';
import { Stop, Ticket, TicketWithIds, ReturnTicket } from '../interfaces/matchingJsonTypes';

export const formatFailedFileNames = (failedExportFileNames: string[]): string => {
    // example filename
    // FX-PI-01_UK_BRTB_NETWORK-FARE_My-Best-Product_2022-10-28_2020-02-01_fab0.xml
    const names = failedExportFileNames.map((fileName) => {
        const isNetworkFare = fileName.includes('NETWORK-FARE');
        const productNameChunk = fileName.split(isNetworkFare ? 'NETWORK-FARE_' : 'LINE-FARE_')[1];
        const amountOfCharactersInProductName = productNameChunk.length - 31;
        return productNameChunk.substring(0, amountOfCharactersInProductName);
    });

    return names.join(', ');
};

export const getProofDocumentsString = (documents: string[]): string =>
    documents.map((document) => sentenceCaseString(document)).join(', ');

export const getCookieValue = (ctx: NextPageContext, cookie: string, jsonAttribute = ''): string | null => {
    const cookies = parseCookies(ctx);

    if (cookies[cookie]) {
        if (jsonAttribute) {
            const parsedCookie = JSON.parse(cookies[cookie]);

            return parsedCookie[jsonAttribute] as string;
        }

        return cookies[cookie];
    }

    return null;
};

export const setCookieOnServerSide = (ctx: NextPageContext, cookieName: string, cookieValue: string): void => {
    if (ctx.req && ctx.res) {
        const cookies = new Cookies(ctx.req, ctx.res);

        cookies.set(cookieName, cookieValue, {
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
        });
    }
};

export const deleteCookieOnServerSide = (ctx: NextPageContext, cookieName: string): void => {
    if (ctx.req && ctx.res) {
        const cookies = new Cookies(ctx.req, ctx.res);

        cookies.set(cookieName, '', { overwrite: true, maxAge: 0, path: '/' });
    }
};

export const deleteAllCookiesOnServerSide = (ctx: NextPageContext): void => {
    const cookies = parseCookies(ctx);
    const cookieWhitelist = [
        ID_TOKEN_COOKIE,
        REFRESH_TOKEN_COOKIE,
        DISABLE_AUTH_COOKIE,
        COOKIES_POLICY_COOKIE,
        COOKIE_PREFERENCES_COOKIE,
        CSRF_COOKIE,
        EXPRESS_SESSION_COOKIE,
    ];

    Object.keys(cookies).forEach((cookie) => {
        if (!cookieWhitelist.includes(cookie)) {
            destroyCookie(ctx, cookie);
        }
    });
};

export const formatSOPArray = (stringArray: string[]): string =>
    stringArray.map((string) => purchaseMethodsValuesMap[string] || sentenceCaseString(string)).join(', ');

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

export const getUuidFromSession = (ctx: NextPageContextWithSession): string | null => {
    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);

    return operatorAttribute?.uuid ?? null;
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

export const sentenceCaseString = (input: string): string => {
    const startCasedInput = startCase(input);
    if (startCasedInput.includes(' ')) {
        const splitStartCasedInput = startCasedInput.split(' ');
        return splitStartCasedInput
            .map((section, index) => {
                if (index === 0) {
                    return section;
                }
                return toLower(section);
            })
            .join(' ');
    }
    return startCasedInput;
};

export const getAttributeFromIdToken = <T extends keyof CognitoIdToken>(
    ctx: NextPageContext,
    attribute: T,
): CognitoIdToken[T] | null => {
    const cookies = parseCookies(ctx);
    const idToken = cookies[ID_TOKEN_COOKIE];

    if (!idToken) {
        return null;
    }

    const decodedIdToken = decode(idToken) as CognitoIdToken;

    return decodedIdToken[attribute] ?? null;
};

export const getNocFromIdToken = (ctx: NextPageContext): string | null => getAttributeFromIdToken(ctx, 'custom:noc');

export const getAndValidateNoc = (ctx: NextPageContextWithSession): string => {
    const idTokenNoc = getNocFromIdToken(ctx);
    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const sessionNoc = operatorAttribute?.nocCode;
    const splitNoc = idTokenNoc?.split('|');
    if (sessionNoc && idTokenNoc && splitNoc?.includes(sessionNoc)) {
        return sessionNoc;
    }

    throw new Error('invalid NOC set');
};

export const getSchemeOpRegionFromIdToken = (ctx: NextPageContext): string | null =>
    getAttributeFromIdToken(ctx, 'custom:schemeRegionCode');

export const getAndValidateSchemeOpRegion = (ctx: NextPageContextWithSession): string | null => {
    const idTokenSchemeOpRegion = getSchemeOpRegionFromIdToken(ctx);
    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const sessionRegion = operatorAttribute?.region;

    if (!sessionRegion && !idTokenSchemeOpRegion) {
        return null;
    }

    if (
        !sessionRegion ||
        !idTokenSchemeOpRegion ||
        (sessionRegion && idTokenSchemeOpRegion && sessionRegion !== idTokenSchemeOpRegion)
    ) {
        throw new Error('invalid scheme operator region code set');
    }

    return sessionRegion;
};

export const isSchemeOperator = (ctx: NextPageContextWithSession): boolean => !!getAndValidateSchemeOpRegion(ctx);

export const getErrorsByIds = (ids: string[], errors: ErrorInfo[]): ErrorInfo[] => {
    const compactErrors: ErrorInfo[] = [];
    errors.forEach((error) => {
        if (ids.includes(error.id)) {
            compactErrors.push(error);
        }
    });
    return compactErrors;
};

export const checkIfMultipleOperators = (ctx: NextPageContextWithSession): boolean => {
    const databaseNocs = getNocFromIdToken(ctx);
    let nocs: string[] = [];
    if (databaseNocs) {
        nocs = databaseNocs.split('|');
    }
    return nocs?.length > 1;
};

export const getCsrfToken = (ctx: DocumentContextWithSession | NextPageContextWithSession | NextPageContext): string =>
    (ctx.res as ResponseWithLocals)?.locals?.csrfToken ?? '';

export const toArray = (thing: string | string[] | undefined): string[] => {
    if (thing === undefined) {
        return [];
    }

    return Array.isArray(thing) ? thing : [thing];
};

export const chunk = <T>(array: T[], size: number): T[][] => {
    const copy = [...array];
    const chunks = [];
    while (copy.length > 0) {
        chunks.push(copy.splice(0, size));
    }
    return chunks;
};

export const convertDateFormat = (date: string): string => {
    return dateFormat(date, 'dd/mm/yyyy');
};

export const isReturnTicket = (ticket: Ticket | TicketWithIds): ticket is ReturnTicket => ticket.type === 'return';

export const objectKeyMatchesExportNameExactly = (objectKey: string, exportName: string): boolean => {
    const parts = objectKey.split('/');
    const exportNamePart = parts[2];
    return exportNamePart === exportName;
};

export const fareTypeIsAllowedToAddACap = (fareType: string): boolean => {
    return !!fareType && ['single', 'return', 'flatFare'].includes(fareType);
};
