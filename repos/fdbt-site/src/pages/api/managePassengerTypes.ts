import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import { PASSENGER_TYPE_ATTRIBUTE, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE } from '../../constants/attributes';
import {
    SinglePassengerType,
    ManagePassengerTypeWithErrors,
    NextApiRequestWithSession,
    ErrorInfo,
} from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError } from './apiUtils/index';
import {
    getSinglePassengerTypeByNameAndNationalOperatorCode,
    updateSinglePassengerType,
    upsertSinglePassengerType,
} from '../../data/auroradb';
import { getAndValidateNoc } from './apiUtils/index';
import { removeExcessWhiteSpace, checkIntegerIsValid } from './apiUtils/validator';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!req.body) {
            throw new Error('Could not extract the relevant data from the request.');
        }

        const nationalOperatorCode = getAndValidateNoc(req, res);

        const [isEditMode, singlePassengerType, errors] = await formatRequestBody(req, nationalOperatorCode);

        if (errors.length) {
            const sessionInfo: ManagePassengerTypeWithErrors = {
                errors,
                ...singlePassengerType,
            };

            updateSessionAttribute(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, sessionInfo);

            const location = isEditMode
                ? `/managePassengerTypes?id=${singlePassengerType.id}`
                : '/managePassengerTypes';

            redirectTo(res, location);

            return;
        }

        updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, singlePassengerType.passengerType);

        updateSessionAttribute(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);

        if (isEditMode) {
            await updateSinglePassengerType(singlePassengerType);
        } else {
            await upsertSinglePassengerType(
                nationalOperatorCode,
                singlePassengerType.passengerType,
                singlePassengerType.name,
            );
        }

        redirectTo(res, '/viewPassengerTypes');
    } catch (error) {
        const message = 'There was a problem in the managePassengerTypes API.';

        redirectToError(res, message, 'api.managePassengerTypes', error);
    }
};

export const formatRequestBody = async (
    req: NextApiRequestWithSession,
    nationalOperatorCode: string,
): Promise<[boolean, SinglePassengerType, ErrorInfo[]]> => {
    const errors: ErrorInfo[] = [];
    const id = Number(req.body.id);
    const name = req.body.name;
    const type = req.body.type;
    const ageRangeMin = req.body.ageRangeMin;
    const ageRangeMax = req.body.ageRangeMax;
    const proofDocuments = !isArray(req.body.proofDocuments) ? [req.body.proofDocuments] : req.body.proofDocuments;

    if (typeof name !== 'string' || typeof ageRangeMin !== 'string' || typeof ageRangeMax !== 'string') {
        throw Error('one of the parameters is not a string!');
    }

    if (typeof type !== 'string' || !type) {
        errors.push({ id: 'type', errorMessage: 'You must select a passenger type' });
    }

    let isInEditMode = false;

    const idIsANumber = Number.isInteger(id);

    if (idIsANumber && id !== 0) {
        isInEditMode = true;
    }

    const trimmedName = removeExcessWhiteSpace(name);

    const passengerType: SinglePassengerType = {
        id: id,
        name: trimmedName,
        passengerType: {
            passengerType: type,
            ageRangeMin: ageRangeMin,
            ageRangeMax: ageRangeMax,
            proofDocuments: proofDocuments,
        },
    };

    if (trimmedName.length < 1) {
        errors.push({ id: 'name', errorMessage: 'Name must be provided' });
    }

    if (trimmedName.length >= 50) {
        errors.push({ id: 'name', errorMessage: 'Name must be 50 characters or under' });
    }

    const invalidAgeRangeMin = ageRangeMin && checkIntegerIsValid(ageRangeMin, 'Age', 0, 150);

    if (invalidAgeRangeMin) {
        errors.push({ id: 'age-range-min', errorMessage: invalidAgeRangeMin });
    }

    const invalidAgeRangeMax = ageRangeMax && checkIntegerIsValid(ageRangeMax, 'Age', 0, 150);

    if (invalidAgeRangeMax) {
        errors.push({ id: 'age-range-max', errorMessage: invalidAgeRangeMax });
    }

    if (Number.parseInt(ageRangeMin) > Number.parseInt(ageRangeMax)) {
        errors.push({ id: 'age-range-min', errorMessage: 'Minimum age cannot be greater than maximum age' });
    }

    const singlePassengerType = await getSinglePassengerTypeByNameAndNationalOperatorCode(
        nationalOperatorCode,
        trimmedName,
        false,
    );

    if (singlePassengerType !== undefined) {
        if (id !== singlePassengerType.id) {
            errors.push({ id: 'duplicate', errorMessage: `${trimmedName} already exists as a passenger type` });
        }
    }

    return [isInEditMode, passengerType, errors];
};
