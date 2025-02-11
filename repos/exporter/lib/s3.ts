import { AWSError, S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { GetObjectOutput, PutObjectOutput } from 'aws-sdk/clients/s3';
const getS3Client = (): S3 => {
    let options: S3.ClientConfiguration = {
        region: 'eu-west-2',
    };

    if (process.env.NODE_ENV === 'development') {
        options = {
            s3ForcePathStyle: true,
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
            endpoint: 'http://127.0.0.1:4566',
            region: 'eu-west-2',
        };
    }

    return new S3(options);
};

const s3 = getS3Client();

export const getS3Object = (key: string, bucketName: string): Promise<PromiseResult<GetObjectOutput, AWSError>> => {
    try {
        return s3.getObject({ Key: key, Bucket: bucketName }).promise();
    } catch (e) {
        throw new Error(`Failed to get object from S3 Bucket: ${bucketName} with key: ${key}`);
    }
};

export const putS3Object = (
    key: string,
    bucketName: string,
    body: string,
): Promise<PromiseResult<PutObjectOutput, AWSError>> => {
    try {
        return s3.putObject({ Key: key, Bucket: bucketName, Body: body }).promise();
    } catch (e) {
        throw new Error(`Failed to put object in S3 Bucket: ${bucketName} with key: ${key}`);
    }
};
