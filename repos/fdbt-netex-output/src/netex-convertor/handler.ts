import { S3Event } from 'aws-lambda';
import generateNetex from './netexGenerator';
import * as dynamodb from './data/dynamodb';
import * as s3 from './data/s3';

export interface OperatorData {
    website: string;
    ttrteEnq: string;
    publicName: string;
    opId: string;
    vosaPSVLicenseName: string;
    fareEnq: string;
    complEnq: string;
    mode: string;
}

export interface ServiceData {
    serviceDescription: string;
}

export interface Stop {
    stopName: string;
    naptanCode: string;
    atcoCode: string;
    localityCode: string;
    localityName: string;
    qualifierName: string;
}

export interface FareZonePrices {
    price: string;
    fareZones: string[];
}

export interface FareZone {
    name: string;
    stops: Stop[];
    prices: FareZonePrices[];
}

export interface MatchingData {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    fareZones: FareZone[];
}

const getOperatorsTableData = async (nocCode: string): Promise<OperatorData> => {
    try {
        const operatorTableData = await dynamodb.getOperatorsItem(nocCode);

        const website = dynamodb.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'Website');
        const ttrteEnq = dynamodb.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'TTRteEnq');
        const publicName = dynamodb.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'OperatorPublicName');
        const opId = dynamodb.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'OpId');
        const vosaPSVLicenseName = dynamodb.getAttributeValueFromDynamoDBItemAsAString(
            operatorTableData,
            'VOSA_PSVLicenseName',
        );
        const fareEnq = dynamodb.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'FareEnq');
        const complEnq = dynamodb.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'ComplEnq');
        const mode = dynamodb.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'Mode');

        return {
            website,
            ttrteEnq,
            publicName,
            opId,
            vosaPSVLicenseName,
            fareEnq,
            complEnq,
            mode,
        };
    } catch (error) {
        throw new Error(`Error retrieving operator info from dynamo: ${error.message}`);
    }
};

const getServicesTableData = async (nocCode: string, lineName: string): Promise<ServiceData> => {
    try {
        const servicesItem = await dynamodb.getServicesItem(nocCode, lineName);
        const serviceDescription = dynamodb.getAttributeValueFromDynamoDBItemAsAString(servicesItem, 'Description');

        return {
            serviceDescription,
        };
    } catch (error) {
        throw new Error(`Error retrieving service info from dynamo: ${error.message}`);
    }
};

const netexConvertorHandler = async (event: S3Event): Promise<void> => {
    try {
        const matchingData: MatchingData = await s3.fetchMatchingDataFromS3(event);

        const operatorData = await getOperatorsTableData(matchingData.nocCode);
        const servicesData = await getServicesTableData(matchingData.nocCode, matchingData.lineName);

        const generatedNetex = await generateNetex(matchingData, operatorData, servicesData);

        const fileName = `${matchingData.operatorShortName}_${matchingData.lineName}_${new Date().toISOString()}.xml`;

        await s3.uploadNetexToS3(generatedNetex, fileName);
    } catch (error) {
        console.error(error.message);
    }
};

export default netexConvertorHandler;
