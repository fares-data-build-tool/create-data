import { PointToPointPeriodTicket, PriceByDistanceProduct } from 'fdbt-types/matchingJsonTypes';
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
    isReturnTicket,
    ValidBetween,
} from '../types';
import {
    getExemptedGroupOfLinesList,
    getExemptedLinesList,
    getGeographicalIntervals,
    getGeoZoneFareTable,
    getGroupOfLinesList,
    getGroupOfOperators,
    getHybridFareTable,
    getLinesList,
    getMultiServiceFareTable,
    getOrganisations,
    getPreassignedFareProducts,
    getPricedByDistancePriceGroups,
    getSalesOfferPackageList,
    getScheduledStopPointsList,
    getTimeIntervals,
} from './period-tickets/periodTicketNetexHelpers';
import {
    buildSalesOfferPackages,
    getFareTables,
    getFareZoneList,
    getPointToPointScheduledStopPointsList,
    getPreassignedFareProduct,
    getPriceGroups,
    combineFareZones,
    getAdditionalReturnLines,
} from './point-to-point-tickets/pointToPointTicketNetexHelpers';
import {
    convertJsonToXml,
    getCoreData,
    getFareStructuresElements,
    getNetexMode,
    getNetexTemplateAsJson,
    getTimeRestrictions,
    isFlatFareType,
    isMultiOpFlatFareType,
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

        if (coreData.lineIdName) {
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.LineRef.ref =
                coreData.lineIdName;
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
                ref:
                    isFlatFareType(ticket) || isMultiOpFlatFareType(ticket)
                        ? 'fxc:standard_product@trip@single'
                        : 'fxc:standard_product@pass@period',
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

        let validBetween: ValidBetween = {
            FromDate: { $t: ticket.ticketPeriod.startDate },
        };
        if (ticket.ticketPeriod.endDate) {
            validBetween = { ...validBetween, ToDate: { $t: ticket.ticketPeriod.endDate } };
        }

        compositeFrameToUpdate.ValidBetween = validBetween;

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

            compositeFrameToUpdate.Description.$t =
                isFlatFareType(ticket) || isMultiOpFlatFareType(ticket)
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

        if (isMultiServiceTicket(ticket) || isSchemeOperatorFlatFareTicket(ticket)) {
            serviceFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:ServiceFrame_UK_PI_NETWORK:${coreData.placeholderGroupOfProductsName}:op`;

            const lines = getLinesList(ticket, coreData.url, operatorData);

            serviceFrameToUpdate.lines.Line = lines;

            serviceFrameToUpdate.groupsOfLines.GroupOfLines = getGroupOfLinesList(
                coreData.operatorIdentifier,
                false,
                lines,
            );

            return serviceFrameToUpdate;
        }

        if (isHybridTicket(ticket)) {
            serviceFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:ServiceFrame_UK_PI_NETWORK:${coreData.placeholderGroupOfProductsName}:op`;

            const allowedLines = getLinesList(ticket, coreData.url, operatorData);
            let exemptLines;
            let exemptGroupOfLines;

            if ('exemptedServices' in ticket && ticket.exemptedServices) {
                exemptLines = getExemptedLinesList(ticket.exemptedServices, ticket.nocCode, coreData.url);
                exemptGroupOfLines = getExemptedGroupOfLinesList(coreData.operatorIdentifier, exemptLines);
            }

            serviceFrameToUpdate.lines.Line = [...allowedLines, ...(!!exemptLines ? exemptLines : [])];

            const allowedGroupOfLines = getGroupOfLinesList(coreData.operatorIdentifier, true, allowedLines);

            serviceFrameToUpdate.groupsOfLines.GroupOfLines = [
                ...allowedGroupOfLines,
                ...(!!exemptGroupOfLines ? exemptGroupOfLines : []),
            ];

            return serviceFrameToUpdate;
        }

        if ('exemptedServices' in ticket && ticket.exemptedServices) {
            serviceFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:ServiceFrame_UK_PI_NETWORK:${coreData.placeholderGroupOfProductsName}:op`;

            const lines = getExemptedLinesList(ticket.exemptedServices, ticket.nocCode, coreData.url);

            serviceFrameToUpdate.lines.Line = lines;
            serviceFrameToUpdate.groupsOfLines.GroupOfLines = getExemptedGroupOfLinesList(
                coreData.operatorIdentifier,
                lines,
            );

            return serviceFrameToUpdate;
        }

        delete serviceFrameToUpdate.groupsOfLines;

        if ('lineName' in ticket) {
            serviceFrameToUpdate.id = `epd:UK:${ticket.nocCode}:ServiceFrame_UK_PI_NETWORK:${coreData.lineIdName}:op`;

            if (isReturnTicket(ticket) && ticket.additionalServices && ticket.additionalServices.length > 0) {
                serviceFrameToUpdate.lines.Line = getAdditionalReturnLines(
                    ticket,
                    coreData,
                    ticket.additionalServices[0],
                );
            } else {
                serviceFrameToUpdate.lines.Line.id = coreData.lineIdName;
                serviceFrameToUpdate.lines.Line.Name.$t = coreData.operatorPublicNameLineNameFormat;
                serviceFrameToUpdate.lines.Line.PublicCode.$t = coreData.lineName;
                serviceFrameToUpdate.lines.Line.PrivateCode.type = 'txc:Line@id';
                serviceFrameToUpdate.lines.Line.PrivateCode.$t = coreData.lineIdName;
                serviceFrameToUpdate.lines.Line.OperatorRef.ref = coreData.nocCodeFormat;
                serviceFrameToUpdate.lines.Line.OperatorRef.$t = coreData.opIdNocFormat;
                serviceFrameToUpdate.lines.Line.Description.$t = ticket.serviceDescription;
            }

            // do we have a return
            if (isReturnTicket(ticket)) {
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
    // UNLESS the multi service ticket has exempt stops, in which case it needs to create this group of
    // stops as a zone
    const updateNetworkFareFrame = (networkFareFrame: NetexObject): NetexObject | null => {
        const networkFareFrameToUpdate = { ...networkFareFrame };

        const fareZones = [];

        if ('exemptStops' in ticket && ticket.exemptStops) {
            const exemptFareZone = {
                version: '1.0',
                id: `op:${coreData.placeholderGroupOfProductsName}@$exempt_stops_zone`,
                Name: { $t: 'Zone of exempt stops' },
                Description: { $t: 'A zone made up of stops which are exempt from the product' },
                members: { ScheduledStopPointRef: getScheduledStopPointsList(ticket.exemptStops) },
                types: {
                    TypeOfZoneRef: {
                        ref: isMultiOperatorGeoZoneTicket(ticket)
                            ? 'fxc:fare_zone@multi_operator'
                            : 'fxc:fare_zone@operator',
                        version: 'fxc:v1.0',
                    },
                },
                ZoneTopology: { $t: 'nested' },
                ScopingMethod: { $t: 'explicitStops' },
            };

            fareZones.push(exemptFareZone);
        }

        if (isGeoZoneTicket(ticket) || isHybridTicket(ticket)) {
            networkFareFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${coreData.placeholderGroupOfProductsName}@pass:op`;
            networkFareFrameToUpdate.Name.$t = `${coreData.placeholderGroupOfProductsName} Network`;
            networkFareFrameToUpdate.prerequisites.ResourceFrameRef.ref = `epd:UK:${coreData.operatorIdentifier}:ResourceFrame_UK_PI_COMMON:${coreData.operatorIdentifier}:op`;

            const fareZone = {
                version: '1.0',
                id: `op:${coreData.placeholderGroupOfProductsName}@${ticket.zoneName}`,
                Name: { $t: `${ticket.zoneName}` },
                Description: { $t: `${ticket.zoneName} ${coreData.placeholderGroupOfProductsName} Zone` },
                members: { ScheduledStopPointRef: getScheduledStopPointsList(ticket.stops) },
                types: {
                    TypeOfZoneRef: {
                        ref: isMultiOperatorGeoZoneTicket(ticket)
                            ? 'fxc:fare_zone@multi_operator'
                            : 'fxc:fare_zone@operator',
                        version: 'fxc:v1.0',
                    },
                },
                ZoneTopology: { $t: 'nested' },
                ScopingMethod: { $t: 'explicitStops' },
            };

            fareZones.push(fareZone);

            // reversed so if there is an exemptFareZone, it comes 2nd
            networkFareFrameToUpdate.fareZones.FareZone = fareZones.reverse();

            return networkFareFrameToUpdate;
        }

        if (fareZones.length > 0) {
            networkFareFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${coreData.placeholderGroupOfProductsName}@pass:op`;
            networkFareFrameToUpdate.Name.$t = `${coreData.placeholderGroupOfProductsName} Network - exempt stops`;
            networkFareFrameToUpdate.prerequisites.ResourceFrameRef.ref = `epd:UK:${coreData.operatorIdentifier}:ResourceFrame_UK_PI_COMMON:${coreData.operatorIdentifier}:op`;

            networkFareFrameToUpdate.fareZones.FareZone = fareZones;

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
        const isPricedByDistance = 'pricingByDistance' in ticket.products[0];

        if (!isPricedByDistance) {
            delete priceFareFrameToUpdate.geographicalUnits;
            delete priceFareFrameToUpdate.tariffs.Tariff.GeographicalUnitRef;
            delete priceFareFrameToUpdate.tariffs.Tariff.geographicalIntervals;
        }

        priceFareFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${ticketIdentifier}@pass:op`;
        const tariff = priceFareFrameToUpdate.tariffs.Tariff;
        tariff.id = coreData.lineIdName
            ? `Tariff@${coreData.ticketType}@${coreData.lineIdName}`
            : `op:Tariff@${coreData.placeholderGroupOfProductsName}`;
        tariff.Name.$t = `Tariff for ${coreData.productNameForPlainText}`;

        const fareStructuresElements = getFareStructuresElements(
            ticket,
            coreData,
            'exemptedServices' in ticket,
            'exemptStops' in ticket,
        );
        tariff.fareStructureElements.FareStructureElement = fareStructuresElements;

        if (isFlatFareType(ticket) || isMultiOpFlatFareType(ticket)) {
            const typeOfTariffRef = isPricedByDistance ? 'fxc:Distance_kilometers' : 'fxc:flat';
            const tariffBasis = isPricedByDistance ? 'distance' : 'flat';

            tariff.TypeOfTariffRef = {
                version: 'fxc:v1.0',
                ref: typeOfTariffRef,
            };

            tariff.TariffBasis = { $t: tariffBasis };

            if (isPricedByDistance) {
                tariff.geographicalIntervals.GeographicalInterval = getGeographicalIntervals(
                    ticket.products[0] as PriceByDistanceProduct,
                );
            }
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

        if (coreData.lineIdName) {
            tariff.LineRef.ref = coreData.lineIdName;
        }

        if ('lineName' in ticket) {
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct = getPreassignedFareProduct(
                ticket,
                fareStructuresElements,
                coreData.ticketUserConcat,
                coreData.productNameForPlainText,
                coreData.isCarnet,
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
            coreData.isCarnet,
        );

        // Sales Offer Packages
        const salesOfferPackages = getSalesOfferPackageList(ticket, coreData.ticketUserConcat);
        priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage = salesOfferPackages.flat();

        return priceFareFrameToUpdate;
    };

    const updateFareTableFareFrame = (fareTableFareFrame: NetexObject): NetexObject => {
        const fareTableFareFrameToUpdate = { ...fareTableFareFrame };

        fareTableFareFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRICE:${ticketIdentifier}@pass:op`;
        fareTableFareFrameToUpdate.Name.$t = `Prices for ${coreData.productNameForPlainText}`;
        fareTableFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${ticketIdentifier}@pass:op`;

        if ('lineName' in ticket) {
            fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(ticket);
            fareTableFareFrameToUpdate.fareTables.FareTable = getFareTables(
                ticket,
                coreData.lineIdName,
                coreData.ticketUserConcat,
            );
        } else if ('zoneName' in ticket && 'selectedServices' in ticket) {
            delete fareTableFareFrameToUpdate.priceGroups;
            fareTableFareFrameToUpdate.fareTables.FareTable = getHybridFareTable(
                ticket,
                coreData.placeholderGroupOfProductsName,
                coreData.ticketUserConcat,
            );
        } else if ('zoneName' in ticket) {
            delete fareTableFareFrameToUpdate.priceGroups;
            fareTableFareFrameToUpdate.fareTables.FareTable = getGeoZoneFareTable(
                ticket,
                coreData.placeholderGroupOfProductsName,
                coreData.ticketUserConcat,
            );
        } else if ('selectedServices' in ticket || 'schemeOperatorName' in ticket) {
            if ('pricingByDistance' in ticket.products[0]) {
                delete fareTableFareFrameToUpdate.fareTables;
                fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPricedByDistancePriceGroups(
                    ticket.products[0],
                    coreData.ticketUserConcat,
                );
            } else {
                delete fareTableFareFrameToUpdate.priceGroups;
                fareTableFareFrameToUpdate.fareTables.FareTable = getMultiServiceFareTable(
                    ticket,
                    coreData.ticketUserConcat,
                );
            }
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
