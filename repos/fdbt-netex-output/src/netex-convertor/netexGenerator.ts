import parser from 'xml2json';
import fs from 'fs';
import { MatchingData, OperatorData, ServiceData } from './types';
import {
    getScheduledStopPointsList,
    getFareZoneList,
    getPriceGroups,
    getDistanceMatrixElements,
    getDistanceMatrixElementsPriceRefs,
    getFareTables,
    getFareTableElements,
} from './netexHelpers';

interface NetexObject {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const getNetexTemplateAsJson = async (): Promise<NetexObject> => {
    try {
        const fileData = await fs.promises.readFile(`${__dirname}/netexTemplate.xml`, { encoding: 'utf8' });
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

const netexGenerator = (
    matchingData: MatchingData,
    operatorData: OperatorData,
    serviceData: ServiceData,
): { generate: Function } => {
    const opIdNocFormat = `noc:${operatorData.opId}`;
    const opIdBrandFormat = `${operatorData.opId}@brand`;
    const operatorPublicNameLineNameFormat = `${operatorData.publicName} ${matchingData.lineName}`;
    const noccodeLineNameFormat = `${matchingData.nocCode}_${matchingData.lineName}`;
    const lineIdName = `Line_${matchingData.lineName}`;
    const currentDate = new Date(Date.now());

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
        serviceFrameToUpdate.scheduledStopPoints.ScheduledStopPoint = getScheduledStopPointsList(
            matchingData.fareZones,
        );

        return serviceFrameToUpdate;
    };

    const updateZoneFareFrame = (zoneFareFrame: NetexObject): NetexObject => {
        const zoneFareFrameToUpdate = { ...zoneFareFrame };

        zoneFareFrameToUpdate.id = `operator@Network@${lineIdName}`;
        zoneFareFrameToUpdate.Name = { $t: operatorPublicNameLineNameFormat };
        zoneFareFrameToUpdate.fareZones.FareZone = getFareZoneList(matchingData.fareZones);

        return zoneFareFrameToUpdate;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `operator@Products@Trip@${lineIdName}`;
        priceFareFrameToUpdate.Name = { $t: operatorPublicNameLineNameFormat };
        priceFareFrameToUpdate.PricingParameterSet = {};
        priceFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(matchingData.fareZones);
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
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].distanceMatrixElements.DistanceMatrixElement = getDistanceMatrixElements(
            matchingData.fareZones,
        );
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.LineRef.ref = lineIdName;
        priceFareFrameToUpdate.tariffs.Tariff.fareTables.FareTableRef.ref = `Trip@single-SOP@p-ticket@${lineIdName}@adult`;

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

        fareTableFareFrameToUpdate.id = `operator@Products@Trip@prices@${lineIdName}`;
        fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(matchingData.fareZones);
        fareTableFareFrameToUpdate.priceGroups.PriceGroup.push({
            id: `operator@Products@Trip@${lineIdName}@adults`,
            Name: { $t: 'A list of all the prices' },
            DistanceMatrixElementPriceRef: getDistanceMatrixElementsPriceRefs(matchingData.fareZones, lineIdName),
        });
        fareTableFareFrameToUpdate.fareTables.FareTable.id = `Trip@single-SOP@p-ticket@${lineIdName}@adult`;
        fareTableFareFrameToUpdate.fareTables.FareTable.Name.$t = serviceData.serviceDescription;
        fareTableFareFrameToUpdate.fareTables.FareTable.usedIn.TariffRef.ref = `Tariff@single@${lineIdName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.specifics.LineRef.ref = lineIdName;

        fareTableFareFrameToUpdate.fareTables.FareTable.columns.FareTableColumn = getFareTableElements(
            [...matchingData.fareZones],
            lineIdName,
            'c',
        );

        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow = getFareTableElements(
            [...matchingData.fareZones].reverse(),
            lineIdName,
            'r',
        );

        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable = getFareTables(
            [...matchingData.fareZones].slice(0, -1),
            lineIdName,
        );

        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        const netexJson = await getNetexTemplateAsJson();
        const netexFrames = netexJson.PublicationDelivery.dataObjects.CompositeFrame[0].frames;

        netexFrames.ResourceFrame = updateResourceFrame(netexFrames.ResourceFrame);
        netexFrames.ServiceFrame = updateServiceFrame(netexFrames.ServiceFrame);
        netexFrames.FareFrame[0] = updateZoneFareFrame(netexFrames.FareFrame[0]);
        netexFrames.FareFrame[1] = updatePriceFareFrame(netexFrames.FareFrame[1]);
        netexFrames.FareFrame[2] = updateFareTableFareFrame(netexFrames.FareFrame[2]);

        return convertJsonToXml(netexJson);
    };

    return { generate };
};

export default netexGenerator;
