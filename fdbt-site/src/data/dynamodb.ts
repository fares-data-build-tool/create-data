import AWS from 'aws-sdk';
import dateFormat from 'dateformat';
import flatMap from 'array.prototype.flatmap';
import { NAPTAN_TABLE_NAME, SERVICES_TABLE_NAME, TNDS_TABLE_NAME, NAPTAN_TABLE_GSI } from '../constants';

export interface ServiceType {
    lineName: string;
    startDate: string;
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

export interface RawJourneyPatternSection {
    Id: string;
    OrderedStopPoints: {
        StopPointRef: string;
        CommonName: string;
    }[];
    StartPoint: string;
    EndPoint: string;
}

export interface RawJourneyPattern {
    JourneyPatternSections: RawJourneyPatternSection[];
}

interface DynamoNaptanInfo {
    CommonName: string;
    NaptanCode: string;
    ATCOCode: string;
    NptgLocalityCode: string;
    LocalityName: string;
    Indicator: string;
    Street: string;
}

interface DynamoNaptanIndex {
    naptanCode: string;
    atcoCode: string;
}

interface RawDynamoNaptanIndex {
    NaptanCode: string;
    Partition: string;
}

export interface Stop {
    stopName: string;
    naptanCode: string;
    atcoCode: string;
    localityCode: string;
    localityName: string;
    indicator: string;
    street: string;
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

const getDynamoDBClient = (): AWS.DynamoDB.DocumentClient => {
    const dynamoDbRegion = process.env.AWS_REGION || 'eu-west-2';

    const options = {
        convertEmptyValues: true,
        region: dynamoDbRegion,
    };

    let client = null;

    if (process.env.NODE_ENV === 'development') {
        client = new AWS.DynamoDB.DocumentClient({
            ...options,
            endpoint: 'http://localhost:9100',
        });
    } else {
        client = new AWS.DynamoDB.DocumentClient(options);
    }

    return client;
};

const dynamoDbClient = getDynamoDBClient();

export const convertDateFormat = (startDate: string): string => {
    return dateFormat(startDate, 'dd/mm/yyyy');
};

export const getServicesByNocCode = async (nocCode: string): Promise<ServiceType[]> => {
    const tableName = process.env.NODE_ENV === 'development' ? 'dev-Services' : SERVICES_TABLE_NAME;

    const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#pk = :value',
        ExpressionAttributeNames: {
            '#pk': 'Partition',
        },
        ExpressionAttributeValues: {
            ':value': nocCode,
        },
    };

    try {
        const { Items } = await dynamoDbClient.query(queryInput).promise();
        return (
            Items?.map(
                (item): ServiceType => ({ lineName: item.LineName, startDate: convertDateFormat(item.StartDate) }),
            ) || []
        );
    } catch (err) {
        throw new Error(`Could not retrieve services from DynamoDB: ${err.name}, ${err.message}`);
    }
};

export const batchGetStopsByAtcoCode = async (atcoCodes: string[]): Promise<Stop[] | []> => {
    const tableName = process.env.NODE_ENV === 'development' ? 'dev-Stops' : NAPTAN_TABLE_NAME;
    const count = atcoCodes.length;
    const batchSize = 100;
    const batchArray = [];

    for (let i = 0; i < count; i += batchSize) {
        batchArray.push(atcoCodes.slice(i, i + batchSize));
    }

    const batchPromises = batchArray.map(batch => {
        const batchQueryInput: AWS.DynamoDB.DocumentClient.BatchGetItemInput = {
            RequestItems: {
                [tableName]: {
                    ExpressionAttributeNames: {
                        '#in': 'Indicator',
                    },
                    Keys: batch.map(code => ({
                        Partition: code,
                    })),
                    ProjectionExpression: 'LocalityName,#in,Street,CommonName, NaptanCode, ATCOCode, NptgLocalityCode',
                },
            },
        };

        return dynamoDbClient.batchGet(batchQueryInput).promise();
    });

    try {
        const results = await Promise.all(batchPromises);
        const filteredResults = results.filter(item => item.Responses?.[tableName]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const naptanItems: DynamoNaptanInfo[] = flatMap(filteredResults, (item: any) => item.Responses[tableName]);

        return naptanItems.map(item => ({
            stopName: item.CommonName,
            naptanCode: item.NaptanCode,
            atcoCode: item.ATCOCode,
            localityCode: item.NptgLocalityCode,
            localityName: item.LocalityName,
            indicator: item.Indicator,
            street: item.Street,
        }));
    } catch (error) {
        console.error(`Error performing batch get for naptan info for stop list: ${atcoCodes}, error: ${error}`);
        throw new Error(error);
    }
};

export const getAtcoCodesByNaptanCodes = async (naptanCodes: string[]): Promise<DynamoNaptanIndex[]> => {
    const tableName = process.env.NODE_ENV === 'development' ? 'dev-Stops' : NAPTAN_TABLE_NAME;
    const indexName = process.env.NODE_ENV === 'development' ? 'NaptanIndex' : NAPTAN_TABLE_GSI;

    const queryPromises = naptanCodes.map(async naptanCode => {
        const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: tableName,
            IndexName: indexName,
            KeyConditionExpression: 'NaptanCode = :v_code',
            ExpressionAttributeValues: {
                ':v_code': naptanCode,
            },
        };
        return dynamoDbClient.query(queryInput).promise();
    });
    try {
        const results = await Promise.all(queryPromises);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const atcoItems: RawDynamoNaptanIndex[] = flatMap(results, (item: any) => item.Items);
        return atcoItems.map(item => ({ atcoCode: item.Partition, naptanCode: item.NaptanCode }));
    } catch (error) {
        console.error(
            `Error performing queries for ATCO Codes using Naptan Codes: ${naptanCodes}. Error: ${error.stack}`,
        );
        throw new Error(error);
    }
};

export const getServiceByNocCodeAndLineName = async (nocCode: string, lineName: string): Promise<RawService> => {
    const tableName = process.env.NODE_ENV === 'development' ? 'dev-TNDS' : TNDS_TABLE_NAME;

    const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#pkAttNm = :pkAttVal and begins_with (#skAttNm, :skAttVal)',
        ExpressionAttributeNames: {
            '#pkAttNm': 'Partition',
            '#skAttNm': 'Sort',
        },
        ExpressionAttributeValues: {
            ':pkAttVal': nocCode,
            ':skAttVal': lineName,
        },
    };
    let Items;

    try {
        ({ Items } = await getDynamoDBClient()
            .query(queryInput)
            .promise());
    } catch (err) {
        throw new Error(`Could not get journey patterns from Dynamo DB: ${err.name}, ${err.message}`);
    }

    const service = Items?.[0];

    if (!service || !service.JourneyPatterns || service.JourneyPatterns.length === 0) {
        throw new Error(`No journey patterns found for nocCode: ${nocCode}, lineName: ${lineName}`);
    }

    return {
        serviceDescription: service.ServiceDescription,
        operatorShortName: service.OperatorShortName,
        journeyPatterns: service.JourneyPatterns,
    };
};
