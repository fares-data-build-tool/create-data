import { CompanionInfo, GroupPassengerType } from './../../interfaces/index';
import { getAndValidateNoc, redirectTo } from './apiUtils/index';
import { updateSessionAttribute } from './../../utils/sessions';
import { isArray } from 'lodash';
import { NextApiResponse } from 'next';
import { ErrorInfo, NextApiRequestWithSession } from '../../../src/interfaces';
import { redirectToError } from './apiUtils';
import { GS_PASSENGER_GROUP_ATTRIBUTE } from '../../../src/constants/attributes';
import { getPassengerTypeByNameAndNocCode, insertGroupPassengerType } from '../../data/auroradb';
import { checkIntegerIsValid, removeExcessWhiteSpace } from './apiUtils/validator';

export const formatRequestBody = (req: NextApiRequestWithSession): GroupPassengerType => {
    const maxGroupSize = removeExcessWhiteSpace(req.body.maxGroupSize);
    const groupName = removeExcessWhiteSpace(req.body.passengerGroupName);
    const passengerTypes: string[] = !req.body.passengerTypes
        ? []
        : isArray(req.body.passengerTypes)
        ? req.body.passengerTypes
        : [req.body.passengerTypes];

    const companions: CompanionInfo[] = [];
    if (passengerTypes.length > 0) {
        passengerTypes.forEach((passengerType) => {
            const minNumber = req.body[`minimumPassengers${passengerType}`];
            const maxNumber = req.body[`maximumPassengers${passengerType}`];
            const typeOfPassenger = req.body[`${passengerType}-type`];
            const ageRangeMin = req.body[`${passengerType}-age-range-min`];
            const ageRangeMax = req.body[`${passengerType}-age-range-max`];
            const proofDocuments = req.body[`${passengerType}-proof-docs`];
            companions.push({
                name: passengerType,
                passengerType: typeOfPassenger,
                minNumber,
                maxNumber,
                ageRangeMin,
                ageRangeMax,
                proofDocuments,
            });
        });
    }

    return {
        name: groupName,
        maxGroupSize,
        companions,
    };
};

export const collectErrors = async (userInput: GroupPassengerType, nocCode: string): Promise<ErrorInfo[]> => {
    const errors: ErrorInfo[] = [];
    const integerCheck = checkIntegerIsValid(userInput.maxGroupSize, 'Maximum group size', 1, 30);

    if (integerCheck) {
        errors.push({
            errorMessage: integerCheck,
            id: 'max-group-size',
            userInput: userInput.maxGroupSize || '',
        });
    }
    if (!userInput.companions || userInput.companions.length === 0) {
        errors.push({
            errorMessage: 'Select at least one passenger type',
            id: 'passenger-type-0',
        });
    }

    if (userInput.companions && userInput.companions.length && userInput.maxGroupSize) {
        userInput.companions.forEach((companion) => {
            if (companion.minNumber) {
                const minCheck = checkIntegerIsValid(
                    companion.minNumber,
                    'Minimum amount',
                    1,
                    Number(userInput.maxGroupSize),
                );
                if (minCheck) {
                    errors.push({
                        errorMessage: minCheck,
                        id: `minimum-passengers-${companion.name}`,
                        userInput: companion.minNumber || '',
                    });
                }
            }
            if (!companion.maxNumber) {
                errors.push({
                    errorMessage: 'Maximum amount is required',
                    id: `minimum-passengers-${companion.name}`,
                });
            } else {
                const maxCheck = checkIntegerIsValid(
                    companion.maxNumber,
                    'Maximum amount',
                    1,
                    Number(userInput.maxGroupSize),
                );
                if (maxCheck) {
                    errors.push({
                        errorMessage: maxCheck,
                        id: `maximum-passengers-${companion.name}`,
                        userInput: companion.maxNumber || '',
                    });
                }
                if (companion.minNumber && companion.minNumber > companion.maxNumber) {
                    errors.push({
                        errorMessage: 'Minimum amount cannot be greated than maximum amount',
                        id: `minumum-passengers-${companion.name}`,
                        userInput: companion.minNumber || '',
                    });
                }
            }
        });
    }
    const groupNameCheck = await getPassengerTypeByNameAndNocCode(nocCode, userInput.name, true);
    const passengerTypeNameCheck = await getPassengerTypeByNameAndNocCode(nocCode, userInput.name, false);

    if (groupNameCheck) {
        errors.push({
            errorMessage: 'There is already a group with this name. Choose another',
            id: 'passenger-group-name',
            userInput: userInput.name,
        });
        return errors;
    }

    if (passengerTypeNameCheck) {
        errors.push({
            errorMessage: 'There is already a passenger type with this name. Choose another',
            id: 'passenger-group-name',
            userInput: userInput.name,
        });
        return errors;
    }

    if (!userInput.name || userInput.name.length > 50 || userInput.name.length < 1) {
        errors.push({
            errorMessage: 'Enter a group name of up to 50 characters',
            id: 'passenger-group-name',
            userInput: userInput.name || '',
        });
    }
    return errors;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const formattedRequest = formatRequestBody(req);
        const noc = getAndValidateNoc(req, res);
        const errors: ErrorInfo[] = await collectErrors(formattedRequest, noc);
        if (errors.length) {
            updateSessionAttribute(req, GS_PASSENGER_GROUP_ATTRIBUTE, {
                errors,
                inputs: formattedRequest,
            });
            redirectTo(res, '/managePassengerGroup');
            return;
        }
        updateSessionAttribute(req, GS_PASSENGER_GROUP_ATTRIBUTE, undefined);
        await insertGroupPassengerType(noc, formattedRequest, formattedRequest.name);
        redirectTo(res, '/viewPassengerTypes');
        return;
    } catch (error) {
        const message = 'There was a problem in the managePassengerGroup API.';
        redirectToError(res, message, 'api.managePassengerGroup', error);
    }
};
