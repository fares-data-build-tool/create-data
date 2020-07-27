import { NextApiRequest, NextApiResponse } from 'next';
import { DAYS_VALID_COOKIE } from '../../constants/index';
import { setCookieOnResponseObject, redirectToError, redirectTo, getUuidFromCookie } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { ErrorInfo } from '../../interfaces';

export const isInvalidValidityNumber = (req: NextApiRequest): boolean => {
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

export const setCookie = (req: NextApiRequest, res: NextApiResponse, error = ''): void => {
    const daysValid = req.body.validityInput;

    if (error) {
        const errorInfo: ErrorInfo = {
            errorMessage: error,
            id: 'validity-error',
        };
        const cookieValue = JSON.stringify({ daysValid, error: errorInfo });
        setCookieOnResponseObject(DAYS_VALID_COOKIE, cookieValue, req, res);
        redirectTo(res, '/chooseValidity');
        return;
    }

    const uuid = getUuidFromCookie(req, res);
    const cookieValue = JSON.stringify({ daysValid, uuid });
    setCookieOnResponseObject(DAYS_VALID_COOKIE, cookieValue, req, res);
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        if (req.body.validityInput === '0') {
            setCookie(req, res, 'The value of days your product is valid for cannot be 0.');
            return;
        }

        if (!req.body.validityInput) {
            setCookie(req, res, 'The value of days your product is valid for cannot be empty.');
            return;
        }

        if (isInvalidValidityNumber(req)) {
            setCookie(
                req,
                res,
                'The value of days your product is valid for has to be a whole number between 1 and 366.',
            );
            return;
        }

        setCookie(req, res);
        redirectTo(res, '/periodValidity');
    } catch (error) {
        const message = 'There was a problem inputting the number of days the product is valid for:';
        redirectToError(res, message, 'api.chooseValidity', error);
    }
};
