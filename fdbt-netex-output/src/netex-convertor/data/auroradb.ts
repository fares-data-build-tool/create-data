import { createPool, Pool } from 'mysql2/promise';
import awsParamStore from 'aws-param-store';
import { OperatorData, ServiceData } from '../types';

export const getAuroraDBClient = (): Pool => {
    let client: Pool;

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        client = createPool({
            host: 'localhost',
            user: 'fdbt_netex',
            password: 'password',
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    } else {
        client = createPool({
            host: process.env.RDS_HOST,
            user: awsParamStore.getParameterSync('fdbt-rds-netex-output-username', { region: 'eu-west-2' }).Value,
            password: awsParamStore.getParameterSync('fdbt-rds-netex-output-password', { region: 'eu-west-2' }).Value,
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    return client;
};

let connectionPool: Pool;

const executeQuery = async <T>(query: string, values: string[]): Promise<T> => {
    if (!connectionPool) {
        connectionPool = getAuroraDBClient();
    }
    const [rows] = await connectionPool.execute(query, values);
    return JSON.parse(JSON.stringify(rows));
};

export const getOperatorDataByNocCode = async (nocCode: string): Promise<OperatorData> => {
    try {
        const queryInput =
            'SELECT nocTable.opId, nocTable.vosaPsvLicenseName, nocTable.operatorPublicName,' +
            ' nocPublicName.website, nocPublicName.ttrteEnq, nocPublicName.fareEnq, nocPublicName.complEnq, nocLine.mode' +
            ' FROM nocTable JOIN nocPublicName ON nocTable.pubNmId = nocPublicName.pubNmId' +
            ' JOIN nocLine ON nocTable.nocCode = nocLine.nocCode WHERE nocTable.nocCode = ?';

        const queryResult = await executeQuery<OperatorData[]>(queryInput, [nocCode]);

        const operatorData = queryResult[0];

        if (!operatorData) {
            throw new Error(`No operator data found for nocCode: ${nocCode}`);
        }

        return operatorData;
    } catch (err) {
        throw new Error(`Could not retrieve operator data from AuroraDB: ${err.stack}`);
    }
};

export const getTndsServiceDataByNocCodeAndLineName = async (
    nocCode: string,
    lineName: string,
): Promise<ServiceData> => {
    try {
        const queryInput = 'SELECT tndsService.description FROM tndsService WHERE (`nocCode` = ? and `lineName` = ?)';

        const queryResult = await executeQuery<ServiceData[]>(queryInput, [nocCode, lineName]);

        const tndsServiceData = queryResult[0];

        if (!tndsServiceData) {
            throw new Error(`No service data found for nocCode: ${nocCode}, lineName: ${lineName}`);
        }

        return tndsServiceData;
    } catch (err) {
        throw new Error(`Could not retrieve tnds service data from AuroraDB: ${err.stack}`);
    }
};
