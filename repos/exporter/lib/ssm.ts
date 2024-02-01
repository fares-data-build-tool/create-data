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

export const putParameter = async (
    name: string,
    value: string,
    type: 'String' | 'StringList' | 'SecureString',
    overwrite: boolean,
): Promise<void> => {
    const input = {
        Name: name,
        Value: value,
        Type: type,
        Overwrite: overwrite,
    };
    try {
        await ssm.putParameter(input).promise();
    } catch (e) {
        throw new Error(`Parameter ${name} could not be put into ssm`);
    }
};
