import { NextApiResponse } from 'next';
import { redirectTo, redirectToError } from './apiUtils/index';
import { PASSENGER_TYPE_ATTRIBUTE, PASSENGER_TYPES_WITH_GROUP } from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';

export interface PassengerType {
    passengerType: string;
    ageRange?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proof?: string;
    proofDocuments?: string[];
}

export interface PassengerTypeWithErrors {
    errors: ErrorInfo[];
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const passengerTypeValues = PASSENGER_TYPES_WITH_GROUP.map(type => type.passengerTypeValue);

        if (req.body.passengerType && passengerTypeValues.includes(req.body.passengerType)) {
            const { passengerType } = req.body;

            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, { passengerType });

            if (passengerType === 'anyone') {
                redirectTo(res, '/timeRestrictions');
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
