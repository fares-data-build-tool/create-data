import 'source-map-support/register';
import { Handler } from 'aws-lambda';
import { getUsersOptedIntoMultiOperatorEmails } from './cognito';
import { getAuroraDBClient, getIncompleteMultiOperatorProducts } from './database';
import { sendEmails } from './email';

export const handler: Handler = async () => {
    const { RDS_HOST, SERVICE_EMAIL_ADDRESS, SERVICE_DOMAIN, USER_POOL_ID } = process.env;

    if (!RDS_HOST || !SERVICE_EMAIL_ADDRESS || !SERVICE_DOMAIN || !USER_POOL_ID) {
        throw new Error(
            'Missing env vars - RDS_HOST, SERVICE_EMAIL_ADDRESS, SERVICE_DOMAIN and USER_POOL_ID must be set',
        );
    }

    const dbClient = await getAuroraDBClient(RDS_HOST);

    const [users, products] = await Promise.all([
        getUsersOptedIntoMultiOperatorEmails(USER_POOL_ID),
        getIncompleteMultiOperatorProducts(dbClient),
    ]);

    const emailAddresses = users
        .filter((user) => user.nocs.some((noc) => products.some((product) => product.nocCode === noc)))
        .map((user) => user.emailAddress);

    await sendEmails(SERVICE_DOMAIN, SERVICE_EMAIL_ADDRESS, emailAddresses);
};
