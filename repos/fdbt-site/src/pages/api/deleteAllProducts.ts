import { NextApiResponse } from 'next';
import { deleteProductByNocCodeAndId, getAllProductsByNoc } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { deleteFromS3 } from '../../data/s3';
import { PRODUCTS_DATA_BUCKET_NAME } from '../../constants';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            const nationalOperatorCode = getAndValidateNoc(req, res);
            const products = await getAllProductsByNoc(nationalOperatorCode);

            for (const product of products) {
                await deleteFromS3(product.matchingJsonLink, PRODUCTS_DATA_BUCKET_NAME);
                await deleteProductByNocCodeAndId(Number(product.id), nationalOperatorCode);
            }
        }
        redirectTo(res, '/home');
    } catch (error) {
        redirectToError(res, 'There was a problem deleting the all products', 'api.deleteAllProducts', error);
    }
};
