import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectTo } from '../../utils/apiUtils';
import { ErrorInfo, ManagePassengerTypeWithErrors, NextApiRequestWithSession } from '../../interfaces';
import { getS3Exports } from '../../data/s3';
import { getProductById, insertProductGroup, updateProductGroup } from '../../data/auroradb';
import { triggerExport } from '../../utils/apiUtils/export';
import { removeExcessWhiteSpace } from '../..//utils/apiUtils/validator';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {

    console.log("Point .1");
    const noc = getAndValidateNoc(req, res);
    const productIdsFromReq: string[] | undefined | string = req.body.productsToExport;
    //const productGroupName, id = req.body;

    const errors: ErrorInfo[] = [];
    const id = req.body.id && Number(req.body.id);
    const productGroupName = removeExcessWhiteSpace(req.body.productGroupName);
    const isInEditMode = id && Number.isInteger(id);

    console.log("Point .2");
    if (productGroupName.length < 2 ) {
        errors.push({errorMessage: 'Name cannot be less than 2 characters', id: ''});
        console.log("name");
    }

    if (!productIdsFromReq || productIdsFromReq.length === 0) {
        errors.push({errorMessage: 'Select product to be added in the group', id: ''});
        console.log("pridtid");
    }

    if (errors.length) {
        console.log("in errors");
        // const sessionInfo: ManagePassengerTypeWithErrors = {
        //     errors,
        // };

        // updateSessionAttribute(req, MANAGE_PASSENGER_TYPE_ERRORS_ATTRIBUTE, sessionInfo);

        const location = isInEditMode
            ? `/manageProductGroup?id=${id}`
            : '/manageProductGroup';

        redirectTo(res, location);
        return;

    }

    console.log("Point 1");
    let productIds: string[] = [];

    if (typeof productIdsFromReq === 'string') {
        productIds = [productIdsFromReq];
    } else {
        productIds = productIdsFromReq;
    }

    console.log("Point 21");
    if (isInEditMode) {
        await updateProductGroup(id, noc, productIds, productGroupName);
    } else {
        await insertProductGroup(
            noc,
            productIds,
            productGroupName,
        );
    }

    redirectTo(res, '/viewProductGroup');
    return;
};
