import { S3Event } from 'aws-lambda';
import AWS, { SNS } from 'aws-sdk';
import * as db from '../data/auroradb';
import * as s3 from '../data/s3';
import { isPointToPointTicket, isSchemeOperatorTicket, isSingleTicket, Ticket } from '../types/index';
import netexGenerator from './netexGenerator';
import { Operator } from '../../src/types/index';
import { getProductType, replaceAll } from './sharedHelpers';
import { SchemeOperatorTicket } from 'fdbt-types/matchingJsonTypes';
import { fileNameExistsAlready } from '../data/s3';
import { v4 as uuidv4 } from 'uuid';

export const xsl = `
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

const getLineOrNetworkFare = (productType: string): string => {
    if (productType === 'singleTrip' || productType === 'dayReturnTrip' || productType === 'periodReturnTrip') {
        return 'LINE-FARE';
    }

    return 'NETWORK-FARE';
};

export const getSchemeNocIdentifier = (schemeTicket: SchemeOperatorTicket): string =>
    `${schemeTicket.schemeOperatorName.substring(0, 5)}${schemeTicket.schemeOperatorRegionCode}`;

export const getS3FilePrefix = (s3FileName: string, nocIdentifier: string): string => {
    const exportDate = s3FileName.split(`${nocIdentifier}/exports/`)[1].split('/')[0];
    return `${nocIdentifier}/exports/${exportDate}`;
};

export const generateFileName = (ticket: Ticket): string => {
    const productType = getProductType(ticket);
    const lineOrNetworkFare = getLineOrNetworkFare(productType);
    const nocOrSchemeName = isSchemeOperatorTicket(ticket) ? getSchemeNocIdentifier(ticket) : ticket.nocCode;
    const productNameWithoutWhiteSpace = replaceAll(ticket.products[0].productName, ' ', '-');
    const productNameWithoutSlashes = replaceAll(productNameWithoutWhiteSpace, '/', '-');
    const creationDate = new Date(Date.now()).toISOString().split('T')[0];
    const startDate = ticket.ticketPeriod.startDate.split('T')[0];

    let pointToPointInsert = '';

    if (isPointToPointTicket(ticket)) {
        if (isSingleTicket(ticket)) {
            const directionLetter =
                ticket.journeyDirection === 'inbound' || ticket.journeyDirection === 'clockwise' ? 'I' : 'O';
            pointToPointInsert = `${ticket.lineName}_${directionLetter}_`;
        } else {
            pointToPointInsert = `${ticket.lineName}_`;
        }
    }

    const uuid = uuidv4().substring(0, 4);

    return `FX-PI-01_UK_${nocOrSchemeName}_${lineOrNetworkFare}_${
        pointToPointInsert ? pointToPointInsert : ''
    }${productNameWithoutSlashes}_${creationDate}_${startDate}_${uuid}`;
};

export const getFinalNetexName = async (fileName: string): Promise<string> => {
    let placeHolderFileName = fileName;
    let counter = 1;

    while (true) {
        const fileNameTaken = await fileNameExistsAlready(`${placeHolderFileName}.xml`);
        if (fileNameTaken) {
            placeHolderFileName = `${fileName}_${counter}`;
            counter++;
        } else {
            break;
        }
    }

    return placeHolderFileName;
};

export const buildNocList = (ticket: Ticket): string[] => {
    const nocs: string[] = [];

    if ('additionalNocs' in ticket) {
        nocs.push(...ticket.additionalNocs);
    }

    if ('additionalOperators' in ticket) {
        nocs.push(...ticket.additionalOperators.map(op => op.nocCode));
    }

    return nocs;
};

export const netexConvertorHandler = async (event: S3Event): Promise<void> => {
    const { SNS_ALERTS_ARN } = process.env;

    let s3FileName = '';

    try {
        s3FileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const ticket = await s3.fetchDataFromS3<Ticket>(event);

        const { type } = ticket;

        console.info(`NeTEx generation starting for ${s3FileName}, of type ${type}...`);

        const operatorData: Operator[] = [];

        // get the national operator code (noc) for the base operator
        if ('nocCode' in ticket) {
            const baseNoc = ticket.nocCode;

            // check operatorDetails table in database to see if noc has a record
            const details = await db.getOperatorDetailsByNoc(baseNoc);

            const operatorDetails = await db.getOperatorDataByNocCode([baseNoc]);

            operatorData.push({ ...operatorDetails[0], ...details });
        }

        const nocs: string[] = buildNocList(ticket);

        if (nocs.length > 0) {
            operatorData.push(...(await db.getOperatorDataByNocCode(nocs)));
        }
        const generator = await netexGenerator(ticket, operatorData);

        const generatedNetex = await generator.generate();

        let fileName: string;

        if (process.env.NODE_ENV !== 'development') {
            const nocIdentifier = isSchemeOperatorTicket(ticket) ? getSchemeNocIdentifier(ticket) : ticket.nocCode;
            const filePrefix = getS3FilePrefix(s3FileName, nocIdentifier);
            const fileNameEnding = generateFileName(ticket);
            const fileNameWithPrefixs = `${filePrefix}/${fileNameEnding}`;
            fileName = `${await getFinalNetexName(fileNameWithPrefixs)}.xml`;
        } else {
            fileName = s3FileName.replace('.json', '.xml');
        }

        await s3.uploadNetexToS3(generatedNetex, fileName);

        // this gets logged for grafana
        if (!('nocCode' in ticket) || ticket.nocCode !== 'IWBusCo') {
            const scheme = isSchemeOperatorTicket(ticket) ? 'scheme:' : '';

            const carnet = ticket.carnet ? 'carnet:' : '';

            console.info(`NeTEx generation complete for type ${scheme}${carnet}${type}`);
        }
    } catch (error) {
        console.error(error);

        const sns: SNS = new AWS.SNS();

        const messageParams = {
            Subject: 'NeTEx Convertor',
            Message: `There was an error when converting the NeTEx file: ${s3FileName}`,
            TopicArn: SNS_ALERTS_ARN,
            MessageAttributes: {
                NewStateValue: {
                    DataType: 'String',
                    StringValue: 'ALARM',
                },
            },
        };

        if (process.env.STAGE !== 'dev') {
            await sns.publish(messageParams).promise();
        }

        throw error;
    }
};

export default netexConvertorHandler;
