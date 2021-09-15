import { NextApiResponse } from 'next';
import { globalSettingsEnabled } from '../../constants/featureFlag';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { redirectTo, redirectToError } from '../../utils/apiUtils';

export default (_req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (globalSettingsEnabled) {
            redirectTo(res, '/selectPurchaseMethods');
            return;
        }
        redirectTo(res, '/selectSalesOfferPackage');
        return;
    } catch (error) {
        const message = 'There was a problem entering stage names:';
        redirectToError(res, message, 'api.ticketConfirmation', error);
    }
};
