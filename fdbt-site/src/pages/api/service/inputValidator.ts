export const removeExcessWhiteSpace = (input: string): string => {
    // this will remove all whitespace on the front and end of a string, and reduce internal whitespaces to one whitespace
    return input.trim().replace(/\s+/g, ' ');
};

export const isCurrency = (periodPriceInput: string): boolean => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(periodPriceInput);
};

export const checkProductNameIsValid = (inputtedProductName: string): string => {
    let productNameError;

    if (inputtedProductName.length > 50) {
        productNameError = `Product name cannot have more than 50 characters`;
    } else if (inputtedProductName.length < 2) {
        productNameError = `Product name cannot have less than 2 characters`;
    }

    if (productNameError) {
        return productNameError;
    }

    return '';
};

export const checkPriceIsValid = (inputtedPrice: string): string => {
    let productPriceError;

    if (inputtedPrice === '') {
        productPriceError = `This field cannot be empty`;
    } else if (Math.sign(Number(inputtedPrice)) === -1) {
        productPriceError = `This must be a positive number`;
    } else if (!isCurrency(inputtedPrice)) {
        productPriceError = `This must be a valid price in pounds and pence`;
    }

    if (productPriceError) {
        return productPriceError;
    }

    return '';
};

export const checkDurationIsValid = (inputtedDuration: string): string => {
    let productDurationError;

    if (inputtedDuration === '') {
        productDurationError = `This field cannot be empty`;
    } else if (Number.isNaN(Number(inputtedDuration))) {
        productDurationError = `Product duration must be a whole, positive number`;
    } else if (Number(inputtedDuration) <= 0) {
        productDurationError = `Product duration cannot be zero or a negative number`;
    }

    if (productDurationError) {
        return productDurationError;
    }

    return '';
};
