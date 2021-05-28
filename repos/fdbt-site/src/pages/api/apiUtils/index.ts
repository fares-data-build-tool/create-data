import { NextApiRequest, NextApiResponse } from 'next';
import zxcvbn from 'zxcvbn';
import Cookies from 'cookies';
import { ServerResponse } from 'http';
import { decode } from 'jsonwebtoken';
import { ID_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, DISABLE_AUTH_COOKIE } from '../../../constants';
import {
    OPERATOR_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
} from '../../../constants/attributes';
import { CognitoIdToken, ErrorInfo, NextApiRequestWithSession, SchoolFareTypeAttribute } from '../../../interfaces';
import { globalSignOut } from '../../../data/cognito';
import logger from '../../../utils/logger';
import { destroySession, getSessionAttribute, updateSessionAttribute } from '../../../utils/sessions';
import { isFareType } from '../../../interfaces/typeGuards';

export const setCookieOnResponseObject = (
    cookieName: string,
    cookieValue: string,
    req: NextApiRequest,
    res: NextApiResponse,
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

export const deleteCookieOnResponseObject = (cookieName: string, req: NextApiRequest, res: NextApiResponse): void => {
    const cookies = new Cookies(req, res);

    cookies.set(cookieName, '', { overwrite: true, maxAge: 0, path: '/' });
};

export const unescapeAndDecodeCookie = (cookies: Cookies, cookieToDecode: string): string => {
    return unescape(decodeURI(cookies.get(cookieToDecode) || ''));
};

export const getUuidFromSession = (req: NextApiRequestWithSession): string => {
    const operatorAttribute = getSessionAttribute(req, OPERATOR_ATTRIBUTE);

    return operatorAttribute?.uuid ?? '';
};

export const redirectTo = (res: NextApiResponse | ServerResponse, location: string): void => {
    res.writeHead(302, {
        Location: location,
    });
    res.end();
};

export const redirectToError = (
    res: NextApiResponse | ServerResponse,
    message: string,
    context: string,
    error: Error,
): void => {
    logger.error(error.toString(), { context, message, error: error.stack });
    redirectTo(res, '/error');
};

export const getFareTypeFromFromAttributes = (req: NextApiRequestWithSession): string => {
    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const schoolFareTypeAttribute = getSessionAttribute(req, SCHOOL_FARE_TYPE_ATTRIBUTE) as SchoolFareTypeAttribute;

    if (
        !isFareType(fareTypeAttribute) ||
        (fareTypeAttribute.fareType === 'schoolService' && !schoolFareTypeAttribute)
    ) {
        throw new Error('Incorrect fare type session attributes found.');
    }

    return fareTypeAttribute.fareType === 'schoolService'
        ? schoolFareTypeAttribute.schoolFareType
        : fareTypeAttribute.fareType;
};

export const redirectOnSchoolFareType = (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const schoolFareTypeAttribute = getSessionAttribute(req, SCHOOL_FARE_TYPE_ATTRIBUTE) as SchoolFareTypeAttribute;

    if (schoolFareTypeAttribute) {
        switch (schoolFareTypeAttribute.schoolFareType) {
            case 'single':
                redirectTo(res, '/service');
                return;
            case 'period':
                updateSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE, { name: 'multipleServices' });
                redirectTo(res, '/serviceList');
                return;
            case 'flatFare':
                redirectTo(res, '/serviceList');
                return;
            default:
                throw new Error('Did not receive an expected schoolFareType.');
        }
    } else {
        throw new Error('Could not extract schoolFareType from the schoolFareTypeAttribute.');
    }
};

export const redirectOnFareType = (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

    if (isFareType(fareTypeAttribute)) {
        switch (fareTypeAttribute.fareType) {
            case 'period':
                redirectTo(res, '/ticketRepresentation');
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
            case 'multiOperator':
                redirectTo(res, '/ticketRepresentation');
                return;
            case 'schoolService':
                redirectOnSchoolFareType(req, res);
                return;
            default:
                throw new Error('Did not receive an expected fareType.');
        }
    } else {
        throw new Error('Could not extract fareType from the fare type attribute.');
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

export const getAndValidateNoc = (req: NextApiRequestWithSession, res: NextApiResponse): string => {
    const idTokenNoc = getNocFromIdToken(req, res);

    const operatorAttribute = getSessionAttribute(req, OPERATOR_ATTRIBUTE);

    const splitNoc = idTokenNoc?.split('|');

    if (operatorAttribute?.nocCode && idTokenNoc && splitNoc?.includes(operatorAttribute?.nocCode)) {
        return operatorAttribute.nocCode;
    }

    throw new Error('invalid NOC set');
};

export const getSchemeOpRegionFromIdToken = (req: NextApiRequest, res: NextApiResponse): string | null =>
    getAttributeFromIdToken(req, res, 'custom:schemeRegionCode');

export const getAndValidateSchemeOpRegion = (req: NextApiRequestWithSession, res: NextApiResponse): string | null => {
    const idTokenSchemeOpRegion = getSchemeOpRegionFromIdToken(req, res);
    const operatorAttribute = getSessionAttribute(req, OPERATOR_ATTRIBUTE);

    const region = operatorAttribute?.region;

    if (!region && !idTokenSchemeOpRegion) {
        return null;
    }

    if (!region || !idTokenSchemeOpRegion || (region && idTokenSchemeOpRegion && region !== idTokenSchemeOpRegion)) {
        throw new Error('invalid scheme operator region code set');
    }

    return region;
};

export const isSchemeOperator = (req: NextApiRequestWithSession, res: NextApiResponse): boolean =>
    !!getAndValidateSchemeOpRegion(req, res);

export const signOutUser = async (
    username: string | null,
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<void> => {
    if (username) {
        await globalSignOut(username);
    }

    deleteCookieOnResponseObject(ID_TOKEN_COOKIE, req, res);
    deleteCookieOnResponseObject(REFRESH_TOKEN_COOKIE, req, res);
    deleteCookieOnResponseObject(DISABLE_AUTH_COOKIE, req, res);

    destroySession(req);
};

export const getSelectedStages = (req: NextApiRequest): string[][] => {
    const requestBody = req.body;

    const selectObjectsArray: string[][] = [];

    Object.keys(requestBody).map(e => {
        if (requestBody[e] !== '') {
            selectObjectsArray.push(requestBody[e]);
        }
        return null;
    });

    return selectObjectsArray;
};

export const validatePassword = (
    password: string,
    confirmPassword: string,
    errorId: string,
    isUpdate?: boolean,
): ErrorInfo | null => {
    let passwordError = '';

    if (password.length < 8) {
        passwordError =
            password.length === 0
                ? `Enter a ${isUpdate ? 'new ' : ''}password`
                : 'Password must be at least 8 characters long';

        return { id: errorId, errorMessage: passwordError };
    }
    if (password !== confirmPassword) {
        return { id: errorId, errorMessage: 'Passwords do not match' };
    }
    if (zxcvbn(password).score < 3) {
        return {
            id: errorId,
            errorMessage:
                'Your password is too weak. Try adding another word or two. Uncommon words are better. Avoid repeating characters. An example of a strong password is one with three or more uncommon words, one after another.',
        };
    }

    return null;
};
