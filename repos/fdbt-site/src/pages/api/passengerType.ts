import { NextApiResponse } from 'next';
import { redirectTo, redirectToError } from './apiUtils/index';
import { PASSENGER_TYPES_WITH_GROUP } from '../../constants/index';
import { PASSENGER_TYPE_ATTRIBUTE } from '../../constants/attributes';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const passengerTypeValues = PASSENGER_TYPES_WITH_GROUP.map(type => type.passengerTypeValue);

        if (req.body.passengerType && passengerTypeValues.includes(req.body.passengerType)) {
            const { passengerType } = req.body;

            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, { passengerType });

            if (passengerType === 'anyone') {
                redirectTo(res, '/defineTimeRestrictions');
                return;
            }

            if (passengerType === 'group') {
                redirectTo(res, '/groupSize');
                return;
            }

            redirectTo(res, '/definePassengerType');
            return;
        }

        const errors: ErrorInfo[] = [
            {
                id: `passenger-type-${PASSENGER_TYPES_WITH_GROUP[0].passengerTypeValue}`,
                errorMessage: 'Choose a passenger type from the options',
            },
        ];

        updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, {
            errors,
        });

        redirectTo(res, '/passengerType');
    } catch (error) {
        const message = 'There was a problem selecting the passenger type:';
        redirectToError(res, message, 'api.passengerType', error);
    }
};
