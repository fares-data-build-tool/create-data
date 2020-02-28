import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { promises as fs } from 'fs';

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
}

export const createMailTransporter = (): Mail => {
    return nodemailer.createTransport({
        SES: new AWS.SES({
            apiVersion: '2010-12-01',
        }),
    });
};

export const setS3ObjectParams = (event: S3Event): S3ObjectParameters => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params: S3ObjectParameters = {
        Bucket: s3BucketName,
        Key: s3FileName,
    };
    return params;
};

export const setMailOptions = (params: S3ObjectParameters, pathToNetex: string): Mail.Options => {
    return {
        from: 'tfn@infinityworks.com',
        to: ['tfn@infinityworks.com', 'fdbt@transportforthenorth.com'],
        subject: `NeTEx created for ${params.Key}`,
        text: `There was a file uploaded to '${params.Bucket}' [Filename: '${params.Key} ']`,
        attachments: [
            {
                path: pathToNetex,
            },
        ],
    };
};

export const getNetexFileFromS3 = async (params: S3ObjectParameters): Promise<string> => {
    const s3 = new AWS.S3();
    const data = await s3.getObject(params).promise();
    return data.Body?.toString('utf-8') ?? '';
};

export const odhUploaderHandler = async (event: S3Event): Promise<void> => {
    try {
        const s3ObjectParams = setS3ObjectParams(event);
        const pathToSavedNetex = `/tmp/${s3ObjectParams.Key}`;
        const netexFile = await getNetexFileFromS3(s3ObjectParams);
        await fs.writeFile(netexFile, pathToSavedNetex);

        const mailOptions = setMailOptions(s3ObjectParams, pathToSavedNetex);

        const mailTransporter = createMailTransporter();

        const info: SentMessageInfo = await mailTransporter.sendMail(mailOptions);

        console.log(info);

        if(info.message){
            console.log(`Email sent: ${info.message}`);
        } else {
            console.log(`Email sent.`)
        }

        

    } catch (err) {
        throw new Error(
            `SES SendEmail failed. Error: ${err.stack}`,
        );
    }
};

export default odhUploaderHandler;
