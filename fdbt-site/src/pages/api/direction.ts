import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { OPERATOR_COOKIE, JOURNEY_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectTo, redirectToError, isSessionValid } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            redirectToError(res);
            return;
        }

        const cookies = new Cookies(req, res);

        const { journeyPattern } = req.body;

        if (!journeyPattern) {
            redirectTo(res, '/direction');
            return;
        }

        const operatorCookie = unescape(decodeURI(cookies.get(OPERATOR_COOKIE) || ''));
        const operatorObject = JSON.parse(operatorCookie);
        const { uuid } = operatorObject;

        if (!uuid) {
            throw new Error('No UUID found');
        }

        const cookieValue = JSON.stringify({ journeyPattern, uuid });
        setCookieOnResponseObject(getDomain(req), JOURNEY_COOKIE, cookieValue, req, res);
        redirectTo(res, '/inputMethod');
    } catch (error) {
        redirectToError(res);
    }
};
