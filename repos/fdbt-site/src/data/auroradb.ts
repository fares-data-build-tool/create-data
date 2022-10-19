import awsParamStore from 'aws-param-store';
import { ResultSetHeader } from 'mysql2';
import { createPool, Pool } from 'mysql2/promise';
import { FromDb, OperatorDetails } from 'fdbt-types/matchingJsonTypes';
import { INTERNAL_NOC } from '../constants';
import {
    CompanionInfo,
    GroupPassengerType,
    Operator,
    OperatorGroup,
    PassengerType,
    PremadeTimeRestriction,
    SalesOfferPackage,
    ServiceType,
    ServiceCount,
    SinglePassengerType,
    Stop,
    GroupPassengerTypeDb,
    GroupPassengerTypeReference,
    FullGroupPassengerType,
    MyFaresService,
} from '../interfaces';
import logger from '../utils/logger';
import {
    DbTimeRestriction,
    RawMyFaresProduct,
    MyFaresOtherProduct,
    RawSalesOfferPackage,
    RawService,
    MyFaresProduct,
    RawJourneyPattern,
    DbProduct,
} from 'fdbt-types/dbTypes';
import { convertDateFormat } from '../utils';
import _ from 'lodash';

interface ServiceQueryData {
    operatorShortName: string;
    serviceDescription: string;
    lineName: string;
    startDate: string;
    lineId: string;
    fromAtcoCode: string;
    toAtcoCode: string;
    fromCommonName: string;
    toCommonName: string;
    journeyPatternId: string;
    order: string;
    direction: string;
    fromSequenceNumber: string;
    toSequenceNumber: string;
    inboundDirectionDescription: string;
    outboundDirectionDescription: string;
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
            connectionLimit: 5,
            queueLimit: 0,
        });
    } else {
        client = createPool({
            host: process.env.RDS_HOST,
            user: awsParamStore.getParameterSync('fdbt-rds-site-username', { region: 'eu-west-2' }).Value,
            password: awsParamStore.getParameterSync('fdbt-rds-site-password', { region: 'eu-west-2' }).Value,
            database: 'fdbt',
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0,
        });
    }

    return client;
};

export const replaceInternalNocCode = (nocCode: string): string => {
    if (nocCode === INTERNAL_NOC) {
        return 'BLAC';
    }
    return nocCode;
};

let connectionPool: Pool;

