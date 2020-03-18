import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
import { isSessionValid } from './service/validator';
import { PERIOD_TYPE } from '../../constants';

import { PeriodTypeInterface } from '../periodType';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            redirectToError(res);
            return;
        }

        if (!req.body) {
            return;
        }

        const { periodType } = req.body;

        if (!periodType) {
            const error: PeriodTypeInterface = { error: true };
            setCookieOnResponseObject(getDomain(req), PERIOD_TYPE, JSON.stringify(error), req, res);
            redirectTo(res, '/periodType');
            return;
        }

        const periodTypeCookie: PeriodTypeInterface = { error: false, periodType };

        setCookieOnResponseObject(getDomain(req), PERIOD_TYPE, JSON.stringify(periodTypeCookie), req, res);

        if (periodType === 'geozone') {
            redirectTo(res, '/csvZoneUpload');
            return;
        }

        if (periodType === 'singleset') {
            redirectTo(res, '/singleSet');
            return;
        }
    } catch (error) {
        redirectToError(res);
    }
};
