import { NextApiRequest } from 'next';
import { OPERATOR_COOKIE, SERVICE_COOKIE, FARETYPE_COOKIE, JOURNEY_COOKIE } from '../../../constants/index';
import { getCookies } from '../apiUtils';

export const isSessionValid = (req: NextApiRequest): boolean => {
    const cookies = getCookies(req);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    if (operatorCookie) {
        return true;
    }
    return false;
};

export const isCookiesUUIDMatch = (req: NextApiRequest): boolean => {
    const cookies = getCookies(req);
    const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));
    const serviceCookie = unescape(decodeURI(cookies[SERVICE_COOKIE]));
    const fareTypeCookie = unescape(decodeURI(cookies[FARETYPE_COOKIE]));
    const journeyCookie = unescape(decodeURI(cookies[JOURNEY_COOKIE]));

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
        console.error('Cookie UUIDs do not match');
        return false;
    }

    console.error('Cookie UUIDs do not match');
    return false;
};
