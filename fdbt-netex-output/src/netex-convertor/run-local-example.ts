import parser from 'xml2json';
import fs from 'fs';
// import format from 'xml-formatter';
import matchingdata from './test-data/matchingdata';

const Website = 'www.iwbus.co.uk';
const TTRteEnq = 'email@iwbus.co.uk';
const OpId = '123123';
const OperatorPublicName = 'IWBus Transport';
const NOCCode = 'IWBU';
const ShortName = 'IWBus';
const VOSA_PSVLicenseName = 'IWBus Transport Ltd'; // eslint-disable-line @typescript-eslint/camelcase
const FareEnq = '0113 111 1111';
const ComplEnq = 'Apsley Hpuse, 1 Wellington Street, Leeds, LS1 AAA';
const Mode = 'bus';
const opIdNocFormat = `noc:${OpId}`;
const opIdBrandFormat = `${OpId}@brand`;
const operatorPublicNameLineNameFormat = `${OperatorPublicName} ${matchingdata.lineName}`;
const noccodeLineNameFormat = `${NOCCode}_${matchingdata.lineName}`;
const Description = 'London - Manchester - Leeds';
const lineIdName = `Line_${matchingdata.lineName}`;

interface Stop {
    stopName: string;
    naptanCode: string;
    atcoCode: string;
    localityCode: string;
    localityName: string;
    qualifierName: string;
}

interface NetexObject {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface FareZonePrices {
    price: string;
    fareZones: string[];
}

interface FareZone {
    name: string;
    stops: Stop[];
    prices: FareZonePrices[];
}

const stops: Stop[] = matchingdata.fareZones.flatMap(zone => zone.stops);
const uniquePriceGroups: string[] = [
    ...new Set(matchingdata.fareZones.flatMap(zone => zone.prices.flatMap(price => price.price))),
];

const getIdName = (name: string): string => name.replace(/\s/g, '_');

const getPriceGroups = (): {}[] =>
    uniquePriceGroups.map(price => ({
        version: '1.0',
        id: `price_band_${price}`,
        members: [
            {
                GeographicalIntervalPrice: {
                    version: '1.0',
                    id: `price_band_${price}@adult`,
                    Amount: { $t: price },
                },
            },
        ],
    }));

const getDistanceMatrixElements = (): {}[] =>
    matchingdata.fareZones.flatMap(zone =>
        zone.prices.flatMap(price =>
            price.fareZones.map(secondZone => ({
                version: '1.0',
                id: `${getIdName(zone.name)}+${getIdName(secondZone)}`,
                priceGroups: {
                    PriceGroupRef: {
                        version: '1.0',
                        ref: `price_band_${price.price}`,
                    },
                },
                StartTariffZoneRef: {
                    version: '1.0',
                    ref: `fs@${getIdName(zone.name)}`,
                },
                EndTariffZoneRef: {
                    version: '1.0',
                    ref: `fs@${getIdName(secondZone)}`,
                },
            })),
        ),
    );

const getDistanceMatrixElementsPriceRefs = (): {}[] =>
    matchingdata.fareZones.flatMap(zone =>
        zone.prices.flatMap(price =>
            price.fareZones.map(secondZone => ({
                version: '1.0',
                ref: `Trip@single-SOP@p-ticket@${lineIdName}@adult@${getIdName(zone.name)}+${getIdName(secondZone)}`,
            })),
        ),
    );

const getFareTables = (columns: FareZone[]): {}[] =>
    columns.flatMap((zone, columnNum) => {
        let rowCount = columns.length - columnNum;
        let order = 0;

        return {
            Name: { $t: zone.name },
            Description: { $t: `Column ${columnNum + 1}` },
            cells: {
                Cell: zone.prices.flatMap(price =>
                    price.fareZones.map(secondZone => {
                        rowCount -= 1;
                        order += 1;

                        return {
                            version: '1.0',
                            id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@${getIdName(zone.name)}`,
                            order,
                            DistanceMatrixElementPrice: {
                                version: '1.0',
                                id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@${getIdName(zone.name)}+${getIdName(
                                    secondZone,
                                )}`,
                                GeographicalIntervalPriceRef: {
                                    version: '1.0',
                                    ref: `price_band_${price.price}@adult`,
                                },
                                DistanceMatrixElementRef: {
                                    version: '1.0',
                                    ref: `${getIdName(zone.name)}+${getIdName(secondZone)}`,
                                },
                            },
                            ColumnRef: {
                                versionRef: '1',
                                ref: `Trip@single-SOP@p-ticket@${lineIdName}@adult@c${columnNum + 1}@${getIdName(
                                    zone.name,
                                )}`,
                            },
                            RowRef: {
                                versionRef: '1',
                                ref: `Trip@single-SOP@p-ticket@${lineIdName}@adult@r${rowCount + 1}@${getIdName(
                                    secondZone,
                                )}`,
                            },
                        };
                    }),
                ),
            },
        };
    });

