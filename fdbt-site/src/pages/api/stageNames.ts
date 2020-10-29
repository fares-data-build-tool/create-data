import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { updateSessionAttribute } from '../../utils/sessions';
import { STAGE_NAMES_ATTRIBUTE } from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';
import { redirectTo, redirectToError } from './apiUtils';
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

export const isStageNameValid = (req: NextApiRequestWithSession): InputCheck[] => {
    const { stageNameInput = [] } = req.body;
    const response: InputCheck[] = [];
    for (let i = 0; i < stageNameInput.length; i += 1) {
        let error;
        if (!stageNameInput[i] || stageNameInput[i].replace(/\s+/g, '').length === 0) {
            error = 'Enter a name for this fare stage';
        } else if (stageNameInput[i].length > 70) {
            error = `The name for Fare Stage ${i + 1} needs to be 70 characters or fewer`;
        } else if (stageNameInArrayMultipleTimes(stageNameInput, stageNameInput[i])) {
            error = 'Stage names cannot share exact names';
        } else {
            error = '';
        }
        const check: InputCheck = { input: stageNameInput[i], error, id: `fare-stage-name-${i + 1}` };
        response.push(check);
    }
    return response;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const stageNames: string[] = req.body.stageNameInput;

        if (!stageNames || stageNames.length === 0) {
            throw new Error('No stage name input received from Stage Names page.');
        }
        const userInputValidity = isStageNameValid(req);
        if (!userInputValidity.some(el => el.error !== '')) {
            updateSessionAttribute(req, STAGE_NAMES_ATTRIBUTE, stageNames);
            redirectTo(res, '/stageNamesConfirmation');
        } else {
            updateSessionAttribute(req, STAGE_NAMES_ATTRIBUTE, userInputValidity);
            redirectTo(res, '/stageNames');
        }
    } catch (error) {
        const message = 'There was a problem entering stage names:';
        redirectToError(res, message, 'api.stageNames', error);
    }
};
