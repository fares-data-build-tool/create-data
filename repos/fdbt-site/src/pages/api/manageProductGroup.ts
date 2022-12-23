import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectTo } from '../../utils/apiUtils';
import { ErrorInfo, ManageProductGroupWithErrors, NextApiRequestWithSession } from '../../interfaces';
import { getProductGroupByNameAndNocCode, insertProductGroup, updateProductGroup } from '../../data/auroradb';
import { removeExcessWhiteSpace } from '../..//utils/apiUtils/validator';
import { updateSessionAttribute } from '../../utils/sessions';
import { MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE } from '../../constants/attributes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const noc = getAndValidateNoc(req, res);
    const productIdsFromReq: string[] | undefined | string = req.body.productsSelected;

    const errors: ErrorInfo[] = [];
    const id = req.body.id && Number(req.body.id);
    const productGroupName = removeExcessWhiteSpace(req.body.productGroupName);
    const isInEditMode = id && Number.isInteger(id);

    if (productGroupName.length <= 2) {
        errors.push({ errorMessage: 'Name cannot be less than 2 characters', id: 'product-group-name' });
    }

    if (!productIdsFromReq || productIdsFromReq.length === 0) {
        errors.push({ errorMessage: 'Select at least one product to add to the group', id: '' });
    }

    let productIds: string[] = [];

    if (typeof productIdsFromReq === 'string') {
        productIds = [productIdsFromReq];
    } else {
        productIds = productIdsFromReq ? productIdsFromReq : [];
    }

    const productGroup = await getProductGroupByNameAndNocCode(noc, productGroupName);

    if (!!productGroup) {
        if (id !== productGroup.id) {
            errors.push({
                id: 'product-group-name',
                errorMessage: `${productGroupName} already exists as a product group name`,
            });
        }
    }

    if (errors.length > 0) {
        const attributeInfo: ManageProductGroupWithErrors = {
            inputs: { id, productIds: productIds, name: productGroupName },
            errors,
        };

        updateSessionAttribute(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, attributeInfo);

        const location = isInEditMode ? `/manageProductGroup?id=${id}` : '/manageProductGroup';

        redirectTo(res, location);
        return;
    }

    if (isInEditMode) {
        await updateProductGroup(id, noc, productIds, productGroupName);
    } else {
        await insertProductGroup(noc, productIds, productGroupName);
    }
    updateSessionAttribute(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, undefined);
    redirectTo(res, '/viewProductGroups');
    return;
};
