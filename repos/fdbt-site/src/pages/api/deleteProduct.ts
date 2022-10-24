import { NextApiResponse } from 'next';
import { deleteProductByNocCodeAndId, getProductById } from '../../data/auroradb';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { deleteFromS3 } from '../../data/s3';
import { MATCHING_DATA_BUCKET_NAME, PRODUCTS_DATA_BUCKET_NAME } from '../../constants';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const id = Number(req.query?.id);

        if (!Number.isInteger(id)) {
            throw new Error('insufficient data provided for delete query');
        }

        const nationalOperatorCode = getAndValidateNoc(req, res);

        const product = await getProductById(nationalOperatorCode, id.toString());
        const { matchingJsonLink } = product;

        await deleteFromS3(matchingJsonLink, MATCHING_DATA_BUCKET_NAME);
        await deleteFromS3(matchingJsonLink, PRODUCTS_DATA_BUCKET_NAME);
        await deleteProductByNocCodeAndId(id, nationalOperatorCode);

        redirectTo(res, req.headers.referer ?? '/products/services');
    } catch (error) {
        redirectToError(res, 'There was a problem deleting the selected product', 'api.deleteProduct', error);
    }
};
