import { NextApiRequest, NextApiResponse } from 'next';
import { FARE_STAGES_COOKIE } from '../../constants/index';
import { setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';
import { isSessionValid } from './service/validator';
import { ChooseStagesInputCheck } from '../chooseStages';

export const isInvalidFareStageNumber = (fareStageInput: string): ChooseStagesInputCheck => {
    const inputAsNumber = Number(fareStageInput);
    let error = '';

    if (
        fareStageInput === '' ||
        Number.isNaN(inputAsNumber) ||
        !Number.isInteger(inputAsNumber) ||
        inputAsNumber > 20 ||
        inputAsNumber < 2
    ) {
        error = 'Enter a whole number between 2 and 20';
    }
    const inputCheck = { fareStageInput, error };
    return inputCheck;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const { fareStageInput = '' } = req.body;
        const userInputValidity = isInvalidFareStageNumber(fareStageInput);
        if (userInputValidity.error !== '') {
            const fareStageInputCookieValue = JSON.stringify(userInputValidity);
            setCookieOnResponseObject(FARE_STAGES_COOKIE, fareStageInputCookieValue, req, res);
            redirectTo(res, '/chooseStages');
            return;
        }

        const cookieValue = JSON.stringify({ fareStages: fareStageInput });
        setCookieOnResponseObject(FARE_STAGES_COOKIE, cookieValue, req, res);
        redirectTo(res, '/stageNames');
    } catch (error) {
        const message = 'There was a problem inputting the number of fare stages:';
        redirectToError(res, message, error);
    }
};
