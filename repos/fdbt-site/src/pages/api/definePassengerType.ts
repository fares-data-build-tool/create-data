import { NextApiResponse } from 'next';
import * as yup from 'yup';
import isArray from 'lodash/isArray';
import { redirectToError, redirectTo, setCookieOnResponseObject, deleteCookieOnResponseObject } from './apiUtils/index';
import {
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    PASSENGER_TYPE_COOKIE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ERRORS_COOKIE,
} from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';
import { CompanionInfo, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { GroupPassengerTypesCollection } from './groupPassengerTypes';

export interface FilteredRequestBody {
    minNumber?: string;
    maxNumber?: string;
    maxGroupSize?: string;
    groupPassengerType?: string;
    ageRange?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proof?: string;
    proofDocuments?: string[];
}

const radioButtonError = 'Choose one of the options below';
const ageRangeNumberError = 'Enter a whole number between 0-150';
const numberOfPassengersError = 'Enter a whole number between 0 and your max group size';
const ageRangeInputError = 'Enter a minimum or maximum age';
const proofSelectionError = 'Select at least one proof document';
const maxLessThanMinError = (inputType: string): string =>
    `Maximum ${inputType} cannot be less than minimum ${inputType}`;
const minGreaterThanMaxError = (inputType: string): string =>
    `Minimum ${inputType} cannot be greater than maximum ${inputType}`;
const maxGroupSizeError = 'The number of this passenger type cannot be greater than the maximum group size';

const minNumberOfPassengersSchema = yup
    .number()
    .typeError(numberOfPassengersError)
    .integer(numberOfPassengersError)
    .min(0, numberOfPassengersError);

const maxNumberOfPassengersSchema = yup
    .number()
    .typeError(numberOfPassengersError)
    .integer(numberOfPassengersError)
    .max(yup.ref('maxGroupSize'), maxGroupSizeError);

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

export const passengerTypeDetailsSchema = yup
    .object({
        minNumber: yup.number().when('groupPassengerType', {
            is: groupPassengerTypeValue => !!groupPassengerTypeValue,
            then: yup
                .number()
                .when('maxNumber', {
                    is: maxNumberValue => !!maxNumberValue,
                    then: minNumberOfPassengersSchema
                        .max(yup.ref('maxNumber'), minGreaterThanMaxError('number of passengers'))
                        .notRequired(),
                })
                .when('maxNumber', {
                    is: maxNumberValue => !maxNumberValue,
                    then: minNumberOfPassengersSchema.max(150, numberOfPassengersError).notRequired(),
                }),
        }),
        maxNumber: yup.number().when('groupPassengerType', {
            is: groupPassengerTypeValue => !!groupPassengerTypeValue,
            then: yup
                .number()
                .when('minNumber', {
                    is: minNumberValue => !!minNumberValue,
                    then: maxNumberOfPassengersSchema
                        .min(yup.ref('minNumber'), maxLessThanMinError('number of passengers'))
                        .required(numberOfPassengersError),
                })
                .when('minNumber', {
                    is: minNumberValue => !minNumberValue,
                    then: maxNumberOfPassengersSchema.min(0, numberOfPassengersError).required(numberOfPassengersError),
                }),
        }),
        ageRange: yup
            .string()
            .oneOf(['Yes', 'No'])
            .required(radioButtonError),
        proof: yup.string().when('passengerType', {
            is: passengerTypeValue => passengerTypeValue !== 'adult',
            then: yup
                .string()
                .oneOf(['Yes', 'No'])
                .required(radioButtonError),
        }),
        ageRangeMin: yup.number().when('ageRange', {
            is: 'Yes',
            then: yup
                .number()
                .when('ageRangeMax', {
                    is: ageRangeMaxValue => !!ageRangeMaxValue,
                    then: minAgeRangeSchema.max(yup.ref('ageRangeMax'), minGreaterThanMaxError('age')).notRequired(),
                })
                .when('ageRangeMax', {
                    is: ageRangeMaxValue => !ageRangeMaxValue,
                    then: minAgeRangeSchema.max(150, ageRangeNumberError).required(ageRangeInputError),
                }),
        }),
        ageRangeMax: yup.number().when('ageRange', {
            is: 'Yes',
            then: yup
                .number()
                .when('ageRangeMin', {
                    is: ageRangeMinValue => !!ageRangeMinValue,
                    then: maxAgeRangeSchema.min(yup.ref('ageRangeMin'), maxLessThanMinError('age')).notRequired(),
                })
                .when('ageRangeMin', {
                    is: ageRangeMinValue => !ageRangeMinValue,
                    then: maxAgeRangeSchema.min(0, ageRangeNumberError).required(ageRangeInputError),
                }),
        }),
        proofDocuments: yup.string().when('proof', { is: 'Yes', then: yup.string().required(proofSelectionError) }),
    })
    .required();

export const formatRequestBody = (req: NextApiRequestWithSession): FilteredRequestBody => {
    const filteredReqBody: { [key: string]: string | string[] } = {};
    Object.entries(req.body).forEach(entry => {
        if (
            entry[0] === 'ageRangeMin' ||
            entry[0] === 'ageRangeMax' ||
            entry[0] === 'minNumber' ||
            entry[0] === 'maxNumber'
        ) {
            const input = entry[1] as string;
            const strippedInput = input.replace(/\s+/g, '');
            if (strippedInput === '') {
                return;
            }
            filteredReqBody[entry[0]] = strippedInput;
            return;
        }
        if (entry[0] === 'proofDocuments') {
            filteredReqBody[entry[0]] = !isArray(entry[1]) ? [entry[1] as string] : (entry[1] as string[]);
            return;
        }
        filteredReqBody[entry[0]] = entry[1] as string;
    });
    return filteredReqBody;
};

export const getErrorIdFromValidityError = (errorPath: string): string => {
    switch (errorPath) {
        case 'ageRange':
            return 'define-passenger-age-range';
        case 'proof':
            return 'define-passenger-proof';
        case 'ageRangeMin':
            return 'age-range-min';
        case 'ageRangeMax':
            return 'age-range-max';
        case 'proofDocuments':
            return 'proof-required';
        case 'minNumber':
            return 'min-number-of-passengers';
        case 'maxNumber':
            return 'max-number-of-passengers';
        default:
            throw new Error(`Could not match the following error with an expected input. Error path: ${errorPath}.`);
    }
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const { passengerType } = req.body;

        const groupPassengerTypes = getSessionAttribute(req, GROUP_PASSENGER_TYPES_ATTRIBUTE);
        const groupSize = getSessionAttribute(req, GROUP_SIZE_ATTRIBUTE);
        const group = !!groupPassengerTypes && !!groupSize;

        if (!req.body) {
            throw new Error('Could not extract the relevant data from the request.');
        }

        let errors: ErrorInfo[] = [];

        const filteredReqBody = formatRequestBody(req);

        if (groupPassengerTypes && groupSize) {
            filteredReqBody.maxGroupSize = groupSize.maxGroupSize;
            filteredReqBody.groupPassengerType = passengerType;
        }

        try {
            await passengerTypeDetailsSchema.validate(filteredReqBody, { abortEarly: false });
        } catch (validationErrors) {
            const validityErrors: yup.ValidationError = validationErrors;
            errors = validityErrors.inner.map(error => ({
                id: getErrorIdFromValidityError(error.path),
                errorMessage: error.message,
                userInput: error.value,
            }));
        }

        if (errors.length === 0) {
            if (!group) {
                const passengerTypeCookieValue = JSON.stringify({ passengerType, ...filteredReqBody });
                setCookieOnResponseObject(PASSENGER_TYPE_COOKIE, passengerTypeCookieValue, req, res);
            } else {
                const selectedPassengerTypes = getSessionAttribute(req, GROUP_PASSENGER_TYPES_ATTRIBUTE);
                const submittedPassengerType = passengerType;

                if (selectedPassengerTypes) {
                    const index = (selectedPassengerTypes as GroupPassengerTypesCollection).passengerTypes.findIndex(
                        type => type === submittedPassengerType,
                    );

                    (selectedPassengerTypes as GroupPassengerTypesCollection).passengerTypes.splice(index, 1);

                    const { ageRangeMin, ageRangeMax, proofDocuments } = filteredReqBody;
                    const { minNumber, maxNumber } = req.body;

                    const sessionGroup = getSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE);

                    const companions: CompanionInfo[] = [];

                    if (sessionGroup) {
                        sessionGroup.forEach(companion => {
                            companions.push(companion);
                        });
                    }

                    companions.push({
                        minNumber,
                        maxNumber,
                        ageRangeMin,
                        ageRangeMax,
                        proofDocuments,
                        passengerType: submittedPassengerType,
                    });

                    updateSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE, companions);

                    if ((selectedPassengerTypes as GroupPassengerTypesCollection).passengerTypes.length > 0) {
                        deleteCookieOnResponseObject(PASSENGER_TYPE_ERRORS_COOKIE, req, res);
                        redirectTo(
                            res,
                            `/definePassengerType?groupPassengerType=${
                                (selectedPassengerTypes as GroupPassengerTypesCollection).passengerTypes[0]
                            }`,
                        );
                    } else {
                        deleteCookieOnResponseObject(PASSENGER_TYPE_ERRORS_COOKIE, req, res);
                        redirectTo(res, '/timeRestrictions');
                    }
                    return;
                }
            }
            deleteCookieOnResponseObject(PASSENGER_TYPE_ERRORS_COOKIE, req, res);
            redirectTo(res, '/timeRestrictions');
            return;
        }
        const passengerTypeCookieValue = JSON.stringify({ errors, passengerType });
        setCookieOnResponseObject(PASSENGER_TYPE_ERRORS_COOKIE, passengerTypeCookieValue, req, res);
        if (group) {
            redirectTo(res, `/definePassengerType?groupPassengerType=${passengerType}`);
            return;
        }
        redirectTo(res, '/definePassengerType');
    } catch (error) {
        const message = 'There was a problem in the definePassengerType API.';
        redirectToError(res, message, 'api.definePassengerType', error);
    }
};
