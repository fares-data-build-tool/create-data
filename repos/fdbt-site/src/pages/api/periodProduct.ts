import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, getUuidFromCookie, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
import { isSessionValid } from './service/validator';
import { PeriodProductType } from '../../interfaces';
import { PERIOD_PRODUCT } from '../../constants';

const setPeriodProduct = (
    periodProductNameInput: string,
    periodProductPriceInput: string,
    uuid: string,
): PeriodProductType => ({
    uuid,
    productNameError: periodProductNameInput === '',
    productPriceError: periodProductPriceInput === '' || !(Number(periodProductPriceInput) > 0),
    productName: periodProductNameInput.replace(/^\s+|\s+$/g, ''),
    productPrice: periodProductPriceInput,
});

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            redirectToError(res);
            return;
        }

        const uuid = getUuidFromCookie(req, res);

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
            const validation: PeriodProductType = setPeriodProduct(
                periodProductNameInput,
                periodProductPriceInput,
                uuid,
            );

            const validInputs = JSON.stringify(validation);

            setCookieOnResponseObject(getDomain(req), PERIOD_PRODUCT, validInputs, req, res);
            redirectTo(res, '/periodProduct');
            return;
        }

        const inputProductValues: PeriodProductType = setPeriodProduct(
            periodProductNameInput,
            periodProductPriceInput,
            uuid,
        );

        setCookieOnResponseObject(getDomain(req), PERIOD_PRODUCT, JSON.stringify(inputProductValues), req, res);

        redirectTo(res, '/chooseValidity');
    } catch (error) {
        redirectToError(res);
    }
};
