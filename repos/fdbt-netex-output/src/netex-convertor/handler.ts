import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';

export interface s3ObjectParameters {
    Bucket: string;
    Key: string;
}

export interface fetchedData {
    Data: {};
}

export const setS3ObjectParams = (event: S3Event): s3ObjectParameters => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    return {
        Bucket: s3BucketName,
        Key: s3FileName,
    };
};

export const fetchDataFromS3AsJSON = async (parameters: s3ObjectParameters): Promise<JSON> => {
    try {
        const s3: AWS.S3 = new AWS.S3();
        const dataAsString: string = (await s3.getObject(parameters).promise()).Body?.toString('utf-8')!;
        return JSON.parse(dataAsString);
    } catch (err) {
        throw new Error(`Error in retrieving data.: ${err.message}`);
    }
};

export const s3NetexConvertorHandler = async (event: S3Event) => {
    try {
        const params = setS3ObjectParams(event);
        return fetchDataFromS3AsJSON(params);
    } catch (err) {
        throw new Error(err.message);
    }
};
