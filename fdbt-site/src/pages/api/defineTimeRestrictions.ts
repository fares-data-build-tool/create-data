import { NextApiResponse } from 'next';
import * as yup from 'yup';
import isArray from 'lodash/isArray';
import { redirectToError, redirectTo } from './apiUtils/index';
import { FARE_TYPE_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';
import { ErrorInfo, NextApiRequestWithSession, TimeRestriction } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

interface TimeRestrictionsDefinition extends TimeRestriction {
    timeRestriction?: string;
    validDaysSelected?: string;
}

export interface TimeRestrictionsDefinitionWithErrors extends TimeRestrictionsDefinition {
    errors: ErrorInfo[];
}

const radioButtonError = 'Choose one of the options below';
const startTimeRestrictionValidityError = 'Enter a start time in a valid 24 hour format between 0000 - 2300';
const entTimeRestrictionValidityError = 'Enter an end time in a valid 24 hour format between 0000 - 2300';
const daySelectionError = 'Select at least one day';
const endTimeEarlierThanStartTimeError = 'The end time cannot be earlier than the start time';
const startTimeLaterThanEndTimeError = 'The start time cannot be later than the end time';

const timeFormatRegex = new RegExp('^([2][0-3]|[0-1][0-9])[0-5][0-9]$');

const endTimeInputSchema = yup
    .number()
    .typeError(entTimeRestrictionValidityError)
    .integer(entTimeRestrictionValidityError)
    .max(2400, entTimeRestrictionValidityError);

const startTimeInputSchema = yup
    .number()
    .typeError(startTimeRestrictionValidityError)
    .integer(startTimeRestrictionValidityError)
    .min(0, startTimeRestrictionValidityError);

export const defineTimeRestrictionsSchema = yup
    .object({
        timeRestriction: yup
            .string()
            .oneOf(['Yes', 'No'])
            .required(radioButtonError),
        validDaysSelected: yup
            .string()
            .oneOf(['Yes', 'No'])
            .required(radioButtonError),
        startTime: yup.string().when('timeRestriction', {
            is: 'Yes',
            then: yup
                .string()
                .matches(timeFormatRegex, startTimeRestrictionValidityError)
                .required(startTimeRestrictionValidityError),
        }),
        endTime: yup.string().when('timeRestriction', {
            is: 'Yes',
            then: yup
                .string()
                .matches(timeFormatRegex, entTimeRestrictionValidityError)
                .required(entTimeRestrictionValidityError),
        }),
        validDays: yup
            .string()
            .when('validDaysSelected', { is: 'Yes', then: yup.string().required(daySelectionError) }),
    })
    .required();

export const timeRestrictionConditionalInputSchema = yup.object({
    startTime: yup.number().when('timeRestriction', {
        is: 'Yes',
        then: yup
            .number()
            .when('endTime', {
                is: endTimeValue => !!endTimeValue,
                then: startTimeInputSchema.max(yup.ref('endTime'), startTimeLaterThanEndTimeError),
            })
            .when('endTime', {
                is: endTimeValue => !endTimeValue,
                then: startTimeInputSchema.max(2400, startTimeRestrictionValidityError),
            })
            .required(startTimeRestrictionValidityError),
    }),
    endTime: yup.number().when('timeRestriction', {
        is: 'Yes',
        then: yup
            .number()
            .when('startTime', {
                is: startTimeValue => !!startTimeValue,
                then: endTimeInputSchema.min(yup.ref('startTime'), endTimeEarlierThanStartTimeError),
            })
            .when('startTime', {
                is: startTimeValue => !startTimeValue,
                then: endTimeInputSchema.min(0, entTimeRestrictionValidityError),
            })
            .required(entTimeRestrictionValidityError),
    }),
});

export const formatRequestBody = (req: NextApiRequestWithSession): TimeRestrictionsDefinition => {
    const filteredReqBody: { [key: string]: string | string[] } = {};
    Object.entries(req.body).forEach(entry => {
        if (entry[0] === 'startTime' || entry[0] === 'endTime') {
            const input = entry[1] as string;
            const strippedInput = input.replace(/\s+/g, '');
            if (strippedInput === '') {
                return;
            }
            filteredReqBody[entry[0]] = strippedInput;
            return;
        }
        if (entry[0] === 'validDays') {
            filteredReqBody[entry[0]] = !isArray(entry[1]) ? [entry[1] as string] : (entry[1] as string[]);
            return;
        }
        filteredReqBody[entry[0]] = entry[1] as string;
    });
    return filteredReqBody;
};

export const getErrorIdFromValidityError = (errorPath: string): string => {
    switch (errorPath) {
        case 'timeRestriction':
            return 'time-restriction-required';
        case 'validDaysSelected':
            return 'valid-days-required';
        case 'startTime':
            return 'start-time';
        case 'endTime':
            return 'end-time';
        case 'validDays':
            return 'monday';
        default:
            throw new Error(`Could not match the following error with an expected input. Error path: ${errorPath}.`);
    }
};

export const collectUniqueErrors = (initialErrors: ErrorInfo[], currentSchemaErrors: ErrorInfo[]): ErrorInfo[] => {
    let errorCollection: ErrorInfo[] = initialErrors;
    if (initialErrors.length === 0) {
        errorCollection = currentSchemaErrors;
    } else if (initialErrors.length > 0) {
        currentSchemaErrors.forEach(error => {
            if (initialErrors.find(initialError => initialError.id === error.id)) {
                return;
            }
            errorCollection.push(error);
        });
    }
    return errorCollection;
};

export const runValidationSchema = async (
    schema: yup.ObjectSchema,
    reqBody: TimeRestriction,
    initialErrors: ErrorInfo[] = [],
): Promise<ErrorInfo[]> => {
    let errors: ErrorInfo[] = [];

    try {
        await schema.validate(reqBody, { abortEarly: false });
    } catch (validationErrors) {
        const validityErrors: yup.ValidationError = validationErrors;
        errors = validityErrors.inner.map(error => ({
            id: getErrorIdFromValidityError(error.path),
            errorMessage: error.message,
        }));
    }
    const errorCollection = collectUniqueErrors(initialErrors, errors);
    return errorCollection;
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (!fareTypeAttribute) {
            throw new Error('Failed to retrieve the fareType attribute for the defineTimeRestrictions API');
        }

        const filteredReqBody = formatRequestBody(req);

        const { timeRestriction, startTime, endTime, validDaysSelected, validDays } = filteredReqBody;

        const initialErrors = await runValidationSchema(defineTimeRestrictionsSchema, filteredReqBody);
        const combinedErrors = await runValidationSchema(
            timeRestrictionConditionalInputSchema,
            filteredReqBody,
            initialErrors,
        );

        const timeRestrictionsDefinition: TimeRestriction = {
            startTime,
            endTime,
            validDays,
        };

        if (combinedErrors.length > 0) {
            const timeRestrictionsDefinitionWithErrors: TimeRestrictionsDefinitionWithErrors = {
                ...timeRestrictionsDefinition,
                timeRestriction,
                validDaysSelected,
                errors: combinedErrors,
            };
            updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, timeRestrictionsDefinitionWithErrors);
            redirectTo(res, '/defineTimeRestrictions');
            return;
        }

        updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, timeRestrictionsDefinition);
        redirectTo(res, '/fareConfirmation');
        return;
    } catch (error) {
        const message = 'There was a problem in the defineTimeRestrictions API.';
        redirectToError(res, message, 'api.defineTimeRestrictions', error);
    }
};
