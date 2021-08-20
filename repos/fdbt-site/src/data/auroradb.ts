import awsParamStore from 'aws-param-store';
import dateFormat from 'dateformat';
import { ResultSetHeader } from 'mysql2';
import { createPool, Pool } from 'mysql2/promise';
import { INTERNAL_NOC } from '../constants';
import {
    CompanionInfo,
    FullTimeRestriction,
    GroupPassengerType,
    Operator,
    OperatorGroup,
    PassengerType,
    PremadeTimeRestriction,
    RawService,
    SalesOfferPackage,
    ServiceType,
    SinglePassengerType,
    Stop,
    GroupPassengerTypeDb,
    GroupPassengerTypeReference,
    FullGroupPassengerType,
} from '../interfaces';
import logger from '../utils/logger';

interface ServiceQueryData {
    operatorShortName: string;
    serviceDescription: string;
    lineName: string;
    lineId: string;
    fromAtcoCode: string;
    toAtcoCode: string;
    fromCommonName: string;
    toCommonName: string;
    journeyPatternId: string;
    order: string;
}

interface NaptanInfo {
    commonName: string;
    naptanCode: string;
    atcoCode: string;
    nptgLocalityCode: string;
    localityName: string;
    parentLocalityName: string;
    indicator: string;
    street: string;
}

interface NaptanAtcoCodes {
    naptanCode: string;
    atcoCode: string;
}

interface RawSalesOfferPackage {
    name: string;
    description: string;
    id: string;
    purchaseLocations: string;
    paymentMethods: string;
    ticketFormats: string;
}

interface RawTimeRestriction {
    id: number;
    nocCode: string;
    name: string;
    contents: string;
}

interface RawOperatorGroup {
    nocCode: string;
    name: string;
    contents: string;
}

export const getAuroraDBClient = (): Pool => {
    let client: Pool;

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        client = createPool({
            host: 'localhost',
            user: 'fdbt_site',
            password: 'password',
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    } else {
        client = createPool({
            host: process.env.RDS_HOST,
            user: awsParamStore.getParameterSync('fdbt-rds-site-username', { region: 'eu-west-2' }).Value,
            password: awsParamStore.getParameterSync('fdbt-rds-site-password', { region: 'eu-west-2' }).Value,
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    return client;
};

export const convertDateFormat = (startDate: string): string => {
    return dateFormat(startDate, 'dd/mm/yyyy');
};

export const replaceInternalNocCode = (nocCode: string): string => {
    if (nocCode === INTERNAL_NOC) {
        return 'WBTR';
    }

    return nocCode;
};

let connectionPool: Pool;

const executeQuery = async <T>(query: string, values: (string | boolean | number)[]): Promise<T> => {
    if (!connectionPool) {
        connectionPool = getAuroraDBClient();
    }
    const [rows] = await connectionPool.execute(query, values);
    return JSON.parse(JSON.stringify(rows)) as T;
};

export const getServicesByNocCodeAndDataSource = async (nocCode: string, source: string): Promise<ServiceType[]> => {
    const nocCodeParameter = replaceInternalNocCode(nocCode);
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving services for given noc',
        noc: nocCode,
    });

    try {
        const queryInput = `
            SELECT lineName, lineId, startDate, serviceDescription AS description, origin, destination, serviceCode
            FROM txcOperatorLine
            WHERE nocCode = ? AND dataSource = ? AND (endDate IS NULL OR CURDATE() <= endDate)
            ORDER BY CAST(lineName AS UNSIGNED) = 0, CAST(lineName AS UNSIGNED), LEFT(lineName, 1), MID(lineName, 2), startDate;
        `;

        const queryResults = await executeQuery<ServiceType[]>(queryInput, [nocCodeParameter, source]);

        return (
            queryResults.map((item) => ({
                lineName: item.lineName,
                lineId: item.lineId,
                startDate: convertDateFormat(item.startDate),
                description: item.description,
                origin: item.origin,
                destination: item.destination,
                serviceCode: item.serviceCode,
            })) || []
        );
    } catch (error) {
        throw new Error(`Could not retrieve services from AuroraDB: ${error.stack}`);
    }
};

export const getAllServicesByNocCode = async (nocCode: string): Promise<ServiceType[]> => {
    const nocCodeParameter = replaceInternalNocCode(nocCode);
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving services for given noc',
        noc: nocCode,
    });

    try {
        const queryInput = `
            SELECT lineName, lineId, startDate, serviceDescription AS description, serviceCode, dataSource
            FROM txcOperatorLine
            WHERE nocCode = ?
            ORDER BY CAST(lineName AS UNSIGNED) = 0, CAST(lineName AS UNSIGNED), LEFT(lineName, 1), MID(lineName, 2), startDate;
        `;

        const queryResults = await executeQuery<ServiceType[]>(queryInput, [nocCodeParameter]);

        return (
            queryResults.map((item) => ({
                lineName: item.lineName,
                lineId: item.lineId,
                startDate: convertDateFormat(item.startDate),
                description: item.description,
                serviceCode: item.serviceCode,
                dataSource: item.dataSource,
            })) || []
        );
    } catch (error) {
        throw new Error(`Could not retrieve services from AuroraDB: ${error.stack}`);
    }
};