const executeQuery = async <T>(query: string, values: (string | boolean | number | Date)[]): Promise<T> => {
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
            SELECT id, lineName, lineId, startDate, serviceDescription AS description, origin, destination, serviceCode
            FROM txcOperatorLine
            WHERE nocCode = ? AND dataSource = ? AND (endDate IS NULL OR CURDATE() <= endDate)
            ORDER BY CAST(lineName AS UNSIGNED) = 0, CAST(lineName AS UNSIGNED), LEFT(lineName, 1), MID(lineName, 2), startDate;
        `;

        const queryResults = await executeQuery<ServiceType[]>(queryInput, [nocCodeParameter, source]);

        return (
            queryResults.map((item) => ({
                ...item,
                startDate: convertDateFormat(item.startDate),
            })) || []
        );
    } catch (error) {
        throw new Error(`Could not retrieve services from AuroraDB: ${error.stack}`);
    }
};

export const checkBodshasServicesByNoc = async (nationalOperatorCode: string): Promise<boolean> => {
    const nocCodeParameter = replaceInternalNocCode(nationalOperatorCode);

    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving number of services for given national operator code',
        noc: nationalOperatorCode,
    });

    try {
        const queryInput = `
        SELECT count(id) as serviceCount
        FROM txcOperatorLine
        WHERE nocCode = ?  AND dataSource = 'bods'
        ORDER BY CAST(lineName AS UNSIGNED), lineName;
        `;

        const queryResults = await executeQuery<ServiceCount[]>(queryInput, [nocCodeParameter]);
        const hasService = queryResults[0].serviceCount ? queryResults[0].serviceCount : 0;
        if (hasService > 0) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(`Could not retrieve services from AuroraDB: ${error.stack}`);
    }
};

export const getBodsServicesByNoc = async (nationalOperatorCode: string): Promise<MyFaresService[]> => {
    const nocCodeParameter = replaceInternalNocCode(nationalOperatorCode);

    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving services for given national operator code',
        noc: nationalOperatorCode,
    });

    try {
        const queryInput = `
            SELECT id, lineName, lineId, origin, destination, startDate, endDate
            FROM txcOperatorLine
            WHERE nocCode = ? AND dataSource = 'bods'
            ORDER BY CAST(lineName AS UNSIGNED), lineName;
        `;

        const queryResults = await executeQuery<MyFaresService[]>(queryInput, [nocCodeParameter]);
        return (
            queryResults.map((item) => ({
                ...item,
                startDate: convertDateFormat(item.startDate),
                endDate: item.endDate ? convertDateFormat(item.endDate) : undefined,
                lineId: item.lineId,
            })) || []
        );
    } catch (error) {
        throw new Error(`Could not retrieve services from AuroraDB: ${error.stack}`);
    }
};

export const getBodsServiceByNocAndId = async (
    nationalOperatorCode: string,
    serviceId: string,
): Promise<MyFaresService> => {
    const nocCodeParameter = replaceInternalNocCode(nationalOperatorCode);

    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving services for given national operator code and serviceId',
        nationalOperatorCode,
        serviceId,
    });

    try {
        const queryInput = `
            SELECT id, lineName, lineId, origin, destination, startDate, endDate
            FROM txcOperatorLine
            WHERE nocCode = ? AND id = ? AND dataSource = 'bods';
        `;

        const queryResults = await executeQuery<MyFaresService[]>(queryInput, [nocCodeParameter, serviceId]);
        if (queryResults.length !== 1) {
            throw new Error(`Expected one service to be returned, ${queryResults.length} results received.`);
        }
        // Is it better to JSON.parse this and overwrite the start end and end date via spreading the rest?
        return {
            id: queryResults[0].id,
            origin: queryResults[0].origin,
            destination: queryResults[0].destination,
            lineName: queryResults[0].lineName,
            startDate: convertDateFormat(queryResults[0].startDate),
            endDate: queryResults[0].endDate ? convertDateFormat(queryResults[0].endDate) : undefined,
            lineId: queryResults[0].lineId,
        };
    } catch (error) {
        throw new Error(`Could not retrieve individual service from AuroraDB: ${error.stack}`);
    }
};

export const getBodsServiceByNocAndLineId = async (
    nationalOperatorCode: string,
    lineId: string,
): Promise<MyFaresService> => {
    const nocCodeParameter = replaceInternalNocCode(nationalOperatorCode);

    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving services for given national operator code and lineId',
        nationalOperatorCode,
        lineId,
    });

    try {
        const queryInput = `
            SELECT id, lineName, lineId, origin, destination, startDate, endDate
            FROM txcOperatorLine
            WHERE nocCode = ? AND lineId = ? AND dataSource = 'bods';
        `;

        const queryResults = await executeQuery<MyFaresService[]>(queryInput, [nocCodeParameter, lineId]);
        if (queryResults.length !== 1) {
            throw new Error(`Expected one service to be returned, ${queryResults.length} results received.`);
        }

        return {
            id: queryResults[0].id,
            origin: queryResults[0].origin,
            destination: queryResults[0].destination,
            lineName: queryResults[0].lineName,
            startDate: convertDateFormat(queryResults[0].startDate),
            endDate: queryResults[0].endDate ? convertDateFormat(queryResults[0].endDate) : undefined,
            lineId: queryResults[0].lineId,
        };
    } catch (error) {
        throw new Error(`Could not retrieve individual service from AuroraDB: ${error.stack}`);
    }
};

export const getBodsServiceDirectionDescriptionsByNocAndServiceId = async (
    nationalOperatorCode: string,
    serviceId: string,
): Promise<{ inboundDirectionDescription: string; outboundDirectionDescription: string }> => {
    const nocCodeParameter = replaceInternalNocCode(nationalOperatorCode);

    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving services for given national operator code and serviceId',
        nationalOperatorCode,
        serviceId,
    });

    try {
        const queryInput = `
            SELECT inboundDirectionDescription, outboundDirectionDescription
            FROM txcOperatorLine
            WHERE nocCode = ? AND id = ? AND dataSource = 'bods';
        `;

        const queryResults = await executeQuery<
            { inboundDirectionDescription: string; outboundDirectionDescription: string }[]
        >(queryInput, [nocCodeParameter, serviceId]);
        if (queryResults.length !== 1) {
            throw new Error(`Expected one service to be returned, ${queryResults.length} results received.`);
        }
        return {
            inboundDirectionDescription: queryResults[0].inboundDirectionDescription,
            outboundDirectionDescription: queryResults[0].outboundDirectionDescription,
        };
    } catch (error) {
        throw new Error(`Could not retrieve individual service direction descriptions from AuroraDB: ${error.stack}`);
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
            SELECT id, lineName, lineId, startDate, serviceDescription AS description, serviceCode, dataSource
            FROM txcOperatorLine
            WHERE nocCode = ?
            ORDER BY CAST(lineName AS UNSIGNED) = 0, CAST(lineName AS UNSIGNED), LEFT(lineName, 1), MID(lineName, 2), startDate;
        `;

        const queryResults = await executeQuery<ServiceType[]>(queryInput, [nocCodeParameter]);

        return (
            queryResults.map((item) => ({
                ...item,
                startDate: convertDateFormat(item.startDate),
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
            const queryResultsAtcos = queryResults.map((qr) => qr.atcoCode);
            const missingAtcosFromDb = _.difference(atcoCodes, queryResultsAtcos);

            logger.info('', {
                context: 'data.auroradb',
                message: `The missing atco's are: ${missingAtcosFromDb}`,
            });

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

/**
 * For a given national operator code and line id, the function returns a
 * subset of information about each service.
 *
 *
 * @remarks
 * Only brings back services from `bods`.
 *
 *
 * @param noc - The national operator code
 * @param lineId - The line id of the service(s)
 *
 * @returns An array of RawService.
 */
export const getServicesByNocAndLineId = async (noc: string, lineId: string): Promise<RawService[]> => {
    const nationalOperatorCode = replaceInternalNocCode(noc);

    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving services for a given noc and line id',
        noc,
        lineId,
    });

    const query = `
      SELECT ol.id,
             ol.startDate,
             ol.endDate
      FROM txcOperatorLine ol
      WHERE ol.nocCode = ?
      AND ol.lineId = ?
      AND ol.dataSource = 'bods'
    `;

    const result = await executeQuery<RawService[]>(query, [nationalOperatorCode, lineId]);

    return result.map((result) => ({
        ...result,
        startDate: convertDateFormat(result.startDate),
        endDate: result.endDate ? convertDateFormat(result.endDate) : undefined,
    }));
};

export const getServiceByIdAndDataSource = async (
    nocCode: string,
    id: number,
    dataSource: string,
): Promise<RawService> => {
    const nocCodeParameter = replaceInternalNocCode(nocCode);
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving service info for given noc and line name',
        noc: nocCode,
        id,
    });

    const serviceQuery = `
        SELECT os.operatorShortName, os.serviceDescription, os.inboundDirectionDescription, os.outboundDirectionDescription, os.lineName, os.lineId, os.startDate, pl.fromAtcoCode, pl.toAtcoCode, pl.journeyPatternId, pl.orderInSequence, nsStart.commonName AS fromCommonName, nsStop.commonName as toCommonName, ps.direction, pl.fromSequenceNumber, pl.toSequenceNumber
        FROM txcOperatorLine AS os
        JOIN txcJourneyPattern AS ps ON ps.operatorServiceId = os.id
        JOIN txcJourneyPatternLink AS pl ON pl.journeyPatternId = ps.id
        LEFT JOIN naptanStop nsStart ON nsStart.atcoCode=pl.fromAtcoCode
        LEFT JOIN naptanStop nsStop ON nsStop.atcoCode=pl.toAtcoCode
        WHERE os.nocCode = ? AND os.id = ? AND os.dataSource = ?
        ORDER BY pl.journeyPatternId ASC, pl.orderInSequence
    `;

    let queryResult: ServiceQueryData[];

    try {
        queryResult = await executeQuery(serviceQuery, [nocCodeParameter, id, dataSource]);
    } catch (error) {
        throw new Error(`Could not get journey patterns from Aurora DB: ${error.stack}`);
    }

    const service = queryResult[0];

    // allows to get the unique journey's for the operator e.g. [1,2,3]
    const uniqueJourneyPatterns = queryResult
        .map((item) => item.journeyPatternId)
        .filter((value, index, self) => self.indexOf(value) === index);

    const parseSequenceNumber = (sequenceNumber: string | undefined) => {
        const parsedSequenceNumber = Number(sequenceNumber);
        return Number.isInteger(parsedSequenceNumber) ? parsedSequenceNumber : undefined;
    };

    const rawPatternService: RawJourneyPattern[] = uniqueJourneyPatterns.map((journey) => {
        const filteredJourney = queryResult.filter((item) => {
            return item.journeyPatternId === journey;
        });

        return {
            direction: filteredJourney[0].direction,
            orderedStopPoints: [
                {
                    stopPointRef: filteredJourney[0].fromAtcoCode,
                    commonName: filteredJourney[0].fromCommonName,
                    sequenceNumber: parseSequenceNumber(filteredJourney[0].fromSequenceNumber),
                },
                ...filteredJourney.map((data: ServiceQueryData) => ({
                    stopPointRef: data.toAtcoCode,
                    commonName: data.toCommonName,
                    sequenceNumber: parseSequenceNumber(data.toSequenceNumber),
                })),
            ],
        };
    });

    if (!service || rawPatternService.length === 0) {
        throw new Error(`No journey patterns found for nocCode: ${nocCodeParameter}, id: ${id}`);
    }

    return {
        serviceDescription: service.serviceDescription,
        operatorShortName: service.operatorShortName,
        journeyPatterns: rawPatternService,
        lineId: service.lineId,
        lineName: service.lineName,
        startDate: convertDateFormat(service.startDate),
        inboundDirectionDescription: service.inboundDirectionDescription,
        outboundDirectionDescription: service.outboundDirectionDescription,
    };
};

export const getSalesOfferPackagesByNocCode = async (nocCode: string): Promise<FromDb<SalesOfferPackage>[]> => {
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

export const getSalesOfferPackageByIdAndNoc = async (
    id: number,
    nocCode: string,
): Promise<FromDb<SalesOfferPackage>> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving sales offer package for given id and noc',
        nocCode,
        id,
    });

    try {
        const queryInput = `
            SELECT id, name, purchaseLocations, paymentMethods, ticketFormats
            FROM salesOfferPackage
            WHERE nocCode = ? AND id = ?
        `;

        const queryResults = await executeQuery<RawSalesOfferPackage[]>(queryInput, [nocCode, id]);

        if (queryResults.length !== 1) {
            throw new Error(`Expected one sop to be returned, ${queryResults.length} results received.`);
        }

        const item = queryResults[0];

        return {
            id: item.id,
            name: item.name,
            purchaseLocations: item.purchaseLocations.split(','),
            paymentMethods: item.paymentMethods.split(','),
            ticketFormats: item.ticketFormats.split(','),
        };
    } catch (error) {
        throw new Error(`Could not retrieve sales offer packages from AuroraDB: ${error.stack}`);
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
            salesOfferPackage.description || '',
            purchaseLocations,
            paymentMethods,
            ticketFormats,
        ]);
    } catch (error) {
        throw new Error(`Could not insert sales offer package into the salesOfferPackage table. ${error.stack}`);
    }
};

