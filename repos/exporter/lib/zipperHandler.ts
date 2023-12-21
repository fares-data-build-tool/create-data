import { Handler } from 'aws-lambda';
import { Upload } from '@aws-sdk/lib-storage';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { ZipperLambdaBody } from 'fdbt-types/integrationTypes';
import 'source-map-support/register';
import { PassThrough } from 'stream';
import archiver, { Archiver } from 'archiver';
import { getObject, putObject } from './s3';

const s3 = new S3Client({ region: 'eu-west-2' });

const NETEX_BUCKET = process.env.NETEX_BUCKET;
if (!NETEX_BUCKET) {
    throw new Error('Need to set NETEX_BUCKET');
}

export const handler: Handler<ZipperLambdaBody> = async ({ exportName, noc }) => {
    // populate the values from global settings using the IDs and write to matching data bucket
    console.log(`triggered zipper lambda... export: ${exportName} noc: ${noc}`);

    await retrieveAndZipExportedNetexForNoc(noc, exportName);
};

export const retrieveAndZipExportedNetexForNoc = async (noc: string, exportName: string): Promise<void> => {
    const prefix = `${noc}/zips/${exportName}/`;
    const command = new ListObjectsV2Command({
        Bucket: NETEX_BUCKET,
        Prefix: prefix,
    });
    const zipResponse = await s3.send(command);
    const zips = zipResponse.Contents?.length;
    const zipKey = `${prefix}${exportName}.zip`;

    if (!zips) {
        // show that we have started the import
        await putObject(s3, NETEX_BUCKET, zipKey + '_started', 'started');

        const command = new ListObjectsV2Command({
            Bucket: NETEX_BUCKET,
            Prefix: `${noc}/exports/${exportName}/`,
        });
        const listAllNetex = await s3.send(command);

        const allNetex = listAllNetex.Contents?.map((it) => it.Key || '') ?? [];

        await zipFiles(allNetex, zipKey);
    }
};

export const zipFiles = async (allFiles: string[], zipKey: string): Promise<void> => {
    const archive: Archiver = archiver('zip', {
        zlib: { level: 9 }, // Sets the compression level.
    });

    const pass = new PassThrough();
    const s3Upload = new Upload({
        client: s3,
        params: { Bucket: NETEX_BUCKET, Key: zipKey, Body: pass },
    }).done();

    archive.pipe(pass);

    await Promise.all(
        allFiles.map(async (key) => {
            const body = await getObject(s3, NETEX_BUCKET, key, key);

            if (!body) {
                throw new Error(`No body found for key: ${key}`);
            }

            const parts = key.split('/');
            archive.append(body.toString(), { name: parts[parts.length - 1] });
        }),
    );

    await archive.finalize();
    await s3Upload;
};