const currentDate = new Date();

export async function convertXmlToJson(): Promise<NetexObject> {
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
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString, { sanitize: true });
    return netexFileAsXmlString;
}

export function updateResourceFrame(netexFileAsJsObject: NetexObject): void {
    const resourceFrameUpdates =
        netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.ResourceFrame;
    resourceFrameUpdates.codespaces.Codespace.XmlnsUrl.$t = Website;
    resourceFrameUpdates.dataSources.DataSource.Email.$t = TTRteEnq;
    resourceFrameUpdates.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = opIdNocFormat;
    resourceFrameUpdates.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t = OperatorPublicName;
    resourceFrameUpdates.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = opIdNocFormat;
    resourceFrameUpdates.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t = OperatorPublicName;
    resourceFrameUpdates.typesOfValue.ValueSet.values.Branding.id = opIdBrandFormat;
    resourceFrameUpdates.organisations.Operator.id = opIdNocFormat;
    resourceFrameUpdates.organisations.Operator.PublicCode.$t = NOCCode;
    resourceFrameUpdates.organisations.Operator.Name.$t = OperatorPublicName;
    resourceFrameUpdates.organisations.Operator.ShortName.$t = ShortName;
    resourceFrameUpdates.organisations.Operator.TradingName.$t = VOSA_PSVLicenseName; // eslint-disable-line @typescript-eslint/camelcase
    resourceFrameUpdates.organisations.Operator.ContactDetails.Phone.$t = FareEnq;
    resourceFrameUpdates.organisations.Operator.Address.Street.$t = ComplEnq;
    resourceFrameUpdates.organisations.Operator.PrimaryMode.$t = Mode;
}

export function updateServiceFrame(netexFileAsJsObject: NetexObject): void {
    const serviceFrameUpdates =
        netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.ServiceFrame;
    serviceFrameUpdates.id = `operator@Network@${lineIdName}`;
    serviceFrameUpdates.lines.Line.id = matchingdata.lineName;
    serviceFrameUpdates.lines.Line.Name.$t = operatorPublicNameLineNameFormat;
    serviceFrameUpdates.lines.Line.Description.$t = Description;
    serviceFrameUpdates.lines.Line.PublicCode.$t = matchingdata.lineName;
    serviceFrameUpdates.lines.Line.PrivateCode.$t = noccodeLineNameFormat;
    serviceFrameUpdates.lines.Line.OperatorRef.ref = opIdNocFormat;
    serviceFrameUpdates.lines.Line.OperatorRef.$t = NOCCode;
    serviceFrameUpdates.scheduledStopPoints.ScheduledStopPoint = stops.map(stop => ({
        version: 'any',
        id: `naptan:${stop.atcoCode}`,
        Name: { $t: stop.stopName },
        TopographicPlaceView: {
            TopographicPlaceRef: { ref: `nptgUkLocality:${stop.localityCode}`, version: '0' },
            Name: { $t: stop.localityName },
            QualifierName: { $t: stop.qualifierName },
        },
    }));
}

export function updateZoneFareFrame(netexFileAsJsObject: NetexObject): void {
    const fareFrameUpdates = netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.FareFrame[0];
    fareFrameUpdates.id = `operator@Network@${lineIdName}`;
    fareFrameUpdates.Name = { $t: operatorPublicNameLineNameFormat };
    fareFrameUpdates.fareZones.FareZone = matchingdata.fareZones.map(zone => {
        const stopPoints = zone.stops.map(stop => ({
            ScheduledStopPointRef: {
                ref: `naptan:${stop.atcoCode}`,
                version: 'any',
                $t: `${stop.stopName}, ${stop.localityName}`,
            },
        }));
        return {
            version: '1.0',
            id: `fs@${zone.name}`,
            Name: { $t: zone.name },
            members: { stopPoints },
        };
    });
}

