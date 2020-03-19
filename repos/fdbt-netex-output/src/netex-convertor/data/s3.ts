import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';

const s3: AWS.S3 = new AWS.S3();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchMatchingDataFromS3 = async (event: S3Event): Promise<any> => {
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
        throw new Error('Error in retrieving data.');
    }
};

export const uploadNetexToS3 = async (netex: string, fileName: string): Promise<void> => {
    try {
        await s3
            .putObject({
                Bucket: process.env.UNVALIDATED_NETEX_BUCKET as string,
                Key: fileName,
                ContentType: 'application/xml',
                Body: Buffer.from(netex, 'binary'),
            })
            .promise();
    } catch (err) {
        throw new Error('Error in retrieving data.');
    }
};
