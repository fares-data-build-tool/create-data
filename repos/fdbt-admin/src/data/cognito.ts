import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Auth } from 'aws-amplify';
import {
    AdminCreateUserRequest,
    AdminDeleteUserRequest,
    AdminGetUserRequest,
    AdminGetUserResponse,
    AdminUpdateUserAttributesRequest,
    ListUserPoolsRequest,
    ListUsersRequest,
    UserPoolDescriptionType,
    UserType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { randomBytes } from 'crypto';
import { AWS_REGION } from '../constants';
import { AddFormUser } from '../pages/AddUser';
import { EditFormUser } from '../pages/EditUser';

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

const generateTemporaryPassword = (): string => randomBytes(64).toString('hex').substring(2, 34);

export const addUserToPool = async (
    cognito: CognitoIdentityServiceProvider,
    userPoolId: string,
    formUser: AddFormUser,
): Promise<void> => {
    const params: AdminCreateUserRequest = {
        UserPoolId: userPoolId,
        Username: formUser.email,
        UserAttributes: [
            { Name: 'custom:noc', Value: formUser.nocs },
            { Name: 'email', Value: formUser.email },
            { Name: 'email_verified', Value: 'true' },
        ],
        TemporaryPassword: generateTemporaryPassword(),
    };
    await cognito.adminCreateUser(params).promise();
};

export const adminUpdateUserAttributes = async (
    cognito: CognitoIdentityServiceProvider,
    userPoolId: string,
    formUser: EditFormUser,
): Promise<void> => {
    const params: AdminUpdateUserAttributesRequest = {
        UserPoolId: userPoolId,
        Username: formUser.email,
        UserAttributes: [{ Name: 'custom:noc', Value: formUser.nocs }],
    };
    await cognito.adminUpdateUserAttributes(params).promise();
};

export const getUser = async (
    cognito: CognitoIdentityServiceProvider,
    userPoolId: string,
    username: string,
): Promise<AdminGetUserResponse> => {
    const params: AdminGetUserRequest = {
        UserPoolId: userPoolId,
        Username: username,
    };
    return cognito.adminGetUser(params).promise();
};

export const adminDeleteUser = async (
    cognito: CognitoIdentityServiceProvider,
    userPoolId: string,
    username: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    const params: AdminDeleteUserRequest = {
        UserPoolId: userPoolId,
        Username: username,
    };
    return cognito.adminDeleteUser(params).promise();
};
