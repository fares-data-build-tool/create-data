import AWS from 'aws-sdk';

export interface S3ObjectParameters {
    Bucket: string;
    Key: string;
}

export interface StageName {
    stageName: string;
}

export interface UserFareStages {
    fareStages: [
        {
            stageName: string;
            prices: string[];
        },
    ];
}

export const getUserData = async (uuid: string): Promise<UserFareStages> => {
    const s3 = new AWS.S3();

    if (!process.env.USER_DATA_BUCKET_NAME) {
        throw new Error('Environment variable for validated bucket not set');
    }

    const params: S3ObjectParameters = {
        Bucket: process.env.USER_DATA_BUCKET_NAME,
        Key: uuid,
    };
    const response = await s3.getObject(params).promise();
    const dataAsString = response.Body?.toString('utf-8') ?? '';

    const userData: UserFareStages = JSON.parse(dataAsString);

    return userData;
};
