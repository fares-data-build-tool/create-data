import { NextApiResponse } from 'next';
import Cookies from 'cookies';
import { NextApiRequestWithSession, ErrorInfo } from '../../interfaces/index';
import { TIME_RESTRICTIONS_ATTRIBUTE, FARE_TYPE_COOKIE } from '../../constants/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { redirectToError, redirectOnFareType, redirectTo, unescapeAndDecodeCookie } from './apiUtils/index';
import { isSessionValid } from './apiUtils/validator';
import { timeRestrictionsErrorId } from '../timeRestrictions';

export interface TimeRestrictionsAttributeWithErrors {
    errors: ErrorInfo[];
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }
        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
        const { fareType } = JSON.parse(fareTypeCookie);
        if (!fareType) {
            throw new Error('Failed to retrieve the fareType cookie for the timeRestrictions API');
        }
        const { timeRestrictions } = req.body;

        if (timeRestrictions === 'no') {
            redirectOnFareType(req, res);
            return;
        }

        if (timeRestrictions === 'yes') {
            redirectTo(res, '/defineTimeRestrictions');
            return;
        }

        updateSessionAttribute(req, TIME_RESTRICTIONS_ATTRIBUTE, {
            errors: [{ errorMessage: 'Choose either yes or no', id: timeRestrictionsErrorId }],
        });
        redirectTo(res, '/timeRestrictions');
        return;
    } catch (error) {
        const message = 'There was a problem selecting if there are time restrictions:';
        redirectToError(res, message, 'api.timeRestrictions', error);
    }
};
