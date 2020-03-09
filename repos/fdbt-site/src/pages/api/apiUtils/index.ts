import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files } from 'formidable';
import fs from 'fs';
import Cookies from 'cookies';
import { ServerResponse } from 'http';
import {
    OPERATOR_COOKIE,
    SERVICE_COOKIE,
    FARETYPE_COOKIE,
    JOURNEY_COOKIE,
    ALLOWED_CSV_FILE_TYPES,
} from '../../../constants';

const MAX_FILE_SIZE = 5242880;

export type File = FileData;

interface FileData {
    Files: formidable.Files;
    FileContent: string;
}

export const isSessionValid = (req: NextApiRequest, res: NextApiResponse): boolean => {
    const cookies = new Cookies(req, res);
    const operatorCookie = cookies.get(OPERATOR_COOKIE) || '';
    if (operatorCookie) {
        return true;
    }
    console.debug('Invalid session');
    return false;
};

export const isCookiesUUIDMatch = (req: NextApiRequest, res: NextApiResponse): boolean => {
    const cookies = new Cookies(req, res);
    const operatorCookie = unescape(decodeURI(cookies.get(OPERATOR_COOKIE) || ''));
    const serviceCookie = unescape(decodeURI(cookies.get(SERVICE_COOKIE) || ''));
    const fareTypeCookie = unescape(decodeURI(cookies.get(FARETYPE_COOKIE) || ''));
    const journeyCookie = unescape(decodeURI(cookies.get(JOURNEY_COOKIE) || ''));

    try {
        const operatorObject = JSON.parse(operatorCookie);
        const serviceObject = JSON.parse(serviceCookie);
        const fareTypeObject = JSON.parse(fareTypeCookie);
        const journeyObject = JSON.parse(journeyCookie);

        const { uuid } = operatorObject;

        if (serviceObject.uuid === uuid && fareTypeObject.uuid === uuid && journeyObject.uuid === uuid) {
            return true;
        }
    } catch (err) {
        console.error(err.stack);
        return false;
    }

    console.error(new Error().stack);
    return false;
};

export const redirectTo = (res: NextApiResponse | ServerResponse, location: string): void => {
    res.writeHead(302, {
        Location: location,
    });

    res.end();
};

export const redirectToError = (res: NextApiResponse | ServerResponse): void => {
    redirectTo(res, '/error');
    res.end();
};

export const csvFileIsValid = (res: NextApiResponse, formData: formidable.Files, fileContent: string): boolean => {
    const fileSize = formData['csv-upload'].size;
    const fileType = formData['csv-upload'].type;

    if (!fileContent) {
        redirectTo(res, '/csvUpload');
        console.warn('No file attached.');

        return false;
    }

    if (fileSize > MAX_FILE_SIZE) {
        redirectToError(res);
        console.warn(`File is too large. Uploaded file is ${fileSize} Bytes, max size is ${MAX_FILE_SIZE} Bytes`);

        return false;
    }

    if (!ALLOWED_CSV_FILE_TYPES.includes(fileType)) {
        redirectToError(res);
        console.warn(`File not of allowed type, uploaded file is ${fileType}`);

        return false;
    }

    return true;
};

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

export const formParse = async (req: NextApiRequest): Promise<Files> => {
    return new Promise<Files>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, _fields, file) => {
            if (err) {
                return reject(err);
            }
            return resolve(file);
        });
    });
};

export const getFormData = async (req: NextApiRequest): Promise<File> => {
    const files = await formParse(req);
    const stringifiedFileContent = await fs.promises.readFile(files['csv-upload'].path, 'utf-8');
    return {
        Files: files,
        FileContent: stringifiedFileContent,
    };
};
