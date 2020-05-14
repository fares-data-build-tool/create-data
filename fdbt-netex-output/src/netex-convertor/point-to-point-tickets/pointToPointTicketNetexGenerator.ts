import {
    FareZoneList,
    MatchingData,
    MatchingReturnData,
    MatchingSingleData,
    OperatorData,
    ScheduledStopPoints,
} from '../types';
import {
    getDistanceMatrixElements,
    getFareTableElements,
    getFareTables,
    getFareZoneList,
    getNetexMode,
    getPriceGroups,
    getScheduledStopPointsList,
} from './pointToPointTicketNetexHelpers';
import { convertJsonToXml, getCleanWebsite, getNetexTemplateAsJson, NetexObject } from '../sharedHelpers';

const isReturnTicket = (ticket: MatchingData): ticket is MatchingReturnData =>
    ((ticket as MatchingReturnData).inboundFareZones !== undefined &&
        (ticket as MatchingReturnData).inboundFareZones.length > 0) ||
    ((ticket as MatchingReturnData).outboundFareZones !== undefined &&
        (ticket as MatchingReturnData).outboundFareZones.length > 0);

const isSingleTicket = (ticket: MatchingData): ticket is MatchingSingleData =>
    (ticket as MatchingSingleData).fareZones !== undefined && (ticket as MatchingSingleData).fareZones.length > 0;

