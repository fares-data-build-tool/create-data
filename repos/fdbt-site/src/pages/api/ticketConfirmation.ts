import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { redirectTo, redirectToError } from '../../utils/apiUtils';

export default (_req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        redirectTo(res, '/selectPurchaseMethods');
        return;
    } catch (error) {
        const message = 'There was a problem in the ticket confirmation API:';
        redirectToError(res, message, 'api.ticketConfirmation', error);
    }
};
