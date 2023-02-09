import { NextApiResponse } from 'next';
import { deleteCap } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;

        const id = Number(query?.id);

        if (!Number.isInteger(id)) {
            throw new Error('insufficient data provided for delete query');
        }

        const noc = getAndValidateNoc(req, res);

        await deleteCap(id, noc);

        redirectTo(res, '/viewCaps');
    } catch (error) {
        const message = 'There was a problem deleting the cap';
        redirectToError(res, message, 'api.deleteCap', error);
    }
};
