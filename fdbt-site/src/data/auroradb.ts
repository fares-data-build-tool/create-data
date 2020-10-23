import dateFormat from 'dateformat';
import { createPool, Pool } from 'mysql2/promise';
import awsParamStore from 'aws-param-store';
import logger from '../utils/logger';
import { SalesOfferPackage } from '../pages/api/describeSalesOfferPackage';
import { INTERNAL_NOC } from '../constants';

export interface ServiceType {
    lineName: string;
    startDate: string;
    description: string;
    serviceCode: string;
}

export interface OperatorNameType {
    operatorPublicName: string;
    nocCode?: string;
}

export interface Operator {
    operatorPublicName: string;
    nocCode: string;
}

export interface JourneyPattern {
    startPoint: {
        Id: string;
        Display: string;
    };
    endPoint: {
        Id: string;
        Display: string;
    };
    stopList: string[];
}

export interface QueryData {
    operatorShortName: string;
    serviceDescription: string;
    lineName: string;
    fromAtcoCode: string;
    toAtcoCode: string;
    fromCommonName: string;
    toCommonName: string;
    journeyPatternId: string;
    order: string;
}
export interface RawJourneyPattern {
    orderedStopPoints: {
        stopPointRef: string;
        commonName: string;
    }[];
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

export interface Stop {
    stopName: string;
    naptanCode: string;
    atcoCode: string;
    localityCode: string;
    localityName: string;
    parentLocalityName: string;
    indicator?: string;
    street?: string;
    qualifierName?: string;
}

export interface StopIdentifiers {
    naptanCode: string | null;
    atcoCode: string;
}

export interface Service {
    serviceDescription: string;
    operatorShortName: string;
    journeyPatterns: JourneyPattern[];
}

export interface RawService {
    serviceDescription: string;
    operatorShortName: string;
    journeyPatterns: RawJourneyPattern[];
}

interface RawSalesOfferPackage {
    name: string;
    description: string;
    purchaseLocations: string;
    paymentMethods: string;
    ticketFormats: string;
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

const executeQuery = async <T>(query: string, values: string[]): Promise<T> => {
    if (!connectionPool) {
        connectionPool = getAuroraDBClient();
    }
    const [rows] = await connectionPool.execute(query, values);
    return JSON.parse(JSON.stringify(rows));
};

export const getServicesByNocCode = async (nocCode: string): Promise<ServiceType[]> => {
    const nocCodeParameter = replaceInternalNocCode(nocCode);
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving services for given noc',
        noc: nocCode,
    });

    try {
        const queryInput = `
            SELECT lineName, startDate, serviceDescription AS description, serviceCode
            FROM tndsOperatorService
            WHERE nocCode = ?
            ORDER BY CAST(lineName AS UNSIGNED) = 0, CAST(lineName AS UNSIGNED), LEFT(lineName, 1), MID(lineName, 2), startDate;
        `;

        const queryResults = await executeQuery<ServiceType[]>(queryInput, [nocCodeParameter]);

        return (
            queryResults.map(item => ({
                lineName: item.lineName,
                startDate: convertDateFormat(item.startDate),
                description: item.description,
                serviceCode: item.serviceCode,
            })) || []
        );
    } catch (error) {
        throw new Error(`Could not retrieve services from AuroraDB: ${error.stack}`);
    }
};

export const getOperatorNameByNocCode = async (nocCode: string): Promise<OperatorNameType> => {
    const nocCodeParameter = replaceInternalNocCode(nocCode);
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operator name for given noc',
        noc: nocCode,
    });

    const queryInput = `
    SELECT operatorPublicName
    FROM nocTable
    WHERE nocCode = ?
    `;

    let queryResult: OperatorNameType[];

    try {
        queryResult = await executeQuery<OperatorNameType[]>(queryInput, [nocCodeParameter]);
    } catch (error) {
        throw new Error(`Could not retrieve operator name from AuroraDB: ${error.stack}`);
    }

    return queryResult[0];
};

export const batchGetOperatorNamesByNocCode = async (nocCodes: string[]): Promise<OperatorNameType[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operator name for given noc',
    });

    try {
        const substitution = nocCodes.map(() => '?').join(',');
        const batchQuery = `
            SELECT operatorPublicName, nocCode
            FROM nocTable
            WHERE nocCode IN (${substitution})
        `;

        return executeQuery<OperatorNameType[]>(batchQuery, nocCodes);
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

export const getServiceByNocCodeAndLineName = async (nocCode: string, lineName: string): Promise<RawService> => {
    const nocCodeParameter = replaceInternalNocCode(nocCode);
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving service info for given noc and line name',
        noc: nocCode,
        lineName,
    });

    const serviceQuery = `
        SELECT os.operatorShortName, os.serviceDescription, os.lineName, pl.fromAtcoCode, pl.toAtcoCode, pl.journeyPatternId, pl.orderInSequence, nsStart.commonName AS fromCommonName, nsStop.commonName as toCommonName
        FROM tndsOperatorService AS os
        JOIN tndsJourneyPattern AS ps ON ps.operatorServiceId = os.id
        JOIN tndsJourneyPatternLink AS pl ON pl.journeyPatternId = ps.id
        LEFT JOIN naptanStop nsStart ON nsStart.atcoCode=pl.fromAtcoCode
        LEFT JOIN naptanStop nsStop ON nsStop.atcoCode=pl.toAtcoCode
        WHERE os.nocCode = ? AND os.lineName = ?
        ORDER BY pl.journeyPatternId ASC, pl.orderInSequence
    `;

    let queryResult: QueryData[];

    try {
        queryResult = await executeQuery(serviceQuery, [nocCodeParameter, lineName]);
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
                ...filteredJourney.map((data: QueryData) => ({
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
            SELECT name, description, purchaseLocations, paymentMethods, ticketFormats
            FROM salesOfferPackage
            WHERE nocCode = ?
        `;

        const queryResults = await executeQuery<RawSalesOfferPackage[]>(queryInput, [nocCode]);

        return (
            queryResults.map(item => ({
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

export const getSearchOperators = async (searchText: string, nocCode: string): Promise<Operator[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operators for given search text and noc',
        noc: nocCode,
        search: searchText,
    });

    const nocCodeParameter = replaceInternalNocCode(nocCode);

    const searchQuery = `SELECT nocCode, operatorPublicName FROM nocTable WHERE nocCode IN (
                             SELECT DISTINCT nocCode FROM tndsOperatorService WHERE regionCode IN (
                                SELECT DISTINCT regionCode FROM tndsOperatorService WHERE nocCode = ?)
                        ) AND operatorPublicName LIKE ?`;

    try {
        return await executeQuery<Operator[]>(searchQuery, [nocCodeParameter, `%${searchText}%`]);
    } catch (error) {
        throw new Error(`Could not retrieve operators from AuroraDB: ${error.stack}`);
    }
};