export function updatePriceFareFrame(netexFileAsJsObject: NetexObject): void {
    const fareFrameUpdates = netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.FareFrame[1];
    fareFrameUpdates.id = `operator@Products@Trip@${lineIdName}`;
    fareFrameUpdates.Name = { $t: operatorPublicNameLineNameFormat };
    fareFrameUpdates.PricingParameterSet = {};
    fareFrameUpdates.priceGroups.PriceGroup = getPriceGroups();
    fareFrameUpdates.tariffs.Tariff.id = `Tariff@single@${lineIdName}`;
    fareFrameUpdates.tariffs.Tariff.validityConditions = {
        ValidBetween: {
            FromDate: { $t: currentDate.toISOString() },
            ToDate: { $t: new Date(currentDate.setFullYear(currentDate.getFullYear() + 99)).toISOString() },
        },
    };
    fareFrameUpdates.tariffs.Tariff.documentLinks = {};

    fareFrameUpdates.tariffs.Tariff.Name = { $t: `${operatorPublicNameLineNameFormat} - Single Fares` };
    fareFrameUpdates.tariffs.Tariff.OperatorRef.ref = opIdNocFormat;
    fareFrameUpdates.tariffs.Tariff.OperatorRef.$t = NOCCode;
    fareFrameUpdates.tariffs.Tariff.LineRef.ref = lineIdName;
    fareFrameUpdates.tariffs.Tariff.fareStructureElements.FareStructureElement[0].Name = {
        $t: `O/D pairs for ${matchingdata.lineName}`,
    };
    fareFrameUpdates.tariffs.Tariff.fareStructureElements.FareStructureElement[0].distanceMatrixElements.DistanceMatrixElement = getDistanceMatrixElements();
    fareFrameUpdates.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.LineRef.ref = lineIdName;
    fareFrameUpdates.tariffs.Tariff.fareTables.FareTableRef.ref = `Trip@single-SOP@p-ticket@${lineIdName}@adult`;
}

export function updateFareTableFrame(netexFileAsJsObject: NetexObject): void {
    const fareFrameUpdates = netexFileAsJsObject.PublicationDelivery.dataObjects.CompositeFrame[0].frames.FareFrame[2];
    fareFrameUpdates.id = `operator@Products@Trip@prices@${lineIdName}`;
    fareFrameUpdates.priceGroups.PriceGroup = getPriceGroups();
    fareFrameUpdates.priceGroups.PriceGroup.push({
        id: `operator@Products@Trip@${lineIdName}@adults`,
        Name: { $t: 'A list of all the prices' },
        DistanceMatrixElementPriceRef: getDistanceMatrixElementsPriceRefs(),
    });
    fareFrameUpdates.fareTables.FareTable.id = `Trip@single-SOP@p-ticket@${lineIdName}@adult`;
    fareFrameUpdates.fareTables.FareTable.Name.$t = Description;
    fareFrameUpdates.fareTables.FareTable.usedIn.TariffRef.ref = `Tariff@single@${lineIdName}`;
    fareFrameUpdates.fareTables.FareTable.specifics.LineRef.ref = lineIdName;

    const columns = [...matchingdata.fareZones];
    const rows = [...matchingdata.fareZones].reverse();
    columns.pop();
    rows.pop();

    fareFrameUpdates.fareTables.FareTable.columns.FareTableColumn = columns.map((zone, index) => ({
        version: '1.0',
        id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@c${index + 1}@${getIdName(zone.name)}`,
        order: index + 1,
        Name: { $t: zone.name },
    }));

    fareFrameUpdates.fareTables.FareTable.rows.FareTableRow = rows.map((zone, index) => ({
        version: '1.0',
        id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@r${index + 1}@${getIdName(zone.name)}`,
        order: index + 1,
        Name: { $t: zone.name },
    }));

    fareFrameUpdates.fareTables.FareTable.includes.FareTable = getFareTables(columns);
}

convertXmlToJson()
    .then(data => {
        fs.writeFile('./output/output.json', JSON.stringify(data, null, 4), {}, () => {
            console.log('Written');
        });
        // updateResourceFrame(data);
        // updateServiceFrame(data);
        // updateZoneFareFrame(data);
        // updatePriceFareFrame(data);
        // updateFareTableFrame(data);

        // const trialxmlobject: string = convertJsObjectToXml(data);
        // const xmlWithDec = `<?xml version="1.0" encoding="iso-8859-1"?>${trialxmlobject}`;
    })
    .catch(err => console.error(err.message));
