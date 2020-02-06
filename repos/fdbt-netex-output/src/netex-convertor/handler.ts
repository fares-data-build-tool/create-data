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

export const netexConvertorHandler = async (event: S3Event) => {
    try {
        const nocCode = 'CARD';
        const dummynocCode = 'DEWS';
        const dummyLineFile = 'reference-data-service-g-serverlessdeploymentbuck-hizve7nwjfl8'
        const lineServiceName = '619#8528';
        const atcoCode = '0100053331';
        const operatorsWebsite = dynamodbservices.getOperatorsWebsiteValue(nocCode);
        console.log(operatorsWebsite);
        const operatorsTtrteEnq = dynamodbservices.getOperatorsTtrteEnqValue(nocCode);
        console.log(operatorsTtrteEnq);
        const operatorsOperatorPublicName = dynamodbservices.getOperatorsOperatorPublicNameValue(nocCode);
        console.log(operatorsOperatorPublicName);
        const operatorsOpId = dynamodbservices.getOperatorsOpIdValue(nocCode);
        console.log(operatorsOpId);
        const operatorsVosaPSVLicenseName = dynamodbservices.getOperatorsVosaPSVLicenseNameValue(nocCode);
        console.log(operatorsVosaPSVLicenseName);
        const operatorsFareEnq = dynamodbservices.getOperatorsFareEnqValue(nocCode);
        console.log(operatorsFareEnq);
        const operatorsComplEnq = dynamodbservices.getOperatorsComplEnqValue(nocCode);
        console.log(operatorsComplEnq);
        const operatorsMode = dynamodbservices.getOperatorsModeValue(nocCode);
        console.log(operatorsMode);
        const stopsNptgLocalityCode = dynamodbservices.getStopsLocalityNameValue(atcoCode);
        console.log(stopsNptgLocalityCode);
        const stopsLocalityName = dynamodbservices.getStopsLocalityNameValue(atcoCode);
        console.log(stopsLocalityName);
        const servicesDescription = dynamodbservices.getServicesDescriptionValue(nocCode, lineServiceName);
        console.log(servicesDescription);
        const servicesCommonName = dynamodbservices.getServicesCommonNameValue(nocCode, lineServiceName);
        console.log(servicesCommonName);
        const tndsOperatorShortName = dynamodbservices.getOperatorShortNameValue(dummynocCode, dummyLineFile);
        console.log(tndsOperatorShortName);
        const tndsStopsPointsArray = dynamodbservices.getStopPointsArray(dummynocCode, dummyLineFile);
        console.log(tndsStopsPointsArray);
    } catch (error) {
        throw new Error(error.message);
    }
    const params = setS3ObjectParams(event);
    console.log('S3ObjectParameters obtained from S3 Event are: ', params);
    const jsonData = await fetchDataFromS3AsJSON(params);
    console.log('JSON data received from S3 Object received as: ', jsonData);
    return jsonData;
};
