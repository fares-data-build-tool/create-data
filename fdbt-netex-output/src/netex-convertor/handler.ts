import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import * as dynamodbservices from './dynamoDBService';

export type s3ObjectParameters = {
    Bucket: string;
    Key: string;
};

export const setS3ObjectParams = (event: S3Event): s3ObjectParameters => {
    const s3BucketName: string = event.Records[0].s3.bucket.name;
    const s3FileName: string = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params: s3ObjectParameters = {
        Bucket: s3BucketName,
        Key: s3FileName,
    };
    return params;
};

export const fetchDataFromS3AsJSON = async (parameters: s3ObjectParameters): Promise<JSON> => {
    const s3: AWS.S3 = new AWS.S3();
    try {
        const dataAsString: string = (await s3.getObject(parameters).promise()).Body?.toString('utf-8')!;
        const dataAsJson: JSON = JSON.parse(dataAsString);
        return dataAsJson;
    } catch (err) {
        throw new Error('Error in retrieving data.');
    }
};

export const getOperatorsTableData = async (nocCode: string) => {
    const operatorTableData = await dynamodbservices.getOperatorsItem(nocCode);
    const operatorsWebsite = await dynamodbservices.getAttributeValueFromDynamoDBItemAsAString(
        operatorTableData,
        'Website',
    );
    console.log(operatorsWebsite);
    const operatorsTtrteEnq = await dynamodbservices.getAttributeValueFromDynamoDBItemAsAString(
        operatorTableData,
        'TTRteEnq',
    );
    console.log(operatorsTtrteEnq);
    const operatorsOperatorPublicName = await dynamodbservices.getAttributeValueFromDynamoDBItemAsAString(
        operatorTableData,
        'OperatorPublicName',
    );
    console.log(operatorsOperatorPublicName);
    const operatorsOpId = await dynamodbservices.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'OpId');
    console.log(operatorsOpId);
    const operatorsVosaPSVLicenseName = await dynamodbservices.getAttributeValueFromDynamoDBItemAsAString(
        operatorTableData,
        'VOSA_PSVLicenseName',
    );
    console.log(operatorsVosaPSVLicenseName);
    const operatorsFareEnq = await dynamodbservices.getAttributeValueFromDynamoDBItemAsAString(
        operatorTableData,
        'FareEnq',
    );
    console.log(operatorsFareEnq);
    const operatorsComplEnq = await dynamodbservices.getAttributeValueFromDynamoDBItemAsAString(
        operatorTableData,
        'ComplEnq',
    );
    console.log(operatorsComplEnq);
    const operatorsMode = await dynamodbservices.getAttributeValueFromDynamoDBItemAsAString(operatorTableData, 'Mode');
    console.log(operatorsMode);
};

export const getStopsTableData = async (atcoCode: string) => {
    const stopsNptgLocalityCode = await dynamodbservices.getStopsNptgLocalityCodeValue(atcoCode);
    console.log(stopsNptgLocalityCode);
    const stopsLocalityName = await dynamodbservices.getStopsLocalityNameValue(atcoCode);
    console.log(stopsLocalityName);
};

export const getServicesTableData = async (nocCode: string, atcoCode: string, lineNameRowId: string) => {
    const servicesDescription = await dynamodbservices.getServicesDescriptionValue(nocCode, lineNameRowId);
    console.log(servicesDescription);
    const stopsCommonName = await dynamodbservices.getStopsCommonNameValue(atcoCode);
    console.log(stopsCommonName);
};

export const getTndsTableData = async (tempNocCode: string, lineNameFileName: string) => {
    const tndsOperatorShortName = await dynamodbservices.getOperatorShortNameValue(tempNocCode, lineNameFileName);
    console.log(tndsOperatorShortName);
    const tndsStopsPointsArray = await dynamodbservices.getStopPointsArray(tempNocCode, lineNameFileName);
    console.log(tndsStopsPointsArray);
};

export const netexConvertorHandler = async (event: S3Event) => {
    const nocCode = 'CARD';
    const tempNocCode = 'DEWS';
    const lineNameFileName = '1A#ea_20-1A-A-y08-1.xml';
    const lineNameRowId = '619#8528';
    const atcoCode = '0100053331';
    try {
        await getOperatorsTableData(nocCode);
        await getStopsTableData(atcoCode);
        await getServicesTableData(nocCode, atcoCode, lineNameRowId);
        await getTndsTableData(tempNocCode, lineNameFileName);
    } catch (error) {
        throw new Error(error.message);
    }
    const params = setS3ObjectParams(event);
    console.log('S3ObjectParameters obtained from S3 Event are: ', params);
    const jsonData = await fetchDataFromS3AsJSON(params);
    console.log('JSON data received from S3 Object received as: ', jsonData);
    return jsonData;
};
