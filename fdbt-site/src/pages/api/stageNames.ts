import { NextApiRequest, NextApiResponse } from 'next';
import { STAGE_NAMES_COOKIE, STAGE_NAME_VALIDATION_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';
import { setCookieOnResponseObject, redirectTo, redirectToError } from './apiUtils';
import { InputCheck } from '../stageNames';

export const stageNameInArrayMultipleTimes = (stageNames: string[], stageName: string): boolean => {
    let counter = 0;
    stageNames.forEach(stage => {
        if (stage === stageName) {
            counter += 1;
        }
    });
    if (counter === 1) {
        return false;
    }
    return true;
};

export const isStageNameValid = (req: NextApiRequest): InputCheck[] => {
    const { stageNameInput = [] } = req.body;
    const response: InputCheck[] = [];
    for (let i = 0; i < stageNameInput.length; i += 1) {
        let error;
        if (!stageNameInput[i] || stageNameInput[i].replace(/\s+/g, '').length === 0) {
            error = 'Enter a name for this fare stage';
        } else if (stageNameInput[i].length > 30) {
            error = `The name for Fare Stage ${i + 1} needs to be less than 30 characters`;
        } else if (stageNameInArrayMultipleTimes(stageNameInput, stageNameInput[i])) {
            error = 'Stage names cannot share exact names';
        } else {
            error = '';
        }
        const check: InputCheck = { input: stageNameInput[i], error };
        response.push(check);
    }
    return response;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        if (!req.body.stageNameInput || req.body.stageNameInput.length === 0) {
            throw new Error('No stage name input received from Stage Names page.');
        }
        const userInputValidity = isStageNameValid(req);
        if (!userInputValidity.some(el => el.error !== '')) {
            const stageNameCookieValue = JSON.stringify(req.body.stageNameInput);
            setCookieOnResponseObject(STAGE_NAMES_COOKIE, stageNameCookieValue, req, res);
            redirectTo(res, '/priceEntry');
        } else {
            const validationCookieValue = JSON.stringify(userInputValidity);
            setCookieOnResponseObject(STAGE_NAME_VALIDATION_COOKIE, validationCookieValue, req, res);
            redirectTo(res, '/stageNames');
        }
    } catch (error) {
        const message = 'There was a problem entering stage names:';
        redirectToError(res, message, error);
    }
};
