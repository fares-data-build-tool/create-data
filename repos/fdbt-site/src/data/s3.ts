import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    DeleteObjectsCommandInput,
    GetObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    ObjectIdentifier,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
    USER_DATA_BUCKET_NAME,
    RAW_USER_DATA_BUCKET_NAME,
    NETEX_BUCKET_NAME,
    MATCHING_DATA_BUCKET_NAME,
    PRODUCTS_DATA_BUCKET_NAME,
    EXPORT_METADATA_BUCKET_NAME,
    UNVALIDATED_NETEX_BUCKET_NAME,
} from '../constants';
import { UserFareStages, UserFareZone } from '../interfaces';
import logger from '../utils/logger';
import { triggerZipper } from '../utils/apiUtils/export';
import { objectKeyMatchesExportNameExactly } from '../utils';
import { Ticket, TicketWithIds } from '../interfaces/matchingJsonTypes';
import { ExportMetadata } from '../interfaces/integrationTypes';

const s3 =
    process.env.NODE_ENV === 'development'
        ? new S3Client({
              forcePathStyle: true,
              credentials: {
                  accessKeyId: 'S3RVER',
                  secretAccessKey: 'S3RVER',
              },
              endpoint: 'http://localhost:4572',
          })
        : new S3Client({ region: 'eu-west-2' });

export const getObject = async (bucket: string, key: string, originalFilename: string): Promise<string | null> => {
    logger.info('', {
        context: 'data.s3',
        message: 'getting item from s3',
    });

    try {
        const input = {
            Bucket: bucket,
            Key: key,
            ResponseContentDisposition: 'attachment; filename ="' + originalFilename + '"',
        };
        const response = await s3.send(new GetObjectCommand(input));
        return (await response.Body?.transformToString()) ?? null;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get item from s3: ${error.stack || ''}`);
        }

        throw error;
    }
};

export const getUserFareStages = async (uuid: string): Promise<UserFareStages> => {
    try {
        logger.info('', {
            context: 'data.s3',
            message: 'retrieving user fare stages from S3',
            uuid,
        });

        const response = await getObject(USER_DATA_BUCKET_NAME, `${uuid}.json`, `${uuid}.json`);
        const dataAsString = response?.toString() ?? '';

        return JSON.parse(dataAsString) as UserFareStages;
    } catch (error) {
        throw new Error(`Could not retrieve fare stages from S3: ${error.stack}`);
    }
};

export const getMatchingJson = async (path: string): Promise<Ticket> => {
    try {
        const response = await getObject(MATCHING_DATA_BUCKET_NAME, path, path);
        const dataAsString = response?.toString() ?? '';

        return JSON.parse(dataAsString) as Ticket;
    } catch (error) {
        throw new Error(`Could not retrieve matching JSON from S3: ${error.stack}`);
    }
};

export const getProductsMatchingJson = async (path: string): Promise<TicketWithIds> => {
    try {
        const response = await getObject(PRODUCTS_DATA_BUCKET_NAME, path, path);
        const dataAsString = response?.toString() ?? '';

        return JSON.parse(dataAsString) as TicketWithIds;
    } catch (error) {
        throw new Error(`Could not retrieve products matching JSON from S3: ${error.stack}`);
    }
};

export const getCsvZoneUploadData = async (key: string): Promise<string[]> => {
    try {
        logger.info('', {
            context: 'data.s3',
            message: 'retrieving user csv zone data from S3',
            key,
        });

        const response = await getObject(USER_DATA_BUCKET_NAME, key, key);
        const dataAsString = response?.toString() ?? '';

        const parsedData: UserFareZone[] = JSON.parse(dataAsString);

        const atcoCodes: string[] = parsedData.map((data) => data.AtcoCodes);

        return atcoCodes;
    } catch (error) {
        throw new Error(`Could not retrieve Atco codes from S3: ${error.stack}`);
    }
};

export const putStringInS3 = async (bucket: string, key: string, text: string, contentType: string): Promise<void> => {
    logger.info('', {
        context: 'data.s3',
        message: 'uploading string to s3',
        bucket: bucket,
        key,
    });

    try {
        const input = {
            Body: Buffer.from(text, 'binary'),
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
        };
        await s3.send(new PutObjectCommand(input));
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to put item into s3: ${error.stack || ''}`);
        }

        throw error;
    }
};

