import AWS from 'aws-sdk';

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
}

export interface StageName {
    stageName: string;
}

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

export const getUserData = async (uuid: string): Promise<UserFareStages> => {
    if (!process.env.USER_DATA_BUCKET_NAME) {
        throw new Error('Environment variable for validated bucket not set');
    }

    console.log(uuid);

    const params: S3ObjectParameters = {
        Bucket: process.env.USER_DATA_BUCKET_NAME,
        Key: `${uuid}.json`,
    };
    const response = await s3.getObject(params).promise();
    const dataAsString = response.Body?.toString('utf-8') ?? '';

    const userData: UserFareStages = JSON.parse(dataAsString);

    return userData;
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
