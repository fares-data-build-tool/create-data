import { NextApiResponse } from 'next';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError } from './apiUtils';
import { checkProductNameIsValid } from './apiUtils/validator';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        console.log(req.body);

        const { productNameInput, periodQuantity, periodUnit } = req.body;

        const nameCheckError = checkProductNameIsValid(productNameInput);
        const errors: ErrorInfo[] = [];

        if (nameCheckError) {
            errors.push({
                errorMessage: nameCheckError,
                id: 'point-to-point-period-product-name',
            });
        }
        redirectTo(res, '/pointToPointPeriodProduct');
    } catch (error) {
        const message = 'There was a problem processing the product details.';
        redirectToError(res, message, 'api.pointToPointPeriodProduct', error);
    }
};
