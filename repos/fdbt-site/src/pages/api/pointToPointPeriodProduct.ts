import { NextApiResponse } from 'next';
import { MULTIPLE_PRODUCT_ATTRIBUTE } from 'src/constants/attributes';
import { updateSessionAttribute } from 'src/utils/sessions';
import { ErrorInfo, MultiProduct, NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError } from './apiUtils';
import { checkDurationIsValid, checkDurationUnitsIsValid, checkProductNameIsValid } from './apiUtils/validator';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        console.log(req.body);

        const { productNameInput, productDuration, durationUnits } = req.body;
        const multipleProducts: MultiProduct[] = [
            {
                productName: productNameInput,
                productNameId: 'point-to-point-period-product-name',
                productDuration: productDuration,
                productDurationId: '',
                productDurationUnits: durationUnits,
                productDurationUnitsId: 'periodUnit',
            },
        ];

        const nameCheckError = checkProductNameIsValid(productNameInput);
        const durationCheckError = checkDurationIsValid(productDuration);
        const productDurationUnitsCheckError = checkDurationUnitsIsValid(durationUnits);
        const errors: ErrorInfo[] = [];

        if (nameCheckError || durationCheckError || productDurationUnitsCheckError) {
            if (nameCheckError) {
                errors.push({
                    errorMessage: nameCheckError,
                    id: 'point-to-point-period-product-name',
                });
            }
            if (durationCheckError) {
                errors.push({
                    errorMessage: durationCheckError,
                    id: 'product-details-expiry-quantity',
                });
            }
            if (productDurationUnitsCheckError) {
                errors.push({
                    errorMessage: productDurationUnitsCheckError,
                    id: 'product-details-expiry-unit',
                });
            }
            updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, { errors, products: multipleProducts });
            redirectTo(res, '/pointToPointPeriodProduct');
        }
        updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, { products: multipleProducts });
        redirectTo(res, '/periodValidity');
    } catch (error) {
        const message = 'There was a problem processing the product details.';
        redirectToError(res, message, 'api.pointToPointPeriodProduct', error);
    }
};
