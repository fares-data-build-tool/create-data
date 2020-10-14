import { S3Event } from 'aws-lambda';
import libxslt from 'libxslt';
import pointToPointTicketNetexGenerator from './point-to-point-tickets/pointToPointTicketNetexGenerator';
import periodTicketNetexGenerator from './period-tickets/periodTicketNetexGenerator';
import * as db from './data/auroradb';
import * as s3 from './data/s3';
import { PointToPointTicket, PeriodTicket, Operator } from '../types';

const xsl = `
    <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        <xsl:output omit-xml-declaration="yes" indent="yes"/>
        <xsl:strip-space elements="*"/>

        <xsl:template match="node()|@*">
            <xsl:copy>
                <xsl:apply-templates select="node()|@*"/>
            </xsl:copy>
        </xsl:template>

        <xsl:template match="@id">
            <xsl:attribute name="id">
                <xsl:value-of select="translate(., ' ', '_')"/>
            </xsl:attribute>
        </xsl:template>

        <xsl:template match="@ref">
            <xsl:attribute name="ref">
                <xsl:value-of select="translate(., ' ', '_')"/>
            </xsl:attribute>
        </xsl:template>

        <xsl:template match="*[not(@*|*|comment()|processing-instruction()) and normalize-space()='']"/>
    </xsl:stylesheet>
`;

const uploadToS3 = async (netex: string, fileName: string): Promise<void> => {
    if (process.env.NODE_ENV !== 'test') {
        const parsedXsl = libxslt.parse(xsl);
        const transformedNetex = parsedXsl.apply(netex);

        await s3.uploadNetexToS3(transformedNetex, fileName);
    } else {
        await s3.uploadNetexToS3(netex, fileName);
    }
};

export const generateFileName = (eventFileName: string): string => eventFileName.replace('.json', '.xml');

export const netexConvertorHandler = async (event: S3Event): Promise<void> => {
    try {
        const s3Data = await s3.fetchDataFromS3(event);
        const s3FileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const { type } = s3Data;

        console.info(`NeTEx generation starting for type ${type}...`);

        if (type === 'single' || type === 'return') {
            const matchingData: PointToPointTicket = s3Data;
            const operatorData = await db.getOperatorDataByNocCode([matchingData.nocCode]);

            const netexGen = pointToPointTicketNetexGenerator(matchingData, operatorData[0]);
            const generatedNetex = await netexGen.generate();

            const fileName = generateFileName(s3FileName);

            await uploadToS3(generatedNetex, fileName);

            if (matchingData.nocCode !== 'IWBusCo') {
                console.info(`NeTEx generation complete for type ${type}`);
            }
        } else if (
            type === 'periodGeoZone' ||
            type === 'periodMultipleServices' ||
            type === 'flatFare' ||
            type === 'multiOperator'
        ) {
            const userPeriodTicket: PeriodTicket = s3Data;
            let operatorData: Operator[] = [];
            if (
                type === 'multiOperator' &&
                userPeriodTicket.additionalNocs &&
                userPeriodTicket.additionalNocs.length > 0
            ) {
                const nocs: string[] = [...userPeriodTicket.additionalNocs];
                nocs.push(userPeriodTicket.nocCode);
                operatorData = await db.getOperatorDataByNocCode(nocs);
            } else {
                operatorData = await db.getOperatorDataByNocCode([userPeriodTicket.nocCode]);
            }
            const netexGen = periodTicketNetexGenerator(userPeriodTicket, operatorData);
            const generatedNetex = await netexGen.generate();

            const fileName = generateFileName(s3FileName);

            await uploadToS3(generatedNetex, fileName);

            if (userPeriodTicket.nocCode !== 'IWBusCo') {
                console.info(`NeTEx generation complete for type ${type}`);
            }
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
