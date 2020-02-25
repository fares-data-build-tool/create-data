import { NextApiRequest, NextApiResponse } from 'next';
import v1 from 'uuid';
import { OPERATOR_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!req.body.operator) {
            redirectTo(res, '/operator');
            return;
        }

        const { operatorName, nocCode } = JSON.parse(req.body.operator);
        const uuid = v1();
        const cookieValue = JSON.stringify({ operator: operatorName, uuid, nocCode });
        const domain = getDomain(req);
        setCookieOnResponseObject(domain, OPERATOR_COOKIE, cookieValue, req, res);
        redirectTo(res, '/faretype');
    } catch (error) {
        console.log(error.stack);
        redirectToError(res);
    }
    res.end();
};
