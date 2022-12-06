import { NextApiResponse } from 'next';
import { CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE } from '../../constants/attributes';
import { getProductGroupByNocAndId } from '../../data/auroradb';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const productGroupId = req.body.productGroupId as string | undefined;

        if (!productGroupId) {
            updateSessionAttribute(req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE, {
                errorMessage: 'Choose a group of products',
                id: 'product-group-0-radio',
            });
            redirectTo(res, '/selectCappedProductGroup');
            return;
        }

        const noc = getAndValidateNoc(req, res);

        const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.STAGE === 'test';

        if (!isDevOrTest) {
            const productCheck = await getProductGroupByNocAndId(noc, Number.parseInt(productGroupId));

            if (!productCheck) {
                updateSessionAttribute(req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE, {
                    errorMessage: 'Choose a group of products',
                    id: 'product-group-0-radio',
                });
                redirectTo(res, '/selectCappedProductGroup');
                return;
            }
        }

        updateSessionAttribute(req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE, productGroupId);
        redirectTo(res, '/createCaps');
        return;
    } catch (error) {
        const message = 'There was a problem in the Select Capped Product Group API:';
        redirectToError(res, message, 'api.selectCappedProductGroup', error);
    }
};
