import { MAIN_USER_POOL_PREFIX } from '../constants';
import { getCognitoClient, getUserPoolList } from '../data/cognito';
import {  AdminGetUserResponse, AttributeType,  CognitoIdentityProviderClient } from'@aws-sdk/client-cognito-identity-provider';
interface CognitoClientAndUserPool {
    client: CognitoIdentityProviderClient;
    userPoolId: string;
}

export const getCognitoClientAndUserPool = async (): Promise<CognitoClientAndUserPool> => {
    const client = await getCognitoClient();
    const userPoolList = await getUserPoolList(client);
    const userPool = userPoolList?.find((pool) => pool.Name?.startsWith(MAIN_USER_POOL_PREFIX));
    if (!userPool || !userPool.Id) {
        throw new Error('Failed to retrieve main user pool data');
    }

    return { client, userPoolId: userPool.Id };
};

export const cognitoFormatNocs = (nocs: string): string =>
    nocs
        .split(',')
        .map((noc) => noc.trim())
        .join('|');

export const humanFormatNocs = (nocs: string): string =>
    nocs
        .split('|')
        .map((noc) => noc.trim())
        .join(',');

export const htmlFormatNocs = (nocs: string): string =>
    nocs
        .split(',')
        .map((noc) => noc.trim())
        .join(', ');

export const parseUserAttributes = (key: string, attributes: AttributeType[] | undefined): string => {
    const attribute = attributes?.find((attr) => attr.Name === key);
    return attribute?.Value || 'Loading...';
};

export const parseCognitoUser = (
    user: AdminGetUserResponse,
): { username: string | undefined; email: string; nocs: string } => {
    const email = parseUserAttributes('email', user.UserAttributes);
    const nocs = parseUserAttributes('custom:noc', user.UserAttributes);
    return {
        username: user.Username,
        email,
        nocs,
    };
};
