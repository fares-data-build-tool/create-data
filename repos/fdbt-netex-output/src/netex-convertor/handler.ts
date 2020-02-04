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
        console.log({ dataAsString });
        const dataAsJson: JSON = JSON.parse(dataAsString);
        return dataAsJson;
    } catch (err) {
        throw new Error('Error in retrieving data.');
    }
};

export const netexConvertorHandler = async (event: S3Event) => {
    try {
        const nocCode = "METR";
        const lineName = "233";
        const atcoCode = "0100BRP90313";
        const fileName = "ea_20-1A-A-y08-12019-12-20T12:29:46.8712Z";

        const operatorsItem = await dynamodbservices.getOperatorsItem(nocCode);
        const operatorsWebsite = dynamodbservices.getOperatorsWebsiteValue(operatorsItem);
        console.log (operatorsWebsite);
        const operatorsTtrteEnq = dynamodbservices.getOperatorsTtrteEnqValue(operatorsItem);
        console.log (operatorsTtrteEnq);
        const operatorsOperatorPublicName = dynamodbservices.getOperatorsOperatorPublicNameValue(operatorsItem);
        console.log (operatorsOperatorPublicName);
        const operatorsOpId = dynamodbservices.getOperatorsOpIdValue(operatorsItem);
        console.log (operatorsOpId);
        const operatorsVosaPSVLicenseName = dynamodbservices.getOperatorsVosaPSVLicenseNameValue(operatorsItem);
        console.log (operatorsVosaPSVLicenseName);
        const operatorsFareEnq = dynamodbservices.getOperatorsFareEnqValue(operatorsItem);
        console.log (operatorsFareEnq);
        const operatorsComplEnq = dynamodbservices.getOperatorsComplEnqValue(operatorsItem);
        console.log (operatorsComplEnq);
        const operatorsMode = dynamodbservices.getOperatorsModeValue(operatorsItem);
        console.log (operatorsMode);

        const stopsItem = await dynamodbservices.getStopsItem(atcoCode);
        const stopsNtpgLocalityCode = dynamodbservices.getStopsLocalityNameValue(stopsItem);
        console.log (stopsNtpgLocalityCode);
        const stopsLocalityName = dynamodbservices.getStopsLocalityNameValue(stopsItem);
        console.log (stopsLocalityName);
    
        const servicesItem = await dynamodbservices.getServicesItem(nocCode, lineName);
        const servicesDescription = dynamodbservices.getServicesDescriptionValue(servicesItem);
        console.log (servicesDescription);
        const servicesCommonName = dynamodbservices.getServicesCommonNameValue(servicesItem);
        console.log (servicesCommonName);


        const tndsItem = await dynamodbservices.getTNDSItem(fileName, lineName);
        const tndsOperatorShortName = dynamodbservices.getOperatorShortNameValue(tndsItem);
        console.log (tndsOperatorShortName);
        const tndsStopsPointsArray = dynamodbservices.getStopsLocalityNameValue(tndsItem);
        console.log (tndsStopsPointsArray);
    } 
    catch (error) {
        throw new Error(error.message);
    }

    const params = setS3ObjectParams(event);
    console.log('S3ObjectParameters obtained from S3 Event are: ', params);
    const jsonData = await fetchDataFromS3AsJSON(params);
    console.log('JSON data received from S3 Object received as: ', jsonData);
    return jsonData;
};