const pointToPointTicketNetexGenerator = (
    matchingData: MatchingData,
    operatorData: OperatorData,
): { generate: Function } => {
    const opIdNocFormat = `noc:${operatorData.opId}`;
    const nocCodeNocFormat = `noc:${matchingData.nocCode}`;
    const opIdBrandFormat = `${operatorData.opId}@brand`;
    const operatorPublicNameLineNameFormat = `${operatorData.operatorPublicName} ${matchingData.lineName}`;
    const noccodeLineNameFormat = `${matchingData.nocCode}_${matchingData.lineName}`;
    const lineIdName = `Line_${matchingData.lineName}`;
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
        publicationRequestToUpdate.Description.$t = `Request for ${matchingData.nocCode} ${lineIdName}.`;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.ref = nocCodeNocFormat;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.$t = opIdNocFormat;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.LineRef.ref =
            matchingData.lineName;

        return publicationRequestToUpdate;
    };

    const updateCompositeFrame = (compositeFrame: NetexObject): NetexObject => {
        const compositeFrameToUpdate = { ...compositeFrame };
        compositeFrameToUpdate.id = `epd:UK:${matchingData.nocCode}:CompositeFrame_UK_PI_LINE_FARE_OFFER:Trip@${lineIdName}:op`;
        compositeFrameToUpdate.Name.$t = `Fares for ${lineIdName}`;

        if (isReturnTicket(matchingData)) {
            compositeFrameToUpdate.Description.$t = `${matchingData.nocCode} ${lineIdName} is a accessible as a return trip fare.  Prices are given zone to zone, where each zone is a linear group of stops, i.e. fare stage.`;
        } else if (isSingleTicket(matchingData)) {
            compositeFrameToUpdate.Description.$t = `${matchingData.nocCode} ${lineIdName} is a accessible as a single trip fare.  Prices are given zone to zone, where each zone is a linear group of stops, i.e. fare stage.`;
        }

        return compositeFrameToUpdate;
    };

    const updateResourceFrame = (resourceFrame: NetexObject): NetexObject => {
        const resourceFrameToUpdate = { ...resourceFrame };
        resourceFrameToUpdate.id = `epd:UK:${matchingData.nocCode}:ResourceFrame_UK_PI_COMMON:op`;
        resourceFrameToUpdate.codespaces.Codespace.XmlnsUrl.$t = website;
        resourceFrameToUpdate.dataSources.DataSource.Email.$t = operatorData.ttrteEnq;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.operatorPublicName;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            operatorData.operatorPublicName;
        resourceFrameToUpdate.typesOfValue.ValueSet.values.Branding.id = opIdBrandFormat;
        resourceFrameToUpdate.organisations.Operator.id = nocCodeNocFormat;
        resourceFrameToUpdate.organisations.Operator.PublicCode.$t = matchingData.nocCode;
        resourceFrameToUpdate.organisations.Operator.Name.$t = operatorData.operatorPublicName;
        resourceFrameToUpdate.organisations.Operator.ShortName.$t = matchingData.operatorShortName;
        resourceFrameToUpdate.organisations.Operator.TradingName.$t = operatorData.operatorPublicName; // eslint-disable-line @typescript-eslint/camelcase
        resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = operatorData.fareEnq;
        resourceFrameToUpdate.organisations.Operator.Address.Street.$t = operatorData.complEnq;
        resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = getNetexMode(operatorData.mode);
        resourceFrameToUpdate.organisations.Operator.CustomerServiceContactDetails.Email.$t = operatorData.ttrteEnq;

        return resourceFrameToUpdate;
    };

    const updateSiteFrame = (siteFrame: NetexObject): NetexObject => {
        const siteFrameToUpdate = { ...siteFrame };
        siteFrameToUpdate.id = `epd:UK:${matchingData.nocCode}:SiteFrame_UK_PI_NETWORK:${lineIdName}:op`;
        siteFrameToUpdate.prerequisites.ResourceFrameRef.ref = `epd:UK:${matchingData.nocCode}:ResourceFrame_UK_PI_COMMON:op`;

        return siteFrameToUpdate;
    };

    const updateServiceFrame = (serviceFrame: NetexObject): NetexObject => {
        const serviceFrameToUpdate = { ...serviceFrame };
        serviceFrameToUpdate.id = `epd:UK:${matchingData.nocCode}:ServiceFrame_UK_PI_NETWORK:${lineIdName}:op`;
        serviceFrameToUpdate.lines.Line.id = matchingData.lineName;
        serviceFrameToUpdate.lines.Line.Name.$t = operatorPublicNameLineNameFormat;
        serviceFrameToUpdate.lines.Line.PublicCode.$t = matchingData.lineName;
        serviceFrameToUpdate.lines.Line.PrivateCode.$t = noccodeLineNameFormat;
        serviceFrameToUpdate.lines.Line.OperatorRef.ref = nocCodeNocFormat;
        serviceFrameToUpdate.lines.Line.OperatorRef.$t = opIdNocFormat;

        if (isReturnTicket(matchingData)) {
            const outboundStops = getScheduledStopPointsList(matchingData.outboundFareZones);
            const inboundStops = getScheduledStopPointsList(matchingData.inboundFareZones);
            const scheduledStopPointList: ScheduledStopPoints[] = outboundStops.concat(inboundStops);
            serviceFrameToUpdate.scheduledStopPoints.ScheduledStopPoint = [
                ...new Set(scheduledStopPointList.map(({ id }) => id)),
            ].map(e => scheduledStopPointList.find(({ id }) => id === e));
        } else if (isSingleTicket(matchingData)) {
            serviceFrameToUpdate.scheduledStopPoints.ScheduledStopPoint = getScheduledStopPointsList(
                matchingData.fareZones,
            );
        }

        serviceFrameToUpdate.lines.Line.Description.$t = matchingData.serviceDescription;

        return serviceFrameToUpdate;
    };

    const updateZoneFareFrame = (zoneFareFrame: NetexObject): NetexObject => {
        const zoneFareFrameToUpdate = { ...zoneFareFrame };
        zoneFareFrameToUpdate.id = `epd:UK:${matchingData.nocCode}:FareFrame_UK_PI_FARE_NETWORK:${lineIdName}:op`;

        if (isReturnTicket(matchingData)) {
            const outbound = getFareZoneList(matchingData.outboundFareZones);
            const inbound = getFareZoneList(matchingData.inboundFareZones);

            const fareZones: FareZoneList[] = inbound.concat(outbound);

            zoneFareFrameToUpdate.fareZones.FareZone = [...new Set(fareZones.map(({ id }) => id))].map(e =>
                fareZones.find(({ id }) => id === e),
            );
        } else if (isSingleTicket(matchingData)) {
            zoneFareFrameToUpdate.fareZones.FareZone = getFareZoneList(matchingData.fareZones);
        }

        return zoneFareFrameToUpdate;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };
        priceFareFrameToUpdate.id = `epd:UK:${matchingData.nocCode}:FareFrame_UK_PI_FARE_PRODUCT:${lineIdName}:op`;
        priceFareFrameToUpdate.tariffs.Tariff.validityConditions = {
            ValidBetween: {
                FromDate: { $t: currentDate.toISOString() },
                ToDate: { $t: new Date(currentDate.setFullYear(currentDate.getFullYear() + 99)).toISOString() },
            },
        };

        priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.ref = nocCodeNocFormat;
        priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.$t = opIdNocFormat;
        priceFareFrameToUpdate.tariffs.Tariff.LineRef.ref = matchingData.lineName;

        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].Name = {
            $t: `O/D pairs for ${matchingData.lineName}`,
        };

        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.LineRef.ref =
            matchingData.lineName;

        if (isReturnTicket(matchingData)) {
            priceFareFrameToUpdate.tariffs.Tariff.id = `Tariff@return@${lineIdName}`;
            priceFareFrameToUpdate.tariffs.Tariff.Name = { $t: `${operatorPublicNameLineNameFormat} - Return Fares` };
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].id =
                'Tariff@return@lines';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].distanceMatrixElements.DistanceMatrixElement = getDistanceMatrixElements(
                matchingData.outboundFareZones,
            );
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.id =
                'Tariff@return@lines';

            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].id =
                'Tariff@return@eligibility';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].GenericParameterAssignment.id =
                'Tariff@return@eligibility';

            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].id =
                'Trip@return@conditions_of_travel';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.id =
                'Trip@return@conditions_of_travel';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.limitations.RoundTrip.id =
                'Trip@return@condition@direction';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.limitations.RoundTrip.Name.$t =
                'return Trip';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.limitations.RoundTrip.TripType.$t =
                'return';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.limitations.FrequencyOfUse.id =
                'Trip@return@oneTrip';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.limitations.FrequencyOfUse.Name.$t =
                'One trip no transfers';
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2].GenericParameterAssignment.limitations.Interchanging.id =
                'Trip@return@NoTransfers';

            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.id = 'Trip@return';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.Name.$t = 'return Ticket';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.TypeOfFareProductRef.ref =
                'fxc:standard_product@trip@return';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.Name.$t =
                'Return ride';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.id =
                'Trip@return@travel';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[0].ref =
                'Tariff@return@lines';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[1].ref =
                'Tariff@return@eligibility';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.validableElements.ValidableElement.fareStructureElements.FareStructureElementRef[2].ref =
                'Trip@return@conditions_of_travel';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.accessRightsInProduct.AccessRightInProduct.id =
                'Trip@return';
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct.accessRightsInProduct.AccessRightInProduct.ValidableElementRef.ref =
                'Trip@return@travel';
        } else if (isSingleTicket(matchingData)) {
            priceFareFrameToUpdate.tariffs.Tariff.id = `Tariff@single@${lineIdName}`;
            priceFareFrameToUpdate.tariffs.Tariff.Name = { $t: `${operatorPublicNameLineNameFormat} - Single Fares` };
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].distanceMatrixElements.DistanceMatrixElement = getDistanceMatrixElements(
                matchingData.fareZones,
            );
        }

        const arrayofUserProfiles =
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1]
                .GenericParameterAssignment.limitations.UserProfile;
        let userProfile;
        // eslint-disable-next-line no-plusplus
        for (userProfile = 1; userProfile < 4; userProfile++) {
            arrayofUserProfiles[userProfile].Url.$t = website;
        }
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage.BrandingRef.ref = `${matchingData.nocCode}@brand`;

        if (isReturnTicket(matchingData)) {
            priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage.id = 'Trip@return-SOP@p-ticket';
            priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage.distributionAssignments.DistributionAssignment[0].id =
                'Trip@return-SOP@p-ticket@atStop';
            priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage.distributionAssignments.DistributionAssignment[1].id =
                'Trip@return-SOP@p-ticket@onBoard';
            priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage.salesOfferPackageElements.SalesOfferPackageElement.id =
                'Trip@return-SOP@p-ticket';
            priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage.salesOfferPackageElements.SalesOfferPackageElement.PreassignedFareProductRef.ref =
                'Trip@return';
        }

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };
        fareTableFareFrameToUpdate.id = `operator@Products@Trip@prices@${lineIdName}`;

        if (isSingleTicket(matchingData)) {
            fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(matchingData.fareZones);
            fareTableFareFrameToUpdate.fareTables.FareTable.id = `Trip@single-SOP@p-ticket@${lineIdName}@adult`;
            fareTableFareFrameToUpdate.fareTables.FareTable.Name.$t = matchingData.serviceDescription;
            fareTableFareFrameToUpdate.fareTables.FareTable.usedIn.TariffRef.ref = `Tariff@single@${lineIdName}`;
            fareTableFareFrameToUpdate.fareTables.FareTable.columns.FareTableColumn = getFareTableElements(
                [...matchingData.fareZones],
                lineIdName,
                'c',
                'single',
            );
            fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow = getFareTableElements(
                [...matchingData.fareZones].reverse(),
                lineIdName,
                'r',
                'single',
            );
            fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable = getFareTables(
                [...matchingData.fareZones].slice(0, -1),
                lineIdName,
                'single',
            );
        } else if (isReturnTicket(matchingData)) {
            fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(matchingData.outboundFareZones);
            fareTableFareFrameToUpdate.fareTables.FareTable.Name.$t = matchingData.lineName;
            fareTableFareFrameToUpdate.fareTables.FareTable.Description.$t = matchingData.serviceDescription;
            fareTableFareFrameToUpdate.fareTables.FareTable.pricesFor.PreassignedFareProductRef.ref = 'Trip@return';
            fareTableFareFrameToUpdate.fareTables.FareTable.id = `Trip@return-SOP@p-ticket@${lineIdName}@adult`;
            fareTableFareFrameToUpdate.fareTables.FareTable.pricesFor.SalesOfferPackageRef.ref =
                'Trip@return-SOP@p-ticket';
            fareTableFareFrameToUpdate.fareTables.FareTable.usedIn.TariffRef.ref = `Tariff@return@${lineIdName}`;

            fareTableFareFrameToUpdate.fareTables.FareTable.columns.FareTableColumn = getFareTableElements(
                [...matchingData.outboundFareZones],
                lineIdName,
                'c',
                'return',
            );
            fareTableFareFrameToUpdate.fareTables.FareTable.rows.FareTableRow = getFareTableElements(
                [...matchingData.outboundFareZones].reverse(),
                lineIdName,
                'r',
                'return',
            );
            fareTableFareFrameToUpdate.fareTables.FareTable.includes.FareTable = getFareTables(
                [...matchingData.outboundFareZones].slice(0, -1),
                lineIdName,
                'return',
            );
        }

        fareTableFareFrameToUpdate.fareTables.FareTable.specifics.LineRef.ref = lineIdName;

        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        const netexJson: NetexObject = await getNetexTemplateAsJson(
            'point-to-point-tickets/pointToPointTicketNetexTemplate.xml',
        );

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
        netexFrames.ServiceFrame = updateServiceFrame(netexFrames.ServiceFrame);
        netexFrames.FareFrame[0] = updateZoneFareFrame(netexFrames.FareFrame[0]);
        netexFrames.FareFrame[1] = updatePriceFareFrame(netexFrames.FareFrame[1]);
        netexFrames.FareFrame[2] = updateFareTableFareFrame(netexFrames.FareFrame[2]);

        return convertJsonToXml(netexJson);
    };

    return { generate };
};

export default pointToPointTicketNetexGenerator;
