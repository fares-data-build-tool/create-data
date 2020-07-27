import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { ErrorSummary } from '../../components/ErrorSummary';
import { MULTIPLE_PRODUCT_COOKIE, NUMBER_OF_PRODUCTS_COOKIE } from '../../constants/index';
import { redirectToError, setCookieOnResponseObject, redirectTo, unescapeAndDecodeCookie } from './apiUtils';
import {
    isSessionValid,
    removeExcessWhiteSpace,
    checkProductNameIsValid,
    checkPriceIsValid,
    checkDurationIsValid,
} from './apiUtils/validator';

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

export const getErrorsForCookie = (validationResult: MultiProduct[]): ErrorSummary => {
    const errorsForCookie: ErrorSummary = {
        errors: [],
    };

    validationResult.forEach(product => {
        if (product.productDurationError) {
            errorsForCookie.errors.push({
                errorMessage: product.productDurationError,
                id: product.productDurationId,
            });
        }
        if (product.productNameError) {
            errorsForCookie.errors.push({
                errorMessage: product.productNameError,
                id: product.productNameId,
            });
        }
        if (product.productPriceError) {
            errorsForCookie.errors.push({
                errorMessage: product.productPriceError,
                id: product.productPriceId,
            });
        }
    });

    return errorsForCookie;
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
    const productsWithErrors: MultiProduct[] = products.map(product => {
        const { productName } = product;
        const trimmedProductName = removeExcessWhiteSpace(productName);
        const productNameError = checkProductNameIsValid(trimmedProductName);

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

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }
        const cookies = new Cookies(req, res);
        const numberOfProductsCookie = unescapeAndDecodeCookie(cookies, NUMBER_OF_PRODUCTS_COOKIE);
        const numberOfProducts: string = JSON.parse(numberOfProductsCookie).numberOfProductsInput;
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
            const productNameId = `multiple-product-name-input-${count}`;
            const productPriceId = `multiple-product-price-input-${count}`;
            const productDurationId = `multiple-product-duration-input-${count}`;
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
            const errors: ErrorSummary = getErrorsForCookie(fullValidationResult);
            const cookieContent = JSON.stringify({ ...errors, userInput: multipleProducts });

            setCookieOnResponseObject(MULTIPLE_PRODUCT_COOKIE, cookieContent, req, res);
            redirectTo(res, '/multipleProducts');
            return;
        }

        const validInputs = JSON.stringify(multipleProducts);

        setCookieOnResponseObject(MULTIPLE_PRODUCT_COOKIE, validInputs, req, res);

        redirectTo(res, '/multipleProductValidity');
    } catch (error) {
        const message = 'There was a problem inputting the product name, price and/or duration:';
        redirectToError(res, message, 'api.multipleProducts', error);
    }
};
