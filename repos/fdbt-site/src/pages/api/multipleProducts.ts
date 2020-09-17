import { NextApiResponse } from 'next';
import {
    MULTIPLE_PRODUCT_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
} from '../../constants/index';
import { redirectToError, redirectTo } from './apiUtils';

import {
    isSessionValid,
    removeExcessWhiteSpace,
    checkProductNameIsValid,
    checkPriceIsValid,
    checkDurationIsValid,
} from './apiUtils/validator';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute, getSessionAttribute } from '../../utils/sessions';
import { isNumberOfProductsAttribute } from '../howManyProducts';

export interface BaseMultipleProductAttribute {
    products: MultiProduct[];
}

export interface BaseMultipleProductAttributeWithErrors {
    products: MultiProduct[];
    errors: ErrorInfo[];
}

export interface MultiProduct {
    productName: string;
    productNameId: string;
    productNameError?: string;
    productPrice: string;
    productPriceId: string;
    productPriceError?: string;
    productDuration: string;
    productDurationId: string;
    productDurationError?: string;
}

export const getErrorsForCookie = (validationResult: MultiProduct[]): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];

    validationResult.forEach(product => {
        if (product.productDurationError) {
            errors.push({
                errorMessage: product.productDurationError,
                id: product.productDurationId,
            });
        }
        if (product.productNameError) {
            errors.push({
                errorMessage: product.productNameError,
                id: product.productNameId,
            });
        }
        if (product.productPriceError) {
            errors.push({
                errorMessage: product.productPriceError,
                id: product.productPriceId,
            });
        }
    });

    return errors;
};

export const containsErrors = (products: MultiProduct[]): boolean => {
    return products.some(
        product => product.productNameError || product.productPriceError || product.productDurationError,
    );
};

export const checkProductDurationsAreValid = (products: MultiProduct[]): MultiProduct[] => {
    const productsWithErrors: MultiProduct[] = products.map(product => {
        const { productDuration } = product;
        const trimmedDuration = removeExcessWhiteSpace(productDuration);
        const productDurationError = checkDurationIsValid(trimmedDuration);

        if (productDurationError) {
            return {
                ...product,
                productDurationError,
            };
        }

        return product;
    });

    return productsWithErrors;
};

export const checkProductPricesAreValid = (products: MultiProduct[]): MultiProduct[] => {
    const productsWithErrors: MultiProduct[] = products.map(product => {
        const { productPrice } = product;
        const trimmedPrice = removeExcessWhiteSpace(productPrice);
        const productPriceError = checkPriceIsValid(trimmedPrice);

        if (productPriceError) {
            return {
                ...product,
                productPriceError,
            };
        }

        return product;
    });

    return productsWithErrors;
};

export const checkProductNamesAreValid = (products: MultiProduct[]): MultiProduct[] => {
    const productNames = products.map(product => product.productName);

    const productsWithErrors: MultiProduct[] = products.map(product => {
        const { productName } = product;
        const trimmedProductName = removeExcessWhiteSpace(productName);
        const duplicateError =
            productNames.filter(item => item === productName).length > 1 ? 'Product names must be unique' : '';
        const productNameError = checkProductNameIsValid(trimmedProductName) || duplicateError;

        if (productNameError) {
            return {
                ...product,
                productNameError,
            };
        }

        return product;
    });

    return productsWithErrors;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }
        const numberOfProductsAtribute = getSessionAttribute(req, NUMBER_OF_PRODUCTS_ATTRIBUTE);
        const numberOfProducts: string = isNumberOfProductsAttribute(numberOfProductsAtribute)
            ? numberOfProductsAtribute.numberOfProductsInput
            : '';
        const numberOfReceivedProducts: number = Object.entries(req.body).length / 3;

        if (Number(numberOfProducts) !== numberOfReceivedProducts) {
            throw new Error('Number of products received does not match number given in cookie.');
        }
        const arrayedRequest = Object.entries(req.body);
        const multipleProducts: MultiProduct[] = [];

        let count = 0;

        while (arrayedRequest.length > 0) {
            const productName = String(arrayedRequest[0][1]);
            const productPrice = String(arrayedRequest[1][1]);
            const productDuration = String(arrayedRequest[2][1]);
            const productNameId = `multiple-product-name-${count}`;
            const productPriceId = `multiple-product-price-${count}`;
            const productDurationId = `multiple-product-duration-${count}`;
            const product: MultiProduct = {
                productName,
                productNameId,
                productPrice,
                productPriceId,
                productDuration,
                productDurationId,
            };
            multipleProducts.push(product);
            arrayedRequest.splice(0, 3);

            count += 1;
        }

        const nameValidationResult: MultiProduct[] = checkProductNamesAreValid(multipleProducts);
        const priceValidationResult: MultiProduct[] = checkProductPricesAreValid(nameValidationResult);
        const fullValidationResult: MultiProduct[] = checkProductDurationsAreValid(priceValidationResult);

        if (containsErrors(fullValidationResult)) {
            const errors: ErrorInfo[] = getErrorsForCookie(fullValidationResult);
            updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, { errors, products: multipleProducts });
            redirectTo(res, '/multipleProducts');
            return;
        }

        updateSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE, undefined);
        updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, { products: multipleProducts });
        redirectTo(res, '/multipleProductValidity');
    } catch (error) {
        const message = 'There was a problem inputting the product name, price and/or duration:';
        redirectToError(res, message, 'api.multipleProducts', error);
    }
};