export const getOperatorNameByNocCode = async (nocCode: string): Promise<string> => {
    const nocCodeParameter = replaceInternalNocCode(nocCode);
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operator name for given noc',
        noc: nocCode,
    });

    const queryInput = `
    SELECT operatorPublicName AS name
    FROM nocTable
    WHERE nocCode = ?
    `;

    let queryResult: Operator[];

    try {
        queryResult = await executeQuery<Operator[]>(queryInput, [nocCodeParameter]);
    } catch (error) {
        throw new Error(`Could not retrieve operator name from AuroraDB: ${error.stack}`);
    }

    return queryResult[0].name;
};

export const batchGetOperatorNamesByNocCode = async (nocCodes: string[]): Promise<Operator[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operator name for given noc',
    });

    try {
        const substitution = nocCodes.map(() => '?').join(',');
        const batchQuery = `
            SELECT operatorPublicName AS name, nocCode
            FROM nocTable
            WHERE nocCode IN (${substitution})
        `;

        return executeQuery<Operator[]>(batchQuery, nocCodes);
    } catch (error) {
        throw new Error(
            `Error performing batch get for operator names against noc codes '${JSON.stringify(nocCodes)}': ${
                error.stack
            }`,
        );
    }
};

export const batchGetStopsByAtcoCode = async (atcoCodes: string[]): Promise<Stop[] | []> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving naptan info for atco codes',
    });

    try {
        const substitution = atcoCodes.map(() => '?').join(',');
        const batchQuery = `
            SELECT commonName, naptanCode, atcoCode, nptgLocalityCode, localityName, parentLocalityName, indicator, street
            FROM naptanStop
            WHERE atcoCode IN (${substitution})
        `;

        const queryResults = await executeQuery<NaptanInfo[]>(batchQuery, atcoCodes);
        if (queryResults.length !== atcoCodes.length) {
            throw new Error('Not all ATCO codes returned stops, some must be invalid.');
        }

        return queryResults.map((item) => ({
            stopName: item.commonName,
            naptanCode: item.naptanCode,
            atcoCode: item.atcoCode,
            localityCode: item.nptgLocalityCode,
            localityName: item.localityName,
            parentLocalityName: item.parentLocalityName ?? '',
            indicator: item.indicator,
            street: item.street,
        }));
    } catch (error) {
        throw new Error(
            `Error performing batch get for naptan info for stop list '${JSON.stringify(atcoCodes)}': ${error.stack}`,
        );
    }
};

export const getAtcoCodesByNaptanCodes = async (naptanCodes: string[]): Promise<NaptanAtcoCodes[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving atco codes by naptan codes',
    });

    const substitution = naptanCodes.map(() => '?').join(',');
    const atcoCodesByNaptanCodeQuery = `
        SELECT atcoCode, naptanCode FROM naptanStop
        WHERE naptanCode IN (${substitution})
    `;

    try {
        const queryResults = await executeQuery<NaptanAtcoCodes[]>(atcoCodesByNaptanCodeQuery, naptanCodes);

        return queryResults.map((item) => ({ atcoCode: item.atcoCode, naptanCode: item.naptanCode }));
    } catch (error) {
        throw new Error(
            `Error performing queries for ATCO Codes using Naptan Codes '${JSON.stringify(naptanCodes)}': ${
                error.stack
            }`,
        );
    }
};

