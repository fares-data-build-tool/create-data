import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces';
import { redirectToError, redirectTo, setCookieOnResponseObject } from './apiUtils';
import { OPERATOR_COOKIE } from '../../constants';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (req.body.operator) {
            const splitOperator = (req.body.operator as string).split('|');
            const noc = splitOperator.slice(-1)[0];

            const operatorCookieValue = JSON.stringify({
                operator: {
                    operatorPublicName: splitOperator[0],
                },
                noc,
            });
            setCookieOnResponseObject(OPERATOR_COOKIE, operatorCookieValue, req, res);
            redirectTo(res, '/fareType');
        } else {
            const cookieValue = JSON.stringify({
                errorMessage: 'Choose an operator name and NOC from the options',
            });
            setCookieOnResponseObject(OPERATOR_COOKIE, cookieValue, req, res);
            redirectTo(res, '/multipleOperators');
        }
    } catch (error) {
        const message = 'There was a problem setting operator and/or noc';
        redirectToError(res, message, 'api.multipleOperators', error);
    }
};
