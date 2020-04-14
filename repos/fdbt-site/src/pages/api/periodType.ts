import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, getUuidFromCookie, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
import { isSessionValid } from './service/validator';
import { PERIOD_TYPE } from '../../constants';

import { PeriodTypeInterface } from '../periodType';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        if (!req.body) {
            throw new Error('No request body received.');
        }

        const uuid = getUuidFromCookie(req, res);

        const { periodType } = req.body;

        if (!periodType) {
            const error: PeriodTypeInterface = { error: true, uuid };
            setCookieOnResponseObject(getDomain(req), PERIOD_TYPE, JSON.stringify(error), req, res);
            redirectTo(res, '/periodType');
            return;
        }

        const periodTypeObject: PeriodTypeInterface = { error: false, periodTypeName: periodType, uuid };

        setCookieOnResponseObject(getDomain(req), PERIOD_TYPE, JSON.stringify(periodTypeObject), req, res);

        if (periodType === 'periodGeoZone') {
            redirectTo(res, '/csvZoneUpload');
            return;
        }

        if (periodType === 'periodMultipleServices') {
            redirectTo(res, '/singleOperator?selectAll=false');
            return;
        }

        if (periodType === 'periodMultipleOperators') {
            // redirect to page not made yet
            return;
        }
    } catch (error) {
        const message = 'There was a problem selecting the type of period ticket:';
        redirectToError(res, message, error);
    }
};