export const getServiceByNocCodeLineNameAndDataSource = async (
    nocCode: string,
    lineName: string,
    dataSource: string,
): Promise<RawService> => {
    const nocCodeParameter = replaceInternalNocCode(nocCode);
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving service info for given noc and line name',
        noc: nocCode,
        lineName,
    });

    const serviceQuery = `
        SELECT os.operatorShortName, os.serviceDescription, os.lineName, os.lineId, pl.fromAtcoCode, pl.toAtcoCode, pl.journeyPatternId, pl.orderInSequence, nsStart.commonName AS fromCommonName, nsStop.commonName as toCommonName
        FROM txcOperatorLine AS os
        JOIN txcJourneyPattern AS ps ON ps.operatorServiceId = os.id
        JOIN txcJourneyPatternLink AS pl ON pl.journeyPatternId = ps.id
        LEFT JOIN naptanStop nsStart ON nsStart.atcoCode=pl.fromAtcoCode
        LEFT JOIN naptanStop nsStop ON nsStop.atcoCode=pl.toAtcoCode
        WHERE os.nocCode = ? AND os.lineName = ? AND os.dataSource = ?
        ORDER BY pl.journeyPatternId ASC, pl.orderInSequence
    `;

    let queryResult: ServiceQueryData[];

    try {
        queryResult = await executeQuery(serviceQuery, [nocCodeParameter, lineName, dataSource]);
    } catch (error) {
        throw new Error(`Could not get journey patterns from Aurora DB: ${error.stack}`);
    }

    const service = queryResult[0];

    // allows to get the unique journey's for the operator e.g. [1,2,3]
    const uniqueJourneyPatterns = queryResult
        .map((item) => item.journeyPatternId)
        .filter((value, index, self) => self.indexOf(value) === index);

    const rawPatternService = uniqueJourneyPatterns.map((journey) => {
        const filteredJourney = queryResult.filter((item) => {
            return item.journeyPatternId === journey;
        });

        return {
            orderedStopPoints: [
                {
                    stopPointRef: filteredJourney[0].fromAtcoCode,
                    commonName: filteredJourney[0].fromCommonName,
                },
                ...filteredJourney.map((data: ServiceQueryData) => ({
                    stopPointRef: data.toAtcoCode,
                    commonName: data.toCommonName,
                })),
            ],
        };
    });

    if (!service || rawPatternService.length === 0) {
        throw new Error(`No journey patterns found for nocCode: ${nocCodeParameter}, lineName: ${lineName}`);
    }

    return {
        serviceDescription: service.serviceDescription,
        operatorShortName: service.operatorShortName,
        journeyPatterns: rawPatternService,
        lineId: service.lineId,
    };
};

export const getSalesOfferPackagesByNocCode = async (nocCode: string): Promise<SalesOfferPackage[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving sales offer packages for given noc',
        noc: nocCode,
    });

    try {
        const queryInput = `
            SELECT id, name, description, purchaseLocations, paymentMethods, ticketFormats
            FROM salesOfferPackage
            WHERE nocCode = ?
        `;

        const queryResults = await executeQuery<RawSalesOfferPackage[]>(queryInput, [nocCode]);

        return (
            queryResults.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                purchaseLocations: item.purchaseLocations.split(','),
                paymentMethods: item.paymentMethods.split(','),
                ticketFormats: item.ticketFormats.split(','),
            })) || []
        );
    } catch (error) {
        throw new Error(`Could not retrieve services from AuroraDB: ${error.stack}`);
    }
};

