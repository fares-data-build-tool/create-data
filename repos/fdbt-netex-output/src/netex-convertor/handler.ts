import { S3Event } from 'aws-lambda';
import libxslt from 'libxslt';
import {
    PointToPointTicket,
    PeriodTicket,
    isSchemeOperatorTicket,
    Ticket,
    SchemeOperatorGeoZoneTicket,
    SchemeOperatorFlatFareTicket,
    isPointToPointTicket,
    isSchemeOperatorFlatFareTicket,
    isFlatFareTicket,
    isPeriodGeoZoneTicket,
    isPeriodMultipleServicesTicket,
    isSchemeOperatorGeoZoneTicket,
    isMultiOperatorGeoZoneTicket,
    isMultiOperatorMultipleServicesTicket,
} from '../types/index';
import * as db from '../data/auroradb';
import * as s3 from '../data/s3';
import netexGenerator from './netexGenerator';

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

export const buildNocList = (ticket: Ticket): string[] => {
    const nocs: string[] = [];

    if (
        // has only user noc
        isPointToPointTicket(ticket) ||
        isFlatFareTicket(ticket) ||
        isPeriodGeoZoneTicket(ticket) ||
        isPeriodMultipleServicesTicket(ticket)
    ) {
        nocs.push(ticket.nocCode);
    } else if (
        // has only additional nocs
        isSchemeOperatorGeoZoneTicket(ticket)
    ) {
        ticket.additionalNocs.forEach(additionalNoc => nocs.push(additionalNoc));
    } else if (
        // has only additional operators
        isSchemeOperatorFlatFareTicket(ticket)
    ) {
        ticket.additionalOperators.forEach(additionalOperator => nocs.push(additionalOperator.nocCode));
    } else if (
        // has user noc and additional nocs
        isMultiOperatorGeoZoneTicket(ticket)
    ) {
        ticket.additionalNocs.forEach(additionalNoc => nocs.push(additionalNoc));
        nocs.push(ticket.nocCode);
    } else if (
        // has user noc and additional operators
        isMultiOperatorMultipleServicesTicket(ticket)
    ) {
        ticket.additionalOperators.forEach(additionalOperator => nocs.push(additionalOperator.nocCode));
        nocs.push(ticket.nocCode);
    }

    return nocs;
};

export const netexConvertorHandler = async (event: S3Event): Promise<void> => {
    try {
        const ticket = await s3.fetchDataFromS3<
            PointToPointTicket | PeriodTicket | SchemeOperatorGeoZoneTicket | SchemeOperatorFlatFareTicket
        >(event);
        const s3FileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const { type } = ticket;

        console.info(`NeTEx generation starting for type ${type}...`);

        const nocs: string[] = buildNocList(ticket);
        const operatorData = await db.getOperatorDataByNocCode(nocs);
        const netexGen = netexGenerator(ticket, operatorData);
        const generatedNetex = await netexGen.generate();
        const fileName = generateFileName(s3FileName);

        await uploadToS3(generatedNetex, fileName);

        if (!isSchemeOperatorTicket(ticket) && ticket.nocCode !== 'IWBusCo') {
            console.info(`NeTEx generation complete for type ${type}`);
        }
    } catch (error) {
        console.error(error.stack);
        throw new Error(error);
    }
};

export default netexConvertorHandler;
