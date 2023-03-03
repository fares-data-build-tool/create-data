import { NextApiResponse } from 'next';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { FARE_TYPE_ATTRIBUTE, POINT_TO_POINT_PRODUCT_ATTRIBUTE } from '../../constants/attributes';
import {
    checkDurationIsValid,
    checkProductOrCapNameIsValid,
    isValidInputDuration,
    removeExcessWhiteSpace,
} from '../../utils/apiUtils/validator';
import { PointToPointPeriodProduct } from '../../interfaces/matchingJsonTypes';
import { isWithErrors } from '../../interfaces/typeGuards';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { productNameInput, productDuration, durationUnits } = req.body;
        const whiteSpaceCleansedNameInput = removeExcessWhiteSpace(productNameInput);
        const whiteSpaceCleansedDurationInput = removeExcessWhiteSpace(productDuration);
        const pointToPointPeriodProduct: PointToPointPeriodProduct = {
            productName: whiteSpaceCleansedNameInput,
            productDuration: whiteSpaceCleansedDurationInput,
            productDurationUnits: durationUnits,
        };

        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
        const school =
            fareTypeAttribute && !isWithErrors(fareTypeAttribute) && fareTypeAttribute.fareType === 'schoolService';
        const nameCheckError = checkProductOrCapNameIsValid(whiteSpaceCleansedNameInput, 'product');
        const productDurationUnitsCheckError = !isValidInputDuration(durationUnits, true, school)
            ? 'Select a valid expiry unit'
            : '';
        let durationCheckError = '';
        if (durationUnits !== 'no expiry') {
            durationCheckError = checkDurationIsValid(whiteSpaceCleansedDurationInput, 'product');
        }

        const errors: ErrorInfo[] = [];

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

        if (errors.length > 0) {
            updateSessionAttribute(req, POINT_TO_POINT_PRODUCT_ATTRIBUTE, {
                errors,
                ...pointToPointPeriodProduct,
            });
            redirectTo(res, '/pointToPointPeriodProduct');
        }

        updateSessionAttribute(req, POINT_TO_POINT_PRODUCT_ATTRIBUTE, pointToPointPeriodProduct);

        redirectTo(res, '/selectPeriodValidity');
    } catch (error) {
        const message = 'There was a problem processing the product details.';
        redirectToError(res, message, 'api.pointToPointPeriodProduct', error);
    }
};
