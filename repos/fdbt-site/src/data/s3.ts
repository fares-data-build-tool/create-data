import { TicketWithIds } from '../../shared/matchingJsonTypes';
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
import { MatchingFareZones } from '../interfaces/matchingInterface';
import logger from '../utils/logger';
import { PassThrough } from 'stream';
import archiver, { Archiver } from 'archiver';

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
        logger.info('', {
            context: 'data.s3',
            message: 'retrieving matching json from S3',
            path,
        });

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
        logger.info('', {
            context: 'data.s3',
            message: 'retrieving products matching json from S3',
            path,
        });

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

export const getOutboundMatchingFareStages = async (uuid: string): Promise<MatchingFareZones> => {
    const params = {
        Bucket: USER_DATA_BUCKET_NAME,
        Key: `return/outbound/${uuid}.json`,
    };

    try {
        logger.info('', {
            context: 'data.s3',
            message: 'retrieving outbound matching fare stages from S3',
            uuid,
        });

        const response = await s3.getObject(params).promise();
        const dataAsString = response.Body?.toString('utf-8') ?? '';

        return JSON.parse(dataAsString) as MatchingFareZones;
    } catch (error) {
        throw new Error(`Could not retrieve outbound matching fare zones from S3: ${error.stack}`);
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

export const retrieveAndZipExportedNetexForNoc = async (noc: string, exportName: string): Promise<string> => {
    const prefix = `${noc}/zips/${exportName}/`;
    const zipResponse = await s3
        .listObjectsV2({
            Bucket: NETEX_BUCKET_NAME,
            Prefix: prefix,
        })
        .promise();

    const zips = zipResponse.Contents?.length;
    const zipKey = `${prefix}/${exportName}.zip`;

    if (!zips) {
        const response = await s3
            .listObjectsV2({
                Bucket: NETEX_BUCKET_NAME,
                Prefix: `${noc}/exports/${exportName}/`,
            })
            .promise();

        const allFiles = response.Contents?.map((it) => it.Key || '') ?? [];

        await zipFiles(allFiles, zipKey);
    }

    return zipKey;
};

export const zipFiles = async (allFiles: string[], zipKey: string): Promise<void> => {
    const s3 = getS3Client();

    const archive: Archiver = archiver('zip', {
        zlib: { level: 9 }, // Sets the compression level.
    });

    const pass = new PassThrough();
    archive.pipe(pass);

    await Promise.all(
        allFiles.map(async (it) => {
            const obj = await s3.getObject({ Bucket: NETEX_BUCKET_NAME, Key: it }).promise();
            if (obj.Body) {
                archive.append(obj.Body as string, { name: it.split('/')[it.split('/').length - 1] });
            }
        }),
    );

    await archive.finalize();
    await s3.upload({ Bucket: NETEX_BUCKET_NAME, Key: zipKey, Body: pass }).promise();
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
