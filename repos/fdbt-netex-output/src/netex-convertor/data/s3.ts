import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchDataFromS3 = async (event: S3Event): Promise<any> => {
    try {
        const s3BucketName: string = event.Records[0].s3.bucket.name;
        const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const dataAsString: string =
            (
                await s3
                    .getObject({
                        Bucket: s3BucketName,
                        Key: s3FileName,
                    })
                    .promise()
            ).Body?.toString('utf-8') ?? '';
        const dataAsJson: JSON = JSON.parse(dataAsString);
        return dataAsJson;
    } catch (err) {
        throw new Error(`Error in retrieving data. ${err.stack}`);
    }
};

export const uploadNetexToS3 = async (netex: string, fileName: string): Promise<void> => {
    try {
        console.info(`Uploading file: ${fileName}`);

        await s3
            .putObject({
                Bucket: process.env.UNVALIDATED_NETEX_BUCKET as string,
                Key: fileName,
                ContentType: 'application/xml',
                Body: Buffer.from(netex, 'binary'),
            })
            .promise();
    } catch (err) {
        throw new Error(`Error uploading netex to S3. ${err.stack}`);
    }
};
