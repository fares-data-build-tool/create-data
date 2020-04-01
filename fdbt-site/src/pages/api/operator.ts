import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { OPERATOR_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!req.body.operator) {
            redirectTo(res, '/operator');
            return;
        }

        const { operatorName, nocCode } = JSON.parse(req.body.operator);
        const uuid = uuidv4();
        const cookieValue = JSON.stringify({ operator: operatorName, uuid, nocCode });
        setCookieOnResponseObject(getDomain(req), OPERATOR_COOKIE, cookieValue, req, res);
        redirectTo(res, '/faretype');
    } catch (error) {
        const message = 'There was a problem selecting thr operator:';
        redirectToError(res, message, error);
    }
};
