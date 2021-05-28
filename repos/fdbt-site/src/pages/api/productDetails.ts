import { NextApiResponse } from 'next';
import { getFareTypeFromFromAttributes, redirectTo, redirectToError } from './apiUtils';
import { ProductInfo, ErrorInfo, NextApiRequestWithSession, Product, ProductData } from '../../interfaces';
import { PRODUCT_DETAILS_ATTRIBUTE, MULTIPLE_PRODUCT_ATTRIBUTE } from '../../constants/attributes';
import { removeExcessWhiteSpace, checkPriceIsValid, checkProductNameIsValid } from './apiUtils/validator';
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
        const fareType = getFareTypeFromFromAttributes(req);

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

        if (fareType === 'period' || fareType === 'multiOperator') {
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
