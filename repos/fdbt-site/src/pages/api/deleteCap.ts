import { NextApiResponse } from 'next';
import { deleteCap, getAllProductsByNoc, getCapByNocAndId } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { Cap, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getProductsMatchingJson } from '../../data/s3';
import { updateSessionAttribute } from '../../utils/sessions';
import { VIEW_CAP } from '../../constants/attributes';
import { TicketWithIds } from 'src/interfaces/matchingJsonTypes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;

        const id = Number(query?.id);

        if (!Number.isInteger(id)) {
            throw new Error('insufficient data provided for delete query');
        }

        const noc = getAndValidateNoc(req, res);

        const products = await getAllProductsByNoc(noc);
        const matchingJsonLinks = products.map((product) => product.matchingJsonLink);
        const tickets: TicketWithIds[] = await Promise.all(
            matchingJsonLinks.map(async (link) => {
                return await getProductsMatchingJson(link);
            }),
        );

        const productsUsingCap = tickets.filter((t) => 'cap' in t && t.cap && t.cap.id === id);

        if (productsUsingCap.length > 0) {
            const cap = (await getCapByNocAndId(noc, id)) as Cap;
            const { name } = cap.capDetails;
            const errorMessage = `You cannot delete ${name} because it is being used in ${productsUsingCap.length} ticket(s).`;
            const errors: ErrorInfo[] = [{ id: 'cap-card-0', errorMessage }];
            updateSessionAttribute(req, VIEW_CAP, errors);
            redirectTo(res, `/viewCaps?cannotDelete=${name}`);
            return;
        }

        await deleteCap(id, noc);

        redirectTo(res, '/viewCaps');
        return;
    } catch (error) {
        const message = 'There was a problem deleting the cap';
        redirectToError(res, message, 'api.deleteCap', error);
    }
};
