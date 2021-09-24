import { S3Event } from 'aws-lambda';
import AWS, { SNS } from 'aws-sdk';
import libxslt from 'libxslt';
import * as db from '../data/auroradb';
import * as s3 from '../data/s3';
import { isSchemeOperatorTicket, Ticket } from '../types/index';
import netexGenerator from './netexGenerator';
import { Operator } from '../../src/types/index';

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
        const ticket = await s3.fetchDataFromS3<Ticket>(event);
        s3FileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const { type } = ticket;

        // noc of logged in user
        let baseNoc = '';

        // let schemeCode = '';

        // let blah2: Operator = {
        //     opId: '',
        //     mode: '',
        //     vosaPsvLicenseName: '',
        //     nocCode: '',
        //     operatorName: '',
        //     contactNumber: '',
        //     email: '',
        //     url: '',
        //     street: '',
        //     town: '',
        //     county: '',
        //     postcode: '',
        // };

        // the operator of the currently logged in user
        // is known as the 'base operator'
        let operatorData: Operator[] = [];

        // 1. get the national operator code (noc) for the base operator
        if ('nocCode' in ticket) {
            baseNoc = ticket.nocCode;

            // 2. check operatorDetails table in database to see if noc has a record
            const details = await db.getOperatorDetailsByNoc(baseNoc);

            const operatorDetails = await db.getOperatorDataByNocCode([baseNoc]);

            operatorData.push({ ...operatorDetails[0], ...details });
        }

        // else {
        //     // we've got a scheme
        //     schemeCode = `${ticket.schemeOperatorName.substr(0, 5)}${ticket.schemeOperatorRegionCode}`.toUpperCase();

        //     const schemeDetails = await db.getOperatorDetailsByNoc(schemeCode);

        //     blah2 = { ...schemeDetails, opId: '', mode: '', vosaPsvLicenseName: '', nocCode: schemeCode };
        // }

        const nocs: string[] = buildNocList(ticket);

        console.log(nocs);

        if (nocs.length > 0) {
            operatorData = operatorData.concat(await db.getOperatorDataByNocCode(nocs));
        }

        const netexGen = netexGenerator(ticket, operatorData);
        const generatedNetex = await netexGen.generate();
        const fileName = generateFileName(s3FileName);

        await uploadToS3(generatedNetex, fileName);

        // This gets logged for grafana
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
