import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { isSessionValid } from './apiUtils/validator';
import { redirectTo, redirectToError } from './apiUtils';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }
        redirectTo(res, '/selectSalesOfferPackage');
    } catch (error) {
        const message = 'There was a problem entering stage names:';
        redirectToError(res, message, 'api.ticketConfirmation', error);
    }
};
