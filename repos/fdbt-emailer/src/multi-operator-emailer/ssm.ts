import { SSM } from 'aws-sdk';

export const getSsmClient = (): SSM => {
    return new SSM({ region: 'eu-west-2' });
};

export const getSsmValue = async (client: SSM, parameter: string): Promise<string> => {
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