export const insertSalesOfferPackage = async (nocCode: string, salesOfferPackage: SalesOfferPackage): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'inserting sales offer package for given noc',
        noc: nocCode,
    });

    const purchaseLocations = salesOfferPackage.purchaseLocations.toString();
    const paymentMethods = salesOfferPackage.paymentMethods.toString();
    const ticketFormats = salesOfferPackage.ticketFormats.toString();

    const insertQuery = `INSERT INTO salesOfferPackage 
    (nocCode, name, description, purchaseLocations, paymentMethods, ticketFormats) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    try {
        await executeQuery(insertQuery, [
            nocCode,
            salesOfferPackage.name,
            salesOfferPackage.description,
            purchaseLocations,
            paymentMethods,
            ticketFormats,
        ]);
    } catch (error) {
        throw new Error(`Could not insert sales offer package into the salesOfferPackage table. ${error.stack}`);
    }
};

export const deleteSalesOfferPackageByNocCodeAndName = async (sopId: string, nocCode: string): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'deleting sales offer package for given name',
        sopId,
    });

    const deleteQuery = `
            DELETE FROM salesOfferPackage 
            WHERE id = ?
            AND nocCode = ?`;
    try {
        await executeQuery(deleteQuery, [sopId, nocCode]);
    } catch (error) {
        throw new Error(`Could not delete sales offer package from the salesOfferPackage table. ${error.stack}`);
    }
};

export const insertOperatorGroup = async (nocCode: string, operators: Operator[], name: string): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'inserting operator group for given name and nocCode',
        nocCode,
        name,
    });

    const contents = JSON.stringify(operators);

    const insertQuery = `INSERT INTO operatorGroup 
    (nocCode, name, contents) 
    VALUES (?, ?, ?)`;
    try {
        await executeQuery(insertQuery, [nocCode, name, contents]);
    } catch (error) {
        throw new Error(`Could not insert operator group into the operatorGroup table. ${error.stack}`);
    }
};

export const getOperatorGroupsByNoc = async (nocCode: string): Promise<OperatorGroup[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operator groups for given nocCode',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT contents, name
            FROM operatorGroup
            WHERE nocCode = ?
        `;

        const queryResults = await executeQuery<RawOperatorGroup[]>(queryInput, [nocCode]);

        return queryResults.map((item) => ({
            name: item.name,
            operators: JSON.parse(item.contents),
        }));
    } catch (error) {
        throw new Error(`Could not retrieve operator group by nocCode from AuroraDB: ${error.stack}`);
    }
};

export const getOperatorGroupsByNameAndNoc = async (name: string, nocCode: string): Promise<OperatorGroup[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operator groups for given name and nocCode',
        name,
        nocCode,
    });

    try {
        const queryInput = `
            SELECT contents
            FROM operatorGroup
            WHERE name = ?
            AND nocCode = ?
        `;

        const queryResults = await executeQuery<RawOperatorGroup[]>(queryInput, [name, nocCode]);

        return queryResults.map((item) => ({
            name,
            nocCode,
            operators: JSON.parse(item.contents),
        }));
    } catch (error) {
        throw new Error(`Could not retrieve operator group by name and nocCode from AuroraDB: ${error.stack}`);
    }
};

export const insertTimeRestriction = async (
    nocCode: string,
    timeRestriction: FullTimeRestriction[],
    name: string,
): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'inserting time restriction for given noc and name',
        nocCode,
        name,
    });

    const contents = JSON.stringify(timeRestriction);

    const insertQuery = `INSERT INTO timeRestriction 
    (nocCode, name, contents) 
    VALUES (?, ?, ?)`;
    try {
        await executeQuery(insertQuery, [nocCode, name, contents]);
    } catch (error) {
        throw new Error(`Could not insert time restriction into the timeRestriction table. ${error.stack}`);
    }
};

export const updateTimeRestriction = async (
    id: number,
    nocCode: string,
    timeRestriction: FullTimeRestriction[],
    name: string,
): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'updating time restriction',
        nocCode,
        name,
        id,
    });

    const contents = JSON.stringify(timeRestriction);

    const updateQuery = `UPDATE timeRestriction 
                         SET name = ?, contents = ? 
                         WHERE id = ? AND nocCode = ?`;

    try {
        await executeQuery(updateQuery, [name, contents, id, nocCode]);
    } catch (error) {
        throw new Error(`Could not update time restriction. ${error.stack}`);
    }
};

export const getTimeRestrictionByNocCode = async (nocCode: string): Promise<PremadeTimeRestriction[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving time restrictions for given noc',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT id, name, contents
            FROM timeRestriction
            WHERE nocCode = ?
        `;

        const queryResults = await executeQuery<RawTimeRestriction[]>(queryInput, [nocCode]);

        return (
            queryResults.map((item) => ({
                id: item.id,
                name: item.name,
                contents: JSON.parse(item.contents),
            })) || []
        );
    } catch (error) {
        throw new Error(`Could not retrieve time restriction by nocCode from AuroraDB: ${error.stack}`);
    }
};

export const getTimeRestrictionById = async (
    id: number,
    nocCode: string,
): Promise<PremadeTimeRestriction | undefined> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving time restriction for given id',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT id, name, contents
            FROM timeRestriction
            WHERE nocCode = ? AND id = ?
        `;

        const queryResult = (await executeQuery<RawTimeRestriction[]>(queryInput, [nocCode, id]))[0];

        return queryResult && { ...queryResult, contents: JSON.parse(queryResult.contents) };
    } catch (error) {
        throw new Error(`Could not retrieve time restriction by nocCode from AuroraDB: ${error.stack}`);
    }
};

