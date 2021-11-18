import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { exportEnabled } from '../../constants/featureFlag';
import { getNetexSignedUrl, getS3Exports, getS3FolderCount, retrieveAndZipExportedNetexForNoc } from '../../data/s3';
import { MATCHING_DATA_BUCKET_NAME, NETEX_BUCKET_NAME } from '../../constants';

export interface Export {
    name: string;
    matchingDataCount: number;
    netexCount: number;
    signedUrl: string;
}

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (!exportEnabled) {
            redirectTo(res, '/home');
        }

        const noc = getAndValidateNoc(req, res);

        const exportNames = await getS3Exports(noc);

        const exports: Export[] = await Promise.all(
            exportNames.map(async (name) => {
                const prefix = `${noc}/exports/${name}/`;
                const matchingDataCount = await getS3FolderCount(MATCHING_DATA_BUCKET_NAME, prefix);

                const netexCount = await getS3FolderCount(NETEX_BUCKET_NAME, prefix);

                const complete = matchingDataCount === netexCount;

                let signedUrl = '';
                if (complete) {
                    const zipKey = await retrieveAndZipExportedNetexForNoc(noc, name);
                    signedUrl = await getNetexSignedUrl(zipKey || '');
                }

                return { name, matchingDataCount, netexCount, signedUrl };
            }),
        );

        res.status(200).json({
            exports,
        });
    } catch (error) {
        redirectToError(res, 'There was a problem getting the export progress', 'api.getExportProgress', error);
    }
};
