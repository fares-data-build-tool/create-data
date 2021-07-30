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
import { upsertSinglePassengerType } from '../../data/auroradb';
import { getAndValidateNoc } from './apiUtils/index';
import { checkIntegerIsValid } from './apiUtils/validator';

export const formatRequestBody = (req: NextApiRequestWithSession): [SinglePassengerType, ErrorInfo[]] => {
    const errors: ErrorInfo[] = [];
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

    const passengerType: SinglePassengerType = {
        name: name,
        passengerType: {
            passengerType: type,
            ageRangeMin: ageRangeMin,
            ageRangeMax: ageRangeMax,
            proofDocuments: proofDocuments,
        },
    };

    if (passengerType.name.length < 1) {
        errors.push({ id: 'name', errorMessage: 'Name must be provided' });
    }

    if (passengerType.name.length >= 50) {
        errors.push({ id: 'name', errorMessage: 'Name must be fewer than 50 characters long' });
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
        errors.push({ id: 'age-range-min', errorMessage: 'Minimum age cannot be greater than Maximum age' });
    }

    return [passengerType, errors];
};

export const getErrorIdFromValidityError = (errorPath: string): string => {
    switch (errorPath) {
        case 'passengerType':
            return 'type';
        case 'name':
            return 'name';
        case 'ageRangeMin':
            return 'age-range-min';
        case 'ageRangeMax':
            return 'age-range-max';
        case 'proofDocuments':
            return 'proof-documents';
        default:
            throw new Error(`Could not match the following error with an expected input. Error path: ${errorPath}.`);
    }
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        console.log('The Request Body is:');

        console.log(req.body);

        if (!req.body) {
            throw new Error('Could not extract the relevant data from the request.');
        }

        const [singlePassengerType, errors] = formatRequestBody(req);

        if (errors.length) {
            const sessionInfo: ManagePassengerTypeWithErrors = {
                errors,
                ...singlePassengerType,
            };

            updateSessionAttribute(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, sessionInfo);

            redirectTo(res, '/managePassengerTypes');

            return;
        }

        const nationalOperatorCode = getAndValidateNoc(req, res);

        updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, singlePassengerType.passengerType);

        updateSessionAttribute(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);

        await upsertSinglePassengerType(
            nationalOperatorCode,
            singlePassengerType.passengerType,
            singlePassengerType.name,
        );

        redirectTo(res, '/viewPassengerTypes');
    } catch (error) {
        const message = 'There was a problem in the managePassengerTypes API.';

        redirectToError(res, message, 'api.managePassengerTypes', error);
    }
};
