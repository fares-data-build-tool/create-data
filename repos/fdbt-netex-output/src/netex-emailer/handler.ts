import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import moment from 'moment-timezone';
import { fetchDataFromS3, getFileFromS3 } from '../utils/s3';
import emailTemplate from './template/emailTemplate';

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
}

export interface MatchingData {
    uuid: string;
    email: string;
    selectedServices?: ServiceList[];
    products?: ProductList[];
    type: string;
    passengerType: string;
}

export const createMailTransporter = (): Mail => {
    return nodemailer.createTransport({
        SES: new AWS.SES({
            apiVersion: '2010-12-01',
            region: 'eu-west-1',
        }),
    });
};

export interface ProductList {
    productName: string;
}

export interface ServiceList {
    lineName: string;
}

export const setS3ObjectParams = (event: S3Event): S3ObjectParameters => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    return {
        Bucket: s3BucketName,
        Key: s3FileName,
    };
};

export const setMailOptions = (
    params: S3ObjectParameters,
    pathToNetex: string,
    matchingData: MatchingData,
): Mail.Options => {
    const { email, uuid, passengerType, type, selectedServices, products } = matchingData;

    return {
        from: 'fdbt@transportforthenorth.com',
        to: email,
        subject: `NeTEx created for ${params.Key}`,
        text: `There was a file uploaded to '${params.Bucket}' [Filename: '${params.Key} ']`,
        html: emailTemplate(
            uuid,
            passengerType,
            moment()
                .tz('Europe/London')
                .format('DD-MM-YYYY, HH:mm'),
            type,
            selectedServices,
            products,
        ),
        attachments: [
            {
                path: pathToNetex,
            },
        ],
    };
};

export const netexEmailerHandler = async (event: S3Event): Promise<void> => {
    try {
        const s3ObjectParams = setS3ObjectParams(event);
        const splitKey = s3ObjectParams.Key.split('/').pop();
        const pathToSavedNetex = `/tmp/${splitKey}`;
        const netexFile = await getFileFromS3(s3ObjectParams);

        const matchingData: MatchingData = await fetchDataFromS3<MatchingData>(event, true);

        if (!matchingData.email) {
            return;
        }

        await fs.writeFile(pathToSavedNetex, netexFile);

        const mailOptions = setMailOptions(s3ObjectParams, pathToSavedNetex, matchingData);

        if (process.env.NODE_ENV === 'development') {
            console.info('mailOptions', mailOptions);
        }

        if (process.env.NODE_ENV !== 'development') {
            const mailTransporter = createMailTransporter();
            await mailTransporter.sendMail(mailOptions);

            console.info(`Email sent.`);
        }
    } catch (err) {
        throw new Error(`SES SendEmail failed. Error: ${err.stack}`);
    }
};

export default netexEmailerHandler;
