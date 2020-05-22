import AWS from 'aws-sdk';
import { USER_DATA_BUCKET_NAME, RAW_USER_DATA_BUCKET_NAME } from '../constants';
import { MatchingFareZones } from '../interfaces/matchingInterface';

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
    let options = {};

    if (process.env.NODE_ENV === 'development') {
        options = {
            s3ForcePathStyle: true,
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
            endpoint: new AWS.Endpoint('http://localhost:4572'),
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
        console.info('retrieving user fare stages from S3', { uuid });

        const response = await s3.getObject(params).promise();
        const dataAsString = response.Body?.toString('utf-8') ?? '';

        return JSON.parse(dataAsString);
    } catch (err) {
        throw new Error(`Could not retrieve fare stages from S3: ${err.name}, ${err.message}`);
    }
};

export const getCsvZoneUploadData = async (uuid: string): Promise<string[]> => {
    const params = {
        Bucket: USER_DATA_BUCKET_NAME,
        Key: `${uuid}.json`,
    };

    try {
        console.info('retrieving user csv zone data from S3', { uuid });

        const response = await s3.getObject(params).promise();

        const dataAsString = response.Body?.toString('utf-8') ?? '';

        const parsedData: UserFareZone[] = JSON.parse(dataAsString);

        const atcoCodes: string[] = parsedData.map(data => data.AtcoCodes);

        return atcoCodes;
    } catch (err) {
        throw new Error(`Could not retrieve Atco codes from S3: ${err.name}, ${err.message}`);
    }
};

export const getOutboundMatchingFareStages = async (uuid: string): Promise<MatchingFareZones> => {
    const params = {
        Bucket: USER_DATA_BUCKET_NAME,
        Key: `return/outbound/${uuid}.json`,
    };

    try {
        console.info('retrieving outbound matching fare stages from S3', { uuid });

        const response = await s3.getObject(params).promise();
        const dataAsString = response.Body?.toString('utf-8') ?? '';

        return JSON.parse(dataAsString);
    } catch (err) {
        throw new Error(`Could not retrieve outbound matching fare zones from S3: ${err.stack}`);
    }
};

export const putStringInS3 = async (
    bucketName: string,
    key: string,
    text: string,
    contentType: string,
): Promise<void> => {
    console.info('uploading string to S3', { bucket: bucketName, key });

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

    console.info('uploading data to S3', { bucket: bucketName, key });

    await putStringInS3(bucketName, key, JSON.stringify(data), contentType);
};
