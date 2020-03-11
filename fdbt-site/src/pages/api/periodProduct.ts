import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
import { isSessionValid } from './service/validator';
import { PeriodProductType } from '../../interfaces';
import { PERIOD_PRODUCT } from '../../constants/index';

const setPeriodProduct = (periodProductNameInput: string, periodProductPriceInput: string) => ({
    productNameError: periodProductNameInput === '',
    productPriceError: periodProductPriceInput === '' || !(Number(periodProductPriceInput) > 0),
    productName: periodProductNameInput.replace(/\s+/g, ''),
    productPrice: periodProductPriceInput,
});

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            redirectToError(res);
            return;
        }

        const requestBody = JSON.stringify(req.body);
        const parsedBody = JSON.parse(requestBody);

        const { periodProductNameInput, periodProductPriceInput } = parsedBody;

        if (
            periodProductNameInput === '' ||
            periodProductPriceInput === '' ||
            // eslint-disable-next-line no-restricted-globals
            isNaN(periodProductPriceInput) ||
            !Number.isInteger(Number(periodProductPriceInput))
        ) {
            const validation: PeriodProductType = setPeriodProduct(periodProductNameInput, periodProductPriceInput);

            const validInputs = JSON.stringify(validation);

            setCookieOnResponseObject(getDomain(req), PERIOD_PRODUCT, validInputs, req, res);
            redirectTo(res, '/periodProduct');
            return;
        }

        const inputProductValues: PeriodProductType = setPeriodProduct(periodProductNameInput, periodProductPriceInput);

        setCookieOnResponseObject(getDomain(req), PERIOD_PRODUCT, JSON.stringify(inputProductValues), req, res);

        redirectTo(res, '/chooseValidity');
    } catch (error) {
        redirectToError(res);
    }
};
