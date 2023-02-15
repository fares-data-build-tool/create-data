import { NextApiResponse } from 'next';
import {
    deleteTimeRestrictionByIdAndNocCode,
    getAllProductsByNoc,
    getTimeRestrictionByIdAndNoc,
} from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getProductsMatchingJson } from '../../data/s3';
import { updateSessionAttribute } from '../../utils/sessions';
import { VIEW_TIME_RESTRICTION } from '../../constants/attributes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;

        const id = Number(query?.id);

        const nationalOperatorCode = getAndValidateNoc(req, res);

        const products = await getAllProductsByNoc(nationalOperatorCode);
        const matchingJsonLinks = products.map((product) => product.matchingJsonLink);
        const tickets = await Promise.all(
            matchingJsonLinks.map(async (link) => {
                return await getProductsMatchingJson(link);
            }),
        );

        const productsUsingTimeRestrictions = tickets.filter((t) => t.timeRestriction?.id === id);

        if (productsUsingTimeRestrictions.length > 0) {
            const timeRestrictionDetails = await getTimeRestrictionByIdAndNoc(id, nationalOperatorCode);
            const { name } = timeRestrictionDetails;
            const errorMessage = `You cannot delete ${name} because it is being used in ${productsUsingTimeRestrictions.length} product(s).`;
            const errors: ErrorInfo[] = [{ id: `${id}`, errorMessage }];
            updateSessionAttribute(req, VIEW_TIME_RESTRICTION, errors);
            redirectTo(res, `/viewTimeRestrictions`);
            return;
        }

        await deleteTimeRestrictionByIdAndNocCode(id, nationalOperatorCode);

        redirectTo(res, '/viewTimeRestrictions');
    } catch (error) {
        const message = 'There was a problem deleting the time restriction';

        redirectToError(res, message, 'api.deletePassenger', error);
    }
};
