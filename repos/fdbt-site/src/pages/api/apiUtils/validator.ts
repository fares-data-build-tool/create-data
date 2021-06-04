export const removeExcessWhiteSpace = (input: undefined | string): string => {
    // this will remove all whitespace on the front and end of a string, and reduce internal whitespaces to one whitespace
    if (!input) {
        return '';
    }
    return input.trim().replace(/\s+/g, ' ');
};

export const removeAllWhiteSpace = (input: string): string => input.replace(/\s+/g, '');

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

export const checkPriceIsValid = (inputtedPrice: string | undefined): string => {
    let productPriceError;

    if (!inputtedPrice) {
        productPriceError = 'Product price cannot be empty';
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
        productDurationError = `Product duration cannot be empty`;
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

export const checkIntegerIsValid = (input: string, inputName: string, min: number, max: number): string => {
    if (input === '') {
        return `${inputName} cannot be empty`;
    }

    const numberInput = Number(input);

    if (Number.isNaN(numberInput)) {
        return `${inputName} must be a whole, positive number`;
    }

    if (numberInput < min) {
        return `${inputName} cannot be less than ${min}`;
    }

    if (numberInput > max) {
        return `${inputName} cannot be greater than ${max}`;
    }

    return '';
};

export const isValid24hrTimeFormat = (time: string): boolean => RegExp('^([2][0-3]|[0-1][0-9])[0-5][0-9]$').test(time);
