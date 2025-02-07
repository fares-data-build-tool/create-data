import { NextApiResponse } from 'next';
import { deleteProductsByNocCode, getAllProductsByNoc } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { deleteMultipleObjectsFromS3, getProductsMatchingJson } from '../../data/s3';
import { PRODUCTS_DATA_BUCKET_NAME } from '../../constants';
import { getAdditionalNocMatchingJsonLink } from '../../utils';
import { getAdditionalNocsFromTicket } from '../../utils/apiUtils/userData';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const nationalOperatorCode = getAndValidateNoc(req, res);
        const products = await getAllProductsByNoc(nationalOperatorCode);

        if (products.length > 0 && (process.env.NODE_ENV === 'development' || process.env.STAGE === 'test')) {
            const matchingJsonLinks: string[] = [];

            for (const product of products) {
                matchingJsonLinks.push(product.matchingJsonLink);

                if (product.fareType === 'multiOperatorExt') {
                    const ticket = await getProductsMatchingJson(product.matchingJsonLink);
                    const additionalNocs = getAdditionalNocsFromTicket(ticket);

                    for (const additionalNoc of additionalNocs) {
                        const additionalNocMatchingJsonLink = getAdditionalNocMatchingJsonLink(
                            product.matchingJsonLink,
                            additionalNoc,
                        );
                        matchingJsonLinks.push(additionalNocMatchingJsonLink);
                    }
                }
            }

            await deleteMultipleObjectsFromS3(matchingJsonLinks, PRODUCTS_DATA_BUCKET_NAME);
            await deleteProductsByNocCode(nationalOperatorCode);
        }
        redirectTo(res, '/home');
        return;
    } catch (error) {
        redirectToError(res, 'There was a problem deleting the all products', 'api.deleteAllProducts', error);
    }
};
