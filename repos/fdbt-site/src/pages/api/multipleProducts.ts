import { NextApiResponse } from 'next';
import { isFareTypeAttributeWithErrors } from '../../interfaces/typeGuards';
import { isValidInputDuration } from './chooseValidity';
import {
    MULTIPLE_PRODUCT_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    CARNET_FARE_TYPE_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectToError, redirectTo } from './apiUtils';

import {
    removeExcessWhiteSpace,
    checkProductNameIsValid,
    checkPriceIsValid,
    checkDurationIsValid,
    checkIntegerIsValid,
} from './apiUtils/validator';
import { ErrorInfo, NextApiRequestWithSession, MultiProductWithErrors, MultiProduct } from '../../interfaces';
import { updateSessionAttribute, getSessionAttribute } from '../../utils/sessions';

export const getErrorsForSession = (validationResult: MultiProductWithErrors[]): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];

    validationResult.forEach(product => {
        if (product.productDurationError) {
            errors.push({
                errorMessage: product.productDurationError,
                id: product.productDurationId as string,
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
                id: product.productDurationUnitsId as string,
            });
        }

        if (product.productCarnetQuantityError) {
            errors.push({
                errorMessage: product.productCarnetQuantityError,
                id: product.productCarnetQuantityId as string,
            });
        }

        if (product.productCarnetExpiryDurationError) {
            errors.push({
                errorMessage: product.productCarnetExpiryDurationError,
                id: product.productCarnetExpiryDurationId as string,
            });
        }

        if (product.productCarnetExpiryUnitsError) {
            errors.push({
                errorMessage: product.productCarnetExpiryUnitsError,
                id: product.productCarnetExpiryUnitsId as string,
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
            product.productDurationUnitsError ||
            product.productCarnetQuantityError ||
            product.productCarnetExpiryDurationError ||
            product.productCarnetExpiryUnitsError,
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
        const productDurationUnitsError = !isValidInputDuration(productDurationUnits as string, false)
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

export const checkCarnetQuantitiesAreValid = (products: MultiProduct[]): MultiProductWithErrors[] => {
    const productsWithErrors: MultiProduct[] = products.map(product => {
        const { productCarnetQuantity } = product;
        const trimmedQuantity = removeExcessWhiteSpace(productCarnetQuantity);
        const quantityError = checkIntegerIsValid(trimmedQuantity, 'Quantity in bundle', 2, 999);

        if (quantityError) {
            return {
                ...product,
                productCarnetQuantityError: quantityError,
            };
        }

        return product;
    });

    return productsWithErrors;
};

export const checkCarnetExpiriesAreValid = (products: MultiProduct[]): MultiProductWithErrors[] => {
    const productsWithErrors: MultiProduct[] = products.map(product => {
        const { productCarnetExpiryDuration } = product;
        const trimmedQuantity = removeExcessWhiteSpace(productCarnetExpiryDuration);
        const expiryError = checkIntegerIsValid(trimmedQuantity, 'Carnet expiry amount', 1, 999);

        if (expiryError) {
            return {
                ...product,
                productCarnetExpiryDurationError: expiryError,
            };
        }

        return product;
    });

    return productsWithErrors;
};

export const checkCarnetExpiryUnitsAreValid = (products: MultiProduct[]): MultiProductWithErrors[] => {
    const productsWithErrors: MultiProduct[] = products.map(product => {
        const { productCarnetExpiryUnits } = product;
        const productDurationUnitsError = !isValidInputDuration(productCarnetExpiryUnits as string, true)
            ? 'Choose an option from the dropdown'
            : '';
        if (productDurationUnitsError) {
            return {
                ...product,
                productCarnetExpiryUnitsError: productDurationUnitsError,
            };
        }

        return product;
    });

    return productsWithErrors;
};

export const checkAllValidation = (
    products: MultiProduct[],
    isCarnet: boolean,
    isFlatFare: boolean,
): MultiProductWithErrors[] => {
    let validationResult = checkProductNamesAreValid(products);
    validationResult = checkProductPricesAreValid(validationResult);

    if (!isFlatFare) {
        validationResult = checkProductDurationsAreValid(validationResult);
        validationResult = checkProductDurationTypesAreValid(validationResult);
    }

    if (isCarnet) {
        validationResult = checkCarnetQuantitiesAreValid(validationResult);
        validationResult = checkCarnetExpiriesAreValid(validationResult);
        validationResult = checkCarnetExpiryUnitsAreValid(validationResult);
    }

    return validationResult;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const carnetAttribute = getSessionAttribute(req, CARNET_FARE_TYPE_ATTRIBUTE);
        const isCarnet: boolean = carnetAttribute !== undefined && !!carnetAttribute;
        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
        if (!fareTypeAttribute || isFareTypeAttributeWithErrors(fareTypeAttribute)) {
            throw new Error('Faretype attribute not found, could not ascertain fareType.');
        }
        const isFlatFare = fareTypeAttribute.fareType === 'flatFare';
        const multipleProducts: MultiProduct[] = [];
        let i = 0;
        while (req.body[`multipleProductNameInput${i}`] !== undefined) {
            const productName = req.body[`multipleProductNameInput${i}`];
            const productPrice = req.body[`multipleProductPriceInput${i}`];
            const productDuration = req.body[`multipleProductDurationInput${i}`];
            const productDurationUnits = req.body[`multipleProductDurationUnitsInput${i}`] || '';
            const productCarnetQuantity = req.body[`carnetQuantityInput${i}`];
            const productCarnetExpiryDuration = req.body[`carnetExpiryDurationInput${i}`];
            const productCarnetExpiryUnits = req.body[`carnetExpiryUnitInput${i}`] || '';
            const productNameId = `multiple-product-name-${i}`;
            const productPriceId = `multiple-product-price-${i}`;
            const productDurationId = `product-details-period-duration-quantity-${i}`;
            const productDurationUnitsId = `product-details-period-duration-unit-${i}`;
            const productCarnetQuantityId = `product-details-carnet-quantity-${i}`;
            const productCarnetExpiryDurationId = `product-details-carnet-expiry-quantity-${i}`;
            const productCarnetExpiryUnitsId = `product-details-carnet-expiry-unit-${i}`;
            let product: MultiProduct = {
                productName,
                productNameId,
                productPrice,
                productPriceId,
            };

            if (isCarnet) {
                product = {
                    ...product,
                    productCarnetQuantity,
                    productCarnetExpiryDuration,
                    productCarnetExpiryUnits,
                    productCarnetQuantityId,
                    productCarnetExpiryDurationId,
                    productCarnetExpiryUnitsId,
                };
            }

            if (!isFlatFare) {
                product = {
                    ...product,
                    productDuration,
                    productDurationId,
                    productDurationUnits,
                    productDurationUnitsId,
                };
            }
            multipleProducts.push(product);
            i += 1;
        }

        const numberOfProducts = multipleProducts.length;
        if (numberOfProducts !== 0) {
            updateSessionAttribute(req, NUMBER_OF_PRODUCTS_ATTRIBUTE, numberOfProducts);
        }
        const fullValidationResult = checkAllValidation(multipleProducts, isCarnet, isFlatFare);

        if (containsErrors(fullValidationResult)) {
            const errors: ErrorInfo[] = getErrorsForSession(fullValidationResult);
            updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, { errors, products: multipleProducts });
            redirectTo(res, '/multipleProducts');
            return;
        }
        updateSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE, undefined);
        updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, { products: multipleProducts });
        redirectTo(res, isFlatFare ? '/ticketConfirmation' : '/productValidity');
    } catch (error) {
        const message = 'There was a problem inputting the product name, price and/or duration:';
        redirectToError(res, message, 'api.multipleProducts', error);
    }
};
