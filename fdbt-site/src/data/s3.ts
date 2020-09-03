import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import {
    USER_DATA_BUCKET_NAME,
    RAW_USER_DATA_BUCKET_NAME,
    NETEX_BUCKET_NAME,
    MATCHING_DATA_BUCKET_NAME,
} from '../constants';
import { MatchingFareZones } from '../interfaces/matchingInterface';
import logger from '../utils/logger';

export interface FareStage {
    stageName: string;
    prices: {
        price: string;
        fareZones: string[];
    }[];
}

export interface UserFareStages {
    fareStages: FareStage[];
}

export interface UserFareZone {
    FareZoneName: string;
    NaptanCodes: string;
    AtcoCodes: string;
}

const getS3Client = (): AWS.S3 => {
    let options: AWS.S3.ClientConfiguration = {
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

    return new AWS.S3(options);
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

        return JSON.parse(dataAsString);
    } catch (error) {
        throw new Error(`Could not retrieve fare stages from S3: ${error.stack}`);
    }
};

export const getCsvZoneUploadData = async (uuid: string): Promise<string[]> => {
    const params = {
        Bucket: USER_DATA_BUCKET_NAME,
        Key: `${uuid}.json`,
    };

    try {
        logger.info('', {
            context: 'data.s3',
            message: 'retrieving user csv zone data from S3',
            uuid,
        });

        const response = await s3.getObject(params).promise();

        const dataAsString = response.Body?.toString('utf-8') ?? '';

        const parsedData: UserFareZone[] = JSON.parse(dataAsString);

        const atcoCodes: string[] = parsedData.map(data => data.AtcoCodes);

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

        return JSON.parse(dataAsString);
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
        throw new Error(`Failed to get signed url for key: ${key}`);
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
    } catch (err) {
        throw new Error(`Failed to get matching data for key: ${key}`);
    }
};

export const retrieveNetexForNocs = async (nocList: string[]): Promise<AWS.S3.Object[]> => {
    try {
        const requestPromises = nocList.map(noc => {
            const request: AWS.S3.ListObjectsV2Request = {
                Bucket: NETEX_BUCKET_NAME,
                Prefix: noc,
            };

            return s3.listObjectsV2(request).promise();
        });

        const response = await Promise.all(requestPromises);

        return response.flatMap(item => item.Contents || []);
    } catch (error) {
        throw new Error('Failed to retrieve NeTEx from NOCs');
    }
};
