import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import * as yup from 'yup';
import {
    PASSENGER_TYPE_ATTRIBUTE,
    MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
} from '../../constants/attributes';
import {
    ActualPassengerType,
    ManagePassengerTypeWithErrors,
    ErrorInfo,
    FareType,
    NextApiRequestWithSession,
} from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError } from './apiUtils/index';
import { removeAllWhiteSpace } from './apiUtils/validator';
import { upsertSinglePassengerType } from '../../data/auroradb';
import { getAndValidateNoc } from './apiUtils/index';

interface FilteredRequestBody {
    name?: string;
    type?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proofDocuments?: string[];
}

interface IFilteredRequestBody {
    [key: string]: string | string[];
}

const passengerTypeRequiredErrorMessage = 'You must select a passenger type';
const nameRequiredErrorMessage = 'You must provide a name';
const nameGreaterThanMaxErrorMessage = 'The name caannot be greater than 50 characters';
const ageRangeNumberError = 'Enter a whole number between 0-150';
const ageRangeInputError = 'Enter a minimum or maximum age';
const proofSelectionError = 'Select at least one proof document';
const maxLessThanMinError = (inputType: string): string =>
    `Maximum ${inputType} cannot be less than minimum ${inputType}`;
const minGreaterThanMaxError = (inputType: string): string =>
    `Minimum ${inputType} cannot be greater than maximum ${inputType}`;

const minAgeRangeSchema = yup
    .number()
    .typeError(ageRangeNumberError)
    .integer(ageRangeNumberError)
    .min(0, ageRangeNumberError);

const maxAgeRangeSchema = yup
    .number()
    .typeError(ageRangeNumberError)
    .integer(ageRangeNumberError)
    .max(150, ageRangeNumberError);

export const requestValidationRules = yup
    .object({
        type: yup.string().required(passengerTypeRequiredErrorMessage),
        name: yup.string().required(nameRequiredErrorMessage).max(50, nameGreaterThanMaxErrorMessage),
        ageRangeMin: yup.number().when('ageRange', {
            is: 'Yes',
            then: yup
                .number()
                .when('ageRangeMax', {
                    is: (ageRangeMaxValue) => !!ageRangeMaxValue,
                    then: minAgeRangeSchema.max(yup.ref('ageRangeMax'), minGreaterThanMaxError('age')).notRequired(),
                })
                .when('ageRangeMax', {
                    is: (ageRangeMaxValue) => !ageRangeMaxValue,
                    then: minAgeRangeSchema.max(150, ageRangeNumberError).required(ageRangeInputError),
                }),
        }),
        ageRangeMax: yup.number().when('ageRange', {
            is: 'Yes',
            then: yup
                .number()
                .when('ageRangeMin', {
                    is: (ageRangeMinValue) => !!ageRangeMinValue,
                    then: maxAgeRangeSchema.min(yup.ref('ageRangeMin'), maxLessThanMinError('age')).notRequired(),
                })
                .when('ageRangeMin', {
                    is: (ageRangeMinValue) => !ageRangeMinValue,
                    then: maxAgeRangeSchema.min(0, ageRangeNumberError).required(ageRangeInputError),
                }),
        }),
        proofDocuments: yup.string().when('proof', { is: 'Yes', then: yup.string().required(proofSelectionError) }),
    })
    .required();

export const formatRequestBody = (req: NextApiRequestWithSession): FilteredRequestBody => {
    const filteredReqBody: IFilteredRequestBody = {};

    Object.entries(req.body).forEach((entry) => {
        const key = entry[0];
        const value = entry[1];

        if (key === 'type') {
            filteredReqBody[key] = value as string;
        }

        if (key === 'name') {
            filteredReqBody[key] = value as string;
        }

        if (key === 'ageRangeMin' || key === 'ageRangeMax') {
            const strippedValue = removeAllWhiteSpace(value as string);

            if (strippedValue === '') {
                return;
            }

            filteredReqBody[key] = strippedValue;

            return;
        }

        if (key === 'proofDocuments') {
            filteredReqBody[key] = !isArray(value) ? [value as string] : (value as string[]);

            return;
        }

        filteredReqBody[key] = value as string;
    });

    return filteredReqBody;
};

export const getErrorIdFromValidityError = (errorPath: string): string => {
    switch (errorPath) {
        case 'type':
            return 'type';
        case 'name':
            return 'name';
        case 'ageRangeMin':
            return 'age-range-min';
        case 'ageRangeMax':
            return 'age-range-max';
        case 'proofDocuments':
            return 'membership-card';
        default:
            throw new Error(`Could not match the following error with an expected input. Error path: ${errorPath}.`);
    }
};

export const getPassengerTypeRedirectLocation = (req: NextApiRequestWithSession, passengerType: string): string => {
    const { fareType } = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;

    return passengerType === 'schoolPupil' && fareType === 'schoolService' ? '/termTime' : '/defineTimeRestrictions';
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!req.body) {
            throw new Error('Could not extract the relevant data from the request.');
        }

        let errors: ErrorInfo[] = [];

        const requestBody = formatRequestBody(req);

        const actualPassengerType = {
            name: requestBody.name,
            passengerType: {
                passengerType: requestBody.type,
                ageRangeMin: requestBody.ageRangeMin,
                ageRangeMax: requestBody.ageRangeMax,
                proofDocuments: requestBody.proofDocuments,
            },
        } as ActualPassengerType;

        try {
            await requestValidationRules.validate(requestBody, { abortEarly: false });
        } catch (exception) {
            console.log('ERRORS MAAAAN!!!!!!!');

            const validationErrors: yup.ValidationError = exception;

            errors = validationErrors.inner.map((error) => ({
                id: getErrorIdFromValidityError(error.path),
                errorMessage: error.message,
            }));
        }

        if (errors.length === 0) {
            console.log('there were no errors!');
            const nationalOperatorCode = getAndValidateNoc(req, res);

            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, actualPassengerType.passengerType);

            updateSessionAttribute(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);

            await upsertSinglePassengerType(
                nationalOperatorCode,
                actualPassengerType.passengerType,
                actualPassengerType.name,
            );

            redirectTo(res, '/viewPassengerTypes');
        }

        const sessionInfo: ManagePassengerTypeWithErrors = {
            errors,
            ...actualPassengerType,
        };

        updateSessionAttribute(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, sessionInfo);

        redirectTo(res, '/managePassengerTypes');
    } catch (error) {
        const message = 'There was a problem in the managePassengerTypes API.';

        redirectToError(res, message, 'api.managePassengerTypes', error);
    }
};
