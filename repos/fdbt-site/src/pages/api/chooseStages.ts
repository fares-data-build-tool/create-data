import { NextApiRequest, NextApiResponse } from 'next';
import { FARE_STAGES_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';

export const isValidFareStageNumber = (req: NextApiRequest): boolean => {
    const { fareStageInput } = req.body;

    if (fareStageInput.isNaN()) {
        return false;
    }

    if (!Number.isInteger(fareStageInput)) {
        return false;
    }

    if (fareStageInput > 20 || fareStageInput < 1) {
        return false;
    }

    return true;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (req.body.fareStageInput === 0) {
            redirectToError(res);
        }

        if (!req.body.fareStageInput) {
            redirectTo(res, '/chooseStages');
            return;
        }

        if (!isValidFareStageNumber(req)) {
            redirectToError(res);
        }

        const { numberOfFareStages } = JSON.parse(req.body.fareStageInput);
        const cookieValue = JSON.stringify({ fareStages: numberOfFareStages });
        const domain = getDomain(req);
        setCookieOnResponseObject(domain, FARE_STAGES_COOKIE, cookieValue, res);
        redirectTo(res, '/stageNames');
    } catch (error) {
        redirectToError(res);
    }
    res.end();
};
