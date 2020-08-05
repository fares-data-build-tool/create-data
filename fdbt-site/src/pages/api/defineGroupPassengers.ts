import { isArray } from 'lodash';
import { NextApiResponse } from 'next';
import { NextApiRequestWithSession, ErrorInfo } from '../../interfaces/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { redirectToError, redirectTo } from './apiUtils/index';
import { GROUP_PASSENGER_TYPES } from '../../constants/index';

export interface GroupPassengerTypes {
    passengerTypes: string[];
}
export interface GroupPassengerTypesWithErrors {
    errors: ErrorInfo[];
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const chosenPassengerTypes = req.body.passengerTypes;
        if (chosenPassengerTypes) {
            if (isArray(chosenPassengerTypes) && chosenPassengerTypes.length > 2) {
                const passengerTypeErrorMessage: GroupPassengerTypesWithErrors = {
                    errors: [
                        {
                            errorMessage: 'Choose one or two passenger types - you cannot exceed this limit',
                            id: 'passenger-types-error',
                        },
                    ],
                };
                updateSessionAttribute(req, GROUP_PASSENGER_TYPES, passengerTypeErrorMessage);
                redirectTo(res, '/defineGroupPassengers');
                return;
            }

            updateSessionAttribute(req, GROUP_PASSENGER_TYPES, chosenPassengerTypes);
            redirectTo(res, '/definePassengerType');
            return;
        }

        const passengerTypeErrorMessage: GroupPassengerTypesWithErrors = {
            errors: [
                { errorMessage: 'Choose one or two passenger types from the options', id: 'passenger-types-error' },
            ],
        };

        updateSessionAttribute(req, GROUP_PASSENGER_TYPES, passengerTypeErrorMessage);
        redirectTo(res, '/defineGroupPassengers');
    } catch (error) {
        const message = 'There was a problem selecting the passenger types:';
        redirectToError(res, message, 'api.defineGroupPassengers', error);
    }
};
