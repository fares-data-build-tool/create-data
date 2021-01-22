import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Auth } from 'aws-amplify';
import {
    ListUserPoolsRequest,
    ListUsersRequest,
    UserPoolDescriptionType,
    UserType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { AWS_REGION } from '../constants';

export const getCognitoClient = async (): Promise<CognitoIdentityServiceProvider> =>
    new CognitoIdentityServiceProvider({ region: AWS_REGION, credentials: await Auth.currentUserCredentials() });

export const getUserPoolList = async (cognito: CognitoIdentityServiceProvider): Promise<UserPoolDescriptionType[]> => {
    const params: ListUserPoolsRequest = { MaxResults: 5 };

    const listUserPoolsResponse = await cognito.listUserPools(params).promise();

    return listUserPoolsResponse?.UserPools ?? [];
};

export const listUsersInPool = async (
    cognito: CognitoIdentityServiceProvider,
    userPoolId: string,
): Promise<UserType[]> => {
    const users: UserType[] = [];

    const getUsersWithPaginationToken = async (paginationToken: string | undefined) => {
        const params: ListUsersRequest = {
            UserPoolId: userPoolId,
            PaginationToken: paginationToken,
        };

        const listUsersResponse = await cognito.listUsers(params).promise();

        if (listUsersResponse.Users) {
            users.push(...listUsersResponse.Users);

            if (listUsersResponse.PaginationToken) {
                await getUsersWithPaginationToken(listUsersResponse.PaginationToken);
            }
        }
    };

    await getUsersWithPaginationToken(undefined);

    return users;
};
