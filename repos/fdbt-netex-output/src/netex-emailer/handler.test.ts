import { S3Event } from 'aws-lambda';
import nodemailer from 'nodemailer';
import * as testData from './testData/testData';
import { createMailTransporter, netexEmailerHandler } from './handler';
import * as s3 from '../data/s3';
import { periodGeoZoneTicket } from '../test-data/matchingData';

jest.mock('aws-sdk');

describe('netexEmailer SES emailer', () => {
    const mockMailTransporter = jest.fn();

    const mockFetchDataFromS3Spy = jest.spyOn(s3, 'fetchDataFromS3');
    const mockGetNetexFileFromS3 = jest.spyOn(s3, 'getFileFromS3');

    beforeEach(() => {
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodGeoZoneTicket));
        mockGetNetexFileFromS3.mockImplementation(() => Promise.resolve('Body: testData.testNetexFromS3'));

        (createMailTransporter as {}) = jest.fn().mockImplementation(() => {
            return {
                sendMail: mockMailTransporter,
            };
        });

        mockMailTransporter.mockImplementation(() => {
            return nodemailer.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true,
            });
        });
    });

    afterEach(() => {
        mockMailTransporter.mockReset();
    });

    it('sending enabled, sends an email', async () => {
        process.env.EMAIL_SENDING_ENABLED = 'true';

        const key = 'NameOfNetexFile.xml';
        const event: S3Event = testData.testS3Event('thisIsMyBucket', key);

        await netexEmailerHandler(event);

        expect(mockMailTransporter).toBeCalledTimes(1);
    });

    it('sending disabled, no email sent', async () => {
        process.env.EMAIL_SENDING_ENABLED = 'false';

        const key = 'NameOfNetexFile.xml';
        const event: S3Event = testData.testS3Event('thisIsMyBucket', key);

        await netexEmailerHandler(event);

        expect(mockMailTransporter).toBeCalledTimes(0);
    });
});
