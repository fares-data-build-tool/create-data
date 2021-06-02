import { NextApiResponse } from 'next';
import { redirectToError, redirectTo } from './apiUtils/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { SCHOOL_FARE_TYPE_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (req.body.fareType) {
            updateSessionAttribute(req, SCHOOL_FARE_TYPE_ATTRIBUTE, {
                schoolFareType: req.body.fareType,
            });
            redirectTo(res, '/fareConfirmation');
        } else {
            const errors: ErrorInfo[] = [
                { id: 'school-fare-type-single', errorMessage: 'Choose a fare type from the options' },
            ];
            updateSessionAttribute(req, SCHOOL_FARE_TYPE_ATTRIBUTE, {
                schoolFareType: '',
                errors,
            });
            redirectTo(res, '/schoolFareType');
        }
    } catch (error) {
        const message = 'There was a problem selecting the fare type.';
        redirectToError(res, message, 'api.schoolFareType', error);
    }
};