export const updateSalesOfferPackage = async (
    nocCode: string,
    salesOfferPackage: FromDb<SalesOfferPackage>,
): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'updating sales offer package for given noc',
        noc: nocCode,
    });

    const purchaseLocations = salesOfferPackage.purchaseLocations.toString();
    const paymentMethods = salesOfferPackage.paymentMethods.toString();
    const ticketFormats = salesOfferPackage.ticketFormats.toString();

    const updateQuery = `UPDATE salesOfferPackage
    SET name = ?, purchaseLocations = ?, paymentMethods = ?, ticketFormats = ?
    WHERE nocCode = ? AND id = ?`;

    try {
        await executeQuery(updateQuery, [
            salesOfferPackage.name,
            purchaseLocations,
            paymentMethods,
            ticketFormats,
            nocCode,
            salesOfferPackage.id,
        ]);
    } catch (error) {
        throw new Error(`Could not insert sales offer package into the salesOfferPackage table. ${error.stack}`);
    }
};

export const deleteSalesOfferPackageByNocCodeAndName = async (
    sopId: number | string,
    nocCode: string,
): Promise<void> => {
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
    timeRestriction: DbTimeRestriction[],
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
    timeRestriction: DbTimeRestriction[],
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

export const getTimeRestrictionByIdAndNoc = async (id: number, nocCode: string): Promise<PremadeTimeRestriction> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving time restriction for given id and noc',
        nocCode,
        id,
    });

    try {
        const queryInput = `
            SELECT id, name, contents
            FROM timeRestriction
            WHERE nocCode = ? AND id = ?
        `;

        const queryResult = await executeQuery<RawTimeRestriction[]>(queryInput, [nocCode, id]);

        if (queryResult.length !== 1) {
            throw new Error(
                `Could not find time restriction with id: ${id} or more than one time restriction was returned`,
            );
        }

        return { ...queryResult[0], contents: JSON.parse(queryResult[0].contents) };
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

export const getPassengerTypeNameByIdAndNoc = async (id: number, noc: string): Promise<string> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving passenger type name for a given id',
        id,
        noc,
    });

    try {
        const queryInput = `
            SELECT name
            FROM passengerType
            WHERE id = ?
            AND nocCode = ?`;

        const queryResults = await executeQuery<{ name: string }[]>(queryInput, [id, noc]);

        if (queryResults.length !== 1) {
            throw new Error(
                `Could not find a passenger type with id: ${id}, or more than one passenger type was returned`,
            );
        }

        return queryResults[0].name;
    } catch (error) {
        throw new Error(`Could not retrieve passenger type by id from AuroraDB: ${error}`);
    }
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

