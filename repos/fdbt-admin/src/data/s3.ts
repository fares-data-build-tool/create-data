import { ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Auth } from 'aws-amplify';

import { AWS_REGION } from '../constants';
import getEnvironment from '../utils/env';

export const getS3 = async (): Promise<S3Client> => new S3Client({ region: AWS_REGION, credentials: await Auth.currentUserCredentials() });

export const getBucketName = (bucketPrefix: string): string => `${bucketPrefix}-${getEnvironment()}`;

export const listBucketObjects = async (s3: S3Client, bucket: string): Promise<ListObjectsV2CommandOutput['Contents']> => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const objects: ListObjectsV2CommandOutput['Contents'] = [];

    const getObjectsWithPaginationToken = async (continuationToken: string | undefined) => {


        const command = new ListObjectsV2Command( {
            Bucket: bucket,
            ContinuationToken: continuationToken,
        })
        const listObjectsResponse = await s3.send(command)

        if (listObjectsResponse.Contents) {
            objects.push(...listObjectsResponse.Contents);

            if (listObjectsResponse.NextContinuationToken) {
                await getObjectsWithPaginationToken(listObjectsResponse.NextContinuationToken);
            }
        }
    };

    await getObjectsWithPaginationToken(undefined);

    return objects;
};
