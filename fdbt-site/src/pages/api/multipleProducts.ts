import { NextApiResponse } from 'next';
import { isValidInputDuration } from './chooseValidity';
import {
    MULTIPLE_PRODUCT_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
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
import { NumberOfProductsAttribute } from './howManyProducts';

export interface MultipleProductAttribute {
    products: MultiProduct[];
}

export interface MultipleProductAttributeWithErrors extends MultipleProductAttribute {
    errors: ErrorInfo[];
}

export interface MultiProduct {
    productName: string;
    productNameId: string;
    productPrice: string;
    productPriceId: string;
    productDuration: string;
    productDurationId: string;
    productDurationUnits: string;
    productDurationUnitsId: string;
    productValidity: string;
    productValidityId: string;
    productEndTime?: string;
    productEndTimeId?: string;
}

export interface MultiProductWithErrors extends MultiProduct {
    productNameError?: string;
    productPriceError?: string;
    productDurationError?: string;
    productDurationUnitsError?: string;
}

export const getErrorsForCookie = (validationResult: MultiProductWithErrors[]): ErrorInfo[] => {
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

        if (product.productDurationUnitsError) {
            errors.push({
                errorMessage: product.productDurationUnitsError,
                id: product.productDurationUnitsId,
            });
        }
    });

    return errors;
};

export const containsErrors = (products: MultiProductWithErrors[]): boolean => {
    return products.some(
        product =>
            product.productNameError ||
            product.productPriceError ||
            product.productDurationError ||
            product.productDurationUnitsError,
    );
};

export const checkProductDurationsAreValid = (products: MultiProduct[]): MultiProductWithErrors[] => {
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

export const checkProductDurationTypesAreValid = (products: MultiProduct[]): MultiProductWithErrors[] => {
    const productsWithErrors: MultiProduct[] = products.map(product => {
        const { productDurationUnits } = product;
        const productDurationUnitsError = !isValidInputDuration(productDurationUnits)
            ? 'Choose an option from the dropdown'
            : '';
        if (productDurationUnitsError) {
            return {
                ...product,
                productDurationUnitsError,
            };
        }

        return product;
    });

    return productsWithErrors;
};

export const checkProductPricesAreValid = (products: MultiProduct[]): MultiProductWithErrors[] => {
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

export const checkProductNamesAreValid = (products: MultiProduct[]): MultiProductWithErrors[] => {
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
        const numberOfProducts = Number(
            (getSessionAttribute(req, NUMBER_OF_PRODUCTS_ATTRIBUTE) as NumberOfProductsAttribute).numberOfProductsInput,
        );
        const multipleProducts: MultiProduct[] = [];
        for (let i = 0; i < numberOfProducts; i += 1) {
            const productName = req.body[`multipleProductNameInput${i}`];
            const productPrice = req.body[`multipleProductPriceInput${i}`];
            const productDuration = req.body[`multipleProductDurationInput${i}`];
            const productDurationUnits = req.body[`multipleProductDurationUnitsInput${i}`] || '';
            const productNameId = `multiple-product-name-${i}`;
            const productPriceId = `multiple-product-price-${i}`;
            const productDurationId = `multiple-product-duration-${i}`;
            const productDurationUnitsId = `multiple-product-duration-units-${i}`;
            const product: MultiProduct = {
                productName,
                productNameId,
                productPrice,
                productPriceId,
                productDuration,
                productDurationId,
                productDurationUnits,
                productDurationUnitsId,
                productValidity: '',
                productValidityId: '',
            };
            multipleProducts.push(product);
        }

        const nameValidationResult = checkProductNamesAreValid(multipleProducts);
        const priceValidationResult = checkProductPricesAreValid(nameValidationResult);
        const productDurationResult = checkProductDurationsAreValid(priceValidationResult);
        const fullValidationResult = checkProductDurationTypesAreValid(productDurationResult);

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
