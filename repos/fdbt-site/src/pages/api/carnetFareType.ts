import { NextApiResponse } from 'next';
import { redirectToError, redirectTo } from '../../utils/apiUtils/index';
import { updateSessionAttribute, getSessionAttribute } from '../../utils/sessions';
import { FARE_TYPE_ATTRIBUTE, CARNET_FARE_TYPE_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { isFareType } from '../../interfaces/typeGuards';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { fareType } = req.body;
        const carnet = getSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE);
        if (!carnet) {
            updateSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE, true);
        }
        if (fareType && isFareType({ fareType })) {
            updateSessionAttribute(req, FARE_TYPE_ATTRIBUTE, {
                fareType,
            });

            redirectTo(res, '/selectPassengerType');
        } else {
            const errors: ErrorInfo[] = [
                { id: 'fare-type-single', errorMessage: 'Choose a carnet fare type from the options' },
            ];
            updateSessionAttribute(req, FARE_TYPE_ATTRIBUTE, {
                errors,
            });
            redirectTo(res, '/carnetFareType');
        }
    } catch (error) {
        const message = 'There was a problem selecting the fare type.';
        redirectToError(res, message, 'api.carnetFareType', error);
    }
};
