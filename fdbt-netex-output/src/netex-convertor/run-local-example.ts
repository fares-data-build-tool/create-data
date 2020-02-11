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
const uniquePriceGroups: string[] = [
    ...new Set(matchingdata.fareZones.flatMap(zone => zone.prices.flatMap(price => price.price))),
];

export function iterateThroughFareTriangleColumns(arr: Stop[]): string [] {
    const newArr: string[] = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < arr.length - 1; i++) {
        // eslint-disable-next-line no-plusplus
        for (let j = i + 1; j < arr.length; j++) {
            const firstElt = arr[i].stopName;
            const secondElt = arr[j].stopName;
            newArr.push(firstElt, secondElt);
        }
    }
    console.log(newArr);
    return newArr;
}

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
            version: 'any',
            id: `naptan:${stop.atcoCode}`,
            Name: { $t: stop.stopName },
            TopographicPlaceView: {
                TopographicPlaceRef: { ref: `nptgUkLocality:${stop.localityCode}`, version: '0' },
                Name: { $t: stop.localityName },
                QualifierName: { $t: stop.qualifierName },
            },
        },
    }));
}

export function updateZoneFareFrame(netexFileAsJsObject: NetexObject): void {
    const fareFrameUpdates = netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.FareFrame[0];
    fareFrameUpdates.Name = operatorPublicNameLineNameFormat;
    fareFrameUpdates.fareZones = matchingdata.fareZones.map(zone => {
        const stopPoints = zone.stops.map(stop => ({
            ScheduledStopPointRef: {
                ref: `naptan:${stop.atcoCode}`,
                version: 'any',
                $t: `${stop.stopName}, ${stop.localityName}`,
            },
        }));
        return {
            FareZone: {
                version: '1.0',
                id: `fs@${zone.name}`,
                Name: { $t: zone.name },
                members: stopPoints,
            },
        };
    });
}

export function updatePriceFareFrame(netexFileAsJsObject: NetexObject): void {
    const fareFrameUpdates = netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.FareFrame[1];
    fareFrameUpdates.Name = operatorPublicNameLineNameFormat;
    fareFrameUpdates.priceGroups = uniquePriceGroups.map((price, index) => ({
        version: '1.0',
        id: `price_band_${index}`,
        members: [
            {
                GeographicalIntervalPrice: {
                    version: '1.0',
                    id: `price_band_${index}@adult`,
                    Amount: { $t: price },
                },
            },
        ],
    }));
    fareFrameUpdates.tariffs.Tariff.id = `Tariff@single@Line_${matchingdata.lineName}`;
    fareFrameUpdates.tariffs.Tariff.Name = `${operatorPublicNameLineNameFormat} - Single Fares`;
    fareFrameUpdates.tariffs.Tariff.OperatorRef.ref = opIdNocFormat;
    fareFrameUpdates.tariffs.Tariff.OperatorRef.$t = NOCCode;
    fareFrameUpdates.tariffs.Tariff.LineRef.ref = `Line_${matchingdata.lineName}`;
    fareFrameUpdates.tariffs.Tariff.fareStructureElements.FareStructureElement.distanceMatrixElements = stops.map(
        stop => ({
            DistanceMatrixElement: {
                version: '1.0',
                id: `${stop.stopName}+${stop.stopName}`,
                priceGroups: {
                    PriceGroupRef: {
                        version: '1.0',
                        ref: 'price_band_A',
                    },
                },
                StartTariffZoneRef: {
                    version: '1.0',
                    ref: `fs@${stop.stopName}`,
                },
                EndTariffZoneRef: {
                    version: '1.0',
                    ref: `fs@${stop.stopName}`,
                },
            },
        }),
    );
    fareFrameUpdates.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.LineRef.ref = `Line_${matchingdata.lineName}`;
}

export function updateFareTableFrame(netexFileAsJsObject: NetexObject): void {
    const fareFrameUpdates = netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.FareFrame[2];
    fareFrameUpdates.id = `${OpId}@Products@Trip@prices@Line_${matchingdata.lineName}`;
    fareFrameUpdates.dataSourceRef = OpId;
    fareFrameUpdates.noticeAssignments.NoticeAssignment.id = `${OpId}@Products@Trip@prices@Line_${matchingdata.lineName}@Footnote`;
    fareFrameUpdates.noticeAssignments.NoticeAssignment[0].NoticedObjectRef.ref = `Trip@single-SOP@p-ticket@line_${matchingdata.lineName}@adult`;
    fareFrameUpdates.fareTables.FareTable.id = `Trip@single-SOP@p-ticket@Line_${matchingdata.lineName}@adult`;
    fareFrameUpdates.fareTables.FareTable.Name.$t = Description;
    fareFrameUpdates.fareTables.FareTable.usedIn.TariffRef.ref = `Tariff@single@Line_${matchingdata.lineName}`;
    fareFrameUpdates.fareTables.FareTable.specifics.LineRef.ref = `Line_${matchingdata.lineName}`;
    
    console.log(util.inspect(fareFrameUpdates, false, null, true));
}

convertXmlToJsObject()
    .then(data => {
        updateResourceFrame(data);
        updateServiceFrame(data);
        updateZoneFareFrame(data);
        updatePriceFareFrame(data);
        updateFareTableFrame(data);
        const trialxmlobject: string = convertJsObjectToXml(data);
        console.log(trialxmlobject);
    })
    .catch(err => console.error(err.message));
