import awsParamStore from 'aws-param-store';
import dateFormat from 'dateformat';
import { ResultSetHeader } from 'mysql2';
import { createPool, Pool } from 'mysql2/promise';
import { INTERNAL_NOC } from '../constants';
import {
    FullTimeRestriction,
    Operator,
    OperatorGroup,
    PassengerType,
    PremadeTimeRestriction,
    RawService,
    SalesOfferPackage,
    ServiceType,
    Stop,
} from '../interfaces/index';
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

const executeQuery = async <T>(query: string, values: (string | boolean)[]): Promise<T> => {
    if (!connectionPool) {
        connectionPool = getAuroraDBClient();
    }
    const [rows] = await connectionPool.execute(query, values);
    return JSON.parse(JSON.stringify(rows));
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
            WHERE nocCode = ? AND dataSource = ?
            ORDER BY CAST(lineName AS UNSIGNED) = 0, CAST(lineName AS UNSIGNED), LEFT(lineName, 1), MID(lineName, 2), startDate;
        `;

        const queryResults = await executeQuery<ServiceType[]>(queryInput, [nocCodeParameter, source]);

        return (
            queryResults.map(item => ({
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
            queryResults.map(item => ({
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

        return queryResults.map(item => ({
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

        return queryResults.map(item => ({ atcoCode: item.atcoCode, naptanCode: item.naptanCode }));
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
        .map(item => item.journeyPatternId)
        .filter((value, index, self) => self.indexOf(value) === index);

    const rawPatternService = uniqueJourneyPatterns.map(journey => {
        const filteredJourney = queryResult.filter(item => {
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
            queryResults.map(item => ({
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

        return queryResults.map(item => ({
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

        return queryResults.map(item => ({
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

export const getTimeRestrictionByNocCode = async (nocCode: string): Promise<PremadeTimeRestriction[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving time restrictions for given noc',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT name, contents
            FROM timeRestriction
            WHERE nocCode = ?
        `;

        const queryResults = await executeQuery<RawTimeRestriction[]>(queryInput, [nocCode]);

        return (
            queryResults.map(item => ({
                name: item.name,
                contents: JSON.parse(item.contents),
            })) || []
        );
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
            SELECT contents
            FROM timeRestriction
            WHERE name = ?
            AND nocCode = ?
        `;

        const queryResults = await executeQuery<RawTimeRestriction[]>(queryInput, [name, nocCode]);

        return queryResults.map(item => ({
            name,
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

export const upsertPassengerType = async (
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
                             SET contents = ?,
                                 isGroup  = ?
                             WHERE name = ?
                               AND nocCode = ?`;
        const values = [contents, false, name, nocCode];
        const meta = await executeQuery<ResultSetHeader>(updateQuery, values);
        if (meta.affectedRows > 1) {
            throw Error(`Updated too many rows when updating passenger type ${meta}`);
        } else if (meta.affectedRows === 0) {
            const insertQuery = `INSERT INTO passengerType
                                     (contents, isGroup, name, nocCode)
                                 VALUES (?, ?, ?, ?)`;

            await executeQuery(insertQuery, values);
        }
    } catch (error) {
        throw new Error(`Could not insert passenger type into the passengerType table. ${error}`);
    }
};

export const getPassengerTypeByNameAndNocCode = async (
    nocCode: string,
    name: string,
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
            AND isGroup = false
        `;

        const queryResults = await executeQuery<{ contents: string }[]>(queryInput, [nocCode, name]);
        if (queryResults.length > 1) {
            throw new Error("Didn't expect more than one passenger type with same name and NOC");
        }

        return queryResults[0] ? JSON.parse(queryResults[0].contents) : undefined;
    } catch (error) {
        throw new Error(`Could not retrieve passenger type by nocCode from AuroraDB: ${error}`);
    }
};
