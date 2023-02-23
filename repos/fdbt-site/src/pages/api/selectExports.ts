import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectTo } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { getS3Exports } from '../../data/s3';
import { getProductById } from '../../data/auroradb';
import { triggerExport } from '../../utils/apiUtils/export';
import { updateSessionAttribute } from '../../utils/sessions';
import { SELECT_EXPORTS_ATTRIBUTE } from '../../constants/attributes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const noc = getAndValidateNoc(req, res);
    const productIdsFromReq: string[] | undefined | string = req.body.productsToExport;

    if (!productIdsFromReq || productIdsFromReq.length === 0) {
        redirectTo(res, '/products/selectExports');
        return;
    }

    let productIds: string[] = [];

    if (typeof productIdsFromReq === 'string') {
        productIds = [productIdsFromReq];
    } else {
        productIds = productIdsFromReq;
    }

    const products = await Promise.all(productIds.map(async (productId) => await getProductById(noc, productId)));

    const [date] = new Date().toISOString().split('T');
    const currentDateString = date.split('-').join('_');

    const exportNameBase = `${noc}_${currentDateString}`;
    let i = 0;
    let exportName = exportNameBase;
    const exports = await getS3Exports(noc);

    while (exports.find((exportToCheck) => exportToCheck === exportName)) {
        i++;
        exportName = exportNameBase + '_' + i;
    }

    const links = products.map((product) => product.matchingJsonLink);

    await triggerExport({ noc, paths: links, exportPrefix: exportName });
    const currTime = new Date().getTime() / 1000;
    updateSessionAttribute(req, SELECT_EXPORTS_ATTRIBUTE, { exportStarted: currTime.toString() });
    redirectTo(res, '/products/exports?exportStarted=true');
    return;
};
