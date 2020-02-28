import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { FARETYPE_COOKIE, OPERATOR_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';
import { isSessionValid } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req, res)) {
        try {
            const cookies = new Cookies(req, res);

            const { faretype } = req.body;
            const operatorCookie = unescape(decodeURI(cookies.get(OPERATOR_COOKIE) || ''));
            const operatorObject = JSON.parse(operatorCookie);
            const { uuid } = operatorObject;

            if (!uuid) {
                throw new Error('No UUID found');
            }

            if (!faretype) {
                redirectTo(res, '/faretype');
                return;
            }

            const cookieValue = JSON.stringify({ faretype, uuid });
            setCookieOnResponseObject(getDomain(req), FARETYPE_COOKIE, cookieValue, req, res);
            redirectTo(res, '/service');
        } catch (error) {
            console.error(`Error setting faretype: ${error.message}`);
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }

    res.end();
};
