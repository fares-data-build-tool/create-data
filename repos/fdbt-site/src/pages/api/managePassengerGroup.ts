import { CompanionInfo, GroupPassengerTypeDb } from './../../interfaces/index';
import { getAndValidateNoc, redirectTo } from './apiUtils/index';
import { updateSessionAttribute } from './../../utils/sessions';
import { isArray } from 'lodash';
import { NextApiResponse } from 'next';
import { ErrorInfo, NextApiRequestWithSession } from '../../../src/interfaces';
import { redirectToError } from './apiUtils';
import { GS_PASSENGER_GROUP_ATTRIBUTE } from '../../../src/constants/attributes';
import { getPassengerTypeByNameAndNocCode, insertGroupPassengerType } from '../../data/auroradb';
import { checkIntegerIsValid, removeExcessWhiteSpace } from './apiUtils/validator';

export const formatRequestBody = (req: NextApiRequestWithSession): GroupPassengerTypeDb => {
    const id = req.body.groupId;
    const maxGroupSize = removeExcessWhiteSpace(req.body.maxGroupSize);
    const groupName = removeExcessWhiteSpace(req.body.passengerGroupName);
    const passengerTypeNames: string[] = !req.body.passengerTypes
        ? []
        : isArray(req.body.passengerTypes)
        ? req.body.passengerTypes
        : [req.body.passengerTypes];

    const companions: CompanionInfo[] = passengerTypeNames.map((passengerTypeName) => {
        const minNumber = req.body[`minimumPassengers${passengerTypeName}`];
        const maxNumber = req.body[`maximumPassengers${passengerTypeName}`];
        const typeOfPassenger = req.body[`${passengerTypeName}-type`];
        const ageRangeMin = req.body[`${passengerTypeName}-age-range-min`];
        const ageRangeMax = req.body[`${passengerTypeName}-age-range-max`];
        const proofDocuments = req.body[`${passengerTypeName}-proof-docs`];
        const id = req.body[`${passengerTypeName}-id`];

        return {
            name: passengerTypeName,
            passengerType: typeOfPassenger,
            minNumber,
            maxNumber,
            ageRangeMin,
            ageRangeMax,
            proofDocuments,
            id,
        };
    });

    return {
        id,
        name: groupName,
        groupPassengerType: { name: groupName, maxGroupSize, companions },
    };
};

export const collectErrors = async (userInput: GroupPassengerTypeDb, nocCode: string): Promise<ErrorInfo[]> => {
    const errors: ErrorInfo[] = [];
    const integerCheck = checkIntegerIsValid(userInput.groupPassengerType.maxGroupSize, 'Maximum group size', 1, 30);

    if (integerCheck) {
        errors.push({
            errorMessage: integerCheck,
            id: 'max-group-size',
            userInput: userInput.groupPassengerType.maxGroupSize || '',
        });
    }
    if (!userInput.groupPassengerType.companions?.length) {
        errors.push({
            errorMessage: 'Select at least one passenger type',
            id: 'passenger-type-0',
        });
    }

    if (userInput.groupPassengerType.companions && userInput.groupPassengerType.companions.length && userInput.groupPassengerType.maxGroupSize) {
        userInput.groupPassengerType.companions.forEach((companion) => {
            if (companion.minNumber) {
                const minCheck = checkIntegerIsValid(
                    companion.minNumber,
                    'Minimum amount',
                    1,
                    Number(userInput.groupPassengerType.maxGroupSize),
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
                    Number(userInput.groupPassengerType.maxGroupSize),
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

    if (groupNameCheck) {
        errors.push({
            errorMessage: 'There is already a group with this name. Choose another',
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
        await insertGroupPassengerType(noc, formattedRequest.groupPassengerType, formattedRequest.name);
        redirectTo(res, '/viewPassengerTypes');
        return;
    } catch (error) {
        const message = 'There was a problem in the managePassengerGroup API.';
        redirectToError(res, message, 'api.managePassengerGroup', error);
    }
};
