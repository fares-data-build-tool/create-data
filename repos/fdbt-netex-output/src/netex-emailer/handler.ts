import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import moment from 'moment-timezone';
import { fetchDataFromS3, getFileFromS3 } from '../data/s3';
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
    lineName?: string;
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
    const { email, uuid, passengerType, type, selectedServices, products, lineName } = matchingData;

    return {
        from: process.env.SERVICE_EMAIL_ADDRESS,
        to: email,
        subject: `NeTEx created for ${params.Key}`,
        text: `There was a file uploaded to '${params.Bucket}' [Filename: '${params.Key}']`,
        html: emailTemplate(
            uuid,
            passengerType,
            moment()
                .tz('Europe/London')
                .format('DD-MM-YYYY, HH:mm'),
            type,
            lineName || 'N/A',
            selectedServices || [],
            products || [],
        ),
        attachments: [
            {
                path: pathToNetex,
            },
        ],
    };
};

// redactEmailAddress replaces the user portion of an email address so it can be safely logged
export const redactEmailAddress = (
    toRedact: string | Mail.Address | (string | Mail.Address)[] | undefined,
): string | string[] => {
    const redact = (address: string): string => address.toString().replace(/.*@/, '*****@');
    if (toRedact !== undefined) {
        if (typeof toRedact === 'string') {
            return redact(toRedact);
        } else if (toRedact.hasOwnProperty('name') && toRedact.hasOwnProperty('address')) {
            const email = toRedact as Mail.Address;
            return redact(email.address);
        } else if (typeof toRedact === 'object') {
            const addresses = toRedact as Mail.Address[];
            return addresses.map(email => {
                if (email.hasOwnProperty('name') && email.hasOwnProperty('address')) {
                    return redact(email.address);
                } else {
                    return redact((email as unknown) as string);
                }
            });
        }
    }
    return '*****@*****.***';
};

export const netexEmailerHandler = async (event: S3Event): Promise<void> => {
    let mailOptions: Mail.Options = {};
    try {
        const s3ObjectParams = setS3ObjectParams(event);
        const splitName = s3ObjectParams.Key.split('/');

        // if the object key is something like:
        //  "BLAC/exports/BLAC_2021_11_18_1/BLAC00df319d_1633608818591.xml"
        //  "BLAC/zips/BLAC_2021_11_18_1/BLAC_2021_11_18_1.zip"
        // we want to know if the object is in the zips or exports folder
        const isAnExportsOrZipsObject = splitName[1] === 'exports' || splitName[1] === 'zips';
        if (isAnExportsOrZipsObject) {
            // we do not want to send an email if the object is in the zips or exports folder
            return;
        }

        const splitKey = splitName.pop();
        const pathToSavedNetex = `/tmp/${splitKey}`;
        const netexFile = await getFileFromS3(s3ObjectParams);
        const matchingData = await fetchDataFromS3<MatchingData>(event, true);

        if (!matchingData.email) {
            return;
        }

        await fs.writeFile(pathToSavedNetex, netexFile);

        mailOptions = setMailOptions(s3ObjectParams, pathToSavedNetex, matchingData);
        if (process.env.NODE_ENV !== 'development' && process.env.EMAIL_SENDING_ENABLED === 'true') {
            const mailTransporter = createMailTransporter();
            await mailTransporter.sendMail(mailOptions);
            console.info({
                email: {
                    from: mailOptions.from,
                    to: redactEmailAddress(mailOptions.to),
                    subject: mailOptions.subject,
                    text: mailOptions.text,
                },
                message: 'Sending of emails enabled, email sent',
            });
            return;
        } else {
            console.info({
                email: {
                    from: mailOptions.from,
                    to: redactEmailAddress(mailOptions.to),
                    subject: mailOptions.subject,
                    text: mailOptions.text,
                },
                message: 'Sending of emails disabled, email not sent',
            });
            return;
        }
    } catch (err) {
        throw new Error(
            `SES SendEmail failed. from: ${mailOptions?.from}, to: ${redactEmailAddress(mailOptions?.to)}, subject: ${
                mailOptions?.subject
            }, text: ${mailOptions?.text}, Error: ${(err as Error).stack}`,
        );
    }
};

export default netexEmailerHandler;