export const getTimeRestrictionByNameAndNoc = async (
    name: string,
    nocCode: string,
): Promise<PremadeTimeRestriction[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving time restriction for given name and nocCode',
        name,
        nocCode,
    });

    try {
        const queryInput = `
            SELECT id, name, contents
            FROM timeRestriction
            WHERE name = ?
            AND nocCode = ?
        `;

        const queryResults = await executeQuery<RawTimeRestriction[]>(queryInput, [name, nocCode]);

        return queryResults.map((item) => ({
            id: item.id,
            name: item.name,
            contents: JSON.parse(item.contents),
        }));
    } catch (error) {
        throw new Error(`Could not retrieve time restriction by name and nocCode from AuroraDB: ${error.stack}`);
    }
};

export const getSearchOperatorsBySearchText = async (searchText: string): Promise<Operator[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operators for given search text and noc',
        search: searchText,
    });

    const searchQuery = `
        SELECT nocCode, operatorPublicName AS name FROM nocTable WHERE nocCode IN (
            SELECT DISTINCT nocCode FROM txcOperatorLine
        ) AND operatorPublicName LIKE ?
    `;

    try {
        return await executeQuery<Operator[]>(searchQuery, [`%${searchText}%`]);
    } catch (error) {
        throw new Error(`Could not retrieve operators from AuroraDB: ${error.stack}`);
    }
};

export const insertSinglePassengerType = async (
    nocCode: string,
    passengerType: PassengerType,
    name: string,
): Promise<void> => {
    const contents = JSON.stringify(passengerType);

    const insertQuery = `INSERT INTO passengerType (contents, isGroup, name, nocCode)
                         VALUES (?, ?, ?, ?)`;

    await executeQuery(insertQuery, [contents, false, name, nocCode]);
};

export const insertGroupPassengerType = async (
    nocCode: string,
    passengerType: GroupPassengerType | GroupPassengerTypeReference,
    name: string,
): Promise<void> => {
    const contents = JSON.stringify(passengerType);

    const insertQuery = `INSERT INTO passengerType (contents, isGroup, name, nocCode)
                         VALUES (?, ?, ?, ?)`;

    await executeQuery(insertQuery, [contents, true, name, nocCode]);
};

export const upsertSinglePassengerType = async (
    nocCode: string,
    passengerType: PassengerType,
    name: string,
): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'upserting passenger type for given noc and name',
        nocCode,
        name,
    });

    const contents = JSON.stringify(passengerType);

    try {
        const updateQuery = `UPDATE passengerType
                             SET contents = ?
                             WHERE name = ? 
                             AND isGroup = ?
                             AND nocCode = ?`;
        const meta = await executeQuery<ResultSetHeader>(updateQuery, [contents, name, false, nocCode]);
        if (meta.affectedRows > 1) {
            throw Error(`Updated too many rows when updating passenger type ${meta}`);
        } else if (meta.affectedRows === 0) {
            await insertSinglePassengerType(nocCode, passengerType, name);
        }
    } catch (error) {
        throw new Error(`Could not insert passenger type into the passengerType table. ${error}`);
    }
};

export const updateSinglePassengerType = async (noc: string, passengerType: SinglePassengerType): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'updating passenger type for given id',
        id: passengerType.id,
        name: passengerType.name,
    });

    const contents = JSON.stringify(passengerType.passengerType);

    try {
        const updateQuery = `UPDATE passengerType
                             SET name = ?, contents = ?
                             WHERE id = ? AND nocCode = ? AND isGroup = ?`;

        const meta = await executeQuery<ResultSetHeader>(updateQuery, [
            passengerType.name,
            contents,
            passengerType.id,
            noc,
            false,
        ]);

        if (meta.affectedRows !== 1) {
            throw Error(`Did not update a single row: ${meta}`);
        }
    } catch (error) {
        throw new Error(`Could not update passenger type. ${error}`);
    }
};

