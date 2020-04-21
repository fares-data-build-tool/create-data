import { NextApiRequest, NextApiResponse } from 'next';
import { NUMBER_OF_PRODUCTS_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';
import { isSessionValid } from './service/validator';
import { InputCheck } from '../howManyProducts';

export const isNumberOfProductsInvalid = (req: NextApiRequest): InputCheck => {
    const { numberOfProductsInput = '' } = req.body;
    const inputAsNumber = Number(numberOfProductsInput);
    let error;
    if (numberOfProductsInput === '' || Number.isNaN(inputAsNumber)) {
        error = 'Enter a number';
    } else if (!Number.isInteger(inputAsNumber) || inputAsNumber > 10 || inputAsNumber < 1) {
        error = 'Enter a whole number between 1 and 10';
    } else {
        error = '';
    }
    const inputCheck = { numberOfProductsInput, error };
    return inputCheck;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const userInputValidity = isNumberOfProductsInvalid(req);
        if (userInputValidity.error !== '') {
            const numberOfProductsCookieValue = JSON.stringify(userInputValidity);
            setCookieOnResponseObject(getDomain(req), NUMBER_OF_PRODUCTS_COOKIE, numberOfProductsCookieValue, req, res);
            redirectTo(res, '/howManyProducts');
        }
        const numberOfProductsCookieValue = JSON.stringify({
            numberOfProductsInput: userInputValidity.numberOfProductsInput,
        });
        setCookieOnResponseObject(getDomain(req), NUMBER_OF_PRODUCTS_COOKIE, numberOfProductsCookieValue, req, res);
        redirectTo(res, '/multipleProducts');
    } catch (error) {
        const message = 'There was a problem inputting the number of products:';
        redirectToError(res, message, error);
    }
};
