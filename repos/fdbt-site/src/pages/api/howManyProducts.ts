import { NextApiResponse } from 'next';
import { NUMBER_OF_PRODUCTS_ATTRIBUTE, MULTIPLE_PRODUCT_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo } from './apiUtils';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';

export const getErrors = (inputAsNumber: number): ErrorInfo[] => {
    const errorMessage =
        Number.isNaN(inputAsNumber) || !Number.isInteger(inputAsNumber) || inputAsNumber > 10 || inputAsNumber < 1
            ? 'Enter a whole number between 1 and 10'
            : '';
    return errorMessage !== '' ? [{ id: 'number-of-products', errorMessage }] : [];
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { numberOfProductsInput = '' } = req.body;
        const numberOfProducts = Number(numberOfProductsInput);
        const errors = getErrors(numberOfProducts);

        if (errors.length > 0) {
            errors[0].userInput = numberOfProductsInput;
            updateSessionAttribute(req, NUMBER_OF_PRODUCTS_ATTRIBUTE, { errors });
            redirectTo(res, '/howManyProducts');
            return;
        }

        updateSessionAttribute(req, NUMBER_OF_PRODUCTS_ATTRIBUTE, { numberOfProductsInput });

        if (numberOfProductsInput === '1') {
            updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, undefined);
            redirectTo(res, '/productDetails');
        } else {
            redirectTo(res, '/multipleProducts');
        }
    } catch (error) {
        const message = 'There was a problem inputting the number of products:';
        redirectToError(res, message, 'api.howManyProducts', error);
    }
};
