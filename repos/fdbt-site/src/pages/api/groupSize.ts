import { NextApiResponse } from 'next';
import * as yup from 'yup';
import { NextApiRequestWithSession, ErrorInfo } from '../../interfaces';
import { GROUP_SIZE } from '../../constants';
import { isSessionValid, removeAllWhiteSpace } from './apiUtils/validator';
import { redirectToError, redirectTo } from './apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';

export interface GroupTicketAttribute {
    maxGroupSize: string;
}

export interface GroupTicketAttributeWithErrors extends GroupTicketAttribute {
    errors: ErrorInfo[];
}

const wrongInputError = 'Enter a whole number between 1 and 30';

export const groupSizeSchema = yup
    .number()
    .typeError(wrongInputError)
    .integer(wrongInputError)
    .min(1, wrongInputError)
    .max(30, wrongInputError);

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const { maxGroupSize } = req.body;

        const attributeValue: GroupTicketAttribute = {
            maxGroupSize: removeAllWhiteSpace(maxGroupSize),
        };
        let errors: ErrorInfo[] = [];

        try {
            await groupSizeSchema.validate(attributeValue.maxGroupSize, { abortEarly: false });
        } catch (validationErrors) {
            const validityErrors: yup.ValidationError = validationErrors;
            errors = validityErrors.inner.map(error => {
                return {
                    id: 'max-group-size',
                    errorMessage: error.message,
                    userInput: attributeValue.maxGroupSize,
                };
            });
        }
        if (errors.length > 0) {
            const attributeValueWithErrors: GroupTicketAttributeWithErrors = {
                maxGroupSize: attributeValue.maxGroupSize,
                errors,
            };
            updateSessionAttribute(req, GROUP_SIZE, attributeValueWithErrors);
            redirectTo(res, '/groupSize');
        }
        updateSessionAttribute(req, GROUP_SIZE, attributeValue);
        redirectTo(res, '/groupPassengerTypes');
    } catch (error) {
        const message = 'There was a problem setting the total group size:';
        redirectToError(res, message, 'api.groupSize', error);
    }
};
