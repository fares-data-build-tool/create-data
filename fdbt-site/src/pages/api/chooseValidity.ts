import { NextApiResponse } from 'next';
import { NextApiRequestWithSession, ErrorInfo } from '../../interfaces/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { DURATION_VALID_ATTRIBUTE } from '../../constants/index';
import { redirectToError, redirectTo } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';

export const isInvalidValidityNumber = (validityInput: number): boolean => {
    if (Number.isNaN(validityInput)) {
        return true;
    }

    if (!Number.isInteger(Number(validityInput))) {
        return true;
    }

    if (validityInput > 1000 || validityInput < 1) {
        return true;
    }

    return false;
};

export const isInvalidInput = (validityInput: string): boolean => {
    if (!validityInput || validityInput === '0' || isInvalidValidityNumber(Number(validityInput))) {
        return true;
    }
    return false;
};

export const isValidInputDuration = (durationInput: string): boolean =>
    ['day', 'week', 'month', 'year'].includes(durationInput);

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const { validityInput, duration } = req.body;
        const errorInfo: ErrorInfo[] = [];

        if (isInvalidInput(validityInput)) {
            errorInfo.push({
                errorMessage:
                    'The amount of time your product is valid for has to be a whole number between 1 and 1000.',
                id: 'validity',
            });
        }

        if (!duration || !isValidInputDuration(duration)) {
            errorInfo.push({
                errorMessage: 'The type of duration is needed. Choose one of the options.',
                id: 'validity-units',
            });
        }
        updateSessionAttribute(req, DURATION_VALID_ATTRIBUTE, {
            amount: validityInput ?? '',
            duration: duration ?? '',
            errors: errorInfo,
        });
        if (errorInfo.length > 0) {
            redirectTo(res, '/chooseValidity');
            return;
        }

        redirectTo(res, '/periodValidity');
    } catch (error) {
        const message = 'There was a problem inputting the amount of time the product is valid for:';
        redirectToError(res, message, 'api.chooseValidity', error);
    }
};
