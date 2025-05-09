import {
    GetObjectCommand,
    GetObjectCommandInput,
    GetObjectCommandOutput,
    ListObjectsV2Command,
    ListObjectsV2CommandInput,
    ListObjectsV2CommandOutput,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { PassThrough } from 'node:stream';

const replaceSpecialCharacters = (input: string) => input.replace(/[^a-zA-Z0-9._!\*\'\(\)\/-]/g, '_');

const client = new S3Client({
    region: 'eu-west-2',
    ...(process.env.NODE_ENV === 'development'
        ? {
              s3ForcePathStyle: true,
              accessKeyId: 'S3RVER',
              secretAccessKey: 'S3RVER',
              endpoint: 'http://127.0.0.1:4566',
              region: 'eu-west-2',
          }
        : {}),
});

export const listS3Objects = async (input: ListObjectsV2CommandInput): Promise<ListObjectsV2CommandOutput> =>
    client.send(new ListObjectsV2Command(input));

export const getS3Object = async (input: GetObjectCommandInput): Promise<GetObjectCommandOutput> =>
    client.send(
        new GetObjectCommand({
            ...input,
            Key: input.Key ? decodeURIComponent(input.Key) : undefined,
        }),
    );

export const putS3Object = (input: PutObjectCommandInput): Promise<PutObjectCommandOutput> =>
    client.send(
        new PutObjectCommand({
            ...input,
            Key: input.Key ? replaceSpecialCharacters(input.Key) : undefined,
        }),
    );

export const startS3Upload = (
    bucket: string,
    key: string,
    body: PassThrough | Uint8Array,
    contentType: string,
    queueSize = 4,
    partSize = 1024 * 1024 * 5,
    leavePartsOnError = false,
): Upload =>
    new Upload({
        client,
        params: {
            Bucket: bucket,
            Key: replaceSpecialCharacters(key),
            Body: body,
            ContentType: contentType,
        },
        queueSize,
        partSize,
        leavePartsOnError,
    });
