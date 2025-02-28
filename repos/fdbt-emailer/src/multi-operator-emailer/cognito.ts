import { CognitoIdentityServiceProvider } from 'aws-sdk';

type User = {
    emailAddress: string;
    nocs: string[];
};

const client = new CognitoIdentityServiceProvider({ region: 'eu-west-2' });

export const getUsersOptedIntoMultiOperatorEmails = async (userPoolId: string): Promise<User[]> => {
    const users: User[] = [];
    let paginationToken: string | undefined = undefined;

    do {
        const listUsersResponse = await client
            .listUsers({
                UserPoolId: userPoolId,
                PaginationToken: paginationToken,
            })
            .promise();

        paginationToken = listUsersResponse.PaginationToken;

        if (listUsersResponse.Users) {
            for (const user of listUsersResponse.Users) {
                if (user.Attributes) {
                    const emailPreference = user.Attributes.find((attr) => attr.Name === 'custom:multiOpEmailEnabled');

                    if (emailPreference?.Value === 'true') {
                        const emailAttribute = user.Attributes.find((attr) => attr.Name === 'email');
                        const nocAttribute = user.Attributes.find((attr) => attr.Name === 'custom:noc');

                        if (emailAttribute?.Value && nocAttribute?.Value) {
                            users.push({
                                emailAddress: emailAttribute.Value,
                                nocs: nocAttribute.Value.split('|'),
                            });
                        }
                    }
                }
            }
        }
    } while (paginationToken);

    return users;
};
