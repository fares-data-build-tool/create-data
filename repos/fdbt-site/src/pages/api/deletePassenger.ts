import { NextApiResponse } from 'next';
import { deletePassengerTypeByNocCodeAndId, getGroupPassengerTypeDbsFromGlobalSettings } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;

        const id = Number(query?.id);

        const isGroup = query?.isGroup;

        if (!Number.isInteger(id) || typeof isGroup !== 'string') {
            throw new Error('insufficient data provided for delete query');
        }

        const nationalOperatorCode = getAndValidateNoc(req, res);
        const groups = await getGroupPassengerTypeDbsFromGlobalSettings(nationalOperatorCode);
        const groupsInUse = groups.some((group) =>
            group.groupPassengerType.companions.some((individual) => individual.id === id),
        );

        if (groupsInUse) {
            throw new Error('This individual cannot be deleted because it is in use in a group.');
        }

        await deletePassengerTypeByNocCodeAndId(id, nationalOperatorCode, isGroup === 'true');

        redirectTo(res, '/viewPassengerTypes');
    } catch (error) {
        const message = 'There was a problem deleting the selected passenger or group';

        redirectToError(res, message, 'api.deletePassenger', error);
    }
};
