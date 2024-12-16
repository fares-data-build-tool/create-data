import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

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
