import { NextApiResponse } from 'next';
import {
    deletePassengerTypeByNocCodeAndId,
    getAllProductsByNoc,
    getGroupPassengerTypeDbsFromGlobalSettings,
    getPassengerTypeById,
} from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { ErrorInfo, NextApiRequestWithSession, SinglePassengerType } from '../../interfaces';
import { getProductsMatchingJson } from '../../data/s3';
import { updateSessionAttribute } from '../../utils/sessions';
import { VIEW_PASSENGER_TYPE } from '../../constants/attributes';

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

        const products = await getAllProductsByNoc(nationalOperatorCode);
        const matchingJsonLinks = products.map((product) => product.matchingJsonLink);
        const tickets = await Promise.all(
            matchingJsonLinks.map(async (link) => {
                return await getProductsMatchingJson(link);
            }),
        );

        const productsUsingPassengerType = tickets.filter((t) => t.passengerType.id === id);

        if (productsUsingPassengerType.length > 0) {
            const passengerDetails = (await getPassengerTypeById(id, nationalOperatorCode)) as SinglePassengerType;
            const { name } = passengerDetails;
            const errorMessage = `You cannot delete ${name} because it is being used in ${productsUsingPassengerType.length} products.`;
            const errors: ErrorInfo[] = [{ id: 'passenger-card-0', errorMessage }];
            updateSessionAttribute(req, VIEW_PASSENGER_TYPE, errors);
            redirectTo(res, `/viewPassengerTypes?cannotDelete=${name}`);
            return;
        }

        await deletePassengerTypeByNocCodeAndId(id, nationalOperatorCode, isGroup === 'true');

        redirectTo(res, '/viewPassengerTypes');
    } catch (error) {
        const message = 'There was a problem deleting the selected passenger or group';
        redirectToError(res, message, 'api.deletePassenger', error);
    }
};
