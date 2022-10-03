import { startCase } from 'lodash';
import { PointToPointPeriodTicket } from 'fdbt-types/matchingJsonTypes';
import {
    isBaseSchemeOperatorInfo,
    isGeoZoneTicket,
    isHybridTicket,
    isMultiOperatorGeoZoneTicket,
    isMultiOperatorMultipleServicesTicket,
    isMultiOperatorTicket,
    isMultiServiceTicket,
    isPointToPointTicket,
    isSchemeOperatorFlatFareTicket,
    isSchemeOperatorGeoZoneTicket,
    isSchemeOperatorTicket,
    Operator,
    PointToPointTicket,
    ScheduledStopPoints,
    Ticket,
    assertNever,
} from '../types';
import {
    getGeoZoneFareTable,
    getGroupOfLinesList,
    getGroupOfOperators,
    getHybridFareTable,
    getLinesList,
    getMultiServiceFareTable,
    getOrganisations,
    getPreassignedFareProducts,
    getSalesOfferPackageList,
    getScheduledStopPointsList,
    getTimeIntervals,
    getTopographicProjectionRefList,
} from './period-tickets/periodTicketNetexHelpers';
import {
    buildSalesOfferPackages,
    getFareTables,
    getFareZoneList,
    getPointToPointScheduledStopPointsList,
    getPreassignedFareProduct,
    getPriceGroups,
    combineFareZones,
} from './point-to-point-tickets/pointToPointTicketNetexHelpers';
import {
    convertJsonToXml,
    getCoreData,
    getFareStructuresElements,
    getNetexMode,
    getNetexTemplateAsJson,
    getTimeRestrictions,
    isFlatFareType,
    NetexObject,
} from './sharedHelpers';

