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

        const { periodGeoZone } = req.body;

        if (!periodGeoZone) {
            const error: PeriodTypeInterface = { error: true };
            setCookieOnResponseObject(getDomain(req), PERIOD_TYPE, JSON.stringify(error), req, res);
            redirectTo(res, '/periodType');
            return;
        }

        const periodType: PeriodTypeInterface = { error: false, periodType: periodGeoZone };

        setCookieOnResponseObject(getDomain(req), PERIOD_TYPE, JSON.stringify(periodType), req, res);

        if (!periodGeoZone) {
            redirectTo(res, '/csvZoneUpload');
            return;
        }

        if (periodGeoZone === 'geozone') {
            redirectTo(res, '/geoZone');
            return;
        }

        if (periodGeoZone === 'singleset') {
            redirectTo(res, '/singleSet');
            return;
        }
    } catch (error) {
        redirectToError(res);
    }
};
