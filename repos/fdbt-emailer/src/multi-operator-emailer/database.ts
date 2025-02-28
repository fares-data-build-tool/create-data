import { createPool, Pool, PoolOptions } from 'mysql2/promise';
import { getSsmClient, getSsmValue } from './ssm';

export type Product = {
    productId: string;
    nocCode: string;
};

export const getAuroraDBClient = async (rdsHost: string): Promise<Pool> => {
    const clientOptions: PoolOptions = {
        host: 'localhost',
        user: 'fdbt_site',
        password: 'password',
        database: 'fdbt',
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
    };

    if (process.env.NODE_ENV === 'production') {
        const ssmClient = getSsmClient();

        const [username, password] = await Promise.all([
            getSsmValue(ssmClient, 'fdbt-rds-netex-output-username'),
            getSsmValue(ssmClient, 'fdbt-rds-netex-output-password'),
        ]);

        clientOptions.host = rdsHost;
        clientOptions.user = username;
        clientOptions.password = password;
    }

    return createPool(clientOptions);
};

export const getIncompleteMultiOperatorProducts = async (client: Pool): Promise<Product[]> => {
    const query = `
        SELECT products.id AS productId, productAdditionalNocs.additionalNocCode as nocCode
        FROM products
        JOIN productAdditionalNocs ON productAdditionalNocs.productId = products.id
        WHERE products.incomplete = 1
        AND products.fareType = 'multiOperatorExt'
        AND products.dateModified > NOW() - INTERVAL 24 HOUR
    `;

    const [rows] = await client.execute(query, []);
    return rows as Product[];
};
