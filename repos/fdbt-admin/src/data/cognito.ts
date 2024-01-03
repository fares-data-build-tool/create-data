import {
    AdminCreateUserCommand,
    AdminCreateUserRequest,
    AdminDeleteUserCommand,
    AdminDeleteUserRequest,
    AdminGetUserCommand,
    AdminGetUserRequest,
    AdminGetUserResponse,
    AdminUpdateUserAttributesCommand,
    AdminUpdateUserAttributesRequest,
    CognitoIdentityProviderClient,
    ListUserPoolsCommand,
    ListUserPoolsRequest,
    ListUsersCommand,
    ListUsersRequest,
    UserPoolDescriptionType,
    UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { customAlphabet } from 'nanoid';
import { AWS_REGION } from '../constants';
import { AddFormUser } from '../pages/AddUser';
import { EditFormUser } from '../pages/EditUser';

export const getCognitoClient = async (): Promise<CognitoIdentityProviderClient> =>
new CognitoIdentityProviderClient({
    region: AWS_REGION,
});

export const getUserPoolList = async (cognito: CognitoIdentityProviderClient): Promise<UserPoolDescriptionType[]> => {
    const params: ListUserPoolsRequest = { MaxResults: 5 };
    const command = new ListUserPoolsCommand(params)
    const listUserPoolsResponse = await cognito.send(command)
    return listUserPoolsResponse?.UserPools ?? [];
};

export const listUsersInPool = async (
    cognito: CognitoIdentityProviderClient,
    userPoolId: string,
): Promise<UserType[]> => {
    const users: UserType[] = [];

    const getUsersWithPaginationToken = async (paginationToken: string | undefined) => {
        const params: ListUsersRequest = {
            UserPoolId: userPoolId,
            PaginationToken: paginationToken,
        };

        const command = new ListUsersCommand(params)
        const listUsersResponse = await cognito.send(command)

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

const nanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 22);

const generateTemporaryPassword = (length = 22): string => nanoId(length);

export const addUserToPool = async (
    cognito: CognitoIdentityProviderClient,
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
    const command = new AdminCreateUserCommand(params)
    await cognito.send(command)
};

export const adminUpdateUserAttributes = async (
    cognito: CognitoIdentityProviderClient,
    userPoolId: string,
    formUser: EditFormUser,
): Promise<void> => {
    const params: AdminUpdateUserAttributesRequest = {
        UserPoolId: userPoolId,
        Username: formUser.email,
        UserAttributes: [{ Name: 'custom:noc', Value: formUser.nocs }],
    };
    const command = new AdminUpdateUserAttributesCommand(params)
    await cognito.send(command)
};

export const getUser = async (
    cognito: CognitoIdentityProviderClient,
    userPoolId: string,
    username: string,
): Promise<AdminGetUserResponse> => {
    const params: AdminGetUserRequest = {
        UserPoolId: userPoolId,
        Username: username,
    };
    const command = new AdminGetUserCommand(params)
    return await cognito.send(command)
};

export const adminDeleteUser = async (
    cognito: CognitoIdentityProviderClient,
    userPoolId: string,
    username: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    const params: AdminDeleteUserRequest = {
        UserPoolId: userPoolId,
        Username: username,
    };
    const command = new AdminDeleteUserCommand(params)
    return await cognito.send(command)
};
