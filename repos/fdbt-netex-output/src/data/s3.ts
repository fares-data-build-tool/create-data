import { S3Event } from 'aws-lambda';
import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

export const getObject = async (bucket: string, key: string, originalFilename: string): Promise<string| null> => { 
    try {
        const input = {
            Bucket: bucket,
            Key: key,
            ResponseContentDisposition: 'attachment; filename ="' + originalFilename + '"',
        };
        const command = new GetObjectCommand(input);
        const response = await s3.send(command);
        return (await response.Body?.transformToString()) ?? null;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get item from s3: ${error.stack || ''}`);
        }

        throw error;
    }
};

export const putObject = async (
    bucket: string,
    key: string,
    body: string | Blob | Uint8Array | Buffer,
    contentType: string,
): Promise<void> => {
    try {
        const input = {
            Body: body,
            Bucket: bucket,
            Key: key,
            ContentType: contentType
        };
        const command = new PutObjectCommand(input);
        await s3.send(command);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to put item into s3: ${error.stack || ''}`);
        }

        throw error;
    }
};

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
}

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


export const getFileFromS3 = async (params: S3ObjectParameters): Promise<string> => {
    const data = await getObject(params.Bucket, params.Key, params.Key)
    return data || ""
};

export const fileNameExistsAlready = async (fileName: string): Promise<boolean> => {
    try {
        const s3BucketName = process.env.UNVALIDATED_NETEX_BUCKET as string;

        const params: S3ObjectParameters = {
            Bucket: s3BucketName,
            Key: fileName,
        };

        const dataAsString: string = await getFileFromS3(params);

        return !!JSON.parse(dataAsString);
    } catch (err) {
        return false;
    }
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
        throw new Error(`Error in retrieving data. ${(err as Error).stack}`);
    }
};

export const uploadNetexToS3 = async (netex: string, fileName: string): Promise<void> => {
    try {
        console.info(`Uploading file: ${fileName}`);

        await putObject(
            process.env.UNVALIDATED_NETEX_BUCKET as string,
            fileName,
            Buffer.from(netex, 'binary'),
            'application/xml',
        )

    } catch (err) {
        throw new Error(`Error uploading netex to S3. ${(err as Error).stack}`);
    }
};
