import { GetParameterCommand, PutParameterCommand, PutParameterCommandInput, SSMClient } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: 'eu-west-2' });

export const getSsmValue = async (name: string, withDecryption?: boolean): Promise<string> => {
    const input = {
        Name: name,
        WithDecryption: withDecryption ? withDecryption : true,
    };
    const value = (await ssm.send(new GetParameterCommand(input))).Parameter?.Value;

    if (!value) {
        throw new Error(`Parameter ${name} was not found`);
    }

    return value;
};

export const putParameter = async (
    name: string,
    value: string,
    type: 'String' | 'StringList' | 'SecureString',
    overwrite: boolean,
): Promise<void> => {
    try {
        const input: PutParameterCommandInput = {
            Name: name,
            Value: value,
            Type: type,
            Overwrite: overwrite,
        };
        await ssm.send(new PutParameterCommand(input));
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Parameter ${name} could not be put into ssm`);
        }

        throw error;
    }
};
