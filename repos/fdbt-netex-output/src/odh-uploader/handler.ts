import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'eu-west-2' });

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
}

export const setS3ObjectParams = (event: S3Event): S3ObjectParameters => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params: S3ObjectParameters = {
        Bucket: s3BucketName,
        Key: s3FileName,
    };
    return params;
};

export const odhUploaderHandler = async (event: S3Event): Promise<void> => {
    const s3ObjectParams = setS3ObjectParams(event);
    const emailParams = {
        Destination: {
            ToAddresses: ['danny.davies@infinityworks.com'],
        },
        Message: {
            Body: {
                Text: {
                    Data: `There was a file uploaded to ${s3ObjectParams.Bucket} [Filename: ${s3ObjectParams.Key}]`,
                },
            },
            Subject: {
                Data: 'Test Email for using SES',
            },
        },
        Source: 'tfn@infinityworks.com',
    };
    try {
        const sendPromise = await ses.sendEmail(emailParams).promise();
        console.log(sendPromise.MessageId)
    } catch (err) {
        throw new Error(
            `SES SendEmail failed. Error: ${err.name}, Error Message: ${err.message}. Parameters sent via SES: ${emailParams}`,
        );
    }
};

export default odhUploaderHandler;
