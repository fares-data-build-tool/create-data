import { NextApiRequest, NextApiResponse } from 'next';
import { FARETYPE_COOKIE, OPERATOR_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, getCookies, redirectToError, redirectTo } from './apiUtils';
import { isSessionValid } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req)) {
        try {
            const cookies = getCookies(req);

            const { faretype } = req.body;
            const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));
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
            const domain = getDomain(req);
            setCookieOnResponseObject(domain, FARETYPE_COOKIE, cookieValue, res);
            redirectTo(res, '/service');
        } catch (error) {
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }

    res.end();
};
