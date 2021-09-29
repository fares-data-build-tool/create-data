import { createPool, Pool } from 'mysql2/promise';
import { SSM } from 'aws-sdk';
import { PassengerType, SinglePassengerType } from '../shared/dbTypes';

const ssm = new SSM({ region: 'eu-west-2' });

const getSsmValue = async (parameter: string) =>
    (
        await ssm
            .getParameter({
                Name: parameter,
                WithDecryption: true,
            })
            .promise()
    ).Parameter?.Value;

export const getConnectionPool = async (): Promise<Pool> =>
    createPool({
        ...(process.env.STAGE === 'dev'
            ? {
                  host: 'localhost',
                  user: 'fdbt_site',
                  password: 'password',
              }
            : {
                  host: process.env.RDS_HOST,
                  user: await getSsmValue('fdbt-rds-site-username'),
                  password: await getSsmValue('fdbt-rds-site-password'),
              }),
        database: 'fdbt',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

const connectionPool = getConnectionPool();

const executeQuery = async <T>(query: string, values: (string | boolean | number | Date)[]): Promise<T> => {
    const [rows] = await (await connectionPool).execute(query, values);
    return JSON.parse(JSON.stringify(rows)) as T;
};

const retrievePassengerTypeById = async (
    id: number,
    noc: string,
    isGroup: boolean,
): Promise<{
    id: number;
    name: string;
    contents: string;
}> => {
    const queryInput = `
            SELECT id, name, contents
            FROM passengerType
            WHERE id = ? 
            AND nocCode = ?
            AND isGroup = ?`;

    const queryResults = await executeQuery<{ id: number; name: string; contents: string }[]>(queryInput, [
        id,
        noc,
        isGroup,
    ]);

    if (queryResults.length > 1) {
        throw new Error("Didn't expect more than one passenger type with the same id");
    }

    return queryResults[0];
};

export const getPassengerTypeById = async (passengerId: number, noc: string): Promise<SinglePassengerType> => {
    const result = await retrievePassengerTypeById(passengerId, noc, false);

    const { id, name, contents } = result;

    return {
        id,
        name,
        passengerType: JSON.parse(contents) as PassengerType,
    };
};

export interface DbTimeRestriction {
    day: TimeRestrictionDay;
    timeBands: DbTimeBand[];
}

export interface DbTimeBand {
    startTime: string;
    endTime: string | { fareDayEnd: boolean };
}

export type TimeRestrictionDay =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
    | 'bankHoliday';

export const getTimeRestrictionsByIdAndNoc = async (timeRestrictionId: number, noc: string): Promise<DbTimeRestriction[]> => {
    try {
        const queryInput = `
            SELECT contents
            FROM timeRestriction
            WHERE nocCode = ?
            AND id = ?
        `;

        const queryResults = await executeQuery<
            {
                id: number;
                nocCode: string;
                name: string;
                contents: string;
            }[]
        >(queryInput, [noc, timeRestrictionId]);

        return queryResults.map((item) => {
            return JSON.parse(item.contents) as DbTimeRestriction;
        });
    } catch (error) {
        throw new Error(`Could not retrieve time restriction by nocCode from AuroraDB: ${error.stack}`);
    }
};
