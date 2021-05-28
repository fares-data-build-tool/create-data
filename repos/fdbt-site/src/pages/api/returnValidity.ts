import { NextApiResponse } from 'next';
import * as yup from 'yup';
import { redirectToError, redirectTo } from './apiUtils/index';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';
import { RETURN_VALIDITY_ATTRIBUTE } from '../../constants/attributes';

const radioButtonError = 'Choose one of the options below';
const textInputError = 'Enter a whole number greater than zero';
const selectInputError = 'Choose one of the options from the dropdown list';

export const returnValiditySchema = yup
    .object({
        validity: yup
            .string()
            .oneOf(['Yes', 'No'])
            .required(radioButtonError),
        amount: yup
            .mixed()
            .when('validity', {
                is: 'No',
                then: yup.string().notRequired(),
            })
            .when('validity', {
                is: 'Yes',
                then: yup
                    .number()
                    .typeError(textInputError)
                    .when('duration', {
                        is: 'day',
                        then: yup
                            .number()
                            .typeError(textInputError)
                            .integer(textInputError)
                            .min(1, textInputError)
                            .max(365, textInputError),
                    })
                    .when('duration', {
                        is: 'week',
                        then: yup
                            .number()
                            .typeError(textInputError)
                            .integer(textInputError)
                            .min(1, textInputError)
                            .max(260, textInputError),
                    })
                    .when('duration', {
                        is: 'month',
                        then: yup
                            .number()
                            .typeError(textInputError)
                            .integer(textInputError)
                            .min(1, textInputError)
                            .max(120, textInputError),
                    })
                    .when('duration', {
                        is: 'year',
                        then: yup
                            .number()
                            .typeError(textInputError)
                            .integer(textInputError)
                            .min(1, textInputError),
                    })
                    .required(textInputError),
            }),
        duration: yup.string().when('validity', {
            is: 'Yes',
            then: yup
                .string()
                .oneOf(['day', 'week', 'month', 'year'], selectInputError)
                .required(selectInputError),
        }),
    })
    .required();

export const formatRequestBody = (req: NextApiRequestWithSession): { [key: string]: string } => {
    const filteredReqBody: { [key: string]: string } = {};
    Object.entries(req.body).forEach(entry => {
        if (entry[0] === 'amount') {
            const input = entry[1] as string;
            const strippedInput = input.replace(/\s+/g, '');
            if (strippedInput === '') {
                return;
            }
            filteredReqBody[entry[0]] = strippedInput;
            return;
        }
        filteredReqBody[entry[0]] = entry[1] as string;
    });
    return filteredReqBody;
};

export const getErrorIdFromValidityError = (errorPath: string): string => {
    switch (errorPath) {
        case 'validity':
            return 'return-validity-defined';
        case 'amount':
            return 'return-validity-amount';
        case 'duration':
            return 'return-validity-units';
        default:
            throw new Error(`Could not match the following error with an expected input. Error path: ${errorPath}.`);
    }
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { amount, duration, validity } = req.body;

        if (validity === 'No') {
            updateSessionAttribute(req, RETURN_VALIDITY_ATTRIBUTE, undefined);
            redirectTo(res, '/ticketConfirmation');
            return;
        }

        const filteredReqBody = formatRequestBody(req);

        let errors: ErrorInfo[] = [];

        try {
            await returnValiditySchema.validate(filteredReqBody, { abortEarly: false });
        } catch (validationErrors) {
            const validityErrors: yup.ValidationError = validationErrors;
            errors = validityErrors.inner.map(error => ({
                id: getErrorIdFromValidityError(error.path),
                errorMessage: error.message,
                userInput: String(error.value),
            }));
        }

        if (errors.length > 0) {
            updateSessionAttribute(req, RETURN_VALIDITY_ATTRIBUTE, { amount, typeOfDuration: duration, errors });
            redirectTo(res, '/returnValidity');
            return;
        }

        updateSessionAttribute(req, RETURN_VALIDITY_ATTRIBUTE, { amount, typeOfDuration: duration });
        redirectTo(res, '/ticketConfirmation');
    } catch (error) {
        const message = 'There was a problem in the returnValidity API.';
        redirectToError(res, message, 'api.returnValidity', error);
    }
};
