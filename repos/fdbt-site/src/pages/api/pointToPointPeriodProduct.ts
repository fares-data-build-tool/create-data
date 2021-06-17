import { NextApiResponse } from 'next';
import { POINT_TO_POINT_PRODUCT_ATTRIBUTE } from 'src/constants/attributes';
import { updateSessionAttribute } from 'src/utils/sessions';
import { ErrorInfo, NextApiRequestWithSession, PointToPointPeriodProduct } from '../../interfaces';
import { redirectTo, redirectToError } from './apiUtils';
import { checkDurationIsValid, checkProductNameIsValid, isValidInputDuration } from './apiUtils/validator';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        console.log(req.body);

        const { productNameInput, productDuration, durationUnits } = req.body;
        const pointToPointPeriodProduct: PointToPointPeriodProduct = {
            productName: productNameInput,
            productDuration: productDuration,
            productDurationUnits: durationUnits,
        };

        const nameCheckError = checkProductNameIsValid(productNameInput);
        const productDurationUnitsCheckError = !isValidInputDuration(durationUnits, true)
            ? 'Select a valid expiry unit'
            : '';
        let durationCheckError = '';
        if (durationUnits !== 'no expiry') {
            durationCheckError = checkDurationIsValid(productDuration);
        }

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
            updateSessionAttribute(req, POINT_TO_POINT_PRODUCT_ATTRIBUTE, {
                errors,
                ...pointToPointPeriodProduct,
            });
            redirectTo(res, '/pointToPointPeriodProduct');
        }
        updateSessionAttribute(req, POINT_TO_POINT_PRODUCT_ATTRIBUTE, pointToPointPeriodProduct);
        redirectTo(res, '/periodValidity');
    } catch (error) {
        const message = 'There was a problem processing the product details.';
        redirectToError(res, message, 'api.pointToPointPeriodProduct', error);
    }
};
