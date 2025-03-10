import { Lambda } from 'aws-sdk';
import { ExportLambdaBody, ZipperLambdaBody } from '../../interfaces/integrationTypes';
import { getProductStatus } from '../../pages/products/services';
import { DbProduct } from '../../interfaces/dbTypes';

const lambda = new Lambda({ region: 'eu-west-2' });

export const triggerExport = async (params: ExportLambdaBody): Promise<void> => {
    if (process.env.STAGE !== 'dev') {
        await lambda
            .invokeAsync({ FunctionName: `exporter-${process.env.STAGE}`, InvokeArgs: JSON.stringify(params) })
            .promise();
    }
};

export const triggerZipper = async (params: ZipperLambdaBody): Promise<void> => {
    if (process.env.STAGE !== 'dev') {
        await lambda
            .invokeAsync({ FunctionName: `zipper-${process.env.STAGE}`, InvokeArgs: JSON.stringify(params) })
            .promise();
    }
};

/**
 * Filters out expired product and returns only the non-expired products.
 *
 * @param products the unfiltered products list
 *
 * @returns only non-expired products are an array.
 */
export const getActiveOrPendingProducts = (products: DbProduct[]): DbProduct[] => {
    return products.filter((product) => {
        const status = getProductStatus(product.incomplete, product.startDate, product.endDate);
        return status === 'active' || status === 'pending';
    });
};
