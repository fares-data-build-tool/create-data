import { NextApiRequest, NextApiResponse } from 'next';
import { SERVICE_COOKIE, OPERATOR_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';
import { getDomain, setCookieOnResponseObject, getCookies, redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req)) {
        try {
            const cookies = getCookies(req);

            const { service } = req.body;

            if (!service) {
                redirectTo(res, '/service');
                return;
            }

            const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));
            const operatorObject = JSON.parse(operatorCookie);
            const { uuid } = operatorObject;

            if (!uuid) {
                throw new Error('No UUID found');
            }

            const cookieValue = JSON.stringify({ service, uuid });
            const domain = getDomain(req);
            setCookieOnResponseObject(domain, SERVICE_COOKIE, cookieValue, res);
            redirectTo(res, '/inputMethod');
        } catch (error) {
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }
    res.end();
};
