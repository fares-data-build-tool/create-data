import { TicketWithIds } from 'fdbt-types/matchingJsonTypes';
import { S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import {
    USER_DATA_BUCKET_NAME,
    RAW_USER_DATA_BUCKET_NAME,
    NETEX_BUCKET_NAME,
    MATCHING_DATA_BUCKET_NAME,
    PRODUCTS_DATA_BUCKET_NAME,
} from '../constants';
import { Ticket, UserFareStages, UserFareZone } from '../interfaces';
import logger from '../utils/logger';
import { triggerZipper } from '../utils/apiUtils/export';
import { DeleteObjectsRequest, ListObjectsV2Request, ObjectIdentifierList, ObjectList } from 'aws-sdk/clients/s3';
import { objectKeyMatchesExportNameExactly } from '../utils';

const getS3Client = (): S3 => {
    let options: S3.ClientConfiguration = {
        region: 'eu-west-2',
    };

    if (process.env.NODE_ENV === 'development') {
        options = {
            s3ForcePathStyle: true,
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
            endpoint: 'http://localhost:4572',
        };
    }

    return new S3(options);
};

const s3 = getS3Client();

export const getUserFareStages = async (uuid: string): Promise<UserFareStages> => {
    const params = {
        Bucket: USER_DATA_BUCKET_NAME,
        Key: `${uuid}.json`,
    };

    try {
        logger.info('', {
            context: 'data.s3',
            message: 'retrieving user fare stages from S3',
            uuid,
        });

        const response = await s3.getObject(params).promise();
        const dataAsString = response.Body?.toString('utf-8') ?? '';

        return JSON.parse(dataAsString) as UserFareStages;
    } catch (error) {
        throw new Error(`Could not retrieve fare stages from S3: ${error.stack}`);
    }
};

export const getMatchingJson = async (path: string): Promise<Ticket> => {
    const params = {
        Bucket: MATCHING_DATA_BUCKET_NAME,
        Key: path,
    };

    try {
        const response = await s3.getObject(params).promise();
        const dataAsString = response.Body?.toString('utf-8') ?? '';

        return JSON.parse(dataAsString) as Ticket;
    } catch (error) {
        throw new Error(`Could not retrieve matching JSON from S3: ${error.stack}`);
    }
};

export const getProductsMatchingJson = async (path: string): Promise<TicketWithIds> => {
    const params = {
        Bucket: PRODUCTS_DATA_BUCKET_NAME,
        Key: path,
    };

    try {
        const response = await s3.getObject(params).promise();
        const dataAsString = response.Body?.toString('utf-8') ?? '';

        return JSON.parse(dataAsString) as TicketWithIds;
    } catch (error) {
        throw new Error(`Could not retrieve products matching JSON from S3: ${error.stack}`);
    }
};

export const getCsvZoneUploadData = async (key: string): Promise<string[]> => {
    const params = {
        Bucket: USER_DATA_BUCKET_NAME,
        Key: key,
    };

    try {
        logger.info('', {
            context: 'data.s3',
            message: 'retrieving user csv zone data from S3',
            key,
        });

        const response = await s3.getObject(params).promise();

        const dataAsString = response.Body?.toString('utf-8') ?? '';

        const parsedData: UserFareZone[] = JSON.parse(dataAsString);

        const atcoCodes: string[] = parsedData.map((data) => data.AtcoCodes);

        return atcoCodes;
    } catch (error) {
        throw new Error(`Could not retrieve Atco codes from S3: ${error.stack}`);
    }
};

export const putStringInS3 = async (
    bucketName: string,
    key: string,
    text: string,
    contentType: string,
): Promise<void> => {
    logger.info('', {
        context: 'data.s3',
        message: 'uploading string to S3',
        bucket: bucketName,
        key,
    });

    const request: AWS.S3.Types.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(text, 'binary'),
        ContentType: contentType,
    };

    await s3.putObject(request).promise();
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

export const getNetexSignedUrl = async (key: string): Promise<string> => {
    try {
        const request = {
            Bucket: NETEX_BUCKET_NAME,
            Key: key,
        };

        return s3.getSignedUrlPromise('getObject', request);
    } catch (error) {
        throw new Error(`Failed to get signed url for key: ${key}, ${error.stack}`);
    }
};

export const getMatchingDataObject = async (
    key: string,
): Promise<PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>> => {
    try {
        const request: AWS.S3.GetObjectRequest = {
            Bucket: MATCHING_DATA_BUCKET_NAME,
            Key: key,
        };

        return s3.getObject(request).promise();
    } catch (error) {
        throw new Error(`Failed to get matching data for key: ${key}, ${error.stack}`);
    }
};

export const retrieveNetexForNocs = async (nocList: string[]): Promise<AWS.S3.Object[]> => {
    try {
        const requestPromises = nocList.map((noc) => {
            const request: AWS.S3.ListObjectsV2Request = {
                Bucket: NETEX_BUCKET_NAME,
                Prefix: noc,
            };

            return s3.listObjectsV2(request).promise();
        });

        const response = await Promise.all(requestPromises);

        return response.flatMap((item) => item.Contents || []);
    } catch (error) {
        throw new Error(`Failed to retrieve NeTEx from NOCs, ${error.stack}`);
    }
};

export const retrieveExportZip = async (noc: string, exportName: string): Promise<string | undefined> => {
    const prefix = `${noc}/zips/${exportName}/`;
    const zipResponse = await s3
        .listObjectsV2({
            Bucket: NETEX_BUCKET_NAME,
            Prefix: prefix,
        })
        .promise();

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
    const response = await s3
        .listObjectsV2({
            Bucket: bucketName,
            Prefix: path,
            Delimiter: '/',
        })
        .promise();
    return (response.CommonPrefixes?.length ?? 0) + (response.Contents?.length ?? 0);
};

export const getS3Exports = async (noc: string): Promise<string[]> => {
    const response = await s3
        .listObjectsV2({
            Bucket: MATCHING_DATA_BUCKET_NAME,
            Prefix: `${noc}/exports/`,
            Delimiter: '/',
        })
        .promise();
    return (
        response.CommonPrefixes?.flatMap((prefix) => {
            const partsOfName = prefix.Prefix?.split('/');
            return partsOfName?.[partsOfName.length - 2] ?? [];
        }) || []
    );
};

export const deleteFromS3 = async (key: string, bucketName: string): Promise<void> => {
    try {
        logger.info('', {
            context: 'data.s3',
            message: `Deleting ${key} in ${bucketName}`,
        });
        const bucketParams = { Bucket: bucketName, Key: key };
        await s3.deleteObject(bucketParams).promise();
    } catch (error) {
        throw new Error(`Deletion of ${key} in ${bucketName} unsuccessful: ${(error as Error).stack}`);
    }
};

const listBucketObjects = async (bucket: string): Promise<ObjectList> => {
    const objects: {}[] = [];

    const getObjectsWithPaginationToken = async (continuationToken: string | undefined) => {
        const params: ListObjectsV2Request = {
            Bucket: bucket,
            ContinuationToken: continuationToken,
        };

        const listObjectsResponse = await s3.listObjectsV2(params).promise();

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
    const objectsInExport = allObjectsInBucket.filter((obj) =>
        objectKeyMatchesExportNameExactly(obj.Key as string, exportName),
    );

    const deleteParams: DeleteObjectsRequest = {
        Bucket: bucket,
        Delete: {
            Objects: objectsInExport.map((obj) => ({
                Key: obj.Key,
            })) as ObjectIdentifierList,
        },
    };

    await s3.deleteObjects(deleteParams).promise();
};
