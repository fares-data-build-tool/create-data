import { NextApiResponse } from 'next';
import { redirectToError, redirectTo } from './apiUtils/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { FARE_TYPE_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE, CARNET_FARE_TYPE_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { fareType } = req.body;
        if (fareType) {
            if (fareType === 'carnet') {
                updateSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE, true);
                updateSessionAttribute(req, FARE_TYPE_ATTRIBUTE, undefined);
                redirectTo(res, '/carnetFareType');
                return;
            }
            updateSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE, false);
            updateSessionAttribute(req, FARE_TYPE_ATTRIBUTE, {
                fareType,
            });
            if (fareType === 'schoolService') {
                updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, { passengerType: 'schoolPupil' });
                redirectTo(res, '/definePassengerType');
                return;
            }
            redirectTo(res, '/passengerType');
        } else {
            const errors: ErrorInfo[] = [
                { id: 'fare-type-single', errorMessage: 'Choose a fare type from the options' },
            ];
            updateSessionAttribute(req, FARE_TYPE_ATTRIBUTE, {
                errors,
            });
            redirectTo(res, '/fareType');
        }
    } catch (error) {
        const message = 'There was a problem selecting the fare type.';
        redirectToError(res, message, 'api.fareType', error);
    }
};
