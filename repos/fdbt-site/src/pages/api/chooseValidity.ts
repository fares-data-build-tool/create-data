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

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (req.body.validityInput === 0) {
            redirectToError(res);
            return;
        }

        if (!req.body.validityInput) {
            redirectTo(res, '/chooseValidity');
            return;
        }

        if (isInvalidValidityNumber(req)) {
            redirectToError(res);
            return;
        }
        const numberOfDaysValidFor = req.body.validityInput;
        const cookieValue = JSON.stringify({ daysValid: numberOfDaysValidFor });
        setCookieOnResponseObject(getDomain(req), VALIDITY_COOKIE, cookieValue, req, res);
        redirectTo(res, '/periodValidity');
    } catch (error) {
        redirectToError(res);
    }
};