export const updateGroupPassengerType = async (
    noc: string,
    groupPassengerType: GroupPassengerTypeDb,
): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'updating group passenger type for given id',
        id: groupPassengerType.id,
        name: groupPassengerType.name,
    });

    const contents = JSON.stringify(groupPassengerType.groupPassengerType);

    try {
        const updateQuery = `UPDATE passengerType
                             SET name = ?, contents = ?
                             WHERE id = ? AND nocCode = ?`;

        const meta = await executeQuery<ResultSetHeader>(updateQuery, [
            groupPassengerType.name,
            contents,
            groupPassengerType.id,
            noc,
        ]);

        if (meta.affectedRows !== 1) {
            throw Error(`Did not update a single row: ${meta}`);
        }
    } catch (error) {
        throw new Error(`Could not update group passenger type. ${error}`);
    }
};

export const getPassengerTypeByNameAndNocCode = async (
    nocCode: string,
    name: string,
    group: boolean,
): Promise<PassengerType | undefined> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving passenger types for given noc and name',
        nocCode,
        name,
    });

    try {
        const queryInput = `
            SELECT contents
            FROM passengerType
            WHERE nocCode = ?
            AND name = ?
            AND isGroup = ?
        `;

        const queryResults = await executeQuery<{ contents: string }[]>(queryInput, [nocCode, name, group]);
        if (queryResults.length > 1) {
            throw new Error("Didn't expect more than one passenger type with same name and NOC");
        }

        return queryResults[0] ? (JSON.parse(queryResults[0].contents) as PassengerType) : undefined;
    } catch (error) {
        throw new Error(`Could not retrieve passenger type by nocCode from AuroraDB: ${error}`);
    }
};

export const getSinglePassengerTypeByNameAndNocCode = async (
    nationalOperatorCode: string,
    name: string,
    isGroup: boolean,
): Promise<SinglePassengerType | undefined> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving passenger type for a given national operator code and name',
        nationalOperatorCode,
        name,
        isGroup,
    });

    try {
        const queryInput = `
            SELECT id, name, contents
            FROM passengerType
            WHERE nocCode = ? AND name = ? AND isGroup = ?`;

        const queryResults = await executeQuery<{ id: number; name: string; contents: string }[]>(queryInput, [
            nationalOperatorCode,
            name,
            isGroup,
        ]);

        if (queryResults.length > 1) {
            throw new Error("Didn't expect more than one passenger type with the same national operator code and name");
        }

        const data = queryResults[0];

        return data
            ? ({
                  id: data.id,
                  name: data.name,
                  passengerType: JSON.parse(data.contents),
              } as SinglePassengerType)
            : undefined;
    } catch (error) {
        throw new Error(`Could not retrieve passenger type by national operator code and name from AuroraDB: ${error}`);
    }
};

export const getPassengerTypeById = async (
    passengerId: number,
    noc: string,
): Promise<SinglePassengerType | undefined> => {
    const result = await retrievePassengerTypeById(passengerId, noc, false);

    if (!result) {
        return undefined;
    }

    const { id, name, contents } = result;

    return {
        id,
        name,
        passengerType: JSON.parse(contents) as PassengerType,
    };
};

export const getGroupPassengerTypeById = async (
    passengerId: number,
    noc: string,
): Promise<GroupPassengerTypeDb | undefined> => {
    const result = await retrievePassengerTypeById(passengerId, noc, true);

    if (!result) {
        return undefined;
    }

    const { id, name, contents } = result;

    const parsedContents = JSON.parse(contents) as GroupPassengerTypeReference;

    return {
        id,
        name,
        groupPassengerType: parsedContents,
    };
};

const retrievePassengerTypeById = async (
    id: number,
    noc: string,
    isGroup: boolean,
): Promise<
    | {
          id: number;
          name: string;
          contents: string;
      }
    | undefined
> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving passenger type for a given id',
        id,
        noc,
        isGroup,
    });

    try {
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
    } catch (error) {
        throw new Error(`Could not retrieve passenger type by id from AuroraDB: ${error}`);
    }
};

interface SavedPassengerType {
    group: GroupPassengerType;
    single: SinglePassengerType;
}

