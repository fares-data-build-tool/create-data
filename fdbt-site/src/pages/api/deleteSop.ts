import { NextApiResponse } from 'next';
import { deleteSalesOfferPackageByNocCodeAndName } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from './apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;
        const sopId = (query?.sopId as string) || '';
        if (!sopId) {
            throw new Error('sopId not provided for delete query');
        }
        const nocCode = getAndValidateNoc(req, res);
        await deleteSalesOfferPackageByNocCodeAndName(sopId, nocCode);
        redirectTo(res, '/selectSalesOfferPackage');
    } catch (error) {
        const message = 'There was a problem deleting the selected SOP:';
        redirectToError(res, message, 'api.deleteSop', error);
    }
};
