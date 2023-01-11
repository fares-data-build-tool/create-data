import { NextApiResponse } from 'next';
import { deleteProductsByNocCode, getAllProductsByNoc } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { deleteMultipleObjectsFromS3 } from '../../data/s3';
import { PRODUCTS_DATA_BUCKET_NAME } from '../../constants';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            const nationalOperatorCode = getAndValidateNoc(req, res);
            const products = await getAllProductsByNoc(nationalOperatorCode);

            const matchingJsonLinks = products.map((product) => product.matchingJsonLink);
            if (matchingJsonLinks.length > 0) {
                await deleteMultipleObjectsFromS3(matchingJsonLinks, PRODUCTS_DATA_BUCKET_NAME);
                await deleteProductsByNocCode(nationalOperatorCode);
            }
        }
        redirectTo(res, '/home');
    } catch (error) {
        redirectToError(res, 'There was a problem deleting the all products', 'api.deleteAllProducts', error);
    }
};
