import { GetParameterCommand, PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: 'eu-west-2' });

export const putParameter = async (
    name: string,
    value: string,
    type: 'String' | 'StringList' | 'SecureString',
    overwrite: boolean,
): Promise<void> => {
    await ssm.send(
        new PutParameterCommand({
            Name: name,
            Value: value,
            Type: type,
            Overwrite: overwrite,
        }),
    );
};

export const getParameter = async (name: string, withDecryption = true): Promise<string> => {
    const response = await ssm.send(
        new GetParameterCommand({
            Name: name,
            WithDecryption: withDecryption,
        }),
    );

    const value = response.Parameter?.Value;

    if (!value) {
        throw new Error(`SSM Parameter ${name} not found or empty`);
    }

    return value;
};
