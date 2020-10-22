import { createPool, Pool } from 'mysql2/promise';
import awsParamStore from 'aws-param-store';
import { Operator, Service } from '../../types';
import { replaceIWBusCoNocCode } from '../sharedHelpers';

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

export const getOperatorDataByNocCode = async (nocCodes: string[]): Promise<Operator[]> => {
    try {
        const cleansedNocs: string[] = nocCodes.map(noc => replaceIWBusCoNocCode(noc));
        const substitution = cleansedNocs.map(() => '?').join(',');

        const queryInput = `
            SELECT DISTINCT nocTable.nocCode, nocTable.opId, nocTable.vosaPsvLicenseName, nocTable.operatorPublicName,
            nocPublicName.website, nocPublicName.ttrteEnq, nocPublicName.fareEnq, nocPublicName.complEnq, nocLine.mode FROM nocTable
            JOIN nocPublicName ON nocTable.pubNmId = nocPublicName.pubNmId
            JOIN nocLine ON nocTable.nocCode = nocLine.nocCode
            WHERE nocTable.nocCode IN (${substitution})
        `;

        const operatorData = await executeQuery<Operator[]>(queryInput, cleansedNocs);

        if (!operatorData) {
            throw new Error(`No operator data found for nocCodes: ${cleansedNocs.join(',')}`);
        }

        return operatorData;
    } catch (err) {
        throw new Error(`Could not retrieve operator data from AuroraDB: ${err.stack}`);
    }
};

export const getTndsServiceDataByNocCodeAndLineName = async (nocCode: string, lineName: string): Promise<Service> => {
    try {
        const nocCodeParameter = replaceIWBusCoNocCode(nocCode);
        const queryInput = 'SELECT tndsService.description FROM tndsService WHERE (`nocCode` = ? and `lineName` = ?)';

        const queryResult = await executeQuery<Service[]>(queryInput, [nocCodeParameter, lineName]);

        const tndsServiceData = queryResult[0];

        if (!tndsServiceData) {
            throw new Error(`No service data found for nocCode: ${nocCode}, lineName: ${lineName}`);
        }

        return tndsServiceData;
    } catch (err) {
        throw new Error(`Could not retrieve tnds service data from AuroraDB: ${err.stack}`);
    }
};
