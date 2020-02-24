import { NextApiRequest, NextApiResponse } from 'next';
import { FARE_STAGES_COOKIE, STAGE_NAMES_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';
import { getDomain, setCookieOnResponseObject, getCookies, redirectTo, redirectToError } from './apiUtils';

const isStageNameInvalid = (req: NextApiRequest): boolean => {
    const { stageNameInput } = req.body;
    let invalid = false;
    for (let i = 0; i < stageNameInput.length; i += 1) {
        if (stageNameInput[i] === null) {
            console.log(`Stage name input of '${stageNameInput[i]}' is invalid.`);
            invalid = true;
        }
        if (stageNameInput[i].length < 1 || stageNameInput[i].length > 30) {
            console.log(
                `Stage name input of '${stageNameInput[i]}' is invalid. Input length is outside of condition 1 < input.length < 30.`,
            );
            invalid = true;
        }
    }
    return invalid;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req)) {
        try {
            const cookies = getCookies(req);
            const fareStagesCookie = unescape(decodeURI(cookies[FARE_STAGES_COOKIE]));
            const { fareStages } = JSON.parse(fareStagesCookie);
            const iteratorLimit = Number(fareStages) + 1;
            const fareStageNameKeys = [];
            for (let i = 1; i < iteratorLimit; i += 1) {
                fareStageNameKeys.push(`fareStage${i}`);
            }

            const fareStageNames = fareStageNameKeys.map(fareStageNameKey => req.body[fareStageNameKey]);

            const userInputInvalidity = isStageNameInvalid(req);
            if (userInputInvalidity) {
                redirectTo(res, '/stageNames');
                return;
            }
            const cookieValue = JSON.stringify({ fareStageNames });
            const domain = getDomain(req);
            setCookieOnResponseObject(domain, STAGE_NAMES_COOKIE, cookieValue, res);
            redirectTo(res, '/priceEntry');
        } catch (error) {
            console.log(`There was an error while reading and setting cookies. Error: ${error.name}, ${error.stack}`);
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }
    res.end();
};
