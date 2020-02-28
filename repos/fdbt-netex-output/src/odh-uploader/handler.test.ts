import AWS from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import nodemailer from 'nodemailer';
import * as testData from './testData/testData'
import { createMailTransporter, odhUploaderHandler } from './handler';

jest.mock('aws-sdk');

describe('odhHandler SES emailer', () => {

    const mockS3GetObject = jest.fn();
    const mockMailTransporter = jest.fn();

    beforeEach(() => {

        (AWS.S3 as {}) = jest.fn().mockImplementation(() => {
            return {
                getObject: mockS3GetObject,
            };
        });

        mockS3GetObject.mockImplementation(() => ({
            promise(): Promise<{}> {
                return Promise.resolve({ Body: "body"});
            },
        }));

        (createMailTransporter as {}) = jest.fn().mockImplementation(() => {
            return {
                sendMail: mockMailTransporter,
            };
        });

        mockMailTransporter.mockImplementation(() => {
            return nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true
            });
        })
    });

    afterEach(() => {
        mockS3GetObject.mockReset();
        mockMailTransporter.mockReset();
    });

    it('sends an email', async () => {
        const key = 'NameOfNetexFile.xml';
        const event: S3Event = testData.testS3Event('thisIsMyBucket', key);

        await odhUploaderHandler(event);

        expect(mockMailTransporter).toBeCalledTimes(1);

    });
});
