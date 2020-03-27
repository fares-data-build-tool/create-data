import parser from 'xml2json';
import fs from 'fs';
import { OperatorData, GeographicalFareZonePass } from '../types';
import { NetexObject, getScheduledStopPointsList, getTopographicProjectionRefList } from './periodTicketNetexHelpers';
import { getCleanWebsite } from '../sharedHelpers';

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
    const netexFileAsXmlString = parser.toXml(netexFileAsJsonString, { sanitize: true, ignoreNull: true });

    return netexFileAsXmlString;
};

const periodTicketNetexGenerator = (
    geoFareZonePass: GeographicalFareZonePass,
    operatorData: OperatorData,
): { generate: Function } => {
    const opIdNocFormat = `noc:${operatorData.opId}`;
    const nocCodeNocFormat = `noc:${geoFareZonePass.nocCode}`;
    const periodProductNameOpFormat = `op:Pass@${geoFareZonePass.productName}`;
    const currentDate = new Date(Date.now());
    const website = getCleanWebsite(operatorData.website);

    const updatePublicationTimeStamp = (publicationTimeStamp: NetexObject): NetexObject => {
        const publicationTimeStampToUpdate = { ...publicationTimeStamp };
        publicationTimeStampToUpdate.PublicationTimestamp.$t = currentDate;

        return publicationTimeStampToUpdate;
    };

    const updatePublicationRequest = (publicationRequest: NetexObject): NetexObject => {
        const publicationRequestToUpdate = { ...publicationRequest };
        publicationRequestToUpdate.RequestTimestamp.$t = currentDate;
        publicationRequestToUpdate.Description.$t = `Request for ${geoFareZonePass.nocCode} bus pass fares`;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.ref = nocCodeNocFormat;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.$t = opIdNocFormat;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.PreassignedFareProductRef.ref = periodProductNameOpFormat;

        return publicationRequestToUpdate;
    };

    const updateCompositeFrame = (compositeFrame: NetexObject): NetexObject => {
        const compositeFrameToUpdate = { ...compositeFrame };
        compositeFrameToUpdate.id = `epd:UK:${geoFareZonePass.nocCode}:CompositeFrame_UK_PI_NETWORK_FARE_OFFER:Pass@${geoFareZonePass.productName}:op`;
        compositeFrameToUpdate.Name.$t = `Fares for ${geoFareZonePass.operatorName} - ${geoFareZonePass.fareZoneName}`;
        compositeFrameToUpdate.Description.$t = `${geoFareZonePass.operatorName} - ${geoFareZonePass.fareZoneName} is accessible under a period pass. A price is given for a geographical zone, which contains a selection of stops as a fare zone.`;

        return compositeFrameToUpdate;
    };

    const updateResourceFrame = (resourceFrame: NetexObject): NetexObject => {
        const resourceFrameToUpdate = { ...resourceFrame };

        resourceFrameToUpdate.id = `epd:UK:${geoFareZonePass.nocCode}:ResourceFrame_UK_PI_COMMON:${geoFareZonePass.nocCode}:op`;
        resourceFrameToUpdate.codespaces.Codespace.XmlnsUrl.$t = website;
        resourceFrameToUpdate.dataSources.DataSource.Email.$t = operatorData.ttrteEnq;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.publicName;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.publicName;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.id = `op:${geoFareZonePass.operatorName}@brand`;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Name.$t = operatorData.publicName;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Url.$t = website;
        resourceFrameToUpdate.organisations.Operator.id = nocCodeNocFormat;
        resourceFrameToUpdate.organisations.Operator.PublicCode.$t = geoFareZonePass.nocCode;
        resourceFrameToUpdate.organisations.Operator.Name.$t = operatorData.publicName;
        resourceFrameToUpdate.organisations.Operator.ShortName.$t = geoFareZonePass.operatorName;
        resourceFrameToUpdate.organisations.Operator.TradingName.$t = operatorData.vosaPSVLicenseName; // eslint-disable-line @typescript-eslint/camelcase
        resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = operatorData.fareEnq;
        resourceFrameToUpdate.organisations.Operator.ContactDetails.Url.$t = website;
        resourceFrameToUpdate.organisations.Operator.Address.Street.$t = operatorData.complEnq;
        resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = (operatorData.mode).toLowerCase();

        return resourceFrameToUpdate;
    };

    const updateSiteFrame = (siteFrame: NetexObject): NetexObject => {
        const siteFrameToUpdate = { ...siteFrame };

        siteFrameToUpdate.id = `epd:UK:${geoFareZonePass.nocCode}:SiteFrame_UK_PI_STOP:sale_pois:op`;
        siteFrameToUpdate.Name.$t = `Common site elements for ${geoFareZonePass.nocCode}: Travel Shops`;

        return siteFrameToUpdate;
    };

    const updateServiceCalendarFrame = (serviceCalendarFrame: NetexObject): NetexObject => {
        const serviceCalendarFrameToUpdate = { ...serviceCalendarFrame };

        serviceCalendarFrameToUpdate.id = `epd:UK:${geoFareZonePass.nocCode}:ServiceCalendarFrame_UK_PI_CALENDAR:sale_pois:op`;

        return serviceCalendarFrameToUpdate;
    };

    const updateNetworkFareFrame = (networkFareFrame: NetexObject): NetexObject => {
        const networkFareFrameToUpdate = { ...networkFareFrame };
        const parentFareZoneLocality =
            geoFareZonePass.stops[0].parentLocalityName !== ''
                ? geoFareZonePass.stops[0].parentLocalityName
                : geoFareZonePass.stops[0].localityName;

        networkFareFrameToUpdate.id = `epd:UK:${geoFareZonePass.nocCode}:FareFrame_UK_PI_FARE_NETWORK:${geoFareZonePass.productName}@pass:op`;
        networkFareFrameToUpdate.Name.$t = `${geoFareZonePass.productName} Network`;
        networkFareFrameToUpdate.prerequisites.ResourceFrameRef.ref = `epd:UK:${geoFareZonePass.nocCode}:ResourceFrame_UK_PI_COMMON:${geoFareZonePass.nocCode}:op`;

        networkFareFrameToUpdate.fareZones.FareZone[0].id = `op:${geoFareZonePass.productName}@${parentFareZoneLocality}`;
        networkFareFrameToUpdate.fareZones.FareZone[0].Name.$t = parentFareZoneLocality;
        networkFareFrameToUpdate.fareZones.FareZone[0].Description.$t = `${parentFareZoneLocality} ${geoFareZonePass.productName} Parent Fare Zone`;
        networkFareFrameToUpdate.fareZones.FareZone[0].projections.TopographicProjectionRef = getTopographicProjectionRefList(
            geoFareZonePass.stops,
        );

        networkFareFrameToUpdate.fareZones.FareZone[1].id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}`;
        networkFareFrameToUpdate.fareZones.FareZone[1].Name.$t = `${geoFareZonePass.fareZoneName}`;
        networkFareFrameToUpdate.fareZones.FareZone[1].Description.$t = `${geoFareZonePass.fareZoneName} ${geoFareZonePass.productName} Zone`;
        networkFareFrameToUpdate.fareZones.FareZone[1].members.ScheduledStopPointRef = getScheduledStopPointsList(
            geoFareZonePass.stops,
        );
        networkFareFrameToUpdate.fareZones.FareZone[1].projections.TopographicProjectionRef = getTopographicProjectionRefList(
            geoFareZonePass.stops,
        );
        networkFareFrameToUpdate.fareZones.FareZone[1].ParentFareZoneRef.ref = `op:${parentFareZoneLocality}`;

        return networkFareFrameToUpdate;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `epd:UK:${geoFareZonePass.nocCode}:FareFrame_UK_PI_FARE_PRODUCT:${geoFareZonePass.productName}@pass:op`;
        priceFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${geoFareZonePass.nocCode}:FareFrame_UK_PI_FARE_NETWORK:${geoFareZonePass.productName}@pass:op`;
        priceFareFrameToUpdate.tariffs.Tariff.id = `op:Tariff@${geoFareZonePass.productName}`;
        priceFareFrameToUpdate.tariffs.Tariff.validityConditions = {
            ValidBetween: {
                FromDate: { $t: currentDate.toISOString() },
                ToDate: { $t: new Date(currentDate.setFullYear(currentDate.getFullYear() + 99)).toISOString() },
            },
        };
        priceFareFrameToUpdate.tariffs.Tariff.Name.$t = `${geoFareZonePass.productName} - Tariff`;
        priceFareFrameToUpdate.tariffs.Tariff.Description.$t = `${geoFareZonePass.productName} single zone tariff`;
        priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.ref = nocCodeNocFormat;
        priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.$t = opIdNocFormat;
        priceFareFrameToUpdate.tariffs.Tariff.geographicalIntervals.GeographicalInterval.id = `op:Tariff@${geoFareZonePass.productName}@1zone`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[0].id = `op:Tariff@${geoFareZonePass.productName}@1day`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[1].id = `op:Tariff@${geoFareZonePass.productName}@1week`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[2].id = `op:Tariff@${geoFareZonePass.productName}@4week`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[3].id = `op:Tariff@${geoFareZonePass.productName}@1year`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[4].id = `op:Tariff@${geoFareZonePass.productName}@1term`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[5].id = `op:Tariff@${geoFareZonePass.productName}@1academic_year`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].id = `op:Tariff@${geoFareZonePass.productName}@access_zones`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.id = `op:Tariff@${geoFareZonePass.productName}@access_zones`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.FareZoneRef.ref = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].id = `op:Tariff@${geoFareZonePass.productName}@eligibility`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].GenericParameterAssignment.id = `op:Tariff@${geoFareZonePass.productName}@eligibitity`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].id = `op:Tariff@${geoFareZonePass.productName}@durations@adult`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].timeIntervals.TimeIntervalRef[0].ref = `op:Tariff@${geoFareZonePass.productName}@1day`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].timeIntervals.TimeIntervalRef[1].ref = `op:Tariff@${geoFareZonePass.productName}@1week`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].timeIntervals.TimeIntervalRef[2].ref = `op:Tariff@${geoFareZonePass.productName}@4week`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].timeIntervals.TimeIntervalRef[3].ref = `op:Tariff@${geoFareZonePass.productName}@1year`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.id = `op:Tariff@${geoFareZonePass.productName}@adult_or_child`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[3].id = `op:Tariff@${geoFareZonePass.productName}@durations@adult_cash`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[3].timeIntervals.TimeIntervalRef[0].ref = `op:Tariff@${geoFareZonePass.productName}@1day`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[3].timeIntervals.TimeIntervalRef[1].ref = `op:Tariff@${geoFareZonePass.productName}@1week`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[3].GenericParameterAssignment.id = `op:Pass@${geoFareZonePass.productName}@duration@1D_1W`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].id = `op:Tariff@${geoFareZonePass.productName}@conditions_of_travel`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].GenericParameterAssignment.id = `op:Tariff@${geoFareZonePass.productName}@conditions_of_travel`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].GenericParameterAssignment.limitations.Transferability.id = `op:Pass@${geoFareZonePass.productName}@transferability`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].GenericParameterAssignment.limitations.FrequencyOfUse.id = `op:Pass@${geoFareZonePass.productName}@frequency`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].GenericParameterAssignment.limitations.Interchanging.id = `op:Pass@${geoFareZonePass.productName}@interchanging`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.id = `op:Pass@${geoFareZonePass.productName}`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.Name.$t = `${geoFareZonePass.productName} Pass`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.OperatorRef.ref = nocCodeNocFormat;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.OperatorRef.$t = opIdNocFormat;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.id = `op:Pass@${geoFareZonePass.productName}@travel`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[0].ref = `op:Tariff@${geoFareZonePass.productName}@access_zones`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[1].ref = `op:Tariff@${geoFareZonePass.productName}@eligibility`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[2].ref = `op:Tariff@${geoFareZonePass.productName}@durations@adult`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[3].ref = `op:Tariff@${geoFareZonePass.productName}@durations@adult_cash`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[4].ref = `op:Tariff@${geoFareZonePass.productName}@conditions_of_travel`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.accessRightsInProduct.AccessRightInProduct.id = `op:Pass@${geoFareZonePass.productName}@travel`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.accessRightsInProduct.AccessRightInProduct.ValidableElementRef.ref = `op:Pass@${geoFareZonePass.productName}@travel`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].id = `op:Pass@${geoFareZonePass.productName}-SOP@p-ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].BrandingRef.ref = `op:${geoFareZonePass.operatorName}@brand`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].Name.$t = `${geoFareZonePass.productName} - paper ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].distributionAssignments.DistributionAssignment[0].id = `op:Pass@${geoFareZonePass.productName}-GSOP@p-ticket@on_board`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].distributionAssignments.DistributionAssignment[1].id = `op:Pass@${geoFareZonePass.productName}-GSOP@p-ticket@travel_shop`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].salesOfferPackageElements.SalesOfferPackageElement.id = `op:Pass@${geoFareZonePass.productName}-SOP@p-ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].salesOfferPackageElements.SalesOfferPackageElement.PreassignedFareProductRef.ref = `op:Pass@${geoFareZonePass.productName}`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].id = `op:Pass@${geoFareZonePass.productName}-SOP@m-ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].BrandingRef.ref = `op:${geoFareZonePass.operatorName}@brand`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].Name.$t = `${geoFareZonePass.productName} - mobile app`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].distributionAssignments.DistributionAssignment.id = `op:Pass@${geoFareZonePass.productName}-GSOP@m-ticket@mobile_app`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].salesOfferPackageElements.SalesOfferPackageElement.id = `op:Pass@${geoFareZonePass.productName}Pass-SOP@m-ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].salesOfferPackageElements.SalesOfferPackageElement.PreassignedFareProductRef.ref = `op:Pass@${geoFareZonePass.productName}`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].id = `op:Pass@${geoFareZonePass.productName}-SOP@subscription`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].Name.$t = `${operatorData.publicName} Unlimited`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].validityParameterAssignments.GenericParameterAssignment.id = `op:Pass@${geoFareZonePass.productName}-SOP@subscription@subscribing`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].validityParameterAssignments.GenericParameterAssignment.limitations.Subscribing.id = `op:Pass@${geoFareZonePass.productName}-SOP@subscription@subscribing`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].validityParameterAssignments.GenericParameterAssignment.limitations.Subscribing.possibleInstallmenttIntervals.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@4week`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].distributionAssignments.DistributionAssignment.id = `op:Pass@${geoFareZonePass.productName}-GSOP@subscription@online`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].salesOfferPackageElements.SalesOfferPackageElement.id = `op:Pass@${geoFareZonePass.productName}-SOP@subscription`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].salesOfferPackageElements.SalesOfferPackageElement.PreassignedFareProductRef.ref = `op:Pass@${geoFareZonePass.productName}`;

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

        fareTableFareFrameToUpdate.id = `epd:UK:${geoFareZonePass.nocCode}:FareFrame_UK_PI_FARE_PRICE:${geoFareZonePass.productName}@pass:op`;
        fareTableFareFrameToUpdate.Name.$t = `${geoFareZonePass.productName} Prices`;
        fareTableFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${geoFareZonePass.nocCode}:FareFrame_UK_PI_FARE_PRODUCT:${geoFareZonePass.productName}@pass:op`;
        fareTableFareFrameToUpdate.PricingParameterSet.id = `op:Pass@${geoFareZonePass.productName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.id = `op:Pass@${geoFareZonePass.productName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.Name.$t = `${geoFareZonePass.productName} Fares`;
        fareTableFareFrameToUpdate.fareTables.FareTable.pricesFor.PreassignedFareProductRef.ref = `op:Pass@${geoFareZonePass.productName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.usedIn.TariffRef.ref = `op:Tariff@${geoFareZonePass.productName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[0].id = `op:${geoFareZonePass.productName}@1day`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[0].representing.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@1day`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[1].id = `op:${geoFareZonePass.productName}@1week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[1].representing.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@1week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[2].id = `op:${geoFareZonePass.productName}@4week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[2].representing.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@4week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[3].id = `op:${geoFareZonePass.productName}@4week-Unlimited`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[3].representing.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@4week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[4].id = `op:${geoFareZonePass.productName}@1year`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[4].representing.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@1year`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[5].id = `op:${geoFareZonePass.productName}@1term`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[5].representing.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@1term`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[6].id = `op:${geoFareZonePass.productName}@1academic_year`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[6].representing.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@1academic_year`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.Name.$t = geoFareZonePass.fareZoneName;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.specifics.TariffZoneRef.ref = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.columns.FareTableColumn.id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.columns.FareTableColumn.Name.$t =
            geoFareZonePass.fareZoneName;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.columns.FareTableColumn.representing.TariffZoneRef.ref = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.Name.$t = `${geoFareZonePass.productName} - Cash`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.pricesFor.SalesOfferPackageRef.ref = `op:Pass@${geoFareZonePass.productName}-SOP@p-ticket`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.columns.FareTableColumn.id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket@adult`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.Name.$t = `${geoFareZonePass.productName} - Cash - Adult`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.columns.FareTableColumn.id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket@adult`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[0].id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket@adult@1day`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[0].TimeIntervalPrice.id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket@adult@1day`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[0].TimeIntervalPrice.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@1day`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[0].ColumnRef.ref = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket@adult`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[0].RowRef.ref = `op:${geoFareZonePass.productName}@1day`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[1].id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket@adult@1week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[1].TimeIntervalPrice.id = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket@adult@1week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[1].TimeIntervalPrice.TimeIntervalRef.ref = `op:Tariff@${geoFareZonePass.productName}@1week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[1].ColumnRef.ref = `op:${geoFareZonePass.productName}@${geoFareZonePass.fareZoneName}@p-ticket@adult`;
        fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable.includes.FareTable.includes.FareTable.cells.Cell[1].RowRef.ref = `op:${geoFareZonePass.productName}@1week`;

        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        const netexJson = await getNetexTemplateAsJson();

        netexJson.PublicationDelivery = updatePublicationTimeStamp(netexJson.PublicationDelivery);
        netexJson.PublicationDelivery.PublicationRequest = updatePublicationRequest(
            netexJson.PublicationDelivery.PublicationRequest,
        );
        netexJson.PublicationDelivery.dataObjects.CompositeFrame[0] = updateCompositeFrame(
            netexJson.PublicationDelivery.dataObjects.CompositeFrame[0],
        );

        const netexFrames = netexJson.PublicationDelivery.dataObjects.CompositeFrame[0].frames;
        netexFrames.SiteFrame = updateSiteFrame(netexFrames.SiteFrame);
        netexFrames.ResourceFrame = updateResourceFrame(netexFrames.ResourceFrame);
        netexFrames.ServiceCalendarFrame = updateServiceCalendarFrame(netexFrames.ServiceCalendarFrame);

        // The first FareFrame is the NetworkFareFrame which relates to the FareZone given by the user on the csvZoneUpload page.
        netexFrames.FareFrame[0] = updateNetworkFareFrame(netexFrames.FareFrame[0]);

        // The second FareFrame is the ProductFareFrame which relates to the validity/name/price of the sales offer package
        netexFrames.FareFrame[1] = updatePriceFareFrame(netexFrames.FareFrame[1]);

        // The third FareFrame is the FareTableFareFrame which ties together each ParentFareZone/FareZone, with Prices, Validity, Media (TicketTypes) and UserTypes
        netexFrames.FareFrame[2] = updateFareTableFareFrame(netexFrames.FareFrame[2]);

        return convertJsonToXml(netexJson);
    };

    return { generate };
};

export default periodTicketNetexGenerator;
