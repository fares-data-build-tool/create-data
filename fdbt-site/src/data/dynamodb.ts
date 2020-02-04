import AWS from 'aws-sdk';

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
};

export const getServicesByNocCode = async (nocCode: string): Promise<ServiceType[]> => {
    const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.SERVICES_TABLE_NAME as string,
        KeyConditionExpression: 'NationalOperatorCode = :value',
        ExpressionAttributeValues: {
            ':value': nocCode,
        },
    };

    console.log(nocCode);

    const { Items } = await getDynamoDBClient()
        .query(queryInput)
        .promise();

    if (!Items?.length) {
        return Promise.reject(new Error('No services found'));
    }

    return Items?.map(item => ({ lineName: item.LineName }));
};