export const getFareDayEnd = async (nocCode: string): Promise<string | undefined> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving fare day end for given nocCode',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT time
            FROM fareDayEnd
            WHERE nocCode = ?
        `;

        const queryResults = await executeQuery<{ time: string }[]>(queryInput, [nocCode]);
        return queryResults[0]?.time;
    } catch (error) {
        throw new Error(`Could not retrieve fare day end by nocCode from AuroraDB: ${error.stack}`);
    }
};

export const upsertFareDayEnd = async (nocCode: string, fareDayEnd: string): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'upserting fare day end',
        nocCode,
    });

    try {
        const updateQuery = `UPDATE fareDayEnd
                             SET time = ?
                             WHERE nocCode = ?`;
        const meta = await executeQuery<ResultSetHeader>(updateQuery, [fareDayEnd, nocCode]);
        if (meta.affectedRows > 1) {
            throw Error(`Updated too many rows when updating fare day end ${meta}`);
        } else if (meta.affectedRows === 0) {
            const insertQuery = `INSERT INTO fareDayEnd (time, nocCode) VALUES (?, ?)`;

            await executeQuery(insertQuery, [fareDayEnd, nocCode]);
        }
    } catch (error) {
        throw new Error(`Could not insert fare day end into the fareDayEnd table. ${error}`);
    }
};

export const insertProducts = async (
    nocCode: string,
    matchingJsonLink: string,
    dateModified: Date,
    fareType: string,
    lineId: string | undefined,
    startDate: string,
    endDate?: string,
): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'inserting products for given noc and fareType',
        noc: nocCode,
        fareType,
        matchingJsonLink,
    });

    const insertQuery = `INSERT INTO products
    (nocCode, matchingJsonLink, dateModified, fareType, lineId, startDate, endDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    try {
        await executeQuery(insertQuery, [
            nocCode,
            matchingJsonLink,
            dateModified,
            fareType,
            lineId || '',
            startDate,
            endDate || '',
        ]);
    } catch (error) {
        throw new Error(`Could not insert products into the products table. ${error.stack}`);
    }
};

