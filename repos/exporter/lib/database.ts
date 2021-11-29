import { createPool, Pool } from 'mysql2/promise';
import { SSM } from 'aws-sdk';
import {
    GroupPassengerTypeDb,
    GroupPassengerTypeReference,
    DbTimeRestriction,
    PassengerType,
    SinglePassengerType,
    RawSalesOfferPackage,
    ServiceDetails,
} from '../shared/dbTypes';
import { GroupDefinition, CompanionInfo, FromDb, SalesOfferPackage } from '../shared/matchingJsonTypes';

const replaceInternalNocCode = (nocCode: string): string => {
    if (nocCode === 'IWBusCo') {
        return 'BLAC';
    }

    return nocCode;
};

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
        connectionLimit: 1,
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

    if (queryResults.length !== 1) {
        throw new Error(`Didn't get one passenger type with the id [${id}]`);
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

export const getSalesOfferPackagesByNoc = async (nocCode: string): Promise<FromDb<SalesOfferPackage>[]> => {
    const queryInput = `
            SELECT id, name, purchaseLocations, paymentMethods, ticketFormats
            FROM salesOfferPackage
            WHERE nocCode = ?
        `;

    const queryResults: RawSalesOfferPackage[] = await executeQuery<RawSalesOfferPackage[]>(queryInput, [nocCode]);

    return queryResults.map((item) => ({
        id: item.id,
        name: item.name,
        purchaseLocations: item.purchaseLocations.split(','),
        paymentMethods: item.paymentMethods.split(','),
        ticketFormats: item.ticketFormats.split(','),
    }));
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
): Promise<GroupDefinition> => ({
    maxPeople: passengerType.maxGroupSize,
    companions: await getCompanions(passengerType, noc),
});

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

export const getPointToPointProducts = async (): Promise<
    {
        id: number;
        lineId: string;
        matchingJsonLink: string;
        startDate: string;
        endDate: string;
    }[]
> => {
    const queryInput = `      
            SELECT id, lineId, matchingJsonLink, startDate, endDate
            FROM products
            WHERE lineId <> ''
        `;
    return await executeQuery(queryInput, []);
};

export const getServicesByLineIdAndNoc = async (lineId: string, noc: string): Promise<ServiceDetails[]> => {
    const nocCodeParameter = replaceInternalNocCode(noc);

    const serviceQuery = `
        SELECT DISTINCT pl.fromAtcoCode, pl.toAtcoCode, ps.direction, os.id as serviceId
        FROM txcOperatorLine AS os
        JOIN txcJourneyPattern AS ps ON ps.operatorServiceId = os.id
        JOIN txcJourneyPatternLink AS pl ON pl.journeyPatternId = ps.id
        WHERE os.nocCode = ? AND os.lineId = ? AND os.dataSource = 'bods'
    `;

    try {
        return await executeQuery(serviceQuery, [nocCodeParameter, lineId]);
    } catch (error) {
        throw new Error(`Could not get journey patterns from Aurora DB.`);
    }
};

declare interface ResultSetHeader {
    constructor: {
        name: 'ResultSetHeader';
    };
    affectedRows: number;
    fieldCount: number;
    info: string;
    insertId: number;
    serverStatus: number;
    warningStatus: number;
}

export const saveIdsOfServicesRequiringAttentionInTheDb = async (
    productId: number,
    idsOfServicesRequiringAttention: string[],
): Promise<void> => {
    if (idsOfServicesRequiringAttention.length === 0) {
        return;
    }

    const idsAsACommaSeparatedString = idsOfServicesRequiringAttention.join();

    const updateQuery = `UPDATE products
                         SET servicesRequiringAttention = ?
                         WHERE id = ?`;

    const meta = await executeQuery<ResultSetHeader>(updateQuery, [idsAsACommaSeparatedString, productId]);

    if (meta.affectedRows > 1) {
        throw Error(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Updated too many rows when updating the servicesRequiringAttention column on products table. ${meta}`,
        );
    } else if (meta.affectedRows === 0) {
        throw Error(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Nothing was updated when attempting to update the servicesRequiringAttention column on products table. ${meta}`,
        );
    }
};

export const removeAllServicesRequiringAttentionIds = async (): Promise<void> => {
    const serviceQuery = `UPDATE products
                          SET servicesRequiringAttention = null`;

    await executeQuery(serviceQuery, []);
};

export const checkReferenceDataImportHasCompleted = async (tableName: string): Promise<void> => {
    const queryInputForNewTable = `SELECT COUNT(1) as count
                        FROM ${tableName}New
        `;

    const newCount = await executeQuery<{ count: number }>(queryInputForNewTable, []);

    if (newCount.count === 0) {
        throw new Error('Reference data import has failed.');
    }

    const queryInputForOldTable = `SELECT COUNT(1) as count
                        FROM ${tableName}
        `;

    const currentCount = await executeQuery<{ count: number }>(queryInputForOldTable, []);

    const percentageResult = (newCount.count / currentCount.count) * 100;

    if (percentageResult < 75) {
        throw new Error(
            `Reference data import has not completed, as only ${percentageResult}% of yesterday's data has been imported.`,
        );
    }
};
export const deleteAndRenameTables = async (): Promise<void> => {
    const connection = await (await connectionPool).getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'DROP TABLE IF EXISTS nocPublicNameOld, nocTableOld, nocLineOld, naptanStopOld, txcJourneyPatternLinkOld, txcJourneyPatternOld, txcOperatorLineOld;',
        );
        await connection.query('ALTER TABLE nocPublicName RENAME TO nocPublicNameOld;');
        await connection.query('ALTER TABLE nocTable RENAME TO nocTableOld;');
        await connection.query('ALTER TABLE nocLine RENAME TO nocLineOld;');
        await connection.query('ALTER TABLE naptanStop RENAME TO naptanStopOld;');
        await connection.query('ALTER TABLE txcJourneyPatternLink RENAME TO txcJourneyPatternLinkOld;');
        await connection.query('ALTER TABLE txcJourneyPattern RENAME TO txcJourneyPatternOld;');
        await connection.query('ALTER TABLE txcOperatorLine RENAME TO txcOperatorLineOld;');
        await connection.query('ALTER TABLE nocPublicNameNew RENAME TO nocPublicName;');
        await connection.query('ALTER TABLE nocTableNew RENAME TO nocTable;');
        await connection.query('ALTER TABLE nocLineNew RENAME TO nocLine;');
        await connection.query('ALTER TABLE naptanStopNew RENAME TO naptanStop;');
        await connection.query('ALTER TABLE txcJourneyPatternLinkNew RENAME TO txcJourneyPatternLink;');
        await connection.query('ALTER TABLE txcJourneyPatternNew RENAME TO txcJourneyPattern;');
        await connection.query('ALTER TABLE txcOperatorLineNew RENAME TO txcOperatorLine;');
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
