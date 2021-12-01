import { SSM } from 'aws-sdk';

const ssm = new SSM({ region: 'eu-west-2' });

export const getSsmValue = async (parameter: string): Promise<string> => {
    const value = (
        await ssm
            .getParameter({
                Name: parameter,
                WithDecryption: true,
            })
            .promise()
    ).Parameter?.Value;

    if (!value) {
        throw new Error(`Parameter ${parameter} was not found`);
    }

    return value;
};
