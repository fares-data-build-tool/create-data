import { S3Client } from '@aws-sdk/client-s3';
import { getS3 } from '../data/s3';

const getS3Client = async (): Promise<S3Client> => {
    const client = await getS3();
    return client ;
};

export default getS3Client;
