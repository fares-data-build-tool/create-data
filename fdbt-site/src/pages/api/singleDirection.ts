import { NextApiRequest, NextApiResponse } from 'next';
import { setCookieOnResponseObject, redirectTo, redirectToError, getUuidFromCookie } from './apiUtils/index';
import { JOURNEY_COOKIE } from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const { directionJourneyPattern } = req.body;

        if (!directionJourneyPattern) {
            const cookieValue = JSON.stringify({ errorMessage: 'Choose a direction from the options' });
            setCookieOnResponseObject(JOURNEY_COOKIE, cookieValue, req, res);
            redirectTo(res, '/singleDirection');
            return;
        }

        const uuid = getUuidFromCookie(req, res);

        if (!uuid) {
            throw new Error('No UUID found');
        }

        const cookieValue = JSON.stringify({ directionJourneyPattern, uuid });
        setCookieOnResponseObject(JOURNEY_COOKIE, cookieValue, req, res);

        redirectTo(res, '/inputMethod');
    } catch (error) {
        const message = 'There was a problem selecting the direction:';
        redirectToError(res, message, 'api.singleDirection', error);
    }
};
