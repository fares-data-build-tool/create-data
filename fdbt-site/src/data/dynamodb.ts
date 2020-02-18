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

export type ServiceType = {
    lineName: string;
    startDate: string;
};

interface RawJourneyPattern {
    JourneyPatternSections: [
        {
            Id: string;
            OrderedStopPoints: [{ StopPointRef: string; CommonName: string }];
            StartPoint: string;
            EndPoint: string;
        },
    ];
}

interface JourneyPattern {
    startPoint: string;
    endPoint: string;
}

export type ServiceInformation = {
    serviceDescription: string;
    journeyPatterns: JourneyPattern[];
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

    const { Items } = await getDynamoDBClient()
        .query(queryInput)
        .promise();

    return (
        Items?.map(
            (item): ServiceType => ({ lineName: item.LineName, startDate: convertDateFormat(item.StartDate) }),
        ) || []
    );
};

export const getStopPointLocalityByAtcoCode = async (atcoCode: string): Promise<string> => {
    const tableName = process.env.NODE_ENV === 'development' ? 'dev-Stops' : (process.env.NAPTAN_TABLE_NAME as string);

    const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#pk = :value',
        ExpressionAttributeNames: {
            '#pk': 'Partition',
        },
        ExpressionAttributeValues: {
            ':value': atcoCode,
        },
    };

    const { Items } = await getDynamoDBClient()
        .query(queryInput)
        .promise();

    return Items?.[0]?.LocalityName ?? '';
};

export const getJourneyPatternsAndLocalityByNocCodeAndLineName = async (
    nocCode: string,
    lineName: string,
): Promise<ServiceInformation> => {
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
    let Items;

    try {
        ({ Items } = await getDynamoDBClient()
            .query(queryInput)
            .promise());
    } catch (err) {
        throw new Error(`Could not get journey patterns from Dynamo DB: ${err.name}, ${err.message}`);
    }

    const service = Items?.[0];

    const displayedService = {
        serviceDescription: service?.ServiceDescription as string,
        journeyPatterns: (await Promise.all(
            service?.JourneyPatterns.map(
                async (item: RawJourneyPattern): Promise<JourneyPattern> => {
                    const startPoint = item.JourneyPatternSections[0].OrderedStopPoints[0];
                    const startPointLocality = await getStopPointLocalityByAtcoCode(startPoint.StopPointRef);

                    const endPoint = item.JourneyPatternSections.splice(-1, 1)[0].OrderedStopPoints.splice(-1, 1)[0];
                    const endPointLocality = await getStopPointLocalityByAtcoCode(endPoint.StopPointRef);

                    return {
                        startPoint: `${startPoint.CommonName}${startPointLocality ? `,${startPointLocality}` : ''}`,
                        endPoint: `${endPoint.CommonName}${endPointLocality ? `,${endPointLocality}` : ''}`,
                    };
                },
            ),
        )) as JourneyPattern[],
    };

    return displayedService;
};
