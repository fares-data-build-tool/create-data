import AWS from 'aws-sdk';
import dateFormat from 'dateformat';

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

export type ServiceType = {
    lineName: string;
    startDate: string;
};

export type StopType = {
    CommonName: string;
    Indicator: string;
    LocalityName: string;
    Partition: string;
};

export type Service = {
    description: string;
    journeyPatterns: [
        {
            JourneyPatternRef: string;
            OrderedStopPoints: [
                {
                    StopPointRef: string;
                    CommonName: string;
                },
            ];
            StartPoint: string;
            EndPoint: string;
        },
    ];
};

export type BusStopType = {
    StopName: string;
    NaptanCode: string;
};

export const convertDateFormat = (startDate: string): string => {
    return dateFormat(startDate, 'dd/mm/yyyy');
};

export const getServicesByNocCode = async (nocCode: string): Promise<ServiceType[]> => {
    const tableName =
        process.env.NODE_ENV === 'development' ? 'dev-Services' : (process.env.SERVICES_TABLE_NAME as string);

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

    const { Items } = await dynamoDbClient.query(queryInput).promise();

    return (
        Items?.map(
            (item): ServiceType => ({ lineName: item.LineName, startDate: convertDateFormat(item.StartDate) }),
        ) || []
    );
};

// export const getBusStopNamesAndNaptanCodes = async (atcoCodes: string[]) => {
//     const tableName = process.env.NODE_ENV === 'development' ? 'dev-Stops' : (process.env.STOPS_TABLE_NAME as string);

//     const emptyBatch: string[][] = [];
//     const batchSize = 100;
//     const atcoCodeBatches = atcoCodes.reduce((result, _value, index, array) => {
//         if (index % batchSize === 0) {
//             result.push(array.slice(index, index + batchSize));
//         }
//         return result;
//     }, emptyBatch);

//     const batchPromises = atcoCodeBatches.map(item => {
//         const queryInput: AWS.DynamoDB.DocumentClient.BatchGetItemInput = {
//             RequestItems: {
//                 [tableName]: {
//                     Keys: item.map((item: string): {} => (
//                         {
//                             Partition: item
//                         }
//                     )),
//                     AttributesToGet: [
//                         'CommonName',
//                         'Indicator',
//                         'LocalityName',
//                         'Partition'
//                     ],
//                 },
//             }
//         };

//         return dynamoDbClient.batchGet(queryInput).promise();
//     });

//     let stopResults: AWS.DynamoDB.DocumentClient.BatchGetItemOutput[];

//     try {
//         stopResults = await Promise.all(batchPromises);
//     } catch (err) {
//         console.error(`Unable to retrieve stops from dynamo: ${err.message}`);
//         throw new Error(err.message);
//     }

//     const stops:StopType[] = stopResults.map(item => item.Responses ? item.Responses[tableName] : {
//         CommonName: "",
//         Indicator: "",
//         LocalityName: "",
//         Partition: ""
//     });

//     atcoCodes.map(item => {
//         return stops.find(stop => stop.Partition === item)
//     })

// }

export const getTndsByJourneyId = async (nocCode: string, lineNameStartDate: string) => {
    const tableName = process.env.NODE_ENV === 'development' ? 'dev-TNDS' : (process.env.TNDS_TABLE_NAME as string);

    const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#pk = :value and begins_with(#sk,:sortValue)',
        ExpressionAttributeNames: {
            '#pk': 'Partition',
            '#sk': 'Sort',
        },
        ExpressionAttributeValues: {
            ':value': nocCode,
            ':sortValue': `${lineNameStartDate}#journey`,
        },
    };

    const { Items } = await getDynamoDBClient()
        .query(queryInput)
        .promise();

    return Items;
};

export const getJourneysByNocCodeAndLineName = async (nocCode: string, lineName: string): Promise<Service[]> => {
    const tableName = process.env.NODE_ENV === 'development' ? 'dev-TNDS' : (process.env.TNDS_TABLE_NAME as string);

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

    const { Items } = await getDynamoDBClient()
        .query(queryInput)
        .promise();

    return (
        Items?.map((item): Service => ({ description: item.Description, journeyPatterns: item.JourneyPatterns })) || []
    );
};
