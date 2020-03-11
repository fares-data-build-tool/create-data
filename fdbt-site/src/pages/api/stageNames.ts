import { NextApiRequest, NextApiResponse } from 'next';
import { STAGE_NAMES_COOKIE, STAGE_NAME_VALIDATION_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectTo, redirectToError, isSessionValid } from './apiUtils';
import { InputCheck } from '../stageNames';

export const isStageNameValid = (req: NextApiRequest): InputCheck[] => {
    const { stageNameInput = [] } = req.body;
    const response: InputCheck[] = [];
    for (let i = 0; i < stageNameInput.length; i += 1) {
        let error;
        if (!stageNameInput[i] || stageNameInput[i].replace(/\s+/g, '').length === 0) {
            error = 'Enter a name for this fare stage';
        } else if (stageNameInput[i].length > 30) {
            error = `The name for Fare Stage ${i + 1} needs to be less than 30 characters`;
        } else {
            error = '';
        }
        const check: InputCheck = { Input: stageNameInput[i], Error: error };
        response.push(check);
    }
    return response;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            redirectToError(res);
            return;
        }

        if (!req.body.stageNameInput || req.body.stageNameInput.length === 0) {
            throw new Error('No stage name input received from Stage Names page.');
        }
        const userInputValidity = isStageNameValid(req);
        if (!userInputValidity.some(el => el.Error !== '')) {
            const stageNameCookieValue = JSON.stringify(req.body.stageNameInput);
            setCookieOnResponseObject(getDomain(req), STAGE_NAMES_COOKIE, stageNameCookieValue, req, res);
            // deleteCookieOnResponseObject(getDomain(req), STAGE_NAME_VALIDATION_COOKIE, req, res);
            redirectTo(res, '/priceEntry');
        } else {
            const validationCookieValue = JSON.stringify(userInputValidity);
            setCookieOnResponseObject(getDomain(req), STAGE_NAME_VALIDATION_COOKIE, validationCookieValue, req, res);
            redirectTo(res, '/stageNames');
        }
    } catch (error) {
        redirectToError(res);
    }
};
