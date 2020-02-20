import { NextApiRequest, NextApiResponse } from 'next';
import { FARE_STAGES_COOKIE, STAGE_NAMES_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';
import { getDomain, setCookieOnResponseObject, getCookies, redirectTo, redirectToError } from './apiUtils';

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

            if (!req.body) {
                redirectTo(res, '/stageNames');
                return;
            }

            const cookieValue = JSON.stringify({ fareStageNames });
            const domain = getDomain(req);
            setCookieOnResponseObject(domain, STAGE_NAMES_COOKIE, cookieValue, res);
            redirectTo(res, '/priceEntry');
        } catch (error) {
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }
    res.end();
};
