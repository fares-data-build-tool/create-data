import { createPool, Pool } from 'mysql2/promise';
import { SSM } from 'aws-sdk';
import {
    GroupPassengerTypeDb,
    GroupPassengerTypeReference,
    DbTimeRestriction,
    PassengerType,
    SinglePassengerType,
} from '../shared/dbTypes';
import { GroupDefinition, CompanionInfo } from '../shared/matchingJsonTypes';

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
): Promise<{
    id: number;
    name: string;
    contents: string;
    isGroup: boolean;
}> => {
    const queryInput = `
            SELECT id, name, contents, isGroup
            FROM passengerType
            WHERE id = ? 
            AND nocCode = ?`;

    const queryResults = await executeQuery<{ id: number; name: string; contents: string; isGroup: boolean }[]>(
        queryInput,
        [id, noc],
    );

    if (queryResults.length > 1) {
        throw new Error("Didn't expect more than one passenger type with the same id");
    }

    return queryResults[0];
};

export const getPassengerTypeById = async (
    passengerId: number,
    noc: string,
): Promise<SinglePassengerType | GroupPassengerTypeDb> => {
    const result = await retrievePassengerTypeById(passengerId, noc);

    const { id, name, contents, isGroup } = result;

    return isGroup
        ? {
              id,
              name,
              groupPassengerType: JSON.parse(contents) as GroupPassengerTypeReference,
          }
        : {
              id,
              name,
              passengerType: JSON.parse(contents) as PassengerType,
          };
};

export const getTimeRestrictionsByIdAndNoc = async (
    timeRestrictionId: number,
    noc: string,
): Promise<DbTimeRestriction[]> => {
    const queryInput = `
            SELECT contents
            FROM timeRestriction
            WHERE nocCode = ?
            AND id = ?
        `;

    const queryResults = await executeQuery<
        {
            contents: string;
        }[]
    >(queryInput, [noc, timeRestrictionId]);

    return JSON.parse(queryResults[0].contents) as DbTimeRestriction[];
};

export const getFareDayEnd = async (noc: string): Promise<string | undefined> => {
    const queryInput = `
            SELECT time
            FROM fareDayEnd
            WHERE nocCode = ?
        `;

    const queryResults = await executeQuery<
        {
            time: string;
        }[]
    >(queryInput, [noc]);

    return queryResults[0]?.time;
};

export const getCompanions = async (
    passengerType: GroupPassengerTypeReference,
    noc: string,
): Promise<CompanionInfo[]> =>
    await Promise.all(
        passengerType.companions.map(async (companion) => {
            const result = await retrievePassengerTypeById(companion.id, noc);
            const passengerType = JSON.parse(result.contents) as PassengerType;
            return {
                ...passengerType,
                minNumber: companion.minNumber,
                maxNumber: companion.maxNumber,
            };
        }),
    );

export const getGroupDefinition = async (
    passengerType: GroupPassengerTypeReference,
    noc: string,
): Promise<GroupDefinition> => {
    const companions = await getCompanions(passengerType, noc);

    return {
        maxPeople: passengerType.maxGroupSize,
        companions,
    };
};
