import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectTo } from '../../utils/apiUtils';
import { ErrorInfo, ManageProductGroupWithErrors, NextApiRequestWithSession } from '../../interfaces';
import { getProductGroupByNameAndNocCode, insertProductGroup, updateProductGroup } from '../../data/auroradb';
import { removeExcessWhiteSpace } from '../..//utils/apiUtils/validator';
import { updateSessionAttribute } from '../../utils/sessions';
import { MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE } from '../../constants/attributes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    console.log('Point .1');
    const noc = getAndValidateNoc(req, res);
    const productIdsFromReq: string[] | undefined | string = req.body.productsToExport;

    const errors: ErrorInfo[] = [];
    const id = req.body.id && Number(req.body.id);
    const productGroupName = removeExcessWhiteSpace(req.body.productGroupName);
    const isInEditMode = id && Number.isInteger(id);

    console.log('Point .2');

    if (productGroupName.length < 2) {
        errors.push({ errorMessage: 'Name cannot be less than 2 characters', id: 'product-group-name' });
        console.log('name');
    }

    if (!productIdsFromReq || productIdsFromReq.length === 0) {
        errors.push({ errorMessage: 'Select product to be added in the group', id: '' });
        console.log('pridtid');
    }

    console.log('Point 1');
    let productIds: string[] = [];

    if (typeof productIdsFromReq === 'string') {
        productIds = [productIdsFromReq];
    } else {
        productIds = productIdsFromReq;
    }

    const productGroup = await getProductGroupByNameAndNocCode(noc, productGroupName);

    if (productGroup !== undefined) {
        if (id !== productGroup.id) {
            errors.push({
                id: 'product-group-name',
                errorMessage: `${productGroupName} already exists as a product group`,
            });
        }
    }

    if (errors.length) {
        console.log('in errors');
        const sessionInfo: ManageProductGroupWithErrors = {
            inputs: { id, productIds: productIds, name: productGroupName },
            errors,
        };

        updateSessionAttribute(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, sessionInfo);

        const location = isInEditMode ? `/manageProductGroup?id=${id}` : '/manageProductGroup';

        redirectTo(res, location);
        return;
    }

    console.log('Point 21');
    if (isInEditMode) {
        await updateProductGroup(id, noc, productIds, productGroupName);
    } else {
        await insertProductGroup(noc, productIds, productGroupName);
    }
    updateSessionAttribute(req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, undefined);
    redirectTo(res, '/viewProductGroups');
    return;
};