export const deleteProductByNocCodeAndId = async (id: number, nocCode: string): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'deleting product for given id',
        id,
        nocCode,
    });

    const deleteQuery = `
            DELETE FROM products
            WHERE id = ?
            AND nocCode = ?`;

    await executeQuery(deleteQuery, [id, nocCode]);
};

export const updateProductFareTriangleModifiedByNocCodeAndId = async (
    id: number,
    nocCode: string,
    fareTriangleModified: Date,
): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'updating products fare triangle modified date for given id',
        id,
        nocCode,
    });

    const updateQuery = `
            UPDATE products
            SET fareTriangleModified = ?
            WHERE id = ?
            AND nocCode = ?`;
    try {
        await executeQuery(updateQuery, [fareTriangleModified, id, nocCode]);
    } catch (error) {
        throw new Error(`Could not update fareTriangleModified into the products table. ${error.stack}`);
    }
};

export const getOperatorDetailsFromNocTable = async (nocCode: string): Promise<OperatorDetails | undefined> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operator details from nocPublicName table for given nocCode',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT DISTINCT nocTable.operatorPublicName AS operatorName, nocPublicName.fareEnq AS contactNumber, nocPublicName.ttrteEnq AS email, nocPublicName.website AS url, nocPublicName.complEnq AS street
            FROM nocTable
            JOIN nocPublicName ON nocTable.pubNmId = nocPublicName.pubNmId
            WHERE nocTable.nocCode = ?
        `;

        const queryResults = await executeQuery<
            {
                operatorName: string;
                contactNumber: string;
                email: string;
                url: string;
                street: string;
            }[]
        >(queryInput, [nocCode]);

        return queryResults[0]
            ? {
                  ...queryResults[0],
                  town: '',
                  county: '',
                  postcode: '',
              }
            : undefined;
    } catch (error) {
        throw new Error(
            `Could not retrieve operator details from nocPublicName by nocCode from AuroraDB: ${error.stack}`,
        );
    }
};

export const getOperatorDetails = async (nocCode: string): Promise<OperatorDetails | undefined> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'retrieving operator details for given nocCode',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT contents
            FROM operatorDetails
            WHERE nocCode = ?
        `;

        const queryResults = await executeQuery<{ contents: string }[]>(queryInput, [nocCode]);
        return queryResults[0] ? (JSON.parse(queryResults[0].contents) as OperatorDetails) : undefined;
    } catch (error) {
        throw new Error(`Could not retrieve operator details by nocCode from AuroraDB: ${error.stack}`);
    }
};

