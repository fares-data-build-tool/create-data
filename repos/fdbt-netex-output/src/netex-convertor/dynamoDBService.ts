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
    console.log('params we have set for dynamodb query are as follows:', params);

    return docClient.query(params).promise();
};

export const getAttributeValueFromDynamoDBItemAsAString = (
    data: AWS.DynamoDB.DocumentClient.QueryOutput,
    attribute: string,
): string => {
    if (!data?.Items) {
        throw new Error('No data!');
    }
    const requiredAttAsAString: string = data.Items[0][attribute];
    return requiredAttAsAString;
};

export const getAttributeValueFromDynamoDBItemAsStringArray = (
    data: AWS.DynamoDB.DocumentClient.QueryOutput,
    attribute: string,
): string[] => {
    if (!data?.Items) {
        throw new Error('No data!');
    }
    const requiredAttAsAStringArray: [string] = data.Items[0][attribute];
    return requiredAttAsAStringArray;
};

export const getAttributeValueFromDynamoDBItemAsObjectArray = (
    data: AWS.DynamoDB.DocumentClient.QueryOutput,
    attribute: string,
): {}[] => {
    if (!data?.Items) {
        throw new Error('No data!');
    }
    const requiredAttAsAnObjectArray: [object] = data.Items[0][attribute];
    return requiredAttAsAnObjectArray;
};

export const getOperatorsItem = async (nocCode: string) => {
    const operatorsItemData = await getItemFromDynamoDBTableWithPartitionKey('giles-Operators', 'Partition', nocCode);
    return operatorsItemData;
};

export const getOperatorsWebsiteValue = async (nocCode: string) => {
    const operatorsItem = await getOperatorsItem(nocCode);
    const website = getAttributeValueFromDynamoDBItemAsAString(operatorsItem, 'Website');
    return website;
};

export const getOperatorsTtrteEnqValue = async (nocCode: string) => {
    const operatorsItem = await getOperatorsItem(nocCode);
    const ttrteEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItem, 'TTRteEnq');
    return ttrteEnq;
};

export const getOperatorsOperatorPublicNameValue = async (nocCode: string) => {
    const operatorsItem = await getOperatorsItem(nocCode);
    const operatorPublicName = getAttributeValueFromDynamoDBItemAsAString(operatorsItem, 'OperatorPublicName');
    return operatorPublicName;
};

export const getOperatorsOpIdValue = async (nocCode: string) => {
    const operatorsItem = await getOperatorsItem(nocCode);
    const opId = getAttributeValueFromDynamoDBItemAsAString(operatorsItem, 'OpId');
    return opId;
};

export const getOperatorsVosaPSVLicenseNameValue = async (nocCode: string) => {
    const operatorsItem = await getOperatorsItem(nocCode);
    const vosaPSVLicenseName = getAttributeValueFromDynamoDBItemAsAString(operatorsItem, 'VOSA_PSVLicenseName');
    return vosaPSVLicenseName;
};

export const getOperatorsFareEnqValue = async (nocCode: string) => {
    const operatorsItem = await getOperatorsItem(nocCode);
    const fareEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItem, 'FareEnq');
    return fareEnq;
};

export const getOperatorsComplEnqValue = async (nocCode: string) => {
    const operatorsItem = await getOperatorsItem(nocCode);
    const complEnq = getAttributeValueFromDynamoDBItemAsAString(operatorsItem, 'ComplEnq');
    return complEnq;
};

export const getOperatorsModeValue = async (nocCode: string) => {
    const operatorsItem = await getOperatorsItem(nocCode);
    const mode = getAttributeValueFromDynamoDBItemAsAString(operatorsItem, 'Mode');
    return mode;
};

export const getStopsItem = async (atcoCode: string) => {
    const stopsItemData = await getItemFromDynamoDBTableWithPartitionKey('giles-Stops', 'Partition', atcoCode);
    return stopsItemData;
};

export const getStopsNptgLocalityCodeValue = async (atcoCode: string) => {
    const stopsItem = await getStopsItem(atcoCode);
    const nptgLocalityCode = getAttributeValueFromDynamoDBItemAsAString(stopsItem, 'NptgLocalityCode');
    return nptgLocalityCode;
};

export const getStopsLocalityNameValue = async (atcoCode: string) => {
    const stopsItem = await getStopsItem(atcoCode);
    const localityName = getAttributeValueFromDynamoDBItemAsAString(stopsItem, 'LocalityName');
    return localityName;
};

export const getServicesItem = async (nocCode: string, lineNameRowId: string) => {
    const servicesItemData = await getItemFromDynamoDBTableWithPartitionKeyAndSortKey(
        'giles-Services',
        'Partition',
        nocCode,
        'Sort',
        lineNameRowId,
    );
    return servicesItemData;
};

export const getServicesDescriptionValue = async (nocCode: string, lineNameRowId: string) => {
    const servicesItem = await getServicesItem(nocCode, lineNameRowId);
    const description = getAttributeValueFromDynamoDBItemAsAString(servicesItem, 'Description');
    return description;
};

export const getStopsCommonNameValue = async (atcoCode: string) => {
    const stopsItem = await getStopsItem(atcoCode);
    const commonName = getAttributeValueFromDynamoDBItemAsAString(stopsItem, 'CommonName');
    return commonName;
};

export const getTNDSItem = async (nocCode: string, lineNameFileName: string) => {
    const tndsItemData = await getItemFromDynamoDBTableWithPartitionKeyAndSortKey(
        'giles-TNDS',
        'Partition',
        nocCode,
        'Sort',
        lineNameFileName,
    );
    return tndsItemData;
};

export const getOperatorShortNameValue = async (nocCode: string, lineNameFileName: string) => {
    const tndsItem = await getTNDSItem(nocCode, lineNameFileName);
    const operatorShortName = getAttributeValueFromDynamoDBItemAsAString(tndsItem, 'OperatorShortName');
    return operatorShortName;
};

export const getStopPointsArray = async (nocCode: string, lineNameFileName: string) => {
    const tndsItem = await getTNDSItem(nocCode, lineNameFileName);
    const stopPointsArray = getAttributeValueFromDynamoDBItemAsObjectArray(tndsItem, 'StopPoints');
    return stopPointsArray;
};
