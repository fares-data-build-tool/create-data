import 'source-map-support/register';
import { Handler } from 'aws-lambda';
import { getCognitoClient, getUsersOptedIntoMultiOperatorEmails } from './cognito';
import { getAuroraDBClient, getIncompleteMultiOperatorProducts } from './database';
import { getSesClient, sendEmails } from './email';

export const handler: Handler = async () => {
    const { RDS_HOST, SERVICE_DOMAIN, USER_POOL_ID } = process.env;

    if (!RDS_HOST || !SERVICE_DOMAIN || !USER_POOL_ID) {
        throw new Error('Missing env vars - RDS_HOST, SERVICE_DOMAIN and USER_POOL_ID must be set');
    }

    const cognitoClient = getCognitoClient();
    const dbClient = await getAuroraDBClient(RDS_HOST);

    const [users, products] = await Promise.all([
        getUsersOptedIntoMultiOperatorEmails(cognitoClient, USER_POOL_ID),
        getIncompleteMultiOperatorProducts(dbClient),
    ]);

    const emailAddresses = users
        .filter((user) => user.nocs.some((noc) => products.some((product) => product.nocCode === noc)))
        .map((user) => user.emailAddress);

    const sesClient = getSesClient();
    await sendEmails(sesClient, SERVICE_DOMAIN, emailAddresses);
};
