import AWS from 'aws-sdk';

export const getItemFromDynamoDBTableWithPartitionKey = async (
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
    console.log('params we have set for dynamodb query are as follows:', params);

    return docClient.query(params).promise();
};

export const getItemFromDynamoDBTableWithPartitionKeyAndSortKey = async (
    tableName: string,
    partitionKey: string,
    partitionKeyValue: string,
    sortKey: string,
    sortKeyValue: string,
): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: '#pkAttNm = :pkAttVal and #skAttNm = :skAttVal',
        ExpressionAttributeNames: {
            '#pkAttNm': partitionKey,
            '#skAttNm': sortKey,
        },
        ExpressionAttributeValues: {
            ':pkAttVal': partitionKeyValue,
            ':skAttVal': sortKeyValue,
        },
    };
    console.log('params we have set for dynamodb query are as follows:', params);

    return docClient.query(params).promise();
};

export const getAttributeValueFromDynamoDBItemAsAString = (
    data: AWS.DynamoDB.DocumentClient.QueryOutput,
    attribute: string,
): string => {
    if (!data || !data.Items) {
        throw new Error('No data!');
    }
    const requiredAttAsAString: string = data.Items[0][attribute];
    return requiredAttAsAString;
};

export const getAttributeValueFromDynamoDBItemAsStringArray = (
    data: AWS.DynamoDB.DocumentClient.QueryOutput,
    attribute: string,
): string[] => {
    if (!data || !data.Items) {
        throw new Error('No data!');
    }
    const requiredAttAsAStringArray: [string] = data.Items[0][attribute];
    return requiredAttAsAStringArray;
};

export const getAttributeValueFromDynamoDBItemAsObjectArray = (
    data: AWS.DynamoDB.DocumentClient.QueryOutput,
    attribute: string,
): {}[] => {
    if (!data || !data.Items) {
        throw new Error('No data!');
    }
    const requiredAttAsAnObjectArray: [object] = data.Items[0][attribute];
    return requiredAttAsAnObjectArray;
};

export const getOperatorsItem = (nocCode: string): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> => {
    const operatorsItemData = getItemFromDynamoDBTableWithPartitionKey('Operators', 'Partition', nocCode);
    return operatorsItemData;
};

export const getOperatorsWebsiteValue = (operatorsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const website = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, 'Website');
    return website;
};

export const getOperatorsTtrteEnqValue = (operatorsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const ttrteEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, 'TTRteEnq');
    return ttrteEnq;
};

export const getOperatorsOperatorPublicNameValue = (operatorsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const operatorPublicName = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, 'OperatorPublicName');
    return operatorPublicName;
};

export const getOperatorsOpIdValue = (operatorsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const opId = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, 'OpId');
    return opId;
};

export const getOperatorsVosaPSVLicenseNameValue = (operatorsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const vosaPSVLicenseName = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, 'VOSA_PSVLicenseName');
    return vosaPSVLicenseName;
};

export const getOperatorsFareEnqValue = (operatorsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const fareEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, 'FareEnq');
    return fareEnq;
};

export const getOperatorsComplEnqValue = (operatorsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const complEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, 'ComplEnq');
    return complEnq;
};

export const getOperatorsModeValue = (operatorsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const mode = getAttributeValueFromDynamoDBItemAsAString(operatorsItemData, 'Mode');
    return mode;
};

export const getStopsItem = (atcoCode: string) => {
    const stopsItemData = getItemFromDynamoDBTableWithPartitionKey('Stops', 'Partition', atcoCode);
    return stopsItemData;
};

export const getStopsNtpgLocalityCodeValue = (stopsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const ntpgLocalityCode = getAttributeValueFromDynamoDBItemAsAString(stopsItemData, 'NtgpLocalityCode');
    return ntpgLocalityCode;
};

export const getStopsLocalityNameValue = (stopsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const localityName = getAttributeValueFromDynamoDBItemAsAString(stopsItemData, 'LocalityName');
    return localityName;
};

export const getServicesItem = async (nocCode: string, line_ServiceName: string) => {
    const servicesItemData = await getItemFromDynamoDBTableWithPartitionKeyAndSortKey('Services',
    'Partition',
    nocCode,
    'Sort',
    line_ServiceName);
    return servicesItemData;
};

export const getServicesDescriptionValue = (servicesItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
const description = getAttributeValueFromDynamoDBItemAsAString(servicesItemData, 'Description');
return description;
};

export const getServicesCommonNameValue = (servicesItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
const commonName = getAttributeValueFromDynamoDBItemAsAString(servicesItemData, 'CommonName');
return commonName;
};

export const getTNDSItem = async (nocCode: string, line_ServiceName: string) => {
    const tndsItemData = await getItemFromDynamoDBTableWithPartitionKeyAndSortKey('TNDS',
    'Partition',
    nocCode,
    'Sort',
    line_ServiceName);
    return tndsItemData;
};

export const getOperatorShortNameValue = (tndsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const operatorShortNameArray = getAttributeValueFromDynamoDBItemAsStringArray(tndsItemData, 'OperatorShortName');
    const operatorShortName = operatorShortNameArray[0];
    return operatorShortName;
    };

export const getStopPointsArray = (tndsItemData: AWS.DynamoDB.DocumentClient.QueryOutput) => {
    const stopPointsArray = getAttributeValueFromDynamoDBItemAsObjectArray(tndsItemData, 'StopPoints');
    return stopPointsArray;
};
