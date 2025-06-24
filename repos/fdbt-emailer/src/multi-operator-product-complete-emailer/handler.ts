import 'source-map-support/register';
import { Handler } from 'aws-lambda';
import { getAuroraDBClient, getCompleteMultiOperatorProducts } from '../data/database';
import { getCognitoClient, getUsersOptedIntoMultiOperatorEmails } from '../data/cognito';
import { getSesClient, sendEmails } from './email';

export const handler: Handler = async () => {
    const { RDS_HOST, SERVICE_DOMAIN, USER_POOL_ID } = process.env;

    if (!RDS_HOST || !SERVICE_DOMAIN || !USER_POOL_ID) {
        throw new Error('Missing env vars - RDS_HOST, SERVICE_DOMAIN and USER_POOL_ID must be set');
    }

    const dbClient = await getAuroraDBClient(RDS_HOST);
    const products = await getCompleteMultiOperatorProducts(dbClient);

    if (products.length === 0) {
        return;
    }

    const cognitoClient = getCognitoClient();
    const users = await getUsersOptedIntoMultiOperatorEmails(cognitoClient, USER_POOL_ID);

    if (users.length === 0) {
        return;
    }

    const emailAddresses = users
        .filter((user) => user.nocs.some((noc) => products.some((product) => product.nocCode === noc)))
        .map((user) => user.emailAddress);

    if (emailAddresses.length === 0) {
        return;
    }

    const sesClient = getSesClient();
    await sendEmails(sesClient, SERVICE_DOMAIN, emailAddresses);
};