export const getPassengerTypesByNocCode = async <T extends keyof SavedPassengerType>(
    nocCode: string,
    type: T,
): Promise<SavedPassengerType[T][]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving passenger types for given noc',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT id, name, contents
            FROM passengerType
            WHERE nocCode = ?
            AND isGroup = ?
        `;

        const queryResults = await executeQuery<{ id: number; name: string; contents: string }[]>(queryInput, [
            nocCode,
            type === 'group',
        ]);

        if (type === 'single') {
            return queryResults.map(
                (row) =>
                    ({ id: row.id, name: row.name, passengerType: JSON.parse(row.contents) } as SavedPassengerType[T]),
            );
        } else {
            // filter out the ones with IDs that are created in global settings
            return queryResults
                .map((row) => JSON.parse(row.contents) as GroupPassengerType | GroupPassengerTypeReference)
                .filter((row) => !row.companions.some((companion) => 'id' in companion)) as SavedPassengerType[T][];
        }
    } catch (error) {
        throw new Error(`Could not retrieve passenger type by nocCode from AuroraDB: ${error}`);
    }
};

export const getGroupPassengerTypesFromGlobalSettings = async (nocCode: string): Promise<FullGroupPassengerType[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving global settings group passenger types for given noc',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT id, name, contents
            FROM passengerType
            WHERE nocCode = ?
            AND isGroup = ?
        `;

        const queryResults = await executeQuery<{ id: number; name: string; contents: string }[]>(queryInput, [
            nocCode,
            true,
        ]);

        // filter out the ones without IDs that are not created in global settings
        const dbGroups = queryResults
            .map((row) => ({
                id: row.id,
                name: row.name,
                groupPassengerType: JSON.parse(row.contents) as GroupPassengerType | GroupPassengerTypeReference,
            }))
            .filter((row) => row.groupPassengerType.companions.some((it) => 'id' in it)) as GroupPassengerTypeDb[];

        return Promise.all(dbGroups.map((group) => convertToFullPassengerType(group, nocCode)));
    } catch (error) {
        throw new Error(`Could not retrieve group passenger type by nocCode from AuroraDB: ${error}`);
    }
};

export const convertToFullPassengerType = async (
    group: GroupPassengerTypeDb,
    nocCode: string,
): Promise<FullGroupPassengerType> => ({
    id: group.id,
    name: group.name,
    groupPassengerType: {
        ...group.groupPassengerType,
        companions: await Promise.all(
            group.groupPassengerType.companions.map(async (companion): Promise<CompanionInfo> => {
                const individual = await getPassengerTypeById(companion.id, nocCode);
                if (!individual) {
                    throw new Error(`no passenger type found for companion id [${companion.id}]`);
                }
                return {
                    minNumber: companion.minNumber,
                    maxNumber: companion.maxNumber,
                    ...individual.passengerType,
                    passengerType: individual.passengerType.passengerType,
                    name: individual.name,
                    id: individual.id,
                };
            }),
        ),
    },
});

export const getGroupPassengerTypeDbsFromGlobalSettings = async (nocCode: string): Promise<GroupPassengerTypeDb[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving global settings group passenger types for given noc',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT id, name, contents
            FROM passengerType
            WHERE nocCode = ?
            AND isGroup = ?
        `;

        const queryResults = await executeQuery<{ id: number; name: string; contents: string }[]>(queryInput, [
            nocCode,
            true,
        ]);

        // filter out the ones without IDs that are not created in global settings
        return queryResults
            .map((row) => ({
                id: row.id,
                name: row.name,
                groupPassengerType: JSON.parse(row.contents) as GroupPassengerType | GroupPassengerTypeReference,
            }))
            .filter((row) => row.groupPassengerType.companions.some((it) => 'id' in it)) as GroupPassengerTypeDb[];
    } catch (error) {
        throw new Error(`Could not retrieve group passenger type by nocCode from AuroraDB: ${error}`);
    }
};

export const deletePassengerTypeByNocCodeAndId = async (
    id: number,
    nocCode: string,
    isGroup: boolean,
): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'deleting passenger type for given id',
        id,
    });

    const deleteQuery = `
            DELETE FROM passengerType 
            WHERE id = ?
            AND nocCode = ?
            AND isGroup = ?`;
    try {
        await executeQuery(deleteQuery, [id, nocCode, isGroup]);
    } catch (error) {
        throw new Error(
            `Could not delete ${isGroup === true ? 'group' : 'passenger'} from the passengerType table. ${error.stack}`,
        );
    }
};

export const deleteTimeRestrictionByIdAndNocCode = async (id: number, nocCode: string): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: `deleting time restriction for id: ${id}.`,
        id,
        nocCode,
    });

    const deleteQuery = `
            DELETE FROM timeRestriction 
            WHERE id = ?
            AND nocCode = ?`;
    try {
        await executeQuery(deleteQuery, [id, nocCode]);
    } catch (error) {
        throw new Error(`Could not delete time restriction with id: ${id}. ${error.stack}`);
    }
};
