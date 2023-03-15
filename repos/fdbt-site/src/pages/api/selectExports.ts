import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectTo } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { getS3Exports } from '../../data/s3';
import { getProductById } from '../../data/auroradb';
import { triggerExport } from '../../utils/apiUtils/export';

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

    // waiting 2 seconds before redirecting, to allow for export to start before redirecting back
    // because if we redirect immediately, the /exports page will render with initialExportIsInProgress = false
    // which will be incorrect.
    await new Promise(r => setTimeout(r, 2000));

    redirectTo(res, '/products/exports');
    return;
};
