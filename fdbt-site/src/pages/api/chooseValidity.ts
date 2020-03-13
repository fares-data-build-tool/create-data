import { NextApiRequest, NextApiResponse } from 'next';
import { VALIDITY_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';

export const isInvalidValidityNumber = (req: NextApiRequest): boolean => {
    const { validityInput } = req.body;

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(validityInput)) {
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
    if (error === '') {
        const daysValid = req.body.validityInput;
        const cookieValue = JSON.stringify({ daysValid });
        setCookieOnResponseObject(getDomain(req), VALIDITY_COOKIE, cookieValue, req, res);
        return;
    }

    const daysValid = req.body.validityInput;
    const cookieValue = JSON.stringify({ daysValid, error });
    setCookieOnResponseObject(getDomain(req), VALIDITY_COOKIE, cookieValue, req, res);
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (req.body.validityInput === '0') {
            setCookie(req, res, 'The value of days your product is valid for cannot be 0.');
            redirectTo(res, '/chooseValidity');
            return;
        }

        if (!req.body.validityInput) {
            setCookie(req, res, 'The value of days your product is valid for cannot be empty.');
            redirectTo(res, '/chooseValidity');
            return;
        }

        if (isInvalidValidityNumber(req)) {
            setCookie(
                req,
                res,
                'The value of days your product is valid for has to be a whole number between 1 and 366.',
            );
            redirectTo(res, '/chooseValidity');
            return;
        }

        setCookie(req, res);
        redirectTo(res, '/periodValidity');
    } catch (error) {
        redirectToError(res);
    }
};
