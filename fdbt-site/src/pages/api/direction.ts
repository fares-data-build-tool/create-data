import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, setCookieOnResponseObject, redirectTo, redirectToError, getUuidFromCookie } from './apiUtils/index';
import { FARETYPE_COOKIE, JOURNEY_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const { directionJourneyPattern } = req.body;

        const fareTypeCookie = JSON.parse(req.cookies[FARETYPE_COOKIE]).fareType;

        if (!directionJourneyPattern || !fareTypeCookie) {
            redirectTo(res, '/direction');
            return;
        }

        const uuid = getUuidFromCookie(req, res);

        if (!uuid) {
            throw new Error('No UUID found');
        }

        const cookieValue = JSON.stringify({ directionJourneyPattern, uuid });
        setCookieOnResponseObject(getDomain(req), JOURNEY_COOKIE, cookieValue, req, res);

        if (fareTypeCookie === 'returnSingle') {
            redirectTo(res, '/selectJourneyDirection');
        }

        redirectTo(res, '/inputMethod');
    } catch (error) {
        const message = 'There was a problem selecting the direction:';
        redirectToError(res, message, error);
    }
};
