import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { getFareTypeFromFromAttributes, redirectTo, redirectToError } from '../../utils/apiUtils';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const fareTypeAttribute = getFareTypeFromFromAttributes(req);

        if (['single', 'return', 'flatFare'].includes(fareTypeAttribute)) {
            redirectTo(res, '/selectCaps');
            return;
        }
        redirectTo(res, '/selectPurchaseMethods');
        return;
    } catch (error) {
        const message = 'There was a problem in the ticket confirmation API:';
        redirectToError(res, message, 'api.ticketConfirmation', error);
    }
};
