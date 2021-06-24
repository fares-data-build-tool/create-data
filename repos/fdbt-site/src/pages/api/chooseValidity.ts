import { NextApiResponse } from 'next';
import { NextApiRequestWithSession, ErrorInfo } from '../../interfaces/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { DURATION_VALID_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo } from './apiUtils';
import { isValidInput, isValidInputDuration } from './apiUtils/validator';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { validityInput, duration } = req.body;
        const errorInfo: ErrorInfo[] = [];

        if (!isValidInput(validityInput)) {
            errorInfo.push({
                errorMessage:
                    'The amount of time your product is valid for has to be a whole number between 1 and 1000.',
                id: 'validity',
            });
        }

        if (!duration || !isValidInputDuration(duration, false)) {
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
