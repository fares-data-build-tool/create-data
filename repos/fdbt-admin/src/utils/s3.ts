import { S3 } from 'aws-sdk';
import { getS3 } from '../data/s3';

interface S3Client {
    client: S3;
}

const getS3Client = async (): Promise<S3Client> => {
    const client = await getS3();
    return { client };
};

export default getS3Client;
