import { NextApiResponse } from 'next';
import {
    deleteSalesOfferPackageByNocCodeAndName,
    getAllProductsByNoc,
    getSalesOfferPackageByIdAndNoc,
} from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils/index';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getProductsMatchingJson } from 'src/data/s3';
import { updateSessionAttribute } from 'src/utils/sessions';
import { VIEW_PURCHASE_METHOD } from 'src/constants/attributes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { query } = req;
        const id = Number(query?.id);

        if (!Number.isInteger(id)) {
            throw new Error('insufficient data provided for delete query');
        }
        const nocCode = getAndValidateNoc(req, res);

        const products = await getAllProductsByNoc(nocCode);
        const matchingJsonLinks = products.map((product) => product.matchingJsonLink);
        const tickets = await Promise.all(
            matchingJsonLinks.map(async (link) => {
                return await getProductsMatchingJson(link);
            }),
        );

        let productsUsingPurchaseMethod = [];
        for (const ticket of tickets) {
            for (const salesOfferPackage of ticket.products[0].salesOfferPackages) {
                if (salesOfferPackage.id === id) {
                    productsUsingPurchaseMethod.push(ticket);
                }
            }
        }

        if (productsUsingPurchaseMethod.length > 0) {
            const purchaseDetails = await getSalesOfferPackageByIdAndNoc(id, nocCode);
            const { name } = purchaseDetails;
            const errorMessage = `You cannot delete ${name} because it is being used in ${productsUsingPurchaseMethod.length} products.`;
            const errors: ErrorInfo[] = [{ id: `${id}`, errorMessage }];
            updateSessionAttribute(req, VIEW_PURCHASE_METHOD, errors);
            redirectTo(res, `/viewPurchaseMethods?cannotDelete=${name}`);
            return;
        }

        await deleteSalesOfferPackageByNocCodeAndName(id, nocCode);

        redirectTo(res, '/viewPurchaseMethods');
    } catch (error) {
        const message = 'There was a problem deleting the selected SOP:';

        redirectToError(res, message, 'api.deletePurchaseMethod', error);
    }
};