export const upsertOperatorDetails = async (nocCode: string, operatorDetails: OperatorDetails): Promise<void> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'upserting operator details',
        nocCode,
    });

    try {
        const updateQuery = `UPDATE operatorDetails
                             SET contents = ?
                             WHERE nocCode = ?`;
        const meta = await executeQuery<ResultSetHeader>(updateQuery, [JSON.stringify(operatorDetails), nocCode]);
        if (meta.affectedRows > 1) {
            throw Error(`Updated too many rows when updating fare day end ${meta}`);
        } else if (meta.affectedRows === 0) {
            const insertQuery = `INSERT INTO operatorDetails (contents, nocCode) VALUES (?, ?)`;

            await executeQuery(insertQuery, [JSON.stringify(operatorDetails), nocCode]);
        }
    } catch (error) {
        throw new Error(`Could not insert operator details into the operatorDetails table. ${error}`);
    }
};

export const getPointToPointProducts = async (nocCode: string): Promise<MyFaresProduct[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'getting point to point products for given noc',
        nocCode,
    });

    try {
        const queryInput = `
            SELECT id, lineId, matchingJsonLink, startDate, endDate, servicesRequiringAttention
            FROM products
            WHERE lineId <> ''
            AND nocCode = ?
        `;

        return (await executeQuery<RawMyFaresProduct[]>(queryInput, [nocCode])).map((row) => ({
            ...row,
            servicesRequiringAttention:
                row.servicesRequiringAttention === null || row.servicesRequiringAttention === undefined
                    ? []
                    : row.servicesRequiringAttention.split(','),
        }));
    } catch (error) {
        throw new Error(`Could not retrieve point to point products by nocCode from AuroraDB: ${error.stack}`);
    }
};

