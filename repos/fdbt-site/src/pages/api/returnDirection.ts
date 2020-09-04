import { NextApiResponse } from 'next';
import { getUuidFromCookie, redirectTo, redirectToError } from './apiUtils/index';
import { isSessionValid } from './apiUtils/validator';
import { JOURNEY_ATTRIBUTE } from '../../constants';
import { inboundErrorId, outboundErrorId } from '../returnDirection';
import { updateSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const { inboundJourney, outboundJourney } = req.body;

        if (inboundJourney && outboundJourney) {
            const uuid = getUuidFromCookie(req, res);

            if (!uuid) {
                throw new Error('No UUID found');
            }

            updateSessionAttribute(req, JOURNEY_ATTRIBUTE, { inboundJourney, outboundJourney });
            redirectTo(res, '/inputMethod');
        } else {
            const errors: ErrorInfo[] = [];

            if (!inboundJourney) {
                errors.push({ errorMessage: 'Choose an option for an inbound journey', id: inboundErrorId });
            }

            if (!outboundJourney) {
                errors.push({ errorMessage: 'Choose an option for an outbound journey', id: outboundErrorId });
            }

            updateSessionAttribute(req, JOURNEY_ATTRIBUTE, { errors, inboundJourney, outboundJourney });
            redirectTo(res, '/returnDirection');
        }
    } catch (error) {
        const message = 'There was a problem selecting the directions:';
        redirectToError(res, message, 'api.returnDirection', error);
    }
};
