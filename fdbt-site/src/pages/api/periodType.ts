import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, getUuidFromCookie, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
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

        const uuid = getUuidFromCookie(req, res);

        console.log('req', req.body);
        const { periodType } = req.body;

        if (!periodType) {
            const error: PeriodTypeInterface = { error: true, uuid };
            setCookieOnResponseObject(getDomain(req), PERIOD_TYPE, JSON.stringify(error), req, res);
            redirectTo(res, '/periodType');
            return;
        }

        const periodTypeObject: PeriodTypeInterface = { error: false, periodTypeName: periodType, uuid };

        setCookieOnResponseObject(getDomain(req), PERIOD_TYPE, JSON.stringify(periodTypeObject), req, res);

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
