import parser from 'xml2json';
import fs from 'fs';
import util from 'util';
import matchingdata from './matchingdata';

const Website = 'www.iwbus.co.uk';
const TTRteEnq = 'email@iwbus.co.uk';
const OpId = '123123';
const OperatorPublicName = 'IWBus Transport';
const NOCCode = 'IWBU';
const ShortName = 'IWBus';
// eslint-disable-next-line camelcase
const VOSA_PSVLicenseName = 'IWBus Transport Ltd';
const FareEnq = '0113 111 1111';
const ComplEnq = 'Apsley Hpuse, 1 Wellington Street, Leeds, LS1 AAA';
const Mode = 'bus';
const opIdNocFormat = `noc:${OpId}`;
const opIdBrandFormat = `${OpId}@brand`;
const operatorPublicNameLineNameFormat = `${OperatorPublicName} ${matchingdata.lineName}`;
const noccodeLineNameFormat = `${NOCCode}_${matchingdata.lineName}`;
const Description = 'London - Manchester - Leeds';

interface Stop {
    stopName: string;
    naptanCode: string;
    atcoCode: string;
    localityCode: string;
    localityName: string;
    qualifierName: string;
}

interface NetexObject {
    [key: string]: any;
}

const stops: Stop[] = matchingdata.fareZones.flatMap(zone => zone.stops);

export async function convertXmlToJsObject(): Promise<NetexObject> {
    try {
        const fileData = await fs.promises.readFile('./netexTemplate.xml', { encoding: 'utf8' });
        const json = JSON.parse(parser.toJson(fileData, { reversible: true }));
        return json;
    } catch (error) {
        console.log(error);
        return {};
    }
}

export function convertJsObjectToXml(netexFileAsJsObject: NetexObject): string {
    const netexFileAsJsonString = JSON.stringify(netexFileAsJsObject);
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString);
    return netexFileAsXmlString;
}

export function updateResourceFrame(netexFileAsJsObject: NetexObject): void {
    const resourceFrameUpdates =
        netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.ResourceFrame;
    resourceFrameUpdates.codespaces.Codespace.XmlnsUrl.$t = Website;
    resourceFrameUpdates.dataSources.DataSource.Email.$t = TTRteEnq;
    resourceFrameUpdates.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = opIdNocFormat;
    resourceFrameUpdates.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.t = OperatorPublicName;
    resourceFrameUpdates.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = opIdNocFormat;
    resourceFrameUpdates.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.t = OperatorPublicName;
    resourceFrameUpdates.typesOfValue.ValueSet.values.Branding.id = opIdBrandFormat;
    resourceFrameUpdates.organisations.Operator.id = opIdNocFormat;
    resourceFrameUpdates.organisations.Operator.PublicCode.$t = NOCCode;
    resourceFrameUpdates.organisations.Operator.Name.$t = OperatorPublicName;
    resourceFrameUpdates.organisations.Operator.ShortName.$t = ShortName;
    // eslint-disable-next-line camelcase
    resourceFrameUpdates.organisations.Operator.TradingName.$t = VOSA_PSVLicenseName;
    resourceFrameUpdates.organisations.Operator.ContactDetails.Phone.$t = FareEnq;
    resourceFrameUpdates.organisations.Operator.Address.Street.$t = ComplEnq;
    resourceFrameUpdates.organisations.Operator.PrimaryMode.$t = Mode;
}

export function updateServiceFrame(netexFileAsJsObject: NetexObject): void {
    const serviceFrameUpdates =
        netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.ServiceFrame;
    serviceFrameUpdates.lines.Line.id = matchingdata.lineName;
    serviceFrameUpdates.lines.Line.Name.$t = operatorPublicNameLineNameFormat;
    serviceFrameUpdates.lines.Line.Description.$t = Description;
    serviceFrameUpdates.lines.Line.PublicCode.$t = matchingdata.lineName;
    serviceFrameUpdates.lines.Line.PrivateCode.$t = noccodeLineNameFormat;
    serviceFrameUpdates.lines.Line.OperatorRef.ref = opIdNocFormat;
    serviceFrameUpdates.lines.Line.OperatorRef.$t = NOCCode;
    serviceFrameUpdates.scheduledStopPoints = stops.map(stop => ({
        ScheduledStopPoint: {
            id: `naptan:${stop.atcoCode}`,
            Name: { $t: stop.stopName },
            TopographicPlaceView: {
                TopographicPlaceRef: { ref: `nptgUkLocality:${stop.localityCode}` },
                Name: stop.localityName,
                QualifierName: stop.qualifierName,
            },
        },
    }));
}

export function updateFareFrame(netexFileAsJsObject: NetexObject): void {
    const fareFrameUpdates = netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.FareFrame;
    console.log(util.inspect(fareFrameUpdates, false, null, true));
    fareFrameUpdates.Name = operatorPublicNameLineNameFormat;
    // fareFrameUpdates.fareZones = matchingdata.fareZones.map(zone => ({
    //     FareZone: {
    //         id: `naptan:${stop.atcoCode}`,
    //         Name: { $t: stop.stopName },
    //         TopographicPlaceView: {
    //             TopographicPlaceRef: { ref: `nptgUkLocality:${stop.localityCode}` },
    //             Name: stop.localityName,
    //             QualifierName: stop.qualifierName,
    //         },

    console.log(util.inspect(fareFrameUpdates, false, null, true));
}

convertXmlToJsObject()
    .then(data => {
        console.log(data);
        updateResourceFrame(data);
        updateServiceFrame(data);
        updateFareFrame(data);
        console.log(data);
        // const trialxmlobject: string = convertJsObjectToXml(data);
        // console.log(trialxmlobject);
    })
    .catch(err => console.error(err.message));
