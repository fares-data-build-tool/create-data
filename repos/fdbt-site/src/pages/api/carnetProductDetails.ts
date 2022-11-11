import { NextApiResponse } from 'next';
import { getFareTypeFromFromAttributes, redirectTo, redirectToError } from '../../utils/apiUtils';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { MULTIPLE_PRODUCT_ATTRIBUTE, CARNET_PRODUCT_DETAILS_ATTRIBUTE } from '../../constants/attributes';
import {
    removeExcessWhiteSpace,
    checkIntegerIsValid,
    checkProductNameIsValid,
    isValidInputDuration,
} from '../../utils/apiUtils/validator';
import { updateSessionAttribute } from '../../utils/sessions';
import { CarnetProductInfo, CarnetExpiryUnit } from '../../interfaces/matchingJsonTypes';

const getProductDetails = (req: NextApiRequestWithSession): CarnetProductInfo => {
    const productDetails = { ...req.body };

    Object.keys(req.body).forEach((k) => {
        productDetails[k] = removeExcessWhiteSpace(productDetails[k]);
    });

    return {
        productName: productDetails.productDetailsNameInput,
        carnetDetails: {
            quantity: productDetails.productDetailsQuantityInput,
            expiryTime: productDetails.productDetailsExpiryDurationInput,
            expiryUnit: productDetails.productDetailsExpiryUnitInput,
        },
    };
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const errors: ErrorInfo[] = [];

    try {
        const fareType = getFareTypeFromFromAttributes(req);

        const productDetails = getProductDetails(req);

        const productNameError = checkProductNameIsValid(productDetails.productName);
        if (productNameError) {
            errors.push({
                errorMessage: productNameError,
                id: 'product-details-name',
            });
        }

        const quantityError = checkIntegerIsValid(productDetails.carnetDetails.quantity, 'Carnet quantity', 2, 999);

        if (quantityError) {
            errors.push({
                errorMessage: quantityError,
                id: 'product-details-carnet-quantity',
            });
        }

        if (productDetails.carnetDetails.expiryUnit === CarnetExpiryUnit.NO_EXPIRY) {
            productDetails.carnetDetails.expiryTime = '';
        } else {
            const expiryTimeError = checkIntegerIsValid(productDetails.carnetDetails.expiryTime, 'Expiry time', 1, 999);

            if (expiryTimeError) {
                errors.push({
                    errorMessage: expiryTimeError,
                    id: 'product-details-carnet-expiry-quantity',
                });
            }
        }

        const expiryUnitError = !isValidInputDuration(productDetails.carnetDetails.expiryUnit, true)
            ? 'Select a valid expiry unit'
            : '';

        if (expiryUnitError) {
            errors.push({
                errorMessage: expiryUnitError,
                id: 'product-details-carnet-expiry-unit',
            });
        }

        if (errors.length) {
            const invalidInputs = { ...productDetails, errors };
            updateSessionAttribute(req, CARNET_PRODUCT_DETAILS_ATTRIBUTE, invalidInputs);
            redirectTo(res, '/carnetProductDetails');
            return;
        }

        updateSessionAttribute(req, CARNET_PRODUCT_DETAILS_ATTRIBUTE, productDetails);
        updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, undefined);

        if (fareType === 'return') {
            redirectTo(res, '/returnValidity');
            return;
        }

        redirectTo(res, '/ticketConfirmation');
    } catch (error) {
        const message = 'There was a problem processing the product details.';
        redirectToError(res, message, 'api.carnetProductDetails', error);
    }
};
