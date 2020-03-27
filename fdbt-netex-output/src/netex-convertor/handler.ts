import { S3Event } from 'aws-lambda';
import singleTicketNetexGenerator from './single-ticket/singleTicketNetexGenerator';
import periodTicketNetexGenerator from './period-ticket/periodTicketNetexGenerator';
import * as dynamodb from './data/dynamodb';
import * as s3 from './data/s3';
import { OperatorData, ServiceData, MatchingData, GeographicalFareZonePass } from './types';

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

export const netexConvertorHandler = async (event: S3Event): Promise<void> => {
    try {
        const s3Data = await s3.fetchDataFromS3(event);
        if (s3Data.type === 'pointToPoint') {
            const matchingData: MatchingData = s3Data;
            const operatorData = await getOperatorsTableData(matchingData.nocCode);
            const servicesData = await getServicesTableData(matchingData.nocCode, matchingData.lineName);
            const netexGen = singleTicketNetexGenerator(matchingData, operatorData, servicesData);
            const generatedNetex = await netexGen.generate();
            const fileName = `${matchingData.operatorShortName}_${
                matchingData.lineName
            }_${new Date().toISOString()}.xml`;
            const fileNameWithoutSlashes = fileName.replace('/', '_');
            await s3.uploadNetexToS3(generatedNetex, fileNameWithoutSlashes);
        } else if (s3Data.type === 'period') {
            const geoFareZonePass: GeographicalFareZonePass = s3Data;
            const operatorData = await getOperatorsTableData(geoFareZonePass.nocCode);
            const netexGen = periodTicketNetexGenerator(geoFareZonePass, operatorData);
            const generatedNetex = await netexGen.generate();
            const fileName = `${geoFareZonePass.operatorName}_${geoFareZonePass.zoneName}_${
                geoFareZonePass.productName
            }_${new Date().toISOString()}.xml`;
            const fileNameWithoutSlashes = fileName.replace('/', '_');
            await s3.uploadNetexToS3(generatedNetex, fileNameWithoutSlashes);
        } else {
            throw new Error(
                `The JSON object '${decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))}' in the '${
                    event.Records[0].s3.bucket.name
                }' bucket does not contain a 'type' attribute to distinguish product type.`,
            );
        }
    } catch (error) {
        console.error(error.stack);
        throw new Error(error);
    }
};

export default netexConvertorHandler;
