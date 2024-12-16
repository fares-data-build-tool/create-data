import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const getObject = async (
    s3: S3Client,
    bucket: string,
    key: string,
    originalFilename: string,
): Promise<string | null> => {
    try {
        const input = {
            Bucket: bucket,
            Key: key,
            ResponseContentDisposition: 'attachment; filename ="' + originalFilename + '"',
        };
        const response = await s3.send(new GetObjectCommand(input));
        return (await response.Body?.transformToString()) ?? null;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get item from s3: ${error.stack || ''}`);
        }

        throw error;
    }
};

export const putObject = async (
    s3: S3Client,
    bucket: string,
    key: string,
    body: string | Blob | Uint8Array | Buffer,
): Promise<void> => {
    try {
        const input = {
            Body: body,
            Bucket: bucket,
            Key: key,
        };
        await s3.send(new PutObjectCommand(input));
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to put item into s3: ${error.stack || ''}`);
        }

        throw error;
    }
};
