import {
    isMultiOperatorMultipleServicesTicket,
    isMultiOperatorGeoZoneTicket,
    Operator,
    PeriodTicket,
    SchemeOperatorTicket,
    isSchemeOperatorTicket,
} from '../../types/index';

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
} from './periodTicketNetexHelpers';
import {
    NetexObject,
    getCleanWebsite,
    getNetexTemplateAsJson,
    convertJsonToXml,
    getTimeRestrictions,
    getNetexMode,
    replaceIWBusCoNocCode,
} from '../sharedHelpers';

const periodTicketNetexGenerator = (
    userPeriodTicket: PeriodTicket | SchemeOperatorTicket,
    operatorData: Operator[],
): { generate: Function } => {
    const baseOperatorInfo = isSchemeOperatorTicket(userPeriodTicket)
        ? getBaseSchemeOperatorInfo(userPeriodTicket)
        : operatorData.find(operator => operator.operatorPublicName === userPeriodTicket.operatorName);
    const operatorIdentifier = isSchemeOperatorTicket(userPeriodTicket)
        ? `${userPeriodTicket.schemeOperatorName}-${userPeriodTicket.schemeOperatorRegionCode}`
        : userPeriodTicket.nocCode;

    if (!baseOperatorInfo) {
        throw new Error('Could not find base operator');
    }

    const opIdNocFormat = `noc:${baseOperatorInfo.opId}`;
    const nocCodeNocFormat = `noc:${
        isSchemeOperatorTicket(userPeriodTicket) ? operatorIdentifier : replaceIWBusCoNocCode(userPeriodTicket.nocCode)
    }`;
    const currentDate = new Date(Date.now());
    const website = getCleanWebsite(baseOperatorInfo.website);
    const placeHolderGroupOfProductsName = `${operatorIdentifier}_products`;
    const brandingId = `op:${operatorIdentifier}@brand`;
    const ticketUserConcat = `${userPeriodTicket.type}_${userPeriodTicket.passengerType}`;

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
            isGeoZoneTicket(userPeriodTicket) ? 'NETWORK' : 'LINE'
        }_FARE_OFFER:FXCP`;

        if (userPeriodTicket.type === 'multiOperator') {
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

        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.PreassignedFareProductRef = userPeriodTicket.products.map(
            product => ({
                version: '1.0',
                ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}`,
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
        const operatorName = isSchemeOperatorTicket(userPeriodTicket)
            ? userPeriodTicket.schemeOperatorName
            : userPeriodTicket.operatorName;

        compositeFrameToUpdate.id = `epd:UK:${operatorIdentifier}:CompositeFrame_UK_PI_${
            isGeoZoneTicket(userPeriodTicket) ? 'NETWORK' : 'LINE'
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
            userPeriodTicket.type === 'multiOperator' &&
            (isMultiOperatorGeoZoneTicket(userPeriodTicket) || isSchemeOperatorTicket(userPeriodTicket))
        ) {
            const nocs = [...userPeriodTicket.additionalNocs];
            if (isMultiOperatorGeoZoneTicket(userPeriodTicket)) {
                nocs.push(userPeriodTicket.nocCode);
                resourceFrameToUpdate.organisations.Operator = getOrganisations(operatorData);
            } else if (isBaseSchemeOperatorInfo(baseOperatorInfo) && isSchemeOperatorTicket(userPeriodTicket)) {
                resourceFrameToUpdate.organisations.Operator = getOrganisations(operatorData, baseOperatorInfo);
            }
            resourceFrameToUpdate.groupsOfOperators = getGroupOfOperators(operatorData);
        } else if (
            userPeriodTicket.type === 'multiOperator' &&
            isMultiOperatorMultipleServicesTicket(userPeriodTicket)
        ) {
            const nocs: string[] = userPeriodTicket.additionalOperators.map(
                additionalOperator => additionalOperator.nocCode,
            );
            nocs.push(userPeriodTicket.nocCode);
            resourceFrameToUpdate.organisations.Operator = getOrganisations(operatorData);
            resourceFrameToUpdate.groupsOfOperators = getGroupOfOperators(operatorData);
        } else if (
            !isMultiOperatorGeoZoneTicket(userPeriodTicket) &&
            !isSchemeOperatorTicket(userPeriodTicket) &&
            !isMultiOperatorMultipleServicesTicket(userPeriodTicket)
        ) {
            resourceFrameToUpdate.organisations.Operator.id = nocCodeNocFormat;
            resourceFrameToUpdate.organisations.Operator.PublicCode.$t = operatorIdentifier;
            resourceFrameToUpdate.organisations.Operator.Name.$t = operatorPublicName;
            resourceFrameToUpdate.organisations.Operator.ShortName.$t = userPeriodTicket.operatorName;
            resourceFrameToUpdate.organisations.Operator.TradingName.$t = baseOperatorInfo.vosaPsvLicenseName;
            resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = baseOperatorInfo.fareEnq;
            resourceFrameToUpdate.organisations.Operator.ContactDetails.Url.$t = website;
            resourceFrameToUpdate.organisations.Operator.Address.Street.$t = baseOperatorInfo.complEnq;
            resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = getNetexMode(baseOperatorInfo.mode);
        }

        return resourceFrameToUpdate;
    };

    const updateServiceFrame = (serviceFrame: NetexObject): NetexObject | null => {
        if (isMultiServiceTicket(userPeriodTicket)) {
            const serviceFrameToUpdate = { ...serviceFrame };
            serviceFrameToUpdate.id = `epd:UK:${userPeriodTicket.nocCode}:ServiceFrame_UK_PI_NETWORK:${placeHolderGroupOfProductsName}:op`;

            serviceFrameToUpdate.lines.Line = getLinesList(userPeriodTicket, website, operatorData);

            return serviceFrameToUpdate;
        }

        return null;
    };

    const updateNetworkFareFrame = (networkFareFrame: NetexObject): NetexObject | null => {
        if (isGeoZoneTicket(userPeriodTicket)) {
            const networkFareFrameToUpdate = { ...networkFareFrame };

            networkFareFrameToUpdate.id = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${placeHolderGroupOfProductsName}@pass:op`;
            networkFareFrameToUpdate.Name.$t = `${placeHolderGroupOfProductsName} Network`;
            networkFareFrameToUpdate.prerequisites.ResourceFrameRef.ref = `epd:UK:${operatorIdentifier}:ResourceFrame_UK_PI_COMMON:${operatorIdentifier}:op`;

            networkFareFrameToUpdate.fareZones.FareZone.id = `op:${placeHolderGroupOfProductsName}@${userPeriodTicket.zoneName}`;
            networkFareFrameToUpdate.fareZones.FareZone.Name.$t = `${userPeriodTicket.zoneName}`;
            networkFareFrameToUpdate.fareZones.FareZone.Description.$t = `${userPeriodTicket.zoneName} ${placeHolderGroupOfProductsName} Zone`;
            networkFareFrameToUpdate.fareZones.FareZone.members.ScheduledStopPointRef = getScheduledStopPointsList(
                userPeriodTicket.stops,
            );
            networkFareFrameToUpdate.fareZones.FareZone.projections.TopographicProjectionRef = getTopographicProjectionRefList(
                userPeriodTicket.stops,
            );

            return networkFareFrameToUpdate;
        }

        return null;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${placeHolderGroupOfProductsName}@pass:op`;

        if (isGeoZoneTicket(userPeriodTicket)) {
            priceFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${placeHolderGroupOfProductsName}@pass:op`;
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            priceFareFrameToUpdate.prerequisites = null;
        }
        priceFareFrameToUpdate.tariffs.Tariff.id = `op:Tariff@${placeHolderGroupOfProductsName}`;
        let validityCondition;
        if (isMultiServiceTicket(userPeriodTicket) && userPeriodTicket.termTime === true) {
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
                FromDate: { $t: userPeriodTicket.ticketPeriod.startDate },
                ToDate: { $t: userPeriodTicket.ticketPeriod.endDate },
            },
            ValidityCondition: validityCondition,
        };
        priceFareFrameToUpdate.tariffs.Tariff.Name.$t = `${placeHolderGroupOfProductsName} - Tariff`;
        priceFareFrameToUpdate.tariffs.Tariff.Description.$t = `${placeHolderGroupOfProductsName} single zone tariff`;

        if (userPeriodTicket.type === 'multiOperator') {
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
        if (
            isGeoZoneTicket(userPeriodTicket) ||
            (isMultiServiceTicket(userPeriodTicket) && userPeriodTicket.products[0].productDuration)
        ) {
            priceFareFrameToUpdate.tariffs.Tariff.timeIntervals.TimeInterval = getTimeIntervals(userPeriodTicket);
        } else {
            priceFareFrameToUpdate.tariffs.Tariff.timeIntervals = null;
        }

        if (userPeriodTicket.timeRestriction && userPeriodTicket.timeRestriction.length > 0) {
            priceFareFrameToUpdate.tariffs.Tariff.qualityStructureFactors = getTimeRestrictions(
                userPeriodTicket.timeRestriction,
            );
        }

        // Fare structure elements
        priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement = getFareStructuresElements(
            userPeriodTicket,
            placeHolderGroupOfProductsName,
        );

        // Preassigned Fare Product
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct = getPreassignedFareProducts(
            userPeriodTicket,
            nocCodeNocFormat,
            opIdNocFormat,
        );

        // Sales Offer Packages
        const salesOfferPackages = getSalesOfferPackageList(userPeriodTicket, ticketUserConcat);
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage = salesOfferPackages.flat();

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

        fareTableFareFrameToUpdate.id = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_PRICE:${placeHolderGroupOfProductsName}@pass:op`;
        fareTableFareFrameToUpdate.Name.$t = `${placeHolderGroupOfProductsName} Prices`;
        fareTableFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${placeHolderGroupOfProductsName}@pass:op`;

        if (isGeoZoneTicket(userPeriodTicket)) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getGeoZoneFareTable(
                userPeriodTicket,
                placeHolderGroupOfProductsName,
                ticketUserConcat,
            );
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getMultiServiceFareTable(
                userPeriodTicket,
                ticketUserConcat,
            );
        }
        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        const netexJson = await getNetexTemplateAsJson('period-tickets/periodTicketNetexTemplate.xml');

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
