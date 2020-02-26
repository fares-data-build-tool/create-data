import { NextApiRequest, NextApiResponse } from 'next';
import { STAGE_NAMES_COOKIE, VALIDATION_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';
import { getDomain, setCookieOnResponseObject, redirectTo, redirectToError } from './apiUtils';
import { InputCheck } from '../stageNames';

export const isStageNameValid = (req: NextApiRequest): InputCheck[] => {
    const { stageNameInput } = req.body;
    const response: InputCheck[] = [];
    for (let i = 0; i < stageNameInput.length; i += 1) {
        let error;
        if (stageNameInput[i] === null || stageNameInput[i].replace(/\s+/g, '').length === 0) {
            console.log(`Stage name input of '${stageNameInput[i]}' is invalid. Stage name cannot be empty.`);
            error = 'Enter a name for this fare stage';
        } else if (stageNameInput[i].length > 30) {
            console.log(`Stage name input of '${stageNameInput[i]}' is invalid. Input length is greater than 30.`);
            error = `The name for Fare Stage ${i + 1} needs to be less than 30 characters`;
        } else {
            error = '';
        }
        const check: InputCheck = { Input: stageNameInput[i], Error: error };
        response.push(check);
    }
    return response;
};

export const checkUserInput = (userInputValidity: InputCheck[]): boolean => {
    let valid = true;
    userInputValidity.forEach(input => {
        if (input.Error !== '') {
            valid = false;
        }
    });
    return valid;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req, res)) {
        try {
            const userInputValidity = isStageNameValid(req);
            const valid = checkUserInput(userInputValidity);
            if (valid) {
                const cookieValue = JSON.stringify(req.body.stageNameInput);
                const domain = getDomain(req);
                setCookieOnResponseObject(domain, STAGE_NAMES_COOKIE, cookieValue, req, res);
                redirectTo(res, '/priceEntry');
            }
            if (!valid) {
                const cookieValue = JSON.stringify(userInputValidity);
                const domain = getDomain(req);
                setCookieOnResponseObject(domain, VALIDATION_COOKIE, cookieValue, req, res);
                redirectTo(res, '/stageNames');
            }
        } catch (error) {
            console.log(`There was an error while reading and setting cookies. Error: ${error.stack}`);
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }
    res.end();
};
