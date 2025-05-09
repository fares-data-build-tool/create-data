import { Handler } from 'aws-lambda';
import { ZipperLambdaBody } from 'fdbt-types/integrationTypes';
import 'source-map-support/register';
import { PassThrough } from 'stream';
import archiver, { Archiver } from 'archiver';
import { getS3Object, listS3Objects, putS3Object, startS3Upload } from './s3';

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
    const zipResponse = await listS3Objects({
        Bucket: NETEX_BUCKET,
        Prefix: prefix,
    });

    const zips = zipResponse.Contents?.length;
    const zipKey = `${prefix}${exportName}.zip`;

    if (!zips) {
        // show that we have started the import
        await putS3Object({ Bucket: NETEX_BUCKET, Key: zipKey + '_started', Body: 'started' });

        const listAllNetex = await listS3Objects({
            Bucket: NETEX_BUCKET,
            Prefix: `${noc}/exports/${exportName}/`,
        });

        const allNetex = listAllNetex.Contents?.map((it) => it.Key || '') ?? [];

        await zipFiles(allNetex, zipKey);
    }
};

export const zipFiles = async (allFiles: string[], zipKey: string): Promise<void> => {
    const archive: Archiver = archiver('zip', {
        zlib: { level: 9 }, // Sets the compression level.
    });

    const pass = new PassThrough();
    const s3Upload = startS3Upload(NETEX_BUCKET, zipKey, pass, 'application/zip');

    archive.pipe(pass);

    await Promise.all(
        allFiles.map(async (key) => {
            const obj = await getS3Object({ Bucket: NETEX_BUCKET, Key: key });
            const body = await obj.Body?.transformToString('utf-8');

            if (!body) {
                throw new Error(`No body found for key: ${key}`);
            }

            const parts = key.split('/');
            archive.append(body, { name: parts[parts.length - 1] });
        }),
    );

    await archive.finalize();
    await s3Upload.done();
};
