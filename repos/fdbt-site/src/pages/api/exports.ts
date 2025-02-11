import { NextApiResponse } from 'next';
import { getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { getS3Exports } from '../../data/s3';
import { getAllProductsByNoc } from '../../data/auroradb';
import { getNonExpiredProducts, triggerExport } from '../../utils/apiUtils/export';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const noc = getAndValidateNoc(req, res);
    const products = await getAllProductsByNoc(noc);
    // 1. filter out multi-operator 'external' and expired products
    const productsWithoutMultiOperatorExternal = products.filter((product) => product.fareType !== 'multiOperatorExt');
    const nonExpiredProducts = getNonExpiredProducts(productsWithoutMultiOperatorExternal);

    // 2. figure out the name of the file
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

    const links = nonExpiredProducts.map((product) => product.matchingJsonLink);

    await triggerExport({ noc, paths: links, exportPrefix: exportName });

    res.status(204).send('');
};
