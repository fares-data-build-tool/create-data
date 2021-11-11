import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { MAIN_USER_POOL_PREFIX } from '../constants';
import { getCognitoClient, getUserPoolList } from '../data/cognito';

interface CognitoClientAndUserPool {
    client: CognitoIdentityServiceProvider;
    userPoolId: string;
}

const getCognitoClientAndUserPool = async (): Promise<CognitoClientAndUserPool> => {
    const client = await getCognitoClient();
    const userPoolList = await getUserPoolList(client);
    const userPool = userPoolList?.find((pool) => pool.Name?.startsWith(MAIN_USER_POOL_PREFIX));
    if (!userPool || !userPool.Id) {
        throw new Error('Failed to retrieve main user pool data');
    }

    return { client, userPoolId: userPool.Id };
};

export default getCognitoClientAndUserPool;
