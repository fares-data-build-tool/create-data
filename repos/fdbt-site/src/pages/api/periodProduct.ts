import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, getUuidFromCookie, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
import { isSessionValid } from './service/validator';
import { PeriodProductType } from '../../interfaces';
import { PERIOD_PRODUCT_COOKIE } from '../../constants';
import { removeExcessWhiteSpace, checkPriceIsValid, checkProductNameIsValid } from './service/inputValidator';

export const checkIfInputInvalid = (
    periodProductNameInput: string,
    periodProductPriceInput: string,
    uuid: string,
): PeriodProductType => {
    let productNameError = '';
    let productPriceError = '';

    const cleanedNameInput = removeExcessWhiteSpace(periodProductNameInput);
    const cleanedPriceInput = removeExcessWhiteSpace(periodProductPriceInput);

    productNameError = checkProductNameIsValid(cleanedNameInput);

    productPriceError = checkPriceIsValid(cleanedPriceInput);

    return {
        uuid,
        productName: cleanedNameInput,
        productPrice: periodProductPriceInput,
        productNameError,
        productPriceError,
    };
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const uuid = getUuidFromCookie(req, res);

        const { periodProductNameInput, periodProductPriceInput } = req.body;

        const periodProduct = checkIfInputInvalid(periodProductNameInput, periodProductPriceInput, uuid);

        if (periodProduct.productNameError !== '' || periodProduct.productPriceError !== '') {
            const invalidInputs = JSON.stringify(periodProduct);

            setCookieOnResponseObject(getDomain(req), PERIOD_PRODUCT_COOKIE, invalidInputs, req, res);
            redirectTo(res, '/periodProduct');
            return;
        }

        const validInputs = JSON.stringify(periodProduct);

        setCookieOnResponseObject(getDomain(req), PERIOD_PRODUCT_COOKIE, validInputs, req, res);

        redirectTo(res, '/chooseValidity');
    } catch (error) {
        const message = 'There was a problem inputting the product name and price:';
        redirectToError(res, message, error);
    }
};
