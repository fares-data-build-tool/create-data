import { NextApiRequest, NextApiResponse } from 'next';
import { setCookieOnResponseObject, redirectTo, redirectToError, getUuidFromCookie } from './apiUtils/index';
import { isSessionValid } from './service/validator';
import { JOURNEY_COOKIE } from '../../constants';
import { inboundErrorId, outboundErrorId } from '../returnDirection';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const { inboundJourney, outboundJourney } = req.body;

        if (inboundJourney && outboundJourney) {
            const uuid = getUuidFromCookie(req, res);

            if (!uuid) {
                throw new Error('No UUID found');
            }

            const cookieValue = JSON.stringify({ errorMessages: [], inboundJourney, outboundJourney, uuid });
            setCookieOnResponseObject(JOURNEY_COOKIE, cookieValue, req, res);
            redirectTo(res, '/inputMethod');
        } else {
            const errorMessages: object[] = [];

            if (!inboundJourney) {
                errorMessages.push({ errorMessage: 'Choose an option for an inbound journey', id: inboundErrorId });
            }

            if (!outboundJourney) {
                errorMessages.push({ errorMessage: 'Choose an option for an outbound journey', id: outboundErrorId });
            }

            const cookieValue = JSON.stringify({ errorMessages, inboundJourney, outboundJourney });
            setCookieOnResponseObject(JOURNEY_COOKIE, cookieValue, req, res);
            redirectTo(res, '/returnDirection');
        }
    } catch (error) {
        const message = 'There was a problem selecting the directions:';
        redirectToError(res, message, error);
    }
};
