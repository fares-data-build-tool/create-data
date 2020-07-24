import { NextApiResponse } from 'next';
import Cookies from 'cookies';
import { redirectTo, redirectToError, unescapeAndDecodeCookie, setCookieOnResponseObject } from './apiUtils';
import { isSessionValid } from './service/validator';
import { ProductInfo, NextApiRequestWithSession, ProductData, Product, ErrorInfo } from '../../interfaces';
import { PRODUCT_DETAILS_ATTRIBUTE, FARE_TYPE_COOKIE } from '../../constants';
import { removeExcessWhiteSpace, checkPriceIsValid, checkProductNameIsValid } from './service/inputValidator';
import { updateSessionAttribute } from '../../utils/sessions';

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
            throw new Error('Session is invalid.');
        }

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
        const { fareType } = JSON.parse(fareTypeCookie);

        if (!fareType || (fareType !== 'period' && fareType !== 'flatFare')) {
            throw new Error('Failed to retrieve FARE_TYPE_COOKIE info for productDetails API');
        }

        const { productDetailsNameInput, productDetailsPriceInput } = req.body;

        const productDetails = getProductDetails(productDetailsNameInput, productDetailsPriceInput);

        const productNameError = checkProductNameIsValid(productDetails.productName);

        if (productNameError) {
            errors.push({
                errorMessage: productNameError,
                id: 'product-name-error',
            });
        }

        const productPriceError = checkPriceIsValid(productDetails.productPrice);

        if (productPriceError) {
            errors.push({
                errorMessage: productPriceError,
                id: 'product-price-error',
            });
        }

        if (errors.length) {
            const invalidInputs = { ...productDetails, errors };

            updateSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE, invalidInputs);
            redirectTo(res, '/productDetails');
            return;
        }

        if (fareType === 'period') {
            const periodProduct: Product = {
                productName: productDetails.productName,
                productPrice: productDetails.productPrice,
            };
            setCookieOnResponseObject(PRODUCT_DETAILS_ATTRIBUTE, JSON.stringify(periodProduct), req, res);
            redirectTo(res, '/chooseValidity');
        }

        const flatFareProduct: ProductData = {
            products: [{ productName: productDetails.productName, productPrice: productDetails.productPrice }],
        };
        updateSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE, flatFareProduct);
        redirectTo(res, '/selectSalesOfferPackage');
        return;
    } catch (error) {
        const message = 'There was a problem processing the product details.';
        redirectToError(res, message, error);
    }
};
