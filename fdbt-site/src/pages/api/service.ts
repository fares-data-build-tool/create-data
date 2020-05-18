import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    getUuidFromCookie,
    getDomain,
    setCookieOnResponseObject,
    redirectToError,
    redirectTo,
    unescapeAndDecodeCookie,
} from './apiUtils/index';
import { FARETYPE_COOKIE, SERVICE_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }
        const { service } = req.body;

        if (!service) {
            redirectTo(res, '/service');
            return;
        }

        const uuid = getUuidFromCookie(req, res);

        if (!uuid) {
            throw new Error('No UUID found');
        }

        const cookieValue = JSON.stringify({ service, uuid });
        setCookieOnResponseObject(getDomain(req), SERVICE_COOKIE, cookieValue, req, res);

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARETYPE_COOKIE);
        const fareTypeObject = JSON.parse(fareTypeCookie);

        if (fareTypeObject && fareTypeObject.fareType === 'return') {
            redirectTo(res, '/returnDirection');
            return;
        }

        redirectTo(res, '/singleDirection');
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, error);
    }
};
