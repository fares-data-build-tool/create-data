import AWS from 'aws-sdk';
import { QueryOutput } from 'aws-sdk/clients/dynamodb';

const { NOC_TABLE_NAME, SERVICES_TABLE_NAME } = process.env;

const getItemFromDynamoDBTableWithPartitionKey = async (
    tableName: string,
    partitionKey: string,
    partitionKeyValue: string,
): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#pkattNm = :pkAttVal',
        ExpressionAttributeNames: {
            '#pkattNm': partitionKey,
        },
        ExpressionAttributeValues: {
            ':pkAttVal': partitionKeyValue,
        },
    };

    return docClient.query(params).promise();
};

const getItemFromDynamoDBTableWithPartitionKeyAndSortKey = async (
    tableName: string,
    partitionKey: string,
    partitionKeyValue: string,
    sortKey: string,
    sortKeyValue: string,
): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#pkAttNm = :pkAttVal and begins_with (#skAttNm, :skAttVal)',
        ExpressionAttributeNames: {
            '#pkAttNm': partitionKey,
            '#skAttNm': sortKey,
        },
        ExpressionAttributeValues: {
            ':pkAttVal': partitionKeyValue,
            ':skAttVal': sortKeyValue,
        },
    };

    return docClient.query(params).promise();
};

export const getAttributeValueFromDynamoDBItemAsAString = (
    data: AWS.DynamoDB.DocumentClient.QueryOutput,
    attribute: string,
): string => {
    if (!data?.Items) {
        throw new Error('No data!');
    }

    return data.Items[0][attribute];
};

export const getOperatorsItem = async (nocCode: string): Promise<QueryOutput> =>
    getItemFromDynamoDBTableWithPartitionKey(NOC_TABLE_NAME as string, 'Partition', nocCode);

export const getServicesItem = async (nocCode: string, lineNameRowId: string): Promise<QueryOutput> =>
    getItemFromDynamoDBTableWithPartitionKeyAndSortKey(
        SERVICES_TABLE_NAME as string,
        'Partition',
        nocCode,
        'Sort',
        lineNameRowId,
    );
