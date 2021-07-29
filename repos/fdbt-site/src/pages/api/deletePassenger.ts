import { NextApiResponse } from 'next';
import { deletePassengerTypeByNocCodeAndName } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from './apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;

        const name = query?.name as string;

        const isGroup = query?.isGroup as string;

        if (!name || !isGroup) {
            throw new Error('insufficient data provided for delete query');
        }

        const nationalOperatorCode = getAndValidateNoc(req, res);

        await deletePassengerTypeByNocCodeAndName(name, nationalOperatorCode, isGroup === 'true');

        redirectTo(res, '/viewPassengerTypes');
    } catch (error) {
        const message = 'There was a problem deleting the selected passenger or group';

        redirectToError(res, message, 'api.deletePassenger', error);
    }
};