export const getPointToPointProductsByLineId = async (nocCode: string, lineId: string): Promise<MyFaresProduct[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'getting point to point products for given noc and lineId',
        nocCode,
        lineId,
    });

    try {
        const queryInput = `
            SELECT id, lineId, matchingJsonLink, startDate, endDate, servicesRequiringAttention
            FROM products
            WHERE lineId = ?
            AND nocCode = ?
        `;

        const queryResults = await executeQuery<RawMyFaresProduct[]>(queryInput, [lineId, nocCode]);

        return queryResults.map((result) => ({
            ...result,
            startDate: convertDateFormat(result.startDate),
            endDate: result.endDate ? convertDateFormat(result.endDate) : undefined,
            servicesRequiringAttention:
                result.servicesRequiringAttention === null || result.servicesRequiringAttention === undefined
                    ? []
                    : result.servicesRequiringAttention.split(','),
        }));
    } catch (error) {
        throw new Error(
            `Could not retrieve point to point products by lineId and nocCode from AuroraDB: ${error.stack}`,
        );
    }
};

export const getOtherProductsByNoc = async (nocCode: string): Promise<MyFaresOtherProduct[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'getting other products for given noc',
        nocCode,
    });

    try {
        const queryInput =
            process.env.STAGE === 'test'
                ? `
            SELECT id, matchingJsonLink, startDate, endDate
            FROM products
            WHERE lineId = ''
            AND nocCode = ?
            LIMIT 100
        `
                : `
            SELECT id, matchingJsonLink, startDate, endDate
            FROM products
            WHERE lineId = ''
            AND nocCode = ?
        `;

        const queryResults = await executeQuery<MyFaresOtherProduct[]>(queryInput, [nocCode]);

        return queryResults.map((result) => ({
            ...result,
            startDate: convertDateFormat(result.startDate),
            endDate: result.endDate ? convertDateFormat(result.endDate) : undefined,
        }));
    } catch (error) {
        throw new Error(`Could not retrieve other products by nocCode from AuroraDB: ${error.stack}`);
    }
};

export const getProductById = async (nocCode: string, productId: string): Promise<MyFaresProduct> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'getting product matching json link for given noc and productId',
        nocCode,
        productId,
    });

    try {
        const queryInput = `
            SELECT id, lineId, matchingJsonLink, startDate, endDate, servicesRequiringAttention, fareTriangleModified
            FROM products
            WHERE id = ?
            AND nocCode = ?
        `;

        const queryResults = await executeQuery<MyFaresProduct[]>(queryInput, [productId, nocCode]);

        if (queryResults.length !== 1) {
            throw new Error(`Expected one product to be returned, ${queryResults.length} results recevied.`);
        }

        return queryResults[0];
    } catch (error) {
        throw new Error(`Could not retrieve product matchingJsonLinks by nocCode from AuroraDB: ${error.stack}`);
    }
};

export const getProductIdByMatchingJsonLink = async (nocCode: string, jsonLink: string): Promise<string> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'getting product id for given noc and date created',
        nocCode,
        jsonLink,
    });

    try {
        const queryInput = `
            SELECT id
            FROM products
            WHERE matchingJsonLink = ?
            AND nocCode = ?
        `;

        const queryResults = await executeQuery<{ id: string }[]>(queryInput, [jsonLink, nocCode]);

        if (queryResults.length !== 1) {
            throw new Error(`Expected one product to be returned, ${queryResults.length} results recevied.`);
        }

        return queryResults[0].id;
    } catch (error) {
        throw new Error(
            `Could not retrieve product id by nocCode and matchingJsonLink created from AuroraDB: ${error.stack}`,
        );
    }
};

/**
 * For a given national operator code, get all the products from the database.
 *
 * @param noc the national operator code
 *
 * @returns An array of DbProduct.
 */
export const getAllProductsByNoc = async (noc: string): Promise<DbProduct[]> => {
    logger.info('', {
        context: 'data.auroradb',
        message: 'getting products for a given noc',
        noc: noc,
    });

    const query = `
            SELECT matchingJsonLink, lineId, startDate, endDate
            FROM products
            WHERE nocCode = ?
        `;

    try {
        const result = await executeQuery<DbProduct[]>(query, [noc]);

        return result.map((result) => ({
            ...result,
            startDate: convertDateFormat(result.startDate),
            endDate: result.endDate ? convertDateFormat(result.endDate) : undefined,
        }));
    } catch (error) {
        throw new Error(`Could not fetch products from the products table. ${error.stack}`);
    }
};
