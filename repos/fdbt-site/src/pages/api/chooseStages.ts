import { NextApiRequest, NextApiResponse } from 'next';
import { FARE_STAGES_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';

export const isInvalidFareStageNumber = (req: NextApiRequest): boolean => {
    const { fareStageInput } = req.body;

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(fareStageInput)) {
        return true;
    }

    if (!Number.isInteger(Number(fareStageInput))) {
        return true;
    }

    if (fareStageInput > 20 || fareStageInput < 1) {
        return true;
    }

    return false;
};

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (req.body.fareStageInput === 0) {
            throw new Error('0 farestages selected.');
        }

        if (!req.body.fareStageInput) {
            redirectTo(res, '/chooseStages');
            return;
        }

        if (isInvalidFareStageNumber(req)) {
            throw new Error('Invalid number of farestages selected.');
        }

        const numberOfFareStages = req.body.fareStageInput;
        const cookieValue = JSON.stringify({ fareStages: numberOfFareStages });
        setCookieOnResponseObject(getDomain(req), FARE_STAGES_COOKIE, cookieValue, req, res);
        redirectTo(res, '/stageNames');
    } catch (error) {
        const message = 'There was a problem inputting the number of fare stages:';
        redirectToError(res, message, error);
    }
};
