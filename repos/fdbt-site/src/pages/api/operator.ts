import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { OPERATOR_COOKIE } from '../../constants/index';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (req.body.operator) {
            const { operatorName, nocCode } = JSON.parse(req.body.operator);
            const uuid = uuidv4();
            const cookieValue = JSON.stringify({ operator: operatorName, uuid, nocCode });

            console.info('transaction start', { uuid });

            setCookieOnResponseObject(getDomain(req), OPERATOR_COOKIE, cookieValue, req, res);
            redirectTo(res, '/fareType');
        } else {
            const cookieValue = JSON.stringify({ errorMessage: 'Choose an operator from the options' });
            setCookieOnResponseObject(getDomain(req), OPERATOR_COOKIE, cookieValue, req, res);
            redirectTo(res, '/operator');
        }
    } catch (error) {
        const message = 'There was a problem selecting the operator:';
        redirectToError(res, message, error);
    }
};
