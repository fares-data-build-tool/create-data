import { NextApiResponse } from 'next';
import { NextApiRequestWithSession, ErrorInfo } from '../../interfaces/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { DAYS_VALID_ATTRIBUTE } from '../../constants/index';
import { redirectToError, redirectTo } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';

export const isInvalidValidityNumber = (req: NextApiRequestWithSession): boolean => {
    const { validityInput } = req.body;

    if (Number.isNaN(validityInput)) {
        return true;
    }

    if (!Number.isInteger(Number(validityInput))) {
        return true;
    }

    if (validityInput > 366 || validityInput < 1) {
        return true;
    }

    return false;
};

export const setSession = (req: NextApiRequestWithSession, res: NextApiResponse, error = ''): void => {
    const daysValid = req.body.validityInput;

    if (error) {
        const errorInfo: ErrorInfo[] = [
            {
                errorMessage: error,
                id: 'validity',
            },
        ];
        updateSessionAttribute(req, DAYS_VALID_ATTRIBUTE, { daysValid, errors: errorInfo });
        redirectTo(res, '/chooseValidity');
        return;
    }
    updateSessionAttribute(req, DAYS_VALID_ATTRIBUTE, { daysValid, errors: [] });
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        if (req.body.validityInput === '0') {
            setSession(req, res, 'The value of days your product is valid for cannot be 0.');
            return;
        }

        if (!req.body.validityInput) {
            setSession(req, res, 'The value of days your product is valid for cannot be empty.');
            return;
        }

        if (isInvalidValidityNumber(req)) {
            setSession(
                req,
                res,
                'The value of days your product is valid for has to be a whole number between 1 and 366.',
            );
            return;
        }

        setSession(req, res);
        redirectTo(res, '/periodValidity');
    } catch (error) {
        const message = 'There was a problem inputting the number of days the product is valid for:';
        redirectToError(res, message, 'api.chooseValidity', error);
    }
};
