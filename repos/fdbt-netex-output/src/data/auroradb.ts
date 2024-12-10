import { createPool, Pool } from 'mysql2/promise';
import { Operator, OperatorDetails } from '../types';
import { replaceIWBusCoNocCode } from '../netex-convertor/sharedHelpers';
import { getSsmValue } from './ssm';

export const getAuroraDBClient = async (): Promise<Pool> => {
    let client: Pool;

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        client = createPool({
            host: 'localhost',
            user: 'fdbt_netex',
            password: 'password',
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0,
        });
    } else {
        client = createPool({
            host: process.env.RDS_HOST,
            user: await getSsmValue('fdbt-rds-netex-output-username'),
            password: await getSsmValue('fdbt-rds-netex-output-password'),
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0,
        });
    }

    return client;
};

let connectionPool: Pool;

const executeQuery = async <T>(query: string, values: string[]): Promise<T> => {
    if (!connectionPool) {
        connectionPool = await getAuroraDBClient();
    }
    const [rows] = await connectionPool.execute(query, values);
    return JSON.parse(JSON.stringify(rows));
};

export const getOperatorDetailsByNoc = async (nocCode: string): Promise<OperatorDetails | undefined> => {
    try {
        const queryInput = `
            SELECT contents
            FROM operatorDetails
            WHERE nocCode = ?
        `;

        const queryResults = await executeQuery<{ contents: string }[]>(queryInput, [nocCode]);

        return queryResults[0] ? (JSON.parse(queryResults[0].contents) as OperatorDetails) : undefined;
    } catch (error) {
        throw new Error(`Could not retrieve operator details by nocCode from AuroraDB: ${(error as Error).stack}`);
    }
};

export const removeDuplicateOperators = (operators: Operator[]): Operator[] => {
    const filteredOperators = operators.filter(op => {
        // find the number of times the operator appears in the operators array
        const operatorCount = operators.filter(operator => operator.nocCode === op.nocCode).length;
        // only return operators where they appear once or their mode is bus
        return operatorCount === 1 || op.mode === 'Bus';
    });
    return filteredOperators;
};

export const getOperatorDataByNocCode = async (nocCodes: string[]): Promise<Operator[]> => {
    try {
        const cleansedNocs: string[] = nocCodes.map(noc => replaceIWBusCoNocCode(noc));
        if (cleansedNocs.length < 1) {
            throw new Error('No noc codes provided');
        }

        const substitution = cleansedNocs.map(() => '?').join(',');

        const queryInput = `
            SELECT DISTINCT nocTable.nocCode, nocTable.opId, nocTable.vosaPsvLicenseName, nocTable.operatorPublicName as operatorName,
            nocPublicName.website AS url, nocPublicName.ttrteEnq AS email, nocPublicName.fareEnq AS contactNumber, nocPublicName.complEnq AS street, nocLine.mode FROM nocTable
            JOIN nocPublicName ON nocTable.pubNmId = nocPublicName.pubNmId
            JOIN nocLine ON nocTable.nocCode = nocLine.nocCode
            WHERE nocTable.nocCode IN (${substitution})
        `;

        const operatorData = await executeQuery<Operator[]>(queryInput, cleansedNocs);

        if (!operatorData) {
            throw new Error(`No operator data found for nocCodes: ${cleansedNocs.join(',')}`);
        }

        const filteredOperators = removeDuplicateOperators(operatorData);

        return filteredOperators;
    } catch (err) {
        throw new Error(`Could not retrieve operator data from AuroraDB: ${(err as Error).stack}`);
    }
};
