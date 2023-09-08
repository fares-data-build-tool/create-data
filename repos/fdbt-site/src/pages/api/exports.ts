import { NextApiResponse } from 'next';
import { getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession, EntityStatus } from '../../interfaces';
import { getS3Exports } from '../../data/s3';
import { getAllProductsByNoc } from '../../data/auroradb';
import { triggerExport } from '../../utils/apiUtils/export';
import { getEntityStatus } from '../products/services';
import { DbProduct } from '../../interfaces/dbTypes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const noc = getAndValidateNoc(req, res);
    const products = await getAllProductsByNoc(noc);
    // 1. filter out expired products
    const nonExpiredProducts = getNonExpiredProducts(products);

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

/**
 * Filters out expired product and returns only the non-expired products.
 *
 * @param products the unfiltered products list
 *
 * @returns only non-expired products are an array.
 */
export const getNonExpiredProducts = (products: DbProduct[]): DbProduct[] => {
    return products.filter((product) => {
        const status = getEntityStatus(product.startDate, product.endDate);

        if (status !== EntityStatus.Expired) {
            return true;
        }

        return false;
    });
};
