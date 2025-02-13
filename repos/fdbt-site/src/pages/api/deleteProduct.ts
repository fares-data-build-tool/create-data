import { NextApiResponse } from 'next';
import { deleteProductByNocCodeAndId, getProductById } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { deleteMultipleObjectsFromS3, getProductsMatchingJson } from '../../data/s3';
import { PRODUCTS_DATA_BUCKET_NAME } from '../../constants';
import { getAdditionalNocMatchingJsonLink } from '../../utils';
import { getAdditionalNocsFromTicket } from '../../utils/apiUtils/userData';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const id = Number(req.query?.id);

        if (!Number.isInteger(id)) {
            throw new Error('insufficient data provided for delete query');
        }

        const nationalOperatorCode = getAndValidateNoc(req, res);

        const product = await getProductById(nationalOperatorCode, id.toString());
        const matchingJsonLinks = [product.matchingJsonLink];

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

        await deleteMultipleObjectsFromS3(matchingJsonLinks, PRODUCTS_DATA_BUCKET_NAME);
        await deleteProductByNocCodeAndId(id, nationalOperatorCode);

        redirectTo(res, req.headers.referer ?? '/products/services');
    } catch (error) {
        redirectToError(res, 'There was a problem deleting the selected product', 'api.deleteProduct', error);
    }
};
