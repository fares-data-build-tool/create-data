import { NextApiResponse } from 'next';
import { MATCHING_DATA_BUCKET_NAME, NETEX_BUCKET_NAME, UNVALIDATED_NETEX_BUCKET_NAME } from '../../constants';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { deleteExport } from '../../data/s3';
import { NextApiRequestWithSession } from '../../interfaces';
import logger from '../../utils/logger';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const isDevelopment = process.env.NODE_ENV === 'development';
        const isTest = process.env.STAGE === 'test';

        if (!isDevelopment && !isTest) {
            throw new Error('Cancel export API called in non test or development environment.');
        }

        const { exportName } = req.body;

        logger.info('', {
            context: 'cancelExport.ts',
            message: `Cancelling export for ${exportName}`,
        });

        await deleteExport(exportName, MATCHING_DATA_BUCKET_NAME);
        await deleteExport(exportName, NETEX_BUCKET_NAME);
        await deleteExport(exportName, UNVALIDATED_NETEX_BUCKET_NAME);

        redirectTo(res, '/products/exports');
    } catch (error) {
        const message = 'There was a problem cancelling the export:';
        redirectToError(res, message, 'api.cancelExport', error);
    }
};
