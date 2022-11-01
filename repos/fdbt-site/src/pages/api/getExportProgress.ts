import { NextApiResponse } from 'next';
import { dateIsOverAnHourAgo, getAndValidateNoc, redirectToError } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import {
    checkIfMetaDataExists,
    getExportMetaData,
    getS3Exports,
    getS3FolderCount,
    retrieveExportZip,
} from '../../data/s3';
import { MATCHING_DATA_BUCKET_NAME, NETEX_BUCKET_NAME } from '../../constants';
import logger from '../../utils/logger';

export interface Export {
    name: string;
    matchingDataCount: number;
    netexCount: number;
    exportFailed: boolean;
    signedUrl?: string;
}

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const noc = getAndValidateNoc(req, res);

        const exportNames = await getS3Exports(noc);

        const exports: Export[] = await Promise.all(
            exportNames.map(async (name) => {
                const prefix = `${noc}/exports/${name}/`;

                logger.info('', {
                    context: 'api.getExportProgress',
                    message: 'Getting counts for matching data and netex',
                    exportName: name,
                });

                const matchingDataCount = await getS3FolderCount(MATCHING_DATA_BUCKET_NAME, prefix);
                const netexCount = await getS3FolderCount(NETEX_BUCKET_NAME, prefix);

                const complete = matchingDataCount === netexCount;

                const signedUrl = complete ? await retrieveExportZip(noc, name) : undefined;

                let metadata = undefined;
                const metaDataExists = await checkIfMetaDataExists(`${noc}/exports/${name}.json`);

                if (metaDataExists) {
                    metadata = await getExportMetaData(`${noc}/exports/${name}.json`);
                }

                let exportFailed = false;

                logger.info('', {
                    context: 'api.getExportProgress',
                    message: 'Metadata',
                    metadata,
                });

                if (
                    metadata &&
                    dateIsOverAnHourAgo(metadata.date) &&
                    metadata.numberOfExpectedNetexFiles !== netexCount
                ) {
                    exportFailed = true;
                }

                return { name, matchingDataCount, netexCount, signedUrl, exportFailed };
            }),
        );

        res.status(200).json({
            exports: exports.reverse(),
        });
    } catch (error) {
        redirectToError(res, 'There was a problem getting the export progress', 'api.getExportProgress', error);
    }
};
