import { S3Event } from 'aws-lambda';
import periodTicketNetexGenerator from './periodTicketNetexGenerator';
import * as dynamodb from '../data/dynamodb';
import * as s3 from '../data/s3';
import { OperatorData, GeoZonePeriodData } from '../types';

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

export const periodTicketNetexConvertorHandler = async (event: S3Event): Promise<void> => {
    try {
        const geoZonePeriodData: GeoZonePeriodData = await s3.fetchDataFromS3(event);

        const operatorData = await getOperatorsTableData(geoZonePeriodData.nocCode);

        const netexGen = periodTicketNetexGenerator(geoZonePeriodData, operatorData);
        const generatedNetex = await netexGen.generate();

        const fileName = `.xml`;
        const fileNameWithoutSlashes = fileName.replace('/', '_');

        await s3.uploadNetexToS3(generatedNetex, fileNameWithoutSlashes);
    } catch (error) {
        console.error(error.message);
    }
};

export default periodTicketNetexConvertorHandler;
