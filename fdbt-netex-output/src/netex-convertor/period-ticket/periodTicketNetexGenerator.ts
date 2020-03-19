import parser from 'xml2json';
import fs from 'fs';
import { OperatorData, GeoZonePeriodData } from '../types';
import { NetexObject } from './periodTicketNetexHelpers';

const getNetexTemplateAsJson = async (): Promise<NetexObject> => {
    try {
        const fileData = await fs.promises.readFile(`${__dirname}/periodTicketNetexTemplate.xml`, { encoding: 'utf8' });
        const json = JSON.parse(parser.toJson(fileData, { reversible: true, trim: true }));

        return json;
    } catch (error) {
        throw new Error(`Error converting NeTEx template to JSON: ${error.stack}`);
    }
};

const convertJsonToXml = (netexFileAsJsonObject: NetexObject): string => {
    const netexFileAsJsonString = JSON.stringify(netexFileAsJsonObject);
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString, { sanitize: true });

    return netexFileAsXmlString;
};

const periodTicketNetexGenerator = (
    geoZonePeriodData: GeoZonePeriodData,
    operatorData: OperatorData,
): { generate: Function } => {
    // What is the difference between opId and nocCode below?
    const opIdNocFormat = `noc:${operatorData.opId}`;
    const nocCodeNocFormat = `noc:${geoZonePeriodData.nocCode}`;
    const periodProductNameOpFormat = `op:Pass@${geoZonePeriodData.productName}`
    // Should the below contain operatorData.publicName OR operatorData.opId?
    const opIdBrandFormat = `${operatorData.opId}@brand`;
    const currentDate = new Date(Date.now());

    const updatePublicationTimeStamp = (publicationTimeStamp: NetexObject): NetexObject => {
        const publicationTimeStampToUpdate = { ...publicationTimeStamp };
        publicationTimeStampToUpdate.PublicationTimestamp.$t = currentDate;

        return publicationTimeStampToUpdate;
    };

    const updatePublicationRequest = (publicationRequest: NetexObject): NetexObject => {
        const publicationRequestToUpdate = { ...publicationRequest };
        publicationRequestToUpdate.RequestTimestamp.$t = currentDate;
        publicationRequestToUpdate.Description.$t = `Request for ${geoZonePeriodData.nocCode} bus pass fares`;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.ref = nocCodeNocFormat;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.$t = opIdNocFormat;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.PreassignedFareProductRef.ref = periodProductNameOpFormat;

        return publicationRequestToUpdate;
    };

    const updateCompositeFrame = (compositeFrame: NetexObject): NetexObject => {
        const compositeFrameToUpdate = { ...compositeFrame };
        compositeFrameToUpdate.id = `epd:UK:${geoZonePeriodData.nocCode}:CompositeFrame_UK_PI_NETWORK_FARE_OFFER:Pass@${geoZonePeriodData.productName}:op`;
        compositeFrameToUpdate.Name.$t = `Fares for ${geoZonePeriodData.operatorName} - ${geoZonePeriodData.fareZoneName}`;
        compositeFrameToUpdate.Description.$t = `${geoZonePeriodData.operatorName} - ${geoZonePeriodData.fareZoneName} is accessible under a period pass. A price is given for a geographical zone, which contains a selection of stops as a fare zone.`;

        return compositeFrameToUpdate;
    };

    const updateResourceFrame = (resourceFrame: NetexObject): NetexObject => {
        const resourceFrameToUpdate = { ...resourceFrame };

        resourceFrameToUpdate.id = `epd:UK:${geoZonePeriodData.nocCode}:ResourceFrame_UK_PI_COMMON:${geoZonePeriodData.nocCode}:op`;
        resourceFrameToUpdate.codespaces.Codespace.XmlnsUrl.$t = operatorData.website;
        resourceFrameToUpdate.dataSources.DataSource.Email.$t = operatorData.ttrteEnq;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.publicName;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.publicName;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.id = opIdBrandFormat;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Name.$t = operatorData.publicName;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Url.$t = operatorData.website;
        resourceFrameToUpdate.organisations.Operator.id = nocCodeNocFormat;
        resourceFrameToUpdate.organisations.Operator.PublicCode.$t = geoZonePeriodData.nocCode;
        resourceFrameToUpdate.organisations.Operator.Name.$t = operatorData.publicName;
        resourceFrameToUpdate.organisations.Operator.ShortName.$t = geoZonePeriodData.operatorName;
        resourceFrameToUpdate.organisations.Operator.TradingName.$t = operatorData.vosaPSVLicenseName; // eslint-disable-line @typescript-eslint/camelcase
        resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = operatorData.fareEnq;
        resourceFrameToUpdate.organisations.Operator.ContactDetails.Url.$t = operatorData.website;
        resourceFrameToUpdate.organisations.Operator.Address.Street.$t = operatorData.complEnq;
        resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = operatorData.mode;

        return resourceFrameToUpdate;
    };

    const updateSiteFrame = (siteFrame: NetexObject): NetexObject => {
        const siteFrameToUpdate = { ...siteFrame };

        siteFrameToUpdate.id = `epd:UK:${geoZonePeriodData.nocCode}:SiteFrame_UK_PI_STOP:sale_pois:op`;
        siteFrameToUpdate.Name.$t = `Common site elements for ${geoZonePeriodData.nocCode}: Travel Shops`

        return siteFrameToUpdate;
    };

    const updateServiceCalendarFrame = (serviceCalendarFrame: NetexObject): NetexObject => {
        const serviceCalendarFrameToUpdate = { ...serviceCalendarFrame };

        serviceCalendarFrameToUpdate.id = `epd:UK:${geoZonePeriodData.nocCode}:ServiceCalendarFrame_UK_PI_CALENDAR:sale_pois:op`;

        return serviceCalendarFrameToUpdate;
    };

    // const updateZoneFareFrame = (zoneFareFrame: NetexObject): NetexObject => {
    //     const zoneFareFrameToUpdate = { ...zoneFareFrame };

    //     zoneFareFrameToUpdate.id = `epd:UK:${matchingData.nocCode}:FareFrame_UK_PI_FARE_NETWORK:${lineIdName}:op`;
    //     zoneFareFrameToUpdate.Name = { $t: operatorPublicNameLineNameFormat };
    //     zoneFareFrameToUpdate.fareZones.FareZone = getFareZoneList(matchingData.fareZones);

    //     return zoneFareFrameToUpdate;
    // };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `epd:UK:${geoZonePeriodData.nocCode}:FareFrame_UK_PI_FARE_PRODUCT:${geoZonePeriodData.nocCode}@pass:op`;
        // priceFareFrameToUpdate.Name = { $t: operatorPublicNameLineNameFormat };
        // priceFareFrameToUpdate.PricingParameterSet = {};
        // priceFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(matchingData.fareZones);
        // priceFareFrameToUpdate.tariffs.Tariff.id = `Tariff@single@${lineIdName}`;
        // priceFareFrameToUpdate.tariffs.Tariff.validityConditions = {
        //     ValidBetween: {
        //         FromDate: { $t: currentDate.toISOString() },
        //         ToDate: { $t: new Date(currentDate.setFullYear(currentDate.getFullYear() + 99)).toISOString() },
        //     },
        // };

        // priceFareFrameToUpdate.tariffs.Tariff.Name = { $t: `${operatorPublicNameLineNameFormat} - Single Fares` };
        // priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.ref = opIdNocFormat;
        // priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.$t = matchingData.nocCode;
        // priceFareFrameToUpdate.tariffs.Tariff.LineRef.ref = matchingData.lineName;
        // priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].Name = {
        //     $t: `O/D pairs for ${matchingData.lineName}`,
        // };
        // priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].distanceMatrixElements.DistanceMatrixElement = getDistanceMatrixElements(
        //     matchingData.fareZones,
        // );
        // priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.LineRef.ref =
        //     matchingData.lineName;
        // const arrayofUserProfiles =
        //     priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1]
        //         .GenericParameterAssignment.limitations.UserProfile;
        // let userProfile;
        // // eslint-disable-next-line no-plusplus
        // for (userProfile = 1; userProfile < 4; userProfile++) {
        //     arrayofUserProfiles[userProfile].Url.$t = operatorData.website;
        // }
        // console.log(
        //     priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1]
        //         .GenericParameterAssignment.limitations.UserProfile,
        // );
        // priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage.BrandingRef.ref = `${matchingData.nocCode}@brand`;
        return priceFareFrameToUpdate;
    };

    // const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
    //     const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

    //     fareTableFareFrameToUpdate.id = `operator@Products@Trip@prices@${lineIdName}`;
    //     fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(matchingData.fareZones);
    //     fareTableFareFrameToUpdate.priceGroups.PriceGroup.push({
    //         id: `operator@Products@Trip@${lineIdName}@adults`,
    //         Name: { $t: 'A list of all the prices' },
    //         DistanceMatrixElementPriceRef: getDistanceMatrixElementsPriceRefs(matchingData.fareZones, lineIdName),
    //     });
    //     fareTableFareFrameToUpdate.fareTables.FareTable.id = `Trip@single-SOP@p-ticket@${lineIdName}@adult`;
    //     fareTableFareFrameToUpdate.fareTables.FareTable.Name.$t = serviceData.serviceDescription;
    //     fareTableFareFrameToUpdate.fareTables.FareTable.usedIn.TariffRef.ref = `Tariff@single@${lineIdName}`;
    //     fareTableFareFrameToUpdate.fareTables.FareTable.specifics.LineRef.ref = lineIdName;

    //     fareTableFareFrameToUpdate.fareTables.FareTable.columns.FareTableColumn = getFareTableElements(
    //         [...matchingData.fareZones],
    //         lineIdName,
    //         'c',
    //     );

    //     fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow = getFareTableElements(
    //         [...matchingData.fareZones].reverse(),
    //         lineIdName,
    //         'r',
    //     );

    //     fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable = getFareTables(
    //         [...matchingData.fareZones].slice(0, -1),
    //         lineIdName,
    //     );

    //     return fareTableFareFrameToUpdate;
    // };

    const generate = async (): Promise<string> => {
        const netexJson = await getNetexTemplateAsJson();

        const netexPublicationDelivery = netexJson.PublicationDelivery;

        netexPublicationDelivery.PublicationTimestamp = updatePublicationTimeStamp(netexPublicationDelivery);
        netexPublicationDelivery.PublicationRequest = updatePublicationRequest(
            netexPublicationDelivery.PublicationRequest,
        );
        // console.log(netexPublicationDelivery.PublicationTimestamp)
        // console.log(netexPublicationDelivery.PublicationRequest)

        netexPublicationDelivery.dataObjects.CompositeFrame[0] = updateCompositeFrame(
            netexPublicationDelivery.dataObjects.CompositeFrame[0],
        );
        // console.log(netexPublicationDelivery.dataObjects.CompositeFrame[0])

        const netexFrames = netexJson.PublicationDelivery.dataObjects.CompositeFrame[0].frames;
        netexFrames.SiteFrame = updateSiteFrame(netexFrames.SiteFrame);
        netexFrames.ResourceFrame = updateResourceFrame(netexFrames.ResourceFrame);
        netexFrames.ServiceCalendarFrame = updateServiceCalendarFrame(netexFrames.ServiceCalendarFrame);

        // The first FareFrame is the NetworkFareFrame which relates to the FareZone given by the user on the csvZoneUpload page.
        // netexFrames.FareFrame[0] = updateZoneFareFrame(netexFrames.FareFrame[0]);

        // The second FareFrame is the ProductFareFrame which relates to the validity/name/price of the sales offer package
        // netexFrames.FareFrame[1] = updatePriceFareFrame(netexFrames.FareFrame[1]);

        // The third FareFrame is the FareTableFareFrame which ties together each ParentFareZone/FareZone, with Prices, Validity, Media (TicketTypes) and UserTypes
        // netexFrames.FareFrame[2] = updateFareTableFareFrame(netexFrames.FareFrame[2]);

        return convertJsonToXml(netexJson);
    };

    return { generate };
};

export default periodTicketNetexGenerator;
