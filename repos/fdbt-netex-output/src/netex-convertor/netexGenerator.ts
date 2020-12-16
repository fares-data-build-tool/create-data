/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    isMultiOperatorMultipleServicesTicket,
    isMultiOperatorGeoZoneTicket,
    Operator,
    isSchemeOperatorTicket,
} from '../types/index';

import {
    getScheduledStopPointsList,
    getTopographicProjectionRefList,
    getLinesList,
    getGeoZoneFareTable,
    getMultiServiceFareTable,
    getPreassignedFareProducts,
    getSalesOfferPackageList,
    getTimeIntervals,
    getFareStructuresElements,
    isMultiServiceTicket,
    isGeoZoneTicket,
    getOrganisations,
    getGroupOfOperators,
    getBaseSchemeOperatorInfo,
    isBaseSchemeOperatorInfo,
} from './period-tickets/periodTicketNetexHelpers';
import {
    NetexObject,
    getCleanWebsite,
    getNetexTemplateAsJson,
    convertJsonToXml,
    getTimeRestrictions,
    getNetexMode,
    replaceIWBusCoNocCode,
} from './sharedHelpers';

const netexGenerator = (
    // userPeriodTicket: PeriodTicket | SchemeOperatorTicket,
    ticket: any,
    operatorData: Operator[],
): { generate: Function } => {
    const baseOperatorInfo = isSchemeOperatorTicket(ticket)
        ? getBaseSchemeOperatorInfo(ticket)
        : operatorData.find(operator => operator.operatorPublicName === ticket.operatorName);
    const operatorIdentifier = isSchemeOperatorTicket(ticket)
        ? `${ticket.schemeOperatorName}-${ticket.schemeOperatorRegionCode}`
        : ticket.nocCode;

    if (!baseOperatorInfo) {
        throw new Error('Could not find base operator');
    }

    const opIdNocFormat = `noc:${baseOperatorInfo.opId}`;
    const nocCodeNocFormat = `noc:${
        isSchemeOperatorTicket(ticket) ? operatorIdentifier : replaceIWBusCoNocCode(ticket.nocCode)
    }`;
    const currentDate = new Date(Date.now());
    const website = getCleanWebsite(baseOperatorInfo.website);
    const placeHolderGroupOfProductsName = `${operatorIdentifier}_products`;
    const brandingId = `op:${operatorIdentifier}@brand`;
    const ticketUserConcat = `${ticket.type}_${ticket.passengerType}`;

    const updatePublicationTimeStamp = (publicationTimeStamp: NetexObject): NetexObject => {
        const publicationTimeStampToUpdate = { ...publicationTimeStamp };
        publicationTimeStampToUpdate.PublicationTimestamp.$t = currentDate;

        return publicationTimeStampToUpdate;
    };

    const updatePublicationRequest = (publicationRequest: NetexObject): NetexObject => {
        const publicationRequestToUpdate = { ...publicationRequest };
        publicationRequestToUpdate.RequestTimestamp.$t = currentDate;
        publicationRequestToUpdate.Description.$t = `Request for ${operatorIdentifier} bus pass fares`;
        publicationRequestToUpdate.topics.NetworkFrameTopic.TypeOfFrameRef.ref = `fxc:UK:DFT:TypeOfFrame_UK_PI_${
            isGeoZoneTicket(ticket) ? 'NETWORK' : 'LINE'
        }_FARE_OFFER:FXCP`;

        if (ticket.type === 'multiOperator') {
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.GroupOfOperatorsRef = {
                version: '1.0',
                ref: 'operators@bus',
            };
            delete publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences
                .OperatorRef;
        } else {
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.ref = nocCodeNocFormat;
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.$t = opIdNocFormat;
            delete publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences
                .GroupOfOperatorsRef;
        }

        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.PreassignedFareProductRef = ticket.products.map(
            (product: { productName: any }) => ({
                version: '1.0',
                ref: `op:Pass@${product.productName}_${ticket.passengerType}`,
            }),
        );

        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.BrandingRef = {
            version: '1.0',
            ref: brandingId,
        };

        return publicationRequestToUpdate;
    };

    const updateCompositeFrame = (compositeFrame: NetexObject): NetexObject => {
        const compositeFrameToUpdate = { ...compositeFrame };
        const operatorName = isSchemeOperatorTicket(ticket) ? ticket.schemeOperatorName : ticket.operatorName;

        compositeFrameToUpdate.id = `epd:UK:${operatorIdentifier}:CompositeFrame_UK_PI_${
            isGeoZoneTicket(ticket) ? 'NETWORK' : 'LINE'
        }_FARE_OFFER:Pass@${placeHolderGroupOfProductsName}:op`;
        compositeFrameToUpdate.Name.$t = `Fares for ${operatorName}`;
        compositeFrameToUpdate.Description.$t = `Period ticket for ${operatorName}`;

        return compositeFrameToUpdate;
    };

    const updateResourceFrame = (resourceFrame: NetexObject): NetexObject => {
        const resourceFrameToUpdate = { ...resourceFrame };
        const operatorPublicName = isBaseSchemeOperatorInfo(baseOperatorInfo)
            ? baseOperatorInfo.schemeOperatorName
            : baseOperatorInfo.operatorPublicName;

        resourceFrameToUpdate.id = `epd:UK:${operatorIdentifier}:ResourceFrame_UK_PI_COMMON:${operatorIdentifier}:op`;
        resourceFrameToUpdate.codespaces.Codespace.XmlnsUrl.$t = website;
        resourceFrameToUpdate.dataSources.DataSource.Email.$t = baseOperatorInfo.ttrteEnq;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t = operatorPublicName;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref = nocCodeNocFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t = operatorPublicName;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.id = brandingId;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Name.$t = operatorPublicName;
        resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Url.$t = website;

        if (
            ticket.type === 'multiOperator' &&
            (isMultiOperatorGeoZoneTicket(ticket) || isSchemeOperatorTicket(ticket))
        ) {
            const nocs = [...ticket.additionalNocs];
            if (isMultiOperatorGeoZoneTicket(ticket)) {
                nocs.push(ticket.nocCode);
                resourceFrameToUpdate.organisations.Operator = getOrganisations(operatorData);
            } else if (isBaseSchemeOperatorInfo(baseOperatorInfo) && isSchemeOperatorTicket(ticket)) {
                resourceFrameToUpdate.organisations.Operator = getOrganisations(operatorData, baseOperatorInfo);
            }
            resourceFrameToUpdate.groupsOfOperators = getGroupOfOperators(operatorData);
        } else if (ticket.type === 'multiOperator' && isMultiOperatorMultipleServicesTicket(ticket)) {
            const nocs: string[] = ticket.additionalOperators.map(additionalOperator => additionalOperator.nocCode);
            nocs.push(ticket.nocCode);
            resourceFrameToUpdate.organisations.Operator = getOrganisations(operatorData);
            resourceFrameToUpdate.groupsOfOperators = getGroupOfOperators(operatorData);
        } else if (
            !isMultiOperatorGeoZoneTicket(ticket) &&
            !isSchemeOperatorTicket(ticket) &&
            !isMultiOperatorMultipleServicesTicket(ticket)
        ) {
            resourceFrameToUpdate.organisations.Operator.id = nocCodeNocFormat;
            resourceFrameToUpdate.organisations.Operator.PublicCode.$t = operatorIdentifier;
            resourceFrameToUpdate.organisations.Operator.Name.$t = operatorPublicName;
            resourceFrameToUpdate.organisations.Operator.ShortName.$t = ticket.operatorName;
            resourceFrameToUpdate.organisations.Operator.TradingName.$t = baseOperatorInfo.vosaPsvLicenseName;
            resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = baseOperatorInfo.fareEnq;
            resourceFrameToUpdate.organisations.Operator.ContactDetails.Url.$t = website;
            resourceFrameToUpdate.organisations.Operator.Address.Street.$t = baseOperatorInfo.complEnq;
            resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = getNetexMode(baseOperatorInfo.mode);
        }

        return resourceFrameToUpdate;
    };

    const updateServiceFrame = (serviceFrame: NetexObject): NetexObject | null => {
        if (isMultiServiceTicket(ticket)) {
            const serviceFrameToUpdate = { ...serviceFrame };
            serviceFrameToUpdate.id = `epd:UK:${ticket.nocCode}:ServiceFrame_UK_PI_NETWORK:${placeHolderGroupOfProductsName}:op`;

            serviceFrameToUpdate.lines.Line = getLinesList(ticket, website, operatorData);

            return serviceFrameToUpdate;
        }

        return null;
    };

    const updateNetworkFareFrame = (networkFareFrame: NetexObject): NetexObject | null => {
        if (isGeoZoneTicket(ticket)) {
            const networkFareFrameToUpdate = { ...networkFareFrame };

            networkFareFrameToUpdate.id = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${placeHolderGroupOfProductsName}@pass:op`;
            networkFareFrameToUpdate.Name.$t = `${placeHolderGroupOfProductsName} Network`;
            networkFareFrameToUpdate.prerequisites.ResourceFrameRef.ref = `epd:UK:${operatorIdentifier}:ResourceFrame_UK_PI_COMMON:${operatorIdentifier}:op`;

            networkFareFrameToUpdate.fareZones.FareZone.id = `op:${placeHolderGroupOfProductsName}@${ticket.zoneName}`;
            networkFareFrameToUpdate.fareZones.FareZone.Name.$t = `${ticket.zoneName}`;
            networkFareFrameToUpdate.fareZones.FareZone.Description.$t = `${ticket.zoneName} ${placeHolderGroupOfProductsName} Zone`;
            networkFareFrameToUpdate.fareZones.FareZone.members.ScheduledStopPointRef = getScheduledStopPointsList(
                ticket.stops,
            );
            networkFareFrameToUpdate.fareZones.FareZone.projections.TopographicProjectionRef = getTopographicProjectionRefList(
                ticket.stops,
            );

            return networkFareFrameToUpdate;
        }

        return null;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${placeHolderGroupOfProductsName}@pass:op`;

        if (isGeoZoneTicket(ticket)) {
            priceFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${placeHolderGroupOfProductsName}@pass:op`;
        } else if (isMultiServiceTicket(ticket)) {
            priceFareFrameToUpdate.prerequisites = null;
        }
        priceFareFrameToUpdate.tariffs.Tariff.id = `op:Tariff@${placeHolderGroupOfProductsName}`;
        let validityCondition;
        if (isMultiServiceTicket(ticket) && ticket.termTime === true) {
            validityCondition = {
                id: 'op:termtime',
                version: '1.0',
                Name: {
                    $t: 'Term Time Usage Only',
                },
            };
        }
        priceFareFrameToUpdate.tariffs.Tariff.validityConditions = {
            ValidBetween: {
                FromDate: { $t: ticket.ticketPeriod.startDate },
                ToDate: { $t: ticket.ticketPeriod.endDate },
            },
            ValidityCondition: validityCondition,
        };
        priceFareFrameToUpdate.tariffs.Tariff.Name.$t = `${placeHolderGroupOfProductsName} - Tariff`;
        priceFareFrameToUpdate.tariffs.Tariff.Description.$t = `${placeHolderGroupOfProductsName} single zone tariff`;

        if (ticket.type === 'multiOperator') {
            priceFareFrameToUpdate.tariffs.Tariff.GroupOfOperatorsRef = {
                version: '1.0',
                ref: 'operators@bus',
            };
            delete priceFareFrameToUpdate.tariffs.Tariff.OperatorRef;
        } else {
            priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.ref = nocCodeNocFormat;
            priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.$t = opIdNocFormat;
            delete priceFareFrameToUpdate.tariffs.Tariff.GroupOfOperatorsRef;
        }

        // Time intervals
        if (isGeoZoneTicket(ticket) || (isMultiServiceTicket(ticket) && ticket.products[0].productDuration)) {
            priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval = getTimeIntervals(ticket);
        } else {
            priceFareFrameToUpdate.tariffs.Tariff.timeIntervals = null;
        }

        if (ticket.timeRestriction && ticket.timeRestriction.length > 0) {
            priceFareFrameToUpdate.tariffs.Tariff.qualityStructureFactors = getTimeRestrictions(ticket.timeRestriction);
        }

        // Fare structure elements
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement = getFareStructuresElements(
            ticket,
            placeHolderGroupOfProductsName,
        );

        // Preassigned Fare Product
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct = getPreassignedFareProducts(
            ticket,
            nocCodeNocFormat,
            opIdNocFormat,
        );

        // Sales Offer Packages
        const salesOfferPackages = getSalesOfferPackageList(ticket, ticketUserConcat);
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage = salesOfferPackages.flat();

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

        fareTableFareFrameToUpdate.id = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_PRICE:${placeHolderGroupOfProductsName}@pass:op`;
        fareTableFareFrameToUpdate.Name.$t = `${placeHolderGroupOfProductsName} Prices`;
        fareTableFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${placeHolderGroupOfProductsName}@pass:op`;

        if (isGeoZoneTicket(ticket)) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getGeoZoneFareTable(
                ticket,
                placeHolderGroupOfProductsName,
                ticketUserConcat,
            );
        } else if (isMultiServiceTicket(ticket)) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getMultiServiceFareTable(ticket, ticketUserConcat);
        }
        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        // if period
        const netexJson: NetexObject = await getNetexTemplateAsJson('period-tickets/periodTicketNetexTemplate.xml');

        // else

        // const netexJson: NetexObject = await getNetexTemplateAsJson(
        //     'point-to-point-tickets/pointToPointTicketNetexTemplate.xml',
        // );

        netexJson.PublicationDelivery = updatePublicationTimeStamp(netexJson.PublicationDelivery);
        netexJson.PublicationDelivery.PublicationRequest = updatePublicationRequest(
            netexJson.PublicationDelivery.PublicationRequest,
        );
        netexJson.PublicationDelivery.dataObjects.CompositeFrame[0] = updateCompositeFrame(
            netexJson.PublicationDelivery.dataObjects.CompositeFrame[0],
        );

        const netexFrames = netexJson.PublicationDelivery.dataObjects.CompositeFrame[0].frames;
        netexFrames.ResourceFrame = updateResourceFrame(netexFrames.ResourceFrame);

        netexFrames.ServiceFrame = updateServiceFrame(netexFrames.ServiceFrame);

        // Multi Service does not need a Network Frame
        if (isGeoZoneTicket(ticket)) {
            netexFrames.FareFrame = [
                updateNetworkFareFrame(netexFrames.FareFrame[0]),
                updatePriceFareFrame(netexFrames.FareFrame[1]),
                updateFareTableFareFrame(netexFrames.FareFrame[2]),
            ];
        } else if (isMultiServiceTicket(ticket)) {
            netexFrames.FareFrame = [
                updatePriceFareFrame(netexFrames.FareFrame[1]),
                updateFareTableFareFrame(netexFrames.FareFrame[2]),
            ];
        }

        return convertJsonToXml(netexJson);
    };

    return { generate };
};

export default netexGenerator;
