import { createPool, Pool, PoolOptions } from 'mysql2/promise';
import { getSsmClient, getSsmValue } from './ssm';

export type Product = {
    productId: string;
    nocCode: string;
};

export const getAuroraDBClient = async (rdsHost: string): Promise<Pool> => {
    let clientOptions: PoolOptions;
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        clientOptions = {
            host: 'localhost',
            user: 'fdbt_emailer',
            password: 'password',
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0,
        };
    } else {
        const ssmClient = getSsmClient();
        const [username, password] = await Promise.all([
            getSsmValue(ssmClient, 'fdbt-rds-emailer-username'),
            getSsmValue(ssmClient, 'fdbt-rds-emailer-password'),
        ]);

        clientOptions = {
            host: rdsHost,
            user: username,
            password: password,
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0,
        };
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

export const getCompleteMultiOperatorProducts = async (client: Pool): Promise<Product[]> => {
    const query = `
        SELECT products.id AS productId, products.nocCode as nocCode
        FROM products
        WHERE products.incomplete = 0
        AND products.fareType = 'multiOperatorExt'
        AND products.dateModified > NOW() - INTERVAL 24 HOUR
    `;

    const [rows] = await client.execute(query, []);
    return rows as Product[];
};
