import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    OPERATOR_COOKIE,
    SERVICE_COOKIE,
    FARETYPE_COOKIE,
    JOURNEY_COOKIE,
    PERIOD_PRODUCT,
    CSV_ZONE_UPLOAD_COOKIE,
} from '../../../constants/index';

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

export const isPeriodCookiesUUIDMatch = (req: NextApiRequest, res: NextApiResponse): boolean => {
    const cookies = new Cookies(req, res);

    const csvUploadZoneUploadCookie = unescape(decodeURI(cookies.get(CSV_ZONE_UPLOAD_COOKIE) || ''));
    const periodProductCookie = unescape(decodeURI(cookies.get(PERIOD_PRODUCT) || ''));
    const operatorCookie = unescape(decodeURI(cookies.get(OPERATOR_COOKIE) || ''));

    try {
        const operatorObject = JSON.parse(operatorCookie);
        const periodProductObject = JSON.parse(periodProductCookie);
        const csvZoneUploadObject = JSON.parse(csvUploadZoneUploadCookie);
        const { uuid } = operatorObject;

        if (periodProductObject.uuid === uuid && csvZoneUploadObject.uuid === uuid) {
            return true;
        }
    } catch (err) {
        console.error(err.stack);
        return false;
    }

    console.error(new Error().stack);
    return false;
};
