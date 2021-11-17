import { NextApiResponse } from 'next';
import { deleteProductByNocCodeAndId } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const id = Number(req.query?.id);

        if (!Number.isInteger(id)) {
            throw new Error('insufficient data provided for delete query');
        }

        const nationalOperatorCode = getAndValidateNoc(req, res);

        await deleteProductByNocCodeAndId(id, nationalOperatorCode);

        redirectTo(res, req.headers.referer ?? '/products/services');
    } catch (error) {
        redirectToError(res, 'There was a problem deleting the selected product', 'api.deleteProduct', error);
    }
};
