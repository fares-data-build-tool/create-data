import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces/index';
import {
    getAndValidateNoc,
    getFareTypeFromFromAttributes,
    isCapTicket,
    redirectTo,
    redirectToError,
} from '../../utils/apiUtils';
import { getCaps } from '../../../src/data/auroradb';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const fareTypeAttribute = getFareTypeFromFromAttributes(req);
        const nocCode = getAndValidateNoc(req, res);
        const caps = await getCaps(nocCode);

        if (isCapTicket(fareTypeAttribute) && caps.length > 0) {
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
