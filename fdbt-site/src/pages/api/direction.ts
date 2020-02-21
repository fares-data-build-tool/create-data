import { NextApiRequest, NextApiResponse } from 'next';
import { OPERATOR_COOKIE, JOURNEY_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';
import { getDomain, setCookieOnResponseObject, getCookies, redirectTo, redirectToError } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req)) {
        try {
            const cookies = getCookies(req);

            const { journeyPattern } = req.body;

            if (!journeyPattern) {
                redirectTo(res, '/direction');
                return;
            }

            const operatorCookie = unescape(decodeURI(cookies[OPERATOR_COOKIE]));
            const operatorObject = JSON.parse(operatorCookie);
            const { uuid } = operatorObject;

            if (!uuid) {
                throw new Error('No UUID found');
            }

            const cookieValue = JSON.stringify({ journeyPattern, uuid });
            const domain = getDomain(req);
            setCookieOnResponseObject(domain, JOURNEY_COOKIE, cookieValue, res);
            redirectTo(res, '/inputMethod');
        } catch (error) {
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }
    res.end();
};
