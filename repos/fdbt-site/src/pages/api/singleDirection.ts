import { NextApiResponse } from 'next';
import { getUuidFromSession, redirectTo, redirectToError } from './apiUtils/index';
import { JOURNEY_ATTRIBUTE } from '../../constants/attributes';
import { updateSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { directionJourneyPattern } = req.body;

        const errors: ErrorInfo[] = [];

        if (!directionJourneyPattern) {
            errors.push({
                errorMessage: 'Choose a direction from the options',
                id: 'direction-journey-pattern',
            });

            updateSessionAttribute(req, JOURNEY_ATTRIBUTE, { errors });

            redirectTo(res, '/singleDirection');
            return;
        }

        const uuid = getUuidFromSession(req);

        if (!uuid) {
            throw new Error('No UUID found');
        }

        updateSessionAttribute(req, JOURNEY_ATTRIBUTE, { directionJourneyPattern });

        redirectTo(res, '/inputMethod');
    } catch (error) {
        const message = 'There was a problem selecting the direction:';
        redirectToError(res, message, 'api.singleDirection', error);
    }
};
