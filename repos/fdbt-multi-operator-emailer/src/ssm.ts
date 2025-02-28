import { SSM } from 'aws-sdk';

const client = new SSM({ region: 'eu-west-2' });

export const getSsmValue = async (parameter: string): Promise<string> => {
    const parameterResult = await client
        .getParameter({
            Name: parameter,
            WithDecryption: true,
        })
        .promise();

    const value = parameterResult.Parameter?.Value;

    if (!value) {
        throw new Error(`SSM parameter "${parameter}" not found`);
    }

    return value;
};
