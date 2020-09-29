import { NextApiResponse } from 'next';
import { redirectTo, redirectToError } from './apiUtils';
import { ProductInfo, ErrorInfo, NextApiRequestWithSession, Product, ProductData } from '../../interfaces';
import { PRODUCT_DETAILS_ATTRIBUTE, FARE_TYPE_ATTRIBUTE, MULTIPLE_PRODUCT_ATTRIBUTE } from '../../constants';
import {
    isSessionValid,
    removeExcessWhiteSpace,
    checkPriceIsValid,
    checkProductNameIsValid,
} from './apiUtils/validator';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { isFareType } from '../../interfaces/typeGuards';

const getProductDetails = (productDetailsNameInput: string, productDetailsPriceInput: string): ProductInfo => {
    const cleanedNameInput = removeExcessWhiteSpace(productDetailsNameInput);
    const cleanedPriceInput = removeExcessWhiteSpace(productDetailsPriceInput);

    return {
        productName: cleanedNameInput,
        productPrice: cleanedPriceInput,
    };
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const errors: ErrorInfo[] = [];

    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }
        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
        if (
            !fareTypeAttribute ||
            (isFareType(fareTypeAttribute) &&
                fareTypeAttribute.fareType !== 'period' &&
                fareTypeAttribute.fareType !== 'flatFare')
        ) {
            throw new Error('Failed to retrieve FARE_TYPE_ATTRIBUTE info for productDetails API');
        }
        const { productDetailsNameInput, productDetailsPriceInput } = req.body;
        const productDetails = getProductDetails(productDetailsNameInput, productDetailsPriceInput);
        const productNameError = checkProductNameIsValid(productDetails.productName);
        if (productNameError) {
            errors.push({
                errorMessage: productNameError,
                id: 'product-details-name',
            });
        }
        const productPriceError = checkPriceIsValid(productDetails.productPrice);
        if (productPriceError) {
            errors.push({
                errorMessage: productPriceError,
                id: 'product-details-price',
            });
        }

        if (errors.length) {
            const invalidInputs = { ...productDetails, errors };
            updateSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE, invalidInputs);
            redirectTo(res, '/productDetails');
            return;
        }

        updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, undefined);

        if (isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'period') {
            const periodProduct: Product = {
                productName: productDetails.productName,
                productPrice: productDetails.productPrice,
            };
            updateSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE, periodProduct);
            redirectTo(res, '/chooseValidity');

            return;
        }
        const flatFareProduct: ProductData = {
            products: [{ productName: productDetails.productName, productPrice: productDetails.productPrice }],
        };
        updateSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE, flatFareProduct);
        redirectTo(res, '/ticketConfirmation');
        return;
    } catch (error) {
        const message = 'There was a problem processing the product details.';
        redirectToError(res, message, 'api.productDetails', error);
    }
};
