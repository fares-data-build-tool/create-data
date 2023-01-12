import { NextApiResponse } from 'next';
import { getAndValidateNoc } from '../../utils/apiUtils';
import { NextApiRequestWithSession, EntityStatus } from '../../interfaces';
import { getS3Exports } from '../../data/s3';
import { getAllProductsByNoc, getBodsOrTndsServicesByNoc } from '../../data/auroradb';
import { triggerExport } from '../../utils/apiUtils/export';
import { getEntityStatus } from '../products/services';
import { DbProduct } from '../../interfaces/dbTypes';
import { getSessionAttribute } from '../../utils/sessions';
import { MULTI_MODAL_ATTRIBUTE } from '../../constants/attributes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const noc = getAndValidateNoc(req, res);
    const products = await getAllProductsByNoc(noc);
    const dataSource = !!getSessionAttribute(req, MULTI_MODAL_ATTRIBUTE) ? 'tnds' : 'bods';
    // 1. filter out expired products
    const nonExpiredProducts = getNonExpiredProducts(products);

    // 2. filter out products with no active services
    const nonExpiredProductsWithActiveServices = await filterOutProductsWithNoActiveServices(
        noc,
        nonExpiredProducts,
        dataSource,
    );

    // 3. figure out the name of the file
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

    const links = nonExpiredProductsWithActiveServices.map((product) => product.matchingJsonLink);

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

/**
 * For products that are associated with a service, it filters out products that
 * have no active services. Products not associated with a service stay and are
 * not removed.
 *
 *
 * @param noc the national operator code
 * @param products the list of non-expired products
 *
 * @returns a products array where the products have one or more active services.
 */
export const filterOutProductsWithNoActiveServices = async (
    noc: string,
    products: DbProduct[],
    dataSource: string,
): Promise<DbProduct[]> => {
    const lineIdsToKeep: string[] = [];

    const allBodsOrTndsServices = await getBodsOrTndsServicesByNoc(noc, dataSource);

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const lineId = product.lineId;

        if (!lineId) {
            // we have a product that is not associated with a service
            lineIdsToKeep.push(lineId);
        } else {
            const services = allBodsOrTndsServices.filter((service) => service.lineId === lineId);

            const activeServices = services.filter((service) => {
                const startDate = service.startDate;
                const endDate = service.endDate;

                const status = getEntityStatus(startDate, endDate);

                if (status === EntityStatus.Active) {
                    return true;
                }

                return false;
            });

            if (activeServices.length > 0) {
                lineIdsToKeep.push(lineId);
            }
        }
    }

    const nonExpiredProductsWithActiveServices = products.filter((product) => {
        return lineIdsToKeep.some((lineId) => lineId === product.lineId);
    });

    return nonExpiredProductsWithActiveServices;
};
