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

export const convertDateFormat = (startDate: string) => {
    return dateFormat(startDate, 'dd/mm/yyyy');
}

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

    return Items?.map((item): ServiceType => ({ lineName: item.LineName, startDate: convertDateFormat(item.StartDate) })) || [];
};
