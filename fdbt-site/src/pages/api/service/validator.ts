import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../../../constants/index';

export const isSessionValid = (req: NextApiRequest, res: NextApiResponse): boolean => {
    const cookies = new Cookies(req, res);
    const operatorCookie = cookies.get(OPERATOR_COOKIE) || '';
    if (operatorCookie) {
        return true;
    }
    return false;
};

export const isCookiesUUIDMatch = (req: NextApiRequest, res: NextApiResponse): boolean => {
    const cookies = new Cookies(req, res);
    const operatorCookie = unescape(decodeURI(cookies.get(OPERATOR_COOKIE) || ''));
    const serviceCookie = unescape(decodeURI(cookies.get(SERVICE_COOKIE) || ''));
    const operatorObject = JSON.parse(operatorCookie);
    const serviceObject = JSON.parse(serviceCookie);
    if (operatorObject.uuid === serviceObject.uuid) {
        return true;
    }
    return false;
};
