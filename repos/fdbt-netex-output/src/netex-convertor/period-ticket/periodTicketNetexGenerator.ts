import { OperatorData, PeriodTicket, PeriodGeoZoneTicket, PeriodMultipleServicesTicket } from '../types';
import {
    getScheduledStopPointsList,
    getTopographicProjectionRefList,
    getLinesList,
    getLineRefList,
    getGeoZoneFareTable,
    getMultiServiceFareTable,
} from './periodTicketNetexHelpers';
import { NetexObject, getCleanWebsite, getNetexTemplateAsJson, convertJsonToXml } from '../sharedHelpers';

const periodTicketNetexGenerator = (
    userPeriodTicket: PeriodTicket,
    operatorData: OperatorData,
): { generate: Function } => {
    const opIdNocFormat = `noc:${operatorData.opId}`;
    const nocCodeNocFormat = `noc:${userPeriodTicket.nocCode}`;
    const periodProductNameOpFormat = `op:Pass@${userPeriodTicket.productName}`;
    const lineIdName = `Line_${userPeriodTicket.productName}`;
    const currentDate = new Date(Date.now());
    const website = getCleanWebsite(operatorData.website);

    const isGeoZoneTicket = (ticket: PeriodTicket): ticket is PeriodGeoZoneTicket =>
        (ticket as PeriodGeoZoneTicket).zoneName !== undefined;

    const isMultiServiceTicket = (ticket: PeriodTicket): ticket is PeriodMultipleServicesTicket =>
        (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

    const updatePublicationTimeStamp = (publicationTimeStamp: NetexObject): NetexObject => {
        const publicationTimeStampToUpdate = { ...publicationTimeStamp };
        publicationTimeStampToUpdate.PublicationTimestamp.$t = currentDate;

        return publicationTimeStampToUpdate;
    };

    const updatePublicationRequest = (publicationRequest: NetexObject): NetexObject => {
        const publicationRequestToUpdate = { ...publicationRequest };
        publicationRequestToUpdate.RequestTimestamp.$t = currentDate;
        publicationRequestToUpdate.Description.$t = `Request for ${userPeriodTicket.nocCode} bus pass fares`;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.ref = nocCodeNocFormat;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.$t = opIdNocFormat;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.PreassignedFareProductRef.ref = periodProductNameOpFormat;

        return publicationRequestToUpdate;
    };

    const updateCompositeFrame = (compositeFrame: NetexObject): NetexObject => {
        const compositeFrameToUpdate = { ...compositeFrame };
        compositeFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:CompositeFrame_UK_PI_NETWORK_FARE_OFFER:Pass@${userPeriodTicket.productName}:op`;
        compositeFrameToUpdate.Name.$t = `Fares for ${userPeriodTicket.operatorName}`;
        compositeFrameToUpdate.Description.$t = `Period ticket for ${userPeriodTicket.operatorName}`;

        return compositeFrameToUpdate;
    };

    const updateResourceFrame = (resourceFrame: NetexObject): NetexObject => {
        const resourceFrameToUpdate = { ...resourceFrame };

        resourceFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:ResourceFrame_UK_PI_COMMON:${userPeriodTicket.nocCode}:op`;
        resourceFrameToUpdate.codespaces.Codespace.XmlnsUrl.$t = website;
        resourceFrameToUpdate.dataSources.DataSource.Email.$t = operatorData.ttrteEnq;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.operatorPublicName;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.operatorPublicName;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.id = `op:${userPeriodTicket.operatorName}@brand`;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Name.$t = operatorData.operatorPublicName;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Url.$t = website;
        resourceFrameToUpdate.organisations.Operator.id = nocCodeNocFormat;
        resourceFrameToUpdate.organisations.Operator.PublicCode.$t = userPeriodTicket.nocCode;
        resourceFrameToUpdate.organisations.Operator.Name.$t = operatorData.operatorPublicName;
        resourceFrameToUpdate.organisations.Operator.ShortName.$t = userPeriodTicket.operatorName;
        resourceFrameToUpdate.organisations.Operator.TradingName.$t = operatorData.vosaPsvLicenseName; // eslint-disable-line @typescript-eslint/camelcase
        resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = operatorData.fareEnq;
        resourceFrameToUpdate.organisations.Operator.ContactDetails.Url.$t = website;
        resourceFrameToUpdate.organisations.Operator.Address.Street.$t = operatorData.complEnq;
        resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = operatorData.mode.toLowerCase();

        return resourceFrameToUpdate;
    };

    const updateSiteFrame = (siteFrame: NetexObject): NetexObject => {
        const siteFrameToUpdate = { ...siteFrame };

        siteFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:SiteFrame_UK_PI_STOP:sale_pois:op`;
        siteFrameToUpdate.Name.$t = `Common site elements for ${userPeriodTicket.nocCode}: Travel Shops`;

        return siteFrameToUpdate;
    };

    const updateServiceCalendarFrame = (serviceCalendarFrame: NetexObject): NetexObject => {
        const serviceCalendarFrameToUpdate = { ...serviceCalendarFrame };

        serviceCalendarFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:ServiceCalendarFrame_UK_PI_CALENDAR:sale_pois:op`;

        return serviceCalendarFrameToUpdate;
    };

    const updateServiceFrame = (serviceFrame: NetexObject): NetexObject | null => {
        if (isMultiServiceTicket(userPeriodTicket)) {
            const serviceFrameToUpdate = { ...serviceFrame };
            serviceFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:ServiceFrame_UK_PI_NETWORK:${lineIdName}:op`;

            serviceFrameToUpdate.lines.Line = getLinesList(userPeriodTicket, operatorData);

            return serviceFrameToUpdate;
        }

        return null;
    };

    const updateNetworkFareFrame = (networkFareFrame: NetexObject): NetexObject | null => {
        if (isGeoZoneTicket(userPeriodTicket)) {
            const networkFareFrameToUpdate = { ...networkFareFrame };
            const parentFareZoneLocality =
                userPeriodTicket.stops[0].parentLocalityName !== ''
                    ? userPeriodTicket.stops[0].parentLocalityName
                    : userPeriodTicket.stops[0].localityName;

            networkFareFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:FareFrame_UK_PI_FARE_NETWORK:${userPeriodTicket.productName}@pass:op`;
            networkFareFrameToUpdate.Name.$t = `${userPeriodTicket.productName} Network`;
            networkFareFrameToUpdate.prerequisites.ResourceFrameRef.ref = `epd:UK:${userPeriodTicket.nocCode}:ResourceFrame_UK_PI_COMMON:${userPeriodTicket.nocCode}:op`;

            networkFareFrameToUpdate.fareZones.FareZone[0].id = `op:${userPeriodTicket.productName}@${parentFareZoneLocality}`;
            networkFareFrameToUpdate.fareZones.FareZone[0].Name.$t = parentFareZoneLocality;
            networkFareFrameToUpdate.fareZones.FareZone[0].Description.$t = `${parentFareZoneLocality} ${userPeriodTicket.productName} Parent Fare Zone`;
            networkFareFrameToUpdate.fareZones.FareZone[0].projections.TopographicProjectionRef = getTopographicProjectionRefList(
                userPeriodTicket.stops,
            );

            networkFareFrameToUpdate.fareZones.FareZone[1].id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}`;
            networkFareFrameToUpdate.fareZones.FareZone[1].Name.$t = `${userPeriodTicket.zoneName}`;
            networkFareFrameToUpdate.fareZones.FareZone[1].Description.$t = `${userPeriodTicket.zoneName} ${userPeriodTicket.productName} Zone`;
            networkFareFrameToUpdate.fareZones.FareZone[1].members.ScheduledStopPointRef = getScheduledStopPointsList(
                userPeriodTicket.stops,
            );
            networkFareFrameToUpdate.fareZones.FareZone[1].projections.TopographicProjectionRef = getTopographicProjectionRefList(
                userPeriodTicket.stops,
            );
            networkFareFrameToUpdate.fareZones.FareZone[1].ParentFareZoneRef.ref = `op:${parentFareZoneLocality}`;

            return networkFareFrameToUpdate;
        }

        return null;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:FareFrame_UK_PI_FARE_PRODUCT:${userPeriodTicket.productName}@pass:op`;

        if (isGeoZoneTicket(userPeriodTicket)) {
            priceFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${userPeriodTicket.nocCode}:FareFrame_UK_PI_FARE_NETWORK:${userPeriodTicket.productName}@pass:op`;
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            priceFareFrameToUpdate.prerequisites = null;
        }
        priceFareFrameToUpdate.tariffs.Tariff.id = `op:Tariff@${userPeriodTicket.productName}`;
        priceFareFrameToUpdate.tariffs.Tariff.validityConditions = {
            ValidBetween: {
                FromDate: { $t: currentDate.toISOString() },
                ToDate: { $t: new Date(currentDate.setFullYear(currentDate.getFullYear() + 99)).toISOString() },
            },
        };
        priceFareFrameToUpdate.tariffs.Tariff.Name.$t = `${userPeriodTicket.productName} - Tariff`;
        priceFareFrameToUpdate.tariffs.Tariff.Description.$t = `${userPeriodTicket.productName} single zone tariff`;
        priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.ref = nocCodeNocFormat;
        priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.$t = opIdNocFormat;
        priceFareFrameToUpdate.tariffs.Tariff.geographicalIntervals.GeographicalInterval.id = `op:Tariff@${userPeriodTicket.productName}@1zone`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[0].id = `op:Tariff@${userPeriodTicket.productName}@1day`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[1].id = `op:Tariff@${userPeriodTicket.productName}@1week`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[2].id = `op:Tariff@${userPeriodTicket.productName}@4week`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[3].id = `op:Tariff@${userPeriodTicket.productName}@1year`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[4].id = `op:Tariff@${userPeriodTicket.productName}@1term`;
        priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval[5].id = `op:Tariff@${userPeriodTicket.productName}@1academic_year`;

        if (isGeoZoneTicket(userPeriodTicket)) {
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].id = `op:Tariff@${userPeriodTicket.productName}@access_zones`;
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.id = `op:Tariff@${userPeriodTicket.productName}@access_zones`;
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.FareZoneRef.ref = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}`;
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0] = {
                version: '1.0',
                id: `op:Tariff@${userPeriodTicket.productName}@access_lines`,
            };
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].TypeOfFareStructureElementRef = {
                version: 'fxc:v1.0',
                ref: 'fxc:access',
            };
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment = {
                id: `Tariff@${userPeriodTicket.productName}@access_lines`,
                version: '1.0',
                order: '1',
            };
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.TypeOfAccessRightAssignmentRef = {
                version: 'fxc:v1.0',
                ref: 'fxc:can_access',
            };

            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.ValidityParameterGroupingType = {
                $t: 'OR',
            };

            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters = {
                LineRef: getLineRefList(userPeriodTicket),
            };
        }

        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].id = `op:Tariff@${userPeriodTicket.productName}@eligibility`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].GenericParameterAssignment.id = `op:Tariff@${userPeriodTicket.productName}@eligibitity`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].id = `op:Tariff@${userPeriodTicket.productName}@durations@adult`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].timeIntervals.TimeIntervalRef[0].ref = `op:Tariff@${userPeriodTicket.productName}@1day`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].timeIntervals.TimeIntervalRef[1].ref = `op:Tariff@${userPeriodTicket.productName}@1week`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].timeIntervals.TimeIntervalRef[2].ref = `op:Tariff@${userPeriodTicket.productName}@4week`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].timeIntervals.TimeIntervalRef[3].ref = `op:Tariff@${userPeriodTicket.productName}@1year`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.id = `op:Tariff@${userPeriodTicket.productName}@adult_or_child`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[3].id = `op:Tariff@${userPeriodTicket.productName}@durations@adult_cash`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[3].timeIntervals.TimeIntervalRef[0].ref = `op:Tariff@${userPeriodTicket.productName}@1day`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[3].timeIntervals.TimeIntervalRef[1].ref = `op:Tariff@${userPeriodTicket.productName}@1week`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[3].GenericParameterAssignment.id = `op:Pass@${userPeriodTicket.productName}@duration@1D_1W`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].id = `op:Tariff@${userPeriodTicket.productName}@conditions_of_travel`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].GenericParameterAssignment.id = `op:Tariff@${userPeriodTicket.productName}@conditions_of_travel`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].GenericParameterAssignment.limitations.Transferability.id = `op:Pass@${userPeriodTicket.productName}@transferability`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].GenericParameterAssignment.limitations.FrequencyOfUse.id = `op:Pass@${userPeriodTicket.productName}@frequency`;
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[4].GenericParameterAssignment.limitations.Interchanging.id = `op:Pass@${userPeriodTicket.productName}@interchanging`;

        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.id = `op:Pass@${userPeriodTicket.productName}`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.Name.$t = `${userPeriodTicket.productName} Pass`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.OperatorRef.ref = nocCodeNocFormat;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.OperatorRef.$t = opIdNocFormat;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.id = `op:Pass@${userPeriodTicket.productName}@travel`;

        if (isGeoZoneTicket(userPeriodTicket)) {
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[0].ref = `op:Tariff@${userPeriodTicket.productName}@access_zones`;
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[0].ref = `op:Tariff@${userPeriodTicket.productName}@access_lines`;
        }
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[1].ref = `op:Tariff@${userPeriodTicket.productName}@eligibility`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[2].ref = `op:Tariff@${userPeriodTicket.productName}@durations@adult`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[3].ref = `op:Tariff@${userPeriodTicket.productName}@durations@adult_cash`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[4].ref = `op:Tariff@${userPeriodTicket.productName}@conditions_of_travel`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.accessRightsInProduct.AccessRightInProduct.id = `op:Pass@${userPeriodTicket.productName}@travel`;
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.accessRightsInProduct.AccessRightInProduct.ValidableElementRef.ref = `op:Pass@${userPeriodTicket.productName}@travel`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].id = `op:Pass@${userPeriodTicket.productName}-SOP@p-ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].BrandingRef.ref = `op:${userPeriodTicket.operatorName}@brand`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].Name.$t = `${userPeriodTicket.productName} - paper ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].distributionAssignments.DistributionAssignment[0].id = `op:Pass@${userPeriodTicket.productName}-GSOP@p-ticket@on_board`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].distributionAssignments.DistributionAssignment[1].id = `op:Pass@${userPeriodTicket.productName}-GSOP@p-ticket@travel_shop`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].salesOfferPackageElements.SalesOfferPackageElement.id = `op:Pass@${userPeriodTicket.productName}-SOP@p-ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[0].salesOfferPackageElements.SalesOfferPackageElement.PreassignedFareProductRef.ref = `op:Pass@${userPeriodTicket.productName}`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].id = `op:Pass@${userPeriodTicket.productName}-SOP@m-ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].BrandingRef.ref = `op:${userPeriodTicket.operatorName}@brand`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].Name.$t = `${userPeriodTicket.productName} - mobile app`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].distributionAssignments.DistributionAssignment.id = `op:Pass@${userPeriodTicket.productName}-GSOP@m-ticket@mobile_app`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].salesOfferPackageElements.SalesOfferPackageElement.id = `op:Pass@${userPeriodTicket.productName}Pass-SOP@m-ticket`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[1].salesOfferPackageElements.SalesOfferPackageElement.PreassignedFareProductRef.ref = `op:Pass@${userPeriodTicket.productName}`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].id = `op:Pass@${userPeriodTicket.productName}-SOP@subscription`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].Name.$t = `${operatorData.operatorPublicName} Unlimited`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].validityParameterAssignments.GenericParameterAssignment.id = `op:Pass@${userPeriodTicket.productName}-SOP@subscription@subscribing`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].validityParameterAssignments.GenericParameterAssignment.limitations.Subscribing.id = `op:Pass@${userPeriodTicket.productName}-SOP@subscription@subscribing`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].validityParameterAssignments.GenericParameterAssignment.limitations.Subscribing.possibleInstallmenttIntervals.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@4week`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].distributionAssignments.DistributionAssignment.id = `op:Pass@${userPeriodTicket.productName}-GSOP@subscription@online`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].salesOfferPackageElements.SalesOfferPackageElement.id = `op:Pass@${userPeriodTicket.productName}-SOP@subscription`;
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage[2].salesOfferPackageElements.SalesOfferPackageElement.PreassignedFareProductRef.ref = `op:Pass@${userPeriodTicket.productName}`;

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

        fareTableFareFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:FareFrame_UK_PI_FARE_PRICE:${userPeriodTicket.productName}@pass:op`;
        fareTableFareFrameToUpdate.Name.$t = `${userPeriodTicket.productName} Prices`;
        fareTableFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${userPeriodTicket.nocCode}:FareFrame_UK_PI_FARE_PRODUCT:${userPeriodTicket.productName}@pass:op`;
        fareTableFareFrameToUpdate.PricingParameterSet.id = `op:Pass@${userPeriodTicket.productName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.id = `op:Pass@${userPeriodTicket.productName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.Name.$t = `${userPeriodTicket.productName} Fares`;
        fareTableFareFrameToUpdate.fareTables.FareTable.pricesFor.PreassignedFareProductRef.ref = `op:Pass@${userPeriodTicket.productName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.usedIn.TariffRef.ref = `op:Tariff@${userPeriodTicket.productName}`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[0].id = `op:${userPeriodTicket.productName}@1day`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[0].representing.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1day`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[1].id = `op:${userPeriodTicket.productName}@1week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[1].representing.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[2].id = `op:${userPeriodTicket.productName}@4week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[2].representing.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@4week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[3].id = `op:${userPeriodTicket.productName}@4week-Unlimited`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[3].representing.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@4week`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[4].id = `op:${userPeriodTicket.productName}@1year`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[4].representing.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1year`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[5].id = `op:${userPeriodTicket.productName}@1term`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[5].representing.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1term`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[6].id = `op:${userPeriodTicket.productName}@1academic_year`;
        fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow[6].representing.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1academic_year`;

        if (isGeoZoneTicket(userPeriodTicket)) {
            fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable = getGeoZoneFareTable(
                userPeriodTicket,
                fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable,
            );
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable = getMultiServiceFareTable(
                userPeriodTicket,
                fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable,
            );
        }

        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        const netexJson = await getNetexTemplateAsJson('period-ticket/periodTicketNetexTemplate.xml');

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

        netexFrames.ServiceFrame = updateServiceFrame(netexFrames.ServiceFrame);

        // Multi Service does not need a Network Frame
        if (isGeoZoneTicket(userPeriodTicket)) {
            netexFrames.FareFrame = [
                updateNetworkFareFrame(netexFrames.FareFrame[0]),
                updatePriceFareFrame(netexFrames.FareFrame[1]),
                updateFareTableFareFrame(netexFrames.FareFrame[2]),
            ];
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            netexFrames.FareFrame = [
                updatePriceFareFrame(netexFrames.FareFrame[1]),
                updateFareTableFareFrame(netexFrames.FareFrame[2]),
            ];
        }

        return convertJsonToXml(netexJson);
    };

    return { generate };
};

export default periodTicketNetexGenerator;
