import { S3Event } from 'aws-lambda';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import * as testData from './testData/testData';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createMailTransporter, netexEmailerHandler, redactEmailAddress } from './handler';
import * as s3 from '../data/s3';
import { periodGeoZoneTicket } from '../test-data/matchingData';

jest.mock('@aws-sdk/client-ses');
jest.mock('@aws-sdk/client-s3');

describe('netexEmailer SES emailer', () => {
    const mockMailTransporter = jest.fn();

    const mockFetchDataFromS3Spy = jest.spyOn(s3, 'fetchDataFromS3');
    const mockGetNetexFileFromS3 = jest.spyOn(s3, 'getFileFromS3');

    beforeEach(() => {
        mockFetchDataFromS3Spy.mockImplementation(() => Promise.resolve(periodGeoZoneTicket));
        mockGetNetexFileFromS3.mockImplementation(() => Promise.resolve('Body: testData.testNetexFromS3'));

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

describe('redactEmailAddress', () => {
    it('email as string', () => {
        const given = 'test@example.com';
        const expected = '*****@example.com';
        expect(redactEmailAddress(given)).toEqual(expected);
    });
    it('email as Address', () => {
        const given: Mail.Address = { name: 'test', address: 'test@example.com' };
        const expected = '*****@example.com';
        expect(redactEmailAddress(given)).toEqual(expected);
    });
    it('emails as list of strings', () => {
        const given: string[] = ['test@example.com'];
        const expected: string[] = ['*****@example.com'];
        expect(redactEmailAddress(given)).toEqual(expected);
    });
    it('emails as list of Address', () => {
        const given: Mail.Address[] = [{ name: 'test', address: 'test@example.com' }];
        const expected: string[] = ['*****@example.com'];
        expect(redactEmailAddress(given)).toEqual(expected);
    });
    it('emails as list of multiple strings', () => {
        const given: string[] = ['test@example.com', 'test2@example2.com'];
        const expected: string[] = ['*****@example.com', '*****@example2.com'];
        expect(redactEmailAddress(given)).toEqual(expected);
    });
    it('emails as list of multiple Address', () => {
        const given: Mail.Address[] = [
            { name: 'test', address: 'test@example.com' },
            { name: 'test2', address: 'test2@example2.com' },
        ];
        const expected: string[] = ['*****@example.com', '*****@example2.com'];
        expect(redactEmailAddress(given)).toEqual(expected);
    });
    it('email as bad input', () => {
        const given: string = (1 as unknown) as string;
        const expected = '*****@*****.***';
        expect(redactEmailAddress(given)).toEqual(expected);
    });
});
