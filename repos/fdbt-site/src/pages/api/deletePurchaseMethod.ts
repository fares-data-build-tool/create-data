import { NextApiResponse } from 'next';
import { deleteSalesOfferPackageByNocCodeAndName } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;
        const id = Number(query?.id);

        if (!Number.isInteger(id)) {
            throw new Error('insufficient data provided for delete query');
        }
        const nocCode = getAndValidateNoc(req, res);
        await deleteSalesOfferPackageByNocCodeAndName(id, nocCode);

        redirectTo(res, '/viewPurchaseMethods');
    } catch (error) {
        const message = 'There was a problem deleting the selected SOP:';

        redirectToError(res, message, 'api.deletePurchaseMethod', error);
    }
};