const netexGenerator = async (ticket: Ticket, operatorData: Operator[]): Promise<{ generate: Function }> => {
    const coreData = await getCoreData(operatorData, ticket);

    const baseOperatorInfo = coreData.baseOperatorInfo[0];

    const ticketIdentifier: string = coreData.placeholderGroupOfProductsName
        ? coreData.placeholderGroupOfProductsName
        : coreData.lineIdName;

    const updatePublicationTimeStamp = (publicationTimeStamp: NetexObject): NetexObject => {
        const publicationTimeStampToUpdate = { ...publicationTimeStamp };
        publicationTimeStampToUpdate.PublicationTimestamp.$t = coreData.currentDate;

        return publicationTimeStampToUpdate;
    };

    const updatePublicationRequest = (publicationRequest: NetexObject): NetexObject => {
        const publicationRequestToUpdate = { ...publicationRequest };

        publicationRequestToUpdate.RequestTimestamp.$t = coreData.currentDate;
        publicationRequestToUpdate.Description.$t = `Request for ${
            isPointToPointTicket(ticket) ? `${ticket.nocCode} ${coreData.lineIdName}` : coreData.operatorIdentifier
        } bus pass fares`;
        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.BrandingRef = {
            version: '1.0',
            ref: coreData.brandingId,
        };

        publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.ref =
            coreData.nocCodeFormat;

        if (coreData.lineName) {
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.LineRef.ref =
                coreData.lineName;
        }

        const ticketTypeInsert =
            isGeoZoneTicket(ticket) || isSchemeOperatorGeoZoneTicket(ticket) || isHybridTicket(ticket)
                ? 'NETWORK'
                : 'LINE';
        publicationRequestToUpdate.topics.NetworkFrameTopic.TypeOfFrameRef.ref = `fxc:UK:DFT:TypeOfFrame_UK_PI_${ticketTypeInsert}_FARE_OFFER:FXCP`;

        const productRefs = ticket.products.flatMap(product =>
            !isPointToPointTicket(ticket)
                ? {
                      version: '1.0',
                      ref:
                          'lineName' in ticket
                              ? `Trip@${coreData.ticketUserConcat}`
                              : `op:Pass@${product.productName}_${ticket.passengerType}`,
                  }
                : [],
        );

        if (productRefs.length) {
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.PreassignedFareProductRef = productRefs;

            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.TypeOfFareProductRef = {
                version: 'fxc:v1.0',
                ref: isFlatFareType(ticket) ? 'fxc:standard_product@trip@single' : 'fxc:standard_product@pass@period',
            };
        }

        // check if multiOperator and delete as required
        if (isMultiOperatorTicket(ticket) || isSchemeOperatorFlatFareTicket(ticket)) {
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.GroupOfOperatorsRef = {
                version: '1.0',
                ref: 'operators@bus',
            };
            delete publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences
                .OperatorRef;
        } else {
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.$t =
                coreData.opIdNocFormat;
            delete publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences
                .GroupOfOperatorsRef;
        }

        return publicationRequestToUpdate;
    };

    const updateCompositeFrame = (compositeFrame: NetexObject): NetexObject => {
        const compositeFrameToUpdate = { ...compositeFrame };
        const { nocCode } = baseOperatorInfo as Operator;
        const { lineIdName, ticketType } = coreData;

        if (isPointToPointTicket(ticket)) {
            compositeFrameToUpdate.id = `epd:UK:${nocCode}:CompositeFrame_UK_PI_LINE_FARE_OFFER:Trip@${coreData.lineIdName}:op`;
            compositeFrameToUpdate.Name.$t = `Fares for ${lineIdName}`;
            compositeFrameToUpdate.Description.$t = `${nocCode} ${lineIdName} is accessible as a ${ticketType} trip fare. Prices are given zone to zone, where each zone is a linear group of stops, i.e. fare stage.`;
        } else {
            const operatorName = coreData.operatorName;
            const ticketTypeInsert =
                isGeoZoneTicket(ticket) || isSchemeOperatorGeoZoneTicket(ticket) ? 'NETWORK' : 'LINE';

            compositeFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:CompositeFrame_UK_PI_${ticketTypeInsert}_FARE_OFFER:Pass@${coreData.placeholderGroupOfProductsName}:op`;
            compositeFrameToUpdate.Name.$t = `Fares for ${operatorName}`;

            compositeFrameToUpdate.Description.$t = isFlatFareType(ticket)
                ? `Flat fare ticket for ${operatorName}`
                : `Period ticket for ${operatorName}`;
        }

        return compositeFrameToUpdate;
    };

    const updateResourceFrame = (resourceFrame: NetexObject): NetexObject => {
        const resourceFrameToUpdate = { ...resourceFrame };

        resourceFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:ResourceFrame_UK_PI_COMMON${`:${
            !isPointToPointTicket(ticket) ? `${coreData.operatorIdentifier}:` : ''
        }`}op`;
        resourceFrameToUpdate.codespaces.Codespace.XmlnsUrl.$t = coreData.url;
        resourceFrameToUpdate.dataSources.DataSource.Email.$t = baseOperatorInfo.email;

        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref =
            coreData.nocCodeFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            coreData.operatorName;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref =
            coreData.nocCodeFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            coreData.operatorName;

        resourceFrameToUpdate.typesOfValue.ValueSet.values.Branding.id = coreData.brandingId;
        resourceFrameToUpdate.typesOfValue.ValueSet.values.Branding.Name.$t = coreData.operatorName;
        resourceFrameToUpdate.typesOfValue.ValueSet.values.Branding.Url.$t = coreData.url;

        if (
            isSchemeOperatorTicket(ticket) ||
            isMultiOperatorGeoZoneTicket(ticket) ||
            isMultiOperatorMultipleServicesTicket(ticket)
        ) {
            resourceFrameToUpdate.groupsOfOperators = getGroupOfOperators(operatorData);
            if (isSchemeOperatorTicket(ticket) && isBaseSchemeOperatorInfo(baseOperatorInfo)) {
                resourceFrameToUpdate.organisations.Operator = getOrganisations(operatorData, baseOperatorInfo);
            } else if (isMultiOperatorGeoZoneTicket(ticket) || isMultiOperatorMultipleServicesTicket(ticket)) {
                resourceFrameToUpdate.organisations.Operator = getOrganisations(operatorData);
            }
        } else {
            resourceFrameToUpdate.organisations.Operator.id = coreData.nocCodeFormat;
            resourceFrameToUpdate.organisations.Operator.PublicCode.$t = coreData.operatorIdentifier;
            resourceFrameToUpdate.organisations.Operator.Name.$t = coreData.operatorName;
            resourceFrameToUpdate.organisations.Operator.ShortName.$t = coreData.operatorName;
            resourceFrameToUpdate.organisations.Operator.TradingName.$t = baseOperatorInfo.vosaPsvLicenseName;
            resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = baseOperatorInfo.contactNumber;
            resourceFrameToUpdate.organisations.Operator.ContactDetails.Url.$t = coreData.url;
            (resourceFrameToUpdate.organisations.Operator.Address = {
                Street: {
                    $t: baseOperatorInfo.street,
                },
                ...('postcode' in baseOperatorInfo
                    ? {
                          Town: { $t: baseOperatorInfo.town },
                          PostCode: { $t: baseOperatorInfo.postcode },
                          PostalRegion: { $t: baseOperatorInfo.county },
                      }
                    : undefined),
            }),
                (resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = getNetexMode(baseOperatorInfo.mode));
            resourceFrameToUpdate.organisations.Operator.CustomerServiceContactDetails.Email.$t =
                baseOperatorInfo.email;
        }

        return resourceFrameToUpdate;
    };

    const updateServiceFrame = (serviceFrame: NetexObject): NetexObject | null => {
        const serviceFrameToUpdate = { ...serviceFrame };

        if (isMultiServiceTicket(ticket) || isSchemeOperatorFlatFareTicket(ticket) || isHybridTicket(ticket)) {
            serviceFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:ServiceFrame_UK_PI_NETWORK:${coreData.placeholderGroupOfProductsName}:op`;

            const lines = getLinesList(ticket, coreData.url, operatorData);

            serviceFrameToUpdate.lines.Line = lines;

            serviceFrameToUpdate.groupsOfLines.GroupOfLines = getGroupOfLinesList(
                coreData.operatorIdentifier,
                isHybridTicket(ticket),
                lines,
            );

            return serviceFrameToUpdate;
        }

        delete serviceFrameToUpdate.groupsOfLines;

        if ('lineName' in ticket) {
            serviceFrameToUpdate.id = `epd:UK:${ticket.nocCode}:ServiceFrame_UK_PI_NETWORK:${coreData.lineIdName}:op`;
            serviceFrameToUpdate.lines.Line.id = coreData.lineName;
            serviceFrameToUpdate.lines.Line.Name.$t = coreData.operatorPublicNameLineNameFormat;
            serviceFrameToUpdate.lines.Line.PublicCode.$t = coreData.lineName;
            serviceFrameToUpdate.lines.Line.PrivateCode.type = 'txc:Line@id';
            serviceFrameToUpdate.lines.Line.PrivateCode.$t = coreData.lineIdName;
            serviceFrameToUpdate.lines.Line.OperatorRef.ref = coreData.nocCodeFormat;
            serviceFrameToUpdate.lines.Line.OperatorRef.$t = coreData.opIdNocFormat;
            serviceFrameToUpdate.lines.Line.Description.$t = ticket.serviceDescription;

            // do we have a return
            if ('inboundFareZones' in ticket) {
                const outboundStops = getPointToPointScheduledStopPointsList(ticket.outboundFareZones);

                const inboundStops = getPointToPointScheduledStopPointsList(ticket.inboundFareZones);

                const scheduledStopPointList: ScheduledStopPoints[] = outboundStops.concat(inboundStops);

                serviceFrameToUpdate.scheduledStopPoints.ScheduledStopPoint = [
                    ...new Set(scheduledStopPointList.map(({ id }) => id)),
                ].map(e => scheduledStopPointList.find(({ id }) => id === e));
            } else {
                // we have a single
                serviceFrameToUpdate.scheduledStopPoints.ScheduledStopPoint = getPointToPointScheduledStopPointsList(
                    ticket.fareZones,
                );
            }

            return serviceFrameToUpdate;
        }

        return null;
    };

    // this method is called for all period-type tickets instead of 'updateZoneFareFrame'.
    // only GeoZoneTickets need a NetworkFareFrame. MultiServiceTickets do not need a NetworkFareFrame.
    const updateNetworkFareFrame = (networkFareFrame: NetexObject): NetexObject | null => {
        if (isGeoZoneTicket(ticket) || isHybridTicket(ticket)) {
            const networkFareFrameToUpdate = { ...networkFareFrame };

            networkFareFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${coreData.placeholderGroupOfProductsName}@pass:op`;
            networkFareFrameToUpdate.Name.$t = `${coreData.placeholderGroupOfProductsName} Network`;
            networkFareFrameToUpdate.prerequisites.ResourceFrameRef.ref = `epd:UK:${coreData.operatorIdentifier}:ResourceFrame_UK_PI_COMMON:${coreData.operatorIdentifier}:op`;

            networkFareFrameToUpdate.fareZones.FareZone.id = `op:${coreData.placeholderGroupOfProductsName}@${ticket.zoneName}`;
            networkFareFrameToUpdate.fareZones.FareZone.Name.$t = `${ticket.zoneName}`;
            networkFareFrameToUpdate.fareZones.FareZone.Description.$t = `${ticket.zoneName} ${coreData.placeholderGroupOfProductsName} Zone`;
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

    // this method is called for all point-to-point-type tickets instead of 'updateNetworkFareFrame'.
    const updateZoneFareFrame = (
        zoneFareFrame: NetexObject,
        ticket: PointToPointTicket | PointToPointPeriodTicket,
    ): NetexObject | null => {
        const zoneFareFrameToUpdate = { ...zoneFareFrame };

        zoneFareFrameToUpdate.id = `epd:UK:${ticket.nocCode}:FareFrame_UK_PI_FARE_NETWORK:${coreData.lineIdName}:op`;

        if (ticket.type === 'single') {
            zoneFareFrameToUpdate.fareZones.FareZone = getFareZoneList(ticket.fareZones);
        } else {
            const combinedFareZones = combineFareZones(ticket.outboundFareZones, ticket.inboundFareZones);

            const fareZoneList = getFareZoneList(combinedFareZones);

            zoneFareFrameToUpdate.fareZones.FareZone = fareZoneList;
        }

        return zoneFareFrameToUpdate;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${ticketIdentifier}@pass:op`;
        const tariff = priceFareFrameToUpdate.tariffs.Tariff;
        tariff.id = coreData.lineIdName
            ? `Tariff@${coreData.ticketType}@${coreData.lineIdName}`
            : `op:Tariff@${coreData.placeholderGroupOfProductsName}`;
        tariff.Name.$t = `${coreData.operatorName} - ${ticketIdentifier} - Fares for ${startCase(
            coreData.ticketType,
        )} ticket`;

        const fareStructuresElements = getFareStructuresElements(
            ticket,
            coreData.isCarnet,
            coreData.lineName,
            coreData.placeholderGroupOfProductsName,
            `${coreData.operatorIdentifier}@groupOfLines@1`,
        );
        tariff.fareStructureElements.FareStructureElement = fareStructuresElements;

        if (isFlatFareType(ticket)) {
            tariff.TypeOfTariffRef = {
                version: 'fxc:v1.0',
                ref: 'fxc:flat',
            };

            tariff.TariffBasis = { $t: 'flat' };
        }
        tariff.validityConditions = {
            ValidBetween: {
                FromDate: { $t: ticket.ticketPeriod.startDate },
                ToDate: { $t: ticket.ticketPeriod.endDate },
            },
            ValidityCondition:
                'termTime' in ticket && ticket.termTime && ticket.type === 'period' && 'selectedServices' in ticket
                    ? {
                          id: 'op:termtime',
                          version: '1.0',
                          Name: {
                              $t: 'Term Time Usage Only',
                          },
                      }
                    : undefined,
        };

        tariff.OperatorRef.ref = coreData.nocCodeFormat;
        tariff.OperatorRef.$t = coreData.opIdNocFormat;

        if (ticket.timeRestriction && ticket.timeRestriction.length > 0) {
            tariff.qualityStructureFactors = getTimeRestrictions(ticket.timeRestriction);
        }

        if (coreData.lineName) {
            tariff.LineRef.ref = coreData.lineName;
        }

        if ('lineName' in ticket) {
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct = getPreassignedFareProduct(
                ticket,
                fareStructuresElements,
                coreData.ticketUserConcat,
                coreData.productNameForPlainText,
            );

            priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage = buildSalesOfferPackages(
                ticket.products[0],
                coreData.ticketUserConcat,
            );

            if (isPointToPointTicket(ticket)) return priceFareFrameToUpdate;
        }

        if (isGeoZoneTicket(ticket) || isHybridTicket(ticket)) {
            priceFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${coreData.placeholderGroupOfProductsName}@pass:op`;
        } else {
            priceFareFrameToUpdate.prerequisites = undefined;
        }

        if (ticket.type === 'multiOperator' || isSchemeOperatorFlatFareTicket(ticket)) {
            tariff.GroupOfOperatorsRef = {
                version: '1.0',
                ref: 'operators@bus',
            };
            delete tariff.OperatorRef;
        } else {
            delete priceFareFrameToUpdate.tariffs.Tariff.GroupOfOperatorsRef;
        }

        // This is horrible but in the netex the timeIntervals need to come before the qualityStructureFactors and fareStructureElements
        const timeIntervals = { TimeInterval: getTimeIntervals(ticket) };
        const fareStructureElements = tariff.fareStructureElements;
        const qualityStructureFactors = tariff.qualityStructureFactors;
        delete tariff.fareStructureElements;
        delete tariff.qualityStructureFactors;
        delete tariff.timeIntervals;
        priceFareFrameToUpdate.tariffs.Tariff = {
            ...tariff,
            timeIntervals,
            qualityStructureFactors,
            fareStructureElements,
        };

        if ('lineName' in ticket) {
            return priceFareFrameToUpdate;
        }

        // Preassigned Fare Product
        priceFareFrameToUpdate.fareProducts.PreassignedFareProduct = getPreassignedFareProducts(
            ticket,
            coreData.nocCodeFormat,
            coreData.opIdNocFormat,
        );

        // Sales Offer Packages
        const salesOfferPackages = getSalesOfferPackageList(ticket, coreData.ticketUserConcat);
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage = salesOfferPackages.flat();

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

        fareTableFareFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRICE:${ticketIdentifier}@pass:op`;
        fareTableFareFrameToUpdate.Name.$t = `${ticketIdentifier} Prices`;
        fareTableFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${ticketIdentifier}@pass:op`;

        if ('lineName' in ticket) {
            fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(ticket);
            fareTableFareFrameToUpdate.fareTables.FareTable = getFareTables(
                ticket,
                coreData.lineIdName,
                coreData.ticketUserConcat,
            );
        } else if ('zoneName' in ticket && 'selectedServices' in ticket) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getHybridFareTable(
                ticket,
                coreData.placeholderGroupOfProductsName,
                coreData.ticketUserConcat,
            );
        } else if ('zoneName' in ticket) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getGeoZoneFareTable(
                ticket,
                coreData.placeholderGroupOfProductsName,
                coreData.ticketUserConcat,
            );
        } else if ('selectedServices' in ticket || 'schemeOperatorName' in ticket) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getMultiServiceFareTable(
                ticket,
                coreData.ticketUserConcat,
            );
        } else {
            assertNever(ticket);
        }

        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        let netexJson;

        if ('lineName' in ticket) {
            netexJson = await getNetexTemplateAsJson('point-to-point-tickets/pointToPointTicketNetexTemplate.xml');
        } else {
            netexJson = await getNetexTemplateAsJson('period-tickets/periodTicketNetexTemplate.xml');
        }

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

        // do we have a point to point products, such as singles/returns
        if ('lineName' in ticket) {
            netexFrames.FareFrame[0] = updateZoneFareFrame(netexFrames.FareFrame[0], ticket);
        } else {
            netexFrames.FareFrame[0] = updateNetworkFareFrame(netexFrames.FareFrame[0]);
        }

        netexFrames.FareFrame[1] = updatePriceFareFrame(netexFrames.FareFrame[1]);
        netexFrames.FareFrame[2] = updateFareTableFareFrame(netexFrames.FareFrame[2]);

        return convertJsonToXml(netexJson);
    };

    return { generate };
};

export default netexGenerator;
