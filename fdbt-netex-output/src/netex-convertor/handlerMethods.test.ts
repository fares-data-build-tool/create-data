import AWS from 'aws-sdk';
import { fetchDataFromS3AsJSON, setS3ObjectParams, s3ObjectParameters } from './handler';

import * as mocks from './test-data/test-data';

jest.mock('aws-sdk');

describe('fetchDataFromS3AsJSON', () => {
    const mockS3GetObject = jest.fn();
    const s3Params: s3ObjectParameters = {
        Bucket: 'thisIsMyBucket',
        Key: 'andThisIsTheNameOfTheThing',
    };

    beforeEach(() => {
        mockS3GetObject.mockReset();
        (AWS.S3 as any) = jest.fn().mockImplementation(() => ({
            getObject: mockS3GetObject,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns the JSON data', async () => {
        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: mocks.mockS3ObjectDataAsString });
            },
        }));
        try {
            const fetchedData = await fetchDataFromS3AsJSON(s3Params);
            expect(fetchedData).toStrictEqual(mocks.mockS3ObjectDataAsJson);
        } catch (err) {
            console.error(err);
        }
    });

    it('throws an error when no data comes back from S3', async () => {
        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.reject(new Error());
            },
        }));
        expect.assertions(1);
        try {
            await expect(fetchDataFromS3AsJSON(s3Params)).rejects.toThrow('Error in retrieving data.');
        } catch (err) {
            console.error(err);
        }
    });

    it('calls get object from S3 using params provided', async () => {
        mockS3GetObject.mockImplementation(() => ({
            promise() {
                return Promise.resolve({ Body: mocks.mockS3ObjectDataAsString });
            },
        }));

        try {
            await fetchDataFromS3AsJSON(s3Params);
            expect(mockS3GetObject).toHaveBeenCalledWith(s3Params);
        } catch (err) {
            console.error(err);
        }
    });

    describe('setS3ObjectParams', () => {
        const bucketName = 'fdbt-test-matchingdata-s3-bucket';
        const fileName = 'fdbt-test-matchingdata.json';
        const s3Event = mocks.mockS3Event(bucketName, fileName);

        it('sets s3BucketName from S3Event', () => {
            const params = setS3ObjectParams(s3Event);
            expect(params.Bucket).toEqual(bucketName);
        });

        it('sets S3FileName from S3Event', () => {
            const params = setS3ObjectParams(s3Event);
            expect(params.Key).toEqual(fileName);
        });

        it('removes spaces and unicode non-ASCII characters in the S3FileName', () => {
            const file = 'fdbt%2Ftest+%3A+matchingdata.json';
            const S3Event = mocks.mockS3Event(bucketName, file);
            const expectedParams = {
                Bucket: bucketName,
                Key: 'fdbt/test : matchingdata.json',
            };
            const params = setS3ObjectParams(S3Event);
            expect(expectedParams).toEqual(params);
        });
    });
});
