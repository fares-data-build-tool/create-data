import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces';
import { redirectToError, redirectTo } from './apiUtils';
import { OPERATOR_ATTRIBUTE } from '../../constants/attributes';
import { updateSessionAttribute } from '../../utils/sessions';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (req.body.operator) {
            const splitOperator = (req.body.operator as string).split('|');
            const noc = splitOperator.slice(-1)[0];

            updateSessionAttribute(req, OPERATOR_ATTRIBUTE, {
                name: splitOperator[0],
                nocCode: noc,
            });
            redirectTo(res, '/fareType');
        } else {
            updateSessionAttribute(req, OPERATOR_ATTRIBUTE, {
                errors: [
                    {
                        id: 'operators',
                        errorMessage: 'Choose an operator name and NOC from the options',
                    },
                ],
            });
            redirectTo(res, '/multipleOperators');
        }
    } catch (error) {
        const message = 'There was a problem setting operator and/or noc';
        redirectToError(res, message, 'api.multipleOperators', error);
    }
};
