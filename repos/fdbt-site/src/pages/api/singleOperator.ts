import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';
import { isSessionValid } from './service/validator';
import { PERIOD_SINGLE_OPERATOR_SERVICES } from '../../constants';
import { ServiceLists } from '../../interfaces';

const redirectUrl = '/singleOperator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    const serviceListObject: ServiceLists = { error: false, selectedServices: [] };

    try {
        if (!isSessionValid(req, res)) {
            redirectToError(res);
            return;
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            setCookieOnResponseObject(
                getDomain(req),
                PERIOD_SINGLE_OPERATOR_SERVICES,
                JSON.stringify({ ...serviceListObject, error: true }),
                req,
                res,
            );
            redirectTo(res, redirectUrl);
            return;
        }

        setCookieOnResponseObject(
            getDomain(req),
            PERIOD_SINGLE_OPERATOR_SERVICES,
            JSON.stringify({ ...serviceListObject, selectedServices: JSON.stringify(req.body) }),
            req,
            res,
        );

        redirectTo(res, '/periodProduct');

        return;
    } catch (error) {
        redirectToError(res);
    }
};
