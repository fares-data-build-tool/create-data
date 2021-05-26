import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import * as yup from 'yup';
import {
    DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_PASSENGER_TYPES_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
} from '../../constants/attributes';
import { getPassengerTypeByNameAndNocCode, insertPassengerType, upsertPassengerType } from '../../data/auroradb';
import {
    CompanionInfo,
    DefinePassengerTypeWithErrors,
    ErrorInfo,
    FareType,
    GroupPassengerTypesCollection,
    NextApiRequestWithSession,
} from '../../interfaces';
import { isPassengerTypeAttributeWithErrors } from '../../interfaces/typeGuards';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { getAndValidateNoc, redirectTo, redirectToError } from './apiUtils/index';
import { removeAllWhiteSpace, removeExcessWhiteSpace } from './apiUtils/validator';

interface FilteredRequestBody {
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
        ageRange: yup.string().when('passengerType', {
            is: passengerTypeValue => passengerTypeValue !== 'anyone',
            then: yup
                .string()
                .oneOf(['Yes', 'No'])
                .required(radioButtonError),
        }),
        proof: yup.string().when('passengerType', {
            is: passengerTypeValue => !(passengerTypeValue === 'adult' || passengerTypeValue === 'anyone'),
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
        if (entry[0] === 'minNumber' || entry[0] === 'maxNumber') {
            const input = entry[1] as string;
            const strippedInput = removeAllWhiteSpace(input);
            if (strippedInput === '') {
                return;
            }
            filteredReqBody[entry[0]] = strippedInput;
            return;
        }
        if (entry[0] === 'ageRangeMin' || entry[0] === 'ageRangeMax') {
            if (req.body.ageRange === 'Yes') {
                const input = entry[1] as string;
                const strippedInput = removeAllWhiteSpace(input);
                if (strippedInput === '') {
                    return;
                }
                filteredReqBody[entry[0]] = strippedInput;
            }
            return;
        }
        if (entry[0] === 'proofDocuments') {
            if (req.body.proof === 'Yes') {
                filteredReqBody[entry[0]] = !isArray(entry[1]) ? [entry[1] as string] : (entry[1] as string[]);
            }
            return;
        }
        filteredReqBody[entry[0]] = entry[1] as string;
    });
    return filteredReqBody;
};

export const getErrorIdFromValidityError = (errorPath: string): string => {
    switch (errorPath) {
        case 'ageRange':
            return 'age-range-required';
        case 'proof':
            return 'proof-required';
        case 'ageRangeMin':
            return 'age-range-min';
        case 'ageRangeMax':
            return 'age-range-max';
        case 'proofDocuments':
            return 'membership-card';
        case 'minNumber':
            return 'min-number-of-passengers';
        case 'maxNumber':
            return 'max-number-of-passengers';
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
        const { passengerType, passengerTypeName } = req.body;
        const passengerInfo = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
        const groupPassengerTypes = getSessionAttribute(req, GROUP_PASSENGER_TYPES_ATTRIBUTE);
        const groupSize = getSessionAttribute(req, GROUP_SIZE_ATTRIBUTE);
        const group =
            !!groupPassengerTypes &&
            !!groupSize &&
            !isPassengerTypeAttributeWithErrors(passengerInfo) &&
            passengerInfo?.passengerType === 'group';

        if (!req.body) {
            throw new Error('Could not extract the relevant data from the request.');
        }

        let errors: ErrorInfo[] = [];

        const filteredReqBody = formatRequestBody(req);

        if (group && !!groupPassengerTypes && !!groupSize) {
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
            }));
        }

        if (errors.length === 0) {
            const noc = getAndValidateNoc(req, res);
            if (!group) {
                const filteredPassengerType = { passengerType, ...filteredReqBody };
                updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, filteredPassengerType);
                updateSessionAttribute(req, DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);

                await upsertPassengerType(noc, filteredPassengerType, filteredPassengerType.passengerType);

                const redirectLocation = getPassengerTypeRedirectLocation(req, passengerType);
                redirectTo(res, redirectLocation);
                return;
            }

            const selectedPassengerTypes = getSessionAttribute(req, GROUP_PASSENGER_TYPES_ATTRIBUTE);
            const submittedPassengerType = passengerType;

            if (selectedPassengerTypes) {
                const index = (selectedPassengerTypes as GroupPassengerTypesCollection).passengerTypes.findIndex(
                    type => type === filteredReqBody.groupPassengerType,
                );

                const { ageRangeMin, ageRangeMax, proofDocuments } = filteredReqBody;
                const { minNumber, maxNumber } = req.body;

                const sessionGroup = getSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE);

                const companions: CompanionInfo[] = [];

                if (sessionGroup) {
                    sessionGroup.forEach(companion => {
                        companions.push(companion);
                    });
                }

                const companionToAdd: CompanionInfo = {
                    minNumber,
                    maxNumber,
                    passengerType: submittedPassengerType,
                };

                if (filteredReqBody.ageRange === 'Yes') {
                    companionToAdd.ageRangeMax = ageRangeMax;
                    companionToAdd.ageRangeMin = ageRangeMin;
                }

                if (filteredReqBody.proof === 'Yes') {
                    companionToAdd.proofDocuments = proofDocuments;
                }

                companions[index] = companionToAdd;

                updateSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE, companions);
                updateSessionAttribute(req, DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, undefined);

                if (index < (selectedPassengerTypes as GroupPassengerTypesCollection).passengerTypes.length - 1) {
                    redirectTo(
                        res,
                        `/definePassengerType?groupPassengerType=${
                            (selectedPassengerTypes as GroupPassengerTypesCollection).passengerTypes[index + 1]
                        }`,
                    );
                    return;
                }

                const trimmedName = removeExcessWhiteSpace(passengerTypeName);
                if (trimmedName) {
                    const existingType = await getPassengerTypeByNameAndNocCode(noc, trimmedName, true);

                    if (existingType) {
                        errors.push({
                            errorMessage: `You already have a passenger type named ${trimmedName}. Choose another name.`,
                            id: 'passenger-type-name',
                            userInput: trimmedName,
                        });
                    } else {
                        await insertPassengerType(noc, companions, trimmedName, true);
                    }
                }

                if (!errors.length) {
                    redirectTo(res, '/defineTimeRestrictions');
                    return;
                }
            }
        }

        const sessionInfo: DefinePassengerTypeWithErrors = {
            errors,
            passengerType,
            maxNumber: filteredReqBody.maxNumber || '',
            ...(filteredReqBody.ageRangeMin && { ageRangeMin: filteredReqBody.ageRangeMin }),
            ...(filteredReqBody.ageRangeMax && { ageRangeMax: filteredReqBody.ageRangeMax }),
            ...(filteredReqBody.minNumber && { minNumber: filteredReqBody.minNumber }),
            ...(filteredReqBody.proofDocuments && { proofDocuments: filteredReqBody.proofDocuments }),
        };

        updateSessionAttribute(req, DEFINE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, sessionInfo);

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
