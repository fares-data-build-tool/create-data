import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectTo } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { getS3Exports } from '../../data/s3';
import { getMultiOperatorExternalProductsByNoc } from '../../data/auroradb';
import { getActiveOrPendingProducts, triggerExport } from '../../utils/apiUtils/export';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const noc = getAndValidateNoc(req, res);

    const products = await getMultiOperatorExternalProductsByNoc(noc);
    const activeOrPendingProducts = getActiveOrPendingProducts(products);

    // 2. figure out the name of the file
    const [date] = new Date().toISOString().split('T');
    const currentDateString = date.split('-').join('_');

    const exportNameBase = `${noc}_MULTIOPERATOR_${currentDateString}`;
    let i = 0;
    let exportName = exportNameBase;
    const exports = await getS3Exports(noc);

    while (exports.find((exportToCheck) => exportToCheck === exportName)) {
        i++;
        exportName = exportNameBase + '_' + i;
    }

    const links = activeOrPendingProducts.map((product) => product.matchingJsonLink);

    await triggerExport({ noc, paths: links, exportPrefix: exportName });

    redirectTo(res, '/products/exports?exportStarted=true');
    return;
};
