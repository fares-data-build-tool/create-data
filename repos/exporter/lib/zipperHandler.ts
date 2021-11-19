import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { ZipperLambdaBody } from '../shared/integrationTypes';
import 'source-map-support/register';
import { NETEX_BUCKET_NAME } from '../../fdbt-site/src/constants';
import { PassThrough } from 'stream';
import archiver, { Archiver } from 'archiver';

const s3: S3 = new S3({
    region: 'eu-west-2',
});

const NETEX_BUCKET = process.env.NETEX_BUCKET;
const MATCHING_DATA_BUCKET = process.env.MATCHING_DATA_BUCKET;

export const handler: Handler<ZipperLambdaBody> = async ({ exportName, noc }) => {
    // populate the values from global settings using the IDs and write to matching data bucket
    console.log(`triggered zipper lambda... export: ${exportName} noc: ${noc}`);

    if (!NETEX_BUCKET || !MATCHING_DATA_BUCKET) {
        throw new Error('Need to set NETEX_BUCKET and MATCHING_DATA_BUCKET');
    }

    await retrieveAndZipExportedNetexForNoc(noc, exportName);
};

export const retrieveAndZipExportedNetexForNoc = async (noc: string, exportName: string): Promise<void> => {
    const prefix = `${noc}/zips/${exportName}/`;
    const zipResponse = await s3
        .listObjectsV2({
            Bucket: NETEX_BUCKET_NAME,
            Prefix: prefix,
        })
        .promise();

    const zips = zipResponse.Contents?.length;
    const zipKey = `${prefix}${exportName}.zip`;

    if (!zips) {
        // show that we have started the import
        await s3.putObject({ Bucket: NETEX_BUCKET_NAME, Key: zipKey + '_started', Body: 'started' }).promise();

        const listAllNetex = await s3
            .listObjectsV2({
                Bucket: NETEX_BUCKET_NAME,
                Prefix: `${noc}/exports/${exportName}/`,
            })
            .promise();

        const allNetex = listAllNetex.Contents?.map((it) => it.Key || '') ?? [];

        await zipFiles(allNetex, zipKey);
    }
};

export const zipFiles = async (allFiles: string[], zipKey: string): Promise<void> => {
    const archive: Archiver = archiver('zip', {
        zlib: { level: 9 }, // Sets the compression level.
    });

    const pass = new PassThrough();
    const s3Upload = s3.upload({ Bucket: NETEX_BUCKET_NAME, Key: zipKey, Body: pass }).promise();

    archive.pipe(pass);

    await Promise.all(
        allFiles.map(async (key) => {
            const obj = await s3.getObject({ Bucket: NETEX_BUCKET_NAME, Key: key }).promise();
            const body = obj.Body;
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
