import { NextApiRequest, NextApiResponse } from 'next';
import { STAGE_NAMES_COOKIE, VALIDATION_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';
import { getDomain, setCookieOnResponseObject, redirectTo, redirectToError } from './apiUtils';
import { InputCheck } from '../stageNames';

const isStageNameValid = (req: NextApiRequest): InputCheck[] => {
    const { stageNameInput } = req.body;
    const response = [];
    for (let i = 0; i < stageNameInput.length; i += 1) {
        const check = { Valid: true, Error: '', Input: '' };
        if (stageNameInput[i] === null) {
            console.log(`Stage name input of '${stageNameInput[i]}' is invalid. Stage name cannot be null.`);
            check.Input = `${stageNameInput[i]}`;
            check.Error = 'Enter a name for this fare stage';
            check.Valid = false;
        }
        if (stageNameInput[i].replace(/\s+/g, '').length === 0) {
            console.log(`Stage name input of ${stageNameInput[i]} is invalid. Stage name cannot be just whitesapce.`);
            check.Input = `${stageNameInput[i]}`;
            check.Error = 'Enter a name for this fare stage';
            check.Valid = false;
        }
        if (stageNameInput[i].length < 1 || stageNameInput[i].length > 30) {
            console.log(
                `Stage name input of '${stageNameInput[i]}' is invalid. Input length is outside of condition 1 < input.length < 30.`,
            );
            check.Input = `${stageNameInput[i]}`;
            check.Error = `The name for Fare Stage ${i + 1} needs to be between 1-30 characters`;
            check.Valid = false;
        } else {
            check.Input = stageNameInput[i];
        }
        response.push(check);
    }
    return response;
};

const checkUserInput = (userInputValidity: InputCheck[]): boolean => {
    let valid = true;
    userInputValidity.forEach(input => {
        if (input.Valid === false) {
            valid = false;
        }
    });
    return valid;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req)) {
        try {
            const userInputValidity = isStageNameValid(req);
            const valid = checkUserInput(userInputValidity);
            if (valid) {
                console.log(req.body.stageNameInput);
                const cookieValue = JSON.stringify(req.body.stageNameInput);
                const domain = getDomain(req);
                setCookieOnResponseObject(domain, STAGE_NAMES_COOKIE, cookieValue, res);
                redirectTo(res, '/priceEntry');
            }
            if (!valid) {
                const cookieValue = JSON.stringify(userInputValidity);
                const domain = getDomain(req);
                setCookieOnResponseObject(domain, VALIDATION_COOKIE, cookieValue, res);
                redirectTo(res, '/stageNames');
            }
        } catch (error) {
            console.log(`There was an error while reading and setting cookies. Error: ${error.name}, ${error.stack}`);
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }
    res.end();
};
