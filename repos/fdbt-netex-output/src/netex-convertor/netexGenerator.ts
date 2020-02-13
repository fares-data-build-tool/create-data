import parser from 'xml2json';
import fs from 'fs';
import { MatchingData, OperatorData, ServiceData, Stop, FareZone } from './handler';

interface NetexObject {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const getNetexTemplateAsJson = async (): Promise<NetexObject> => {
    try {
        const fileData = await fs.promises.readFile('./netexTemplate.xml', { encoding: 'utf8' });
        const json = JSON.parse(parser.toJson(fileData, { reversible: true }));

        return json;
    } catch (error) {
        throw new Error(`Error converting NeTEx template to JSON: ${error.message}`);
    }
};

const convertJsonToXml = (netexFileAsJsObject: NetexObject): string => {
    const netexFileAsJsonString = JSON.stringify(netexFileAsJsObject);
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString, { sanitize: true });

    return netexFileAsXmlString;
};

const netexGenerator = (matchingData: MatchingData, operatorData: OperatorData, serviceData: ServiceData): {} => {
    const opIdNocFormat = `noc:${operatorData.opId}`;
    const opIdBrandFormat = `${operatorData.opId}@brand`;
    const operatorPublicNameLineNameFormat = `${operatorData.publicName} ${matchingData.lineName}`;
    const noccodeLineNameFormat = `${matchingData.nocCode}_${matchingData.lineName}`;
    const lineIdName = `Line_${matchingData.lineName}`;
    const currentDate = new Date();

    const getStops = (): Stop[] => matchingData.fareZones.flatMap(zone => zone.stops);

    const getUniquePriceGroups = (): string[] => [
        ...new Set(matchingData.fareZones.flatMap(zone => zone.prices.flatMap(price => price.price))),
    ];

    const getIdName = (name: string): string => name.replace(/\s/g, '_');

    const getScheduledStopPointsList = (): {}[] =>
        getStops().map(stop => ({
            version: 'any',
            id: `naptan:${stop.atcoCode}`,
            Name: { $t: stop.stopName },
            TopographicPlaceView: {
                TopographicPlaceRef: { ref: `nptgUkLocality:${stop.localityCode}`, version: '0' },
                Name: { $t: stop.localityName },
                QualifierName: { $t: stop.qualifierName },
            },
        }));

    const getPriceGroups = (): {}[] =>
        getUniquePriceGroups().map(price => ({
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

    const getFareZoneList = (): {}[] =>
        matchingData.fareZones.map(zone => ({
            version: '1.0',
            id: `fs@${zone.name}`,
            Name: { $t: zone.name },
            members: {
                stopPoints: zone.stops.map(stop => ({
                    ScheduledStopPointRef: {
                        ref: `naptan:${stop.atcoCode}`,
                        version: 'any',
                        $t: `${stop.stopName}, ${stop.localityName}`,
                    },
                })),
            },
        }));

    const getDistanceMatrixElements = (): {}[] =>
        matchingData.fareZones.flatMap(zone =>
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
        matchingData.fareZones.flatMap(zone =>
            zone.prices.flatMap(price =>
                price.fareZones.map(secondZone => ({
                    version: '1.0',
                    ref: `Trip@single-SOP@p-ticket@${lineIdName}@adult@${getIdName(zone.name)}+${getIdName(
                        secondZone,
                    )}`,
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
                                    id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@${getIdName(
                                        zone.name,
                                    )}+${getIdName(secondZone)}`,
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

    const updateResourceFrame = (resourceFrame: NetexObject): NetexObject => {
        const resourceFrameToUpdate = { ...resourceFrame };

        resourceFrameToUpdate.codespaces.Codespace.XmlnsUrl.$t = operatorData.website;
        resourceFrameToUpdate.dataSources.DataSource.Email.$t = operatorData.ttrteEnq;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = opIdNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.publicName;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = opIdNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.publicName;
        resourceFrameToUpdate.typesOfValue.ValueSet.values.Branding.id = opIdBrandFormat;
        resourceFrameToUpdate.organisations.Operator.id = opIdNocFormat;
        resourceFrameToUpdate.organisations.Operator.PublicCode.$t = matchingData.nocCode;
        resourceFrameToUpdate.organisations.Operator.Name.$t = operatorData.publicName;
        resourceFrameToUpdate.organisations.Operator.ShortName.$t = matchingData.operatorShortName;
        resourceFrameToUpdate.organisations.Operator.TradingName.$t = operatorData.vosaPSVLicenseName; // eslint-disable-line @typescript-eslint/camelcase
        resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = operatorData.fareEnq;
        resourceFrameToUpdate.organisations.Operator.Address.Street.$t = operatorData.complEnq;
        resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = operatorData.mode;

        return resourceFrameToUpdate;
    };

    const updateServiceFrame = (serviceFrame: NetexObject): NetexObject => {
        const serviceFrameToUpdate = { ...serviceFrame };

        serviceFrameToUpdate.id = `operator@Network@${lineIdName}`;
        serviceFrameToUpdate.lines.Line.id = matchingData.lineName;
        serviceFrameToUpdate.lines.Line.Name.$t = operatorPublicNameLineNameFormat;
        serviceFrameToUpdate.lines.Line.Description.$t = serviceData.serviceDescription;
        serviceFrameToUpdate.lines.Line.PublicCode.$t = matchingData.lineName;
        serviceFrameToUpdate.lines.Line.PrivateCode.$t = noccodeLineNameFormat;
        serviceFrameToUpdate.lines.Line.OperatorRef.ref = opIdNocFormat;
        serviceFrameToUpdate.lines.Line.OperatorRef.$t = matchingData.nocCode;
        serviceFrameToUpdate.scheduledStopPoints.ScheduledStopPoint = getScheduledStopPointsList();

        return serviceFrameToUpdate;
    };

    const updateZoneFareFrame = (zoneFareFrame: NetexObject): NetexObject => {
        const zoneFareFrameToUpdate = { ...zoneFareFrame };

        zoneFareFrameToUpdate.id = `operator@Network@${lineIdName}`;
        zoneFareFrameToUpdate.Name = { $t: operatorPublicNameLineNameFormat };
        zoneFareFrameToUpdate.fareZones.FareZone = getFareZoneList();

        return zoneFareFrameToUpdate;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `operator@Products@Trip@${lineIdName}`;
        priceFareFrameToUpdate.Name = { $t: operatorPublicNameLineNameFormat };
        priceFareFrameToUpdate.PricingParameterSet = {};
        priceFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups();
        priceFareFrameToUpdate.tariffs.Tariff.id = `Tariff@single@${lineIdName}`;
        priceFareFrameToUpdate.tariffs.Tariff.validityConditions = {
            ValidBetween: {
                FromDate: { $t: currentDate.toISOString() },
                ToDate: { $t: new Date(currentDate.setFullYear(currentDate.getFullYear() + 99)).toISOString() },
            },
        };
        priceFareFrameToUpdate.tariffs.Tariff.documentLinks = {};

        priceFareFrameToUpdate.tariffs.Tariff.Name = { $t: `${operatorPublicNameLineNameFormat} - Single Fares` };
        priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.ref = opIdNocFormat;
        priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.$t = matchingData.nocCode;
        priceFareFrameToUpdate.tariffs.Tariff.LineRef.ref = lineIdName;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].Name = {
            $t: `O/D pairs for ${matchingData.lineName}`,
        };
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].distanceMatrixElements.DistanceMatrixElement = getDistanceMatrixElements();
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.LineRef.ref = lineIdName;
        priceFareFrameToUpdate.tariffs.Tariff.fareTables.FareTableRef.ref = `Trip@single-SOP@p-ticket@${lineIdName}@adult`;

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

        fareTableFareFrameToUpdate.id = `operator@Products@Trip@prices@${lineIdName}`;
        fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups();
        fareTableFareFrameToUpdate.priceGroups.PriceGroup.push({
            id: `operator@Products@Trip@${lineIdName}@adults`,
            Name: { $t: 'A list of all the prices' },
            DistanceMatrixElementPriceRef: getDistanceMatrixElementsPriceRefs(),
        });
        fareTableFareFrameToUpdate.fareTables.FareTable.id = `Trip@single-SOP@p-ticket@${lineIdName}@adult`;
        fareTableFareFrameToUpdate.fareTables.FareTable.Name.$t = serviceData.serviceDescription;
        fareTableFareFrameToUpdate.fareTables.FareTable.usedIn.TariffRef.ref = `Tariff@single@${lineIdName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.specifics.LineRef.ref = lineIdName;

        const columns = [...matchingData.fareZones];
        const rows = [...matchingData.fareZones].reverse();

        columns.pop();
        rows.pop();

        fareTableFareFrameToUpdate.fareTables.FareTable.columns.FareTableColumn = columns.map((zone, index) => ({
            version: '1.0',
            id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@c${index + 1}@${getIdName(zone.name)}`,
            order: index + 1,
            Name: { $t: zone.name },
        }));

        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow = rows.map((zone, index) => ({
            version: '1.0',
            id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@r${index + 1}@${getIdName(zone.name)}`,
            order: index + 1,
            Name: { $t: zone.name },
        }));

        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable = getFareTables(columns);

        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        const netexJson = await getNetexTemplateAsJson();
        const netexFrames = netexJson.PublicationDelivery.dataObjects.CompositeFrame[0].frames;

        netexFrames.ResourceFrame = updateResourceFrame(netexFrames.ResourceFrame);
        netexFrames.ServiceFrame = updateServiceFrame(netexFrames.serviceFrame);
        netexFrames.FareFrame[0] = updateZoneFareFrame(netexFrames.FareFrame[0]);
        netexFrames.FareFrame[1] = updatePriceFareFrame(netexFrames.FareFrame[1]);
        netexFrames.FareFrame[2] = updateFareTableFareFrame(netexFrames.FareFrame[2]);

        return convertJsonToXml(netexJson);
    };

    return { generate };
};

export default netexGenerator;
