import { NextApiResponse } from 'next';
import { NextApiRequestWithSession, ErrorInfo } from '../../interfaces/index';
import { FARE_TYPE_ATTRIBUTE, TIME_RESTRICTIONS_ATTRIBUTE } from '../../constants/index';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { redirectToError, redirectOnFareType, redirectTo } from './apiUtils/index';
import { isSessionValid } from './apiUtils/validator';
import { timeRestrictionsErrorId } from '../timeRestrictions';

export interface TimeRestrictionsAttribute {
    timeRestrictions: boolean;
}

export interface TimeRestrictionsAttributeWithErrors extends TimeRestrictionsAttribute {
    errors: ErrorInfo[];
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (!fareTypeAttribute) {
            throw new Error('Failed to retrieve the fareType attribute for the timeRestrictions API');
        }
        const { timeRestrictions } = req.body;

        if (timeRestrictions === 'no') {
            updateSessionAttribute(req, TIME_RESTRICTIONS_ATTRIBUTE, {
                timeRestrictions: false,
            });
            redirectOnFareType(req, res);
            return;
        }

        if (timeRestrictions === 'yes') {
            updateSessionAttribute(req, TIME_RESTRICTIONS_ATTRIBUTE, {
                timeRestrictions: true,
            });
            redirectTo(res, '/defineTimeRestrictions');
            return;
        }

        updateSessionAttribute(req, TIME_RESTRICTIONS_ATTRIBUTE, {
            timeRestrictions: false,
            errors: [{ errorMessage: 'Choose either yes or no', id: timeRestrictionsErrorId }],
        });
        redirectTo(res, '/timeRestrictions');
        return;
    } catch (error) {
        const message = 'There was a problem selecting if there are time restrictions:';
        redirectToError(res, message, 'api.timeRestrictions', error);
    }
};
