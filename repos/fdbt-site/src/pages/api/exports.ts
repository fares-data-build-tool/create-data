import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectTo } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { getS3Exports } from '../../data/s3';
import { getAllProducts } from '../../data/auroradb';
import { triggerExport } from '../../utils/apiUtils/export';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const noc = getAndValidateNoc(req, res);
    const products = await getAllProducts(noc);

    const [date, time] = new Date().toISOString().split('T');
    const currentDateTimeString = date + '_' + time.substr(0, 6).replace(/:/g, '');

    const exportNameBase = `${noc}_${currentDateTimeString}`;
    let i = 0;
    let exportName = exportNameBase;
    const exports = await getS3Exports(noc);
    while (exports.find((exportToCheck) => exportToCheck === exportName)) {
        i++;
        exportName = exportNameBase + '_' + i;
    }

    const links = products.map((product) => product.matchingJsonLink);

    await triggerExport({ noc, paths: links, exportPrefix: exportName });

    redirectTo(res, '/products/exports');
};
