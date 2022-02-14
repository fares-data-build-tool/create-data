import { NextApiResponse } from 'next';
import { deleteTimeRestrictionByIdAndNocCode } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;

        const id = Number(query?.id);

        const nationalOperatorCode = getAndValidateNoc(req, res);

        await deleteTimeRestrictionByIdAndNocCode(id, nationalOperatorCode);

        redirectTo(res, '/viewTimeRestrictions');
    } catch (error) {
        const message = 'There was a problem deleting the time restriction';

        redirectToError(res, message, 'api.deletePassenger', error);
    }
};
