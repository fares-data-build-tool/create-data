import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
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

export const getFileFromS3 = async (params: S3ObjectParameters): Promise<string> => {
    const data = await s3.getObject(params).promise();
    return data.Body?.toString('utf-8') ?? '';
};

export const fetchDataFromS3 = async <T>(event: S3Event, isEmailer = false): Promise<T> => {
    try {
        const s3BucketName: string = !isEmailer
            ? event.Records[0].s3.bucket.name
            : process.env.MATCHING_DATA_BUCKET || '';

        const s3FileName: string = !isEmailer
            ? decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))
            : event.Records[0].s3.object.key.replace('.xml', '.json');

        const params: S3ObjectParameters = {
            Bucket: s3BucketName,
            Key: s3FileName,
        };

        const dataAsString: string = await getFileFromS3(params);

        return JSON.parse(dataAsString);
    } catch (err) {
        throw new Error(`Error in retrieving data. ${err.stack}`);
    }
};
