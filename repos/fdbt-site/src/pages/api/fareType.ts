import camelCase from 'lodash/camelCase';
import { NextApiResponse } from 'next';
import { redirectToError, redirectTo } from './apiUtils/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { FARE_TYPE_ATTRIBUTE, PASSENGER_TYPE_ATTRIBUTE, CARNET_FARE_TYPE_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { globalSettingsEnabled } from '../../constants/featureFlag';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { fareType } = req.body;
        if (fareType) {
            if (
                typeof fareType === 'string' &&
                (fareType === 'carnet' || fareType === 'carnetPeriod' || fareType === 'carnetFlatFare')
            ) {
                updateSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE, true);
                if (fareType === 'carnet') {
                    updateSessionAttribute(req, FARE_TYPE_ATTRIBUTE, undefined);
                    redirectTo(res, '/carnetFareType');
                    return;
                }
                const reformedFareType = camelCase(fareType.split('carnet')[1]) as 'flatFare' | 'period';
                updateSessionAttribute(req, FARE_TYPE_ATTRIBUTE, { fareType: reformedFareType });
                if (globalSettingsEnabled) {
                    redirectTo(res, '/selectPassengerType');
                } else {
                    redirectTo(res, '/passengerType');
                }
                return;
            }
            updateSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE, false);
            updateSessionAttribute(req, FARE_TYPE_ATTRIBUTE, {
                fareType,
            });

            if (globalSettingsEnabled) {
                redirectTo(res, '/selectPassengerType');
            } else if (fareType === 'schoolService') {
                updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, { passengerType: 'schoolPupil' });
                redirectTo(res, '/definePassengerType');
                return;
            } else {
                redirectTo(res, '/passengerType');
            }
        } else {
            const errors: ErrorInfo[] = [
                { id: 'radio-option-single', errorMessage: 'Choose a fare type from the options' },
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
