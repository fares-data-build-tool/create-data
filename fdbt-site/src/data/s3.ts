import AWS from 'aws-sdk';

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
    if (!process.env.USER_DATA_BUCKET_NAME) {
        throw new Error('Environment variable for validated bucket not set');
    }

    const params = {
        Bucket: process.env.USER_DATA_BUCKET_NAME,
        Key: `${uuid}.json`,
    };
    const response = await s3.getObject(params).promise();
    const dataAsString = response.Body?.toString('utf-8') ?? '';

    return JSON.parse(dataAsString);
};

export const putStringInS3 = async (
    bucketName: string,
    key: string,
    text: string,
    contentType: string,
): Promise<void> => {
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

    if (!process.env.USER_DATA_BUCKET_NAME || !process.env.RAW_USER_DATA_BUCKET_NAME) {
        throw new Error('Bucket name environment variables not set.');
    }

    if (processed) {
        bucketName = process.env.USER_DATA_BUCKET_NAME;
        contentType = 'application/json; charset=utf-8';
    } else {
        bucketName = process.env.RAW_USER_DATA_BUCKET_NAME;
        contentType = 'text/csv; charset=utf-8';
    }

    await putStringInS3(bucketName, key, JSON.stringify(data), contentType);
};
