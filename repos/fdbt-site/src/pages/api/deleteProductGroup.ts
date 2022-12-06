import { NextApiResponse } from 'next';
import {
    deleteProductGroupByNocCodeAndId,
    // getAllProductsByNoc,
    // getProductGroupByNocAndId,
} from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';
//import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
// import { getProductsMatchingJson } from '../../data/s3';
// import { updateSessionAttribute } from '../../utils/sessions';
// import { VIEW_PRODUCT_GROUP } from '../../constants/attributes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;
        const id = Number(query?.id);

        if (!Number.isInteger(id)) {
            throw new Error('insufficient data provided for delete query');
        }
        const nocCode = getAndValidateNoc(req, res);

        // TODO: Code to be added after finalizing the structure of product group in capped ticket
        // const products = await getAllProductsByNoc(nocCode);
        // const matchingJsonLinks = products.map((product) => product.matchingJsonLink);

        // const tickets = await Promise.all(
        //     matchingJsonLinks.map(async (link) => {
        //         return await getProductsMatchingJson(link);
        //     }),
        // );

        // const ticketsWithProductGroup = tickets.filter(
        //     (ticket) => 'productGroupId' in ticket && ticket.productGroupId === id,
        // );
        // const productNames = ticketsWithProductGroup
        //     .map((ticket) =>
        //         ticket.products[0]
        //             ? 'productName' in ticket.products[0]
        //                 ? ticket.products[0].productName
        //                 : 'missing'
        //             : '',
        //     )
        //     .filter((product) => product !== 'missing');

        // if (ticketsWithProductGroup && ticketsWithProductGroup.length > 0) {
        //     const productGroup = await getProductGroupByNocAndId(id, nocCode);

        //     const name = productGroup ? productGroup.name : '';
        //     const errorMessage = `You cannot delete ${name} product group because ${
        //         productNames.length > 0
        //             ? `it is part of the following product(s): ${productNames?.join(', ')}.`
        //             : 'it is used in a product(s).'
        //     } `;
        //     const errors: ErrorInfo[] = [{ id: '/viewProductGroups', errorMessage }];

        //     updateSessionAttribute(req, VIEW_PRODUCT_GROUP, errors);
        //     redirectTo(res, `/viewProductGroups?cannotDelete=${name}`);
        //     return;
        // }

        await deleteProductGroupByNocCodeAndId(id, nocCode);

        redirectTo(res, '/viewProductGroups');
    } catch (error) {
        const message = 'There was a problem deleting the selected product group:';

        redirectToError(res, message, 'api.deleteProductGroup', error);
    }
};