export const putDataInS3 = async (
    data: UserFareZone[] | UserFareStages | string,
    key: string,
    processed: boolean,
): Promise<void> => {
    let contentType = '';
    let bucketName = '';

    if (processed) {
        bucketName = USER_DATA_BUCKET_NAME;
        contentType = 'application/json; charset=utf-8';
    } else {
        bucketName = RAW_USER_DATA_BUCKET_NAME;
        contentType = 'text/csv; charset=utf-8';
    }

    logger.info('', {
        context: 'data.s3',
        message: 'uploading data to S3',
        bucket: bucketName,
        key,
    });

    await putStringInS3(bucketName, key, JSON.stringify(data), contentType);
};

export const getItem = async (bucket: string, key: string, originalFilename: string): Promise<string> => {
    logger.info('', {
        context: 'data.s3',
        message: 'getting item from s3',
    });

    try {
        const input = {
            Bucket: bucket,
            Key: key,
            ResponseContentDisposition: 'attachment; filename ="' + originalFilename + '"',
        };
        const url: string = await getSignedUrl(s3, new GetObjectCommand(input), { expiresIn: 3600 });
        return url;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get item from s3: ${error.stack || ''}`);
        }

        throw error;
    }
};

export const getNetexSignedUrl = async (key: string): Promise<string> => {
    try {
        return await getItem(NETEX_BUCKET_NAME, key, key);
    } catch (error) {
        throw new Error(`Failed to get signed url for key: ${key}, ${error.stack}`);
    }
};

export const retrieveExportZip = async (noc: string, exportName: string): Promise<string | undefined> => {
    const prefix = `${noc}/zips/${exportName}/`;
    const zipResponse = await s3.send(
        new ListObjectsV2Command({
            Bucket: NETEX_BUCKET_NAME,
            Prefix: prefix,
        }),
    );
    const zipReady = zipResponse.Contents?.some((object) => object.Key?.endsWith('.zip'));
    const zipStarted = zipResponse.Contents?.some((object) => object.Key?.endsWith('_started'));

    const zipKey = `${prefix}${exportName}.zip`;

    if (zipReady) {
        return await getNetexSignedUrl(zipKey);
    } else if (!zipStarted) {
        await triggerZipper({ noc, exportName });
    }

    return;
};

export const getS3FolderCount = async (bucketName: string, path: string): Promise<number> => {
    try {
        let objectCount = 0;

        const getObjectsWithContinuationToken = async (continuationToken: string | undefined) => {
            const listObjectsResponse = await s3.send(
                new ListObjectsV2Command({
                    Bucket: bucketName,
                    Prefix: path,
                    Delimiter: '/',
                    ContinuationToken: continuationToken,
                }),
            );

            if (listObjectsResponse.Contents || listObjectsResponse.CommonPrefixes) {
                objectCount =
                    objectCount +
                    (listObjectsResponse.CommonPrefixes?.length ?? 0) +
                    (listObjectsResponse.Contents?.length ?? 0);

                if (listObjectsResponse.NextContinuationToken) {
                    await getObjectsWithContinuationToken(listObjectsResponse.NextContinuationToken);
                }
            }
        };

        await getObjectsWithContinuationToken(undefined);

        return objectCount;
    } catch (error) {
        throw new Error(`Failed to get S3 folder count for ${bucketName} with path ${path}: ${error.stack}`);
    }
};

export const getS3Exports = async (noc: string): Promise<string[]> => {
    try {
        const exportNames: string[] = [];

        const getObjectsWithContinuationToken = async (continuationToken: string | undefined) => {
            const listObjectsResponse = await s3.send(
                new ListObjectsV2Command({
                    Bucket: MATCHING_DATA_BUCKET_NAME,
                    Prefix: `${noc}/exports/`,
                    Delimiter: '/',
                    ContinuationToken: continuationToken,
                }),
            );

            if (listObjectsResponse.CommonPrefixes) {
                listObjectsResponse.CommonPrefixes.forEach((prefix) => {
                    const partsOfName = prefix.Prefix?.split('/');
                    const partToReturn = partsOfName?.[partsOfName.length - 2];

                    if (partToReturn) {
                        exportNames.push(partToReturn);
                    }
                });

                if (listObjectsResponse.NextContinuationToken) {
                    await getObjectsWithContinuationToken(listObjectsResponse.NextContinuationToken);
                }
            }
        };

        await getObjectsWithContinuationToken(undefined);

        return exportNames;
    } catch (error) {
        throw new Error(`Failed to get S3 export names for ${noc}: ${error.stack}`);
    }
};

export const getNetexFileNames = async (path: string, validated: boolean): Promise<string[]> => {
    try {
        const netexFileNames: string[] = [];

        const getObjectsWithContinuationToken = async (continuationToken: string | undefined) => {
            const listObjectsResponse = await s3.send(
                new ListObjectsV2Command({
                    Bucket: validated ? NETEX_BUCKET_NAME : UNVALIDATED_NETEX_BUCKET_NAME,
                    Prefix: path,
                    Delimiter: '/',
                    ContinuationToken: continuationToken,
                }),
            );

            if (listObjectsResponse.Contents) {
                listObjectsResponse.Contents.forEach((content) => {
                    if (content.Key) {
                        netexFileNames.push(content.Key);
                    }
                });

                if (listObjectsResponse.NextContinuationToken) {
                    await getObjectsWithContinuationToken(listObjectsResponse.NextContinuationToken);
                }
            }
        };

        await getObjectsWithContinuationToken(undefined);

        return netexFileNames;
    } catch (error) {
        throw new Error(`Failed to retrieve NeTEx filenames, ${error.stack}`);
    }
};

export const deleteFromS3 = async (key: string, bucketName: string): Promise<void> => {
    try {
        logger.info('', {
            context: 'data.s3',
            message: `Deleting ${key} in ${bucketName}`,
        });
        const bucketParams = { Bucket: bucketName, Key: key };
        await s3.send(new DeleteObjectCommand(bucketParams));
    } catch (error) {
        throw new Error(`Deletion of ${key} in ${bucketName} unsuccessful: ${(error as Error).stack}`);
    }
};

export const deleteMultipleObjectsFromS3 = async (keys: string[], bucketName: string): Promise<void> => {
    try {
        logger.info('', {
            context: 'data.s3',
            message: `Deleting ${keys.join(', ')} in ${bucketName}`,
        });

        for (let i = 0; i <= keys.length / 1000; i++) {
            const batchKeys = keys.slice(1000 * i, 1000 * (i + 1));
            const bucketKeys = batchKeys.map((key) => ({ Key: key }));

            const bucketParams = {
                Bucket: bucketName,
                Delete: { Objects: bucketKeys },
            };
            await s3.send(new DeleteObjectsCommand(bucketParams));
        }
    } catch (error) {
        throw new Error(`Deletion of ${keys.join(', ')} in ${bucketName} unsuccessful: ${(error as Error).stack}`);
    }
};

const listBucketObjects = async (bucket: string): Promise<ListObjectsV2CommandOutput['Contents']> => {
    const objects: ListObjectsV2CommandOutput['Contents'] = [];

    const getObjectsWithPaginationToken = async (continuationToken: string | undefined) => {
        const listObjectsResponse = await s3.send(
            new ListObjectsV2Command({
                Bucket: bucket,
                ContinuationToken: continuationToken,
            }),
        );

        if (listObjectsResponse.Contents) {
            objects.push(...listObjectsResponse.Contents);

            if (listObjectsResponse.NextContinuationToken) {
                await getObjectsWithPaginationToken(listObjectsResponse.NextContinuationToken);
            }
        }
    };

    await getObjectsWithPaginationToken(undefined);

    return objects;
};

export const deleteExport = async (exportName: string, bucket: string): Promise<void> => {
    const allObjectsInBucket = await listBucketObjects(bucket);
    const objectsInExport = allObjectsInBucket?.filter((obj) =>
        objectKeyMatchesExportNameExactly(obj.Key as string, exportName),
    );

    const deleteParams: DeleteObjectsCommandInput = {
        Bucket: bucket,
        Delete: {
            Objects: objectsInExport?.map((obj) => ({
                Key: obj.Key,
            })) as Array<ObjectIdentifier>,
        },
    };
    await s3.send(new DeleteObjectsCommand(deleteParams));
};

export const getExportMetaData = async (key: string): Promise<ExportMetadata> => {
    try {
        const response = await getObject(EXPORT_METADATA_BUCKET_NAME, key, key);
        const dataAsString = response?.toString() ?? '';

        return JSON.parse(dataAsString) as ExportMetadata;
    } catch (error) {
        throw new Error(`Failed to get export metadata for key: ${key}, ${error.stack}`);
    }
};

export const checkIfMetaDataExists = async (key: string): Promise<boolean> => {
    try {
        await s3.send(
            new HeadObjectCommand({
                Bucket: EXPORT_METADATA_BUCKET_NAME,
                Key: key,
            }),
        );
        return true;
    } catch (error) {
        logger.info('', {
            context: 'data.s3.checkIfMetaDataExists',
            message: `Metadata does not exist for ${key}`,
        });
        return false;
    }
};
