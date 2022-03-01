import { S3 } from 'aws-sdk';
import { Auth } from 'aws-amplify';
import {
    Object,
    ObjectList,
    ListObjectsV2Request,
    DeleteObjectsRequest,
    ObjectIdentifierList,
} from 'aws-sdk/clients/s3';

import { AWS_REGION } from '../constants';
import getEnvironment from '../utils/env';

export const getS3 = async (): Promise<S3> =>
    new S3({ region: AWS_REGION, credentials: await Auth.currentUserCredentials() });

export const getBucketName = (bucketPrefix: string): string => `${bucketPrefix}-${getEnvironment()}`;

export const listBucketObjects = async (s3: S3, bucket: string): Promise<ObjectList> => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const objects: Object[] = [];

    const getObjectsWithPaginationToken = async (continuationToken: string | undefined) => {
        const params: ListObjectsV2Request = {
            Bucket: bucket,
            ContinuationToken: continuationToken,
        };

        const listObjectsResponse = await s3.listObjectsV2(params).promise();

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

// deleteExport deletes export files in only the matching data, this is the minimum required, for the UI to not show
// the export but will leave data in the netex data bucket
export const deleteExport = async (s3: S3, bucket: string, exportName: string): Promise<void> => {
    const toDelete = (await listBucketObjects(s3, bucket)).filter((obj) => obj.Key?.includes(exportName));
    const deleteParams: DeleteObjectsRequest = {
        Bucket: bucket,
        Delete: {
            Objects: toDelete.map((obj) => ({
                Key: obj.Key,
            })) as ObjectIdentifierList,
        },
    };

    await s3.deleteObjects(deleteParams).promise();
};
