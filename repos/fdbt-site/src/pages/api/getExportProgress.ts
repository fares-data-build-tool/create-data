import { NextApiResponse } from 'next';
import { dateIsOverThirtyMinutesAgo, exportHasStarted, getAndValidateNoc, redirectToError } from '../../utils/apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import {
    checkIfMetaDataExists,
    getExportMetaData,
    getNetexFileNames,
    getS3Exports,
    getS3FolderCount,
    retrieveExportZip,
} from '../../data/s3';
import { MATCHING_DATA_BUCKET_NAME, NETEX_BUCKET_NAME } from '../../constants';
import logger from '../../utils/logger';
import { difference } from 'lodash';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { SELECT_EXPORTS_ATTRIBUTE } from '../../constants/attributes';

export interface Export {
    name: string;
    numberOfFilesExpected: number;
    netexCount: number;
    exportFailed: boolean;
    failedValidationFilenames: string[];
    signedUrl?: string;
}

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const noc = getAndValidateNoc(req, res);

        const exportNames = await getS3Exports(noc);
        const selectExportAttribute = getSessionAttribute(req, SELECT_EXPORTS_ATTRIBUTE);

        if (!!selectExportAttribute && exportHasStarted(selectExportAttribute.exportStarted)) {
            updateSessionAttribute(req, SELECT_EXPORTS_ATTRIBUTE, undefined);
        }

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

                let numberOfFilesExpected = matchingDataCount;

                let metadata = undefined;
                const metaDataExists = await checkIfMetaDataExists(`${noc}/exports/${name}.json`);

                if (metaDataExists) {
                    metadata = await getExportMetaData(`${noc}/exports/${name}.json`);
                    numberOfFilesExpected = metadata.numberOfExpectedNetexFiles;
                }

                let exportFailed = false;
                let failedValidationFilenames: string[] = [];

                if (
                    metadata &&
                    dateIsOverThirtyMinutesAgo(new Date(metadata.date)) &&
                    metadata.numberOfExpectedNetexFiles !== netexCount
                ) {
                    exportFailed = true;
                }

                if (exportFailed) {
                    const unvalidatedNetexFileNames = await getNetexFileNames(prefix, false);
                    const validatedNetexFileNames = await getNetexFileNames(prefix, true);
                    failedValidationFilenames = difference(unvalidatedNetexFileNames, validatedNetexFileNames);
                }

                const complete = matchingDataCount === netexCount;
                const signedUrl = complete ? await retrieveExportZip(noc, name) : undefined;

                return { name, numberOfFilesExpected, netexCount, signedUrl, exportFailed, failedValidationFilenames };
            }),
        );

        res.status(200).json({
            exports: exports.reverse(),
        });
    } catch (error) {
        redirectToError(res, 'There was a problem getting the export progress', 'api.getExportProgress', error);
    }
};
