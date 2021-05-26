import { startCase } from 'lodash';
import {
    getPointToPointScheduledStopPointsList,
    getFareZoneList,
    getDistanceMatrixElements,
    getPreassignedFareProduct,
    buildSalesOfferPackages,
    getConditionsOfTravelFareStructureElement,
    getAvailabilityElement,
    getPriceGroups,
    getFareTables,
} from './point-to-point-tickets/pointToPointTicketNetexHelpers';
import {
    getCoreData,
    NetexObject,
    getNetexTemplateAsJson,
    convertJsonToXml,
    getTimeRestrictions,
    getNetexMode,
    getUserProfile,
    getGroupElement,
    isFlatFareType,
} from './sharedHelpers';
import {
    Operator,
    PeriodTicket,
    PointToPointTicket,
    isSchemeOperatorTicket,
    isMultiOperatorGeoZoneTicket,
    isMultiOperatorMultipleServicesTicket,
    isPointToPointTicket,
    isMultiOperatorTicket,
    ScheduledStopPoints,
    FareZoneList,
    isSingleTicket,
    User,
    isReturnTicket,
    SchemeOperatorFlatFareTicket,
    SchemeOperatorGeoZoneTicket,
    ProductDetails,
    FlatFareProductDetails,
    isSchemeOperatorGeoZoneTicket,
    isSchemeOperatorFlatFareTicket,
    FlatFareTicket,
    isGeoZoneTicket,
    isBaseSchemeOperatorInfo,
    isMultiServiceTicket,
    isGroupTicket,
    isProductDetails,
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
    getOrganisations,
    getGroupOfOperators,
} from './period-tickets/periodTicketNetexHelpers';

const netexGenerator = (
    ticket:
        | PointToPointTicket
        | PeriodTicket
        | FlatFareTicket
        | SchemeOperatorGeoZoneTicket
        | SchemeOperatorFlatFareTicket,
    operatorData: Operator[],
): { generate: Function } => {
    const coreData = getCoreData(operatorData, ticket);
    const baseOperatorInfo = coreData.baseOperatorInfo[0];
    const ticketIdentifier: string = isPointToPointTicket(ticket)
        ? coreData.lineIdName
        : coreData.placeholderGroupOfProductsName;

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
        // update point to point only
        if (isPointToPointTicket(ticket)) {
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.LineRef.ref =
                coreData.lineName;
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.ref =
                coreData.nocCodeFormat;
            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.LineRef.ref =
                coreData.lineName;
        } else {
            // update period only
            publicationRequestToUpdate.topics.NetworkFrameTopic.TypeOfFrameRef.ref = `fxc:UK:DFT:TypeOfFrame_UK_PI_${
                isGeoZoneTicket(ticket) || isSchemeOperatorGeoZoneTicket(ticket) ? 'NETWORK' : 'LINE'
            }_FARE_OFFER:FXCP`;

            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.PreassignedFareProductRef = ticket.products.map(
                (product: ProductDetails | FlatFareProductDetails) => ({
                    version: '1.0',
                    ref: `op:Pass@${product.productName}_${ticket.passengerType}`,
                }),
            );

            publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.TypeOfFareProductRef = {
                version: 'fxc:v1.0',
                ref: isFlatFareType(ticket) ? 'fxc:standard_product@trip@single' : 'fxc:standard_product@pass@period',
            };

            // check if multiOperator and delete as required
            if (isMultiOperatorTicket(ticket) || isSchemeOperatorFlatFareTicket(ticket)) {
                publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.GroupOfOperatorsRef = {
                    version: '1.0',
                    ref: 'operators@bus',
                };
                delete publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences
                    .OperatorRef;
            } else {
                publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.ref =
                    coreData.nocCodeFormat;
                publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences.OperatorRef.$t =
                    coreData.opIdNocFormat;
                delete publicationRequestToUpdate.topics.NetworkFrameTopic.NetworkFilterByValue.objectReferences
                    .GroupOfOperatorsRef;
            }
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
            compositeFrameToUpdate.Description.$t = `${nocCode} ${lineIdName} is accessible as a ${ticketType} trip fare.  Prices are given zone to zone, where each zone is a linear group of stops, i.e. fare stage.`;
        } else {
            const operatorName = isSchemeOperatorTicket(ticket) ? ticket.schemeOperatorName : coreData.operatorName;
            compositeFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:CompositeFrame_UK_PI_${
                isGeoZoneTicket(ticket) || isSchemeOperatorGeoZoneTicket(ticket) ? 'NETWORK' : 'LINE'
            }_FARE_OFFER:Pass@${coreData.placeholderGroupOfProductsName}:op`;
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
        resourceFrameToUpdate.codespaces.Codespace.XmlnsUrl.$t = coreData.website;
        resourceFrameToUpdate.dataSources.DataSource.Email.$t = baseOperatorInfo.ttrteEnq;

        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref =
            coreData.nocCodeFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[0].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            coreData.operatorName;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.ref =
            coreData.nocCodeFormat;
        resourceFrameToUpdate.responsibilitySets.ResponsibilitySet[1].roles.ResponsibilityRoleAssignment.ResponsibleOrganisationRef.$t =
            coreData.operatorName;

        if (!isPointToPointTicket(ticket)) {
            resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.id = coreData.brandingId;
            resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Name.$t = coreData.operatorName;
            resourceFrameToUpdate.typesOfValue.ValueSet[0].values.Branding.Url.$t = coreData.website;
        } else {
            resourceFrameToUpdate.typesOfValue.ValueSet.values.Branding.id = coreData.brandingId;
        }

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
            resourceFrameToUpdate.organisations.Operator.ContactDetails.Phone.$t = baseOperatorInfo.fareEnq;
            resourceFrameToUpdate.organisations.Operator.ContactDetails.Url.$t = coreData.website;
            resourceFrameToUpdate.organisations.Operator.Address.Street.$t = baseOperatorInfo.complEnq;
            resourceFrameToUpdate.organisations.Operator.PrimaryMode.$t = getNetexMode(baseOperatorInfo.mode);
            resourceFrameToUpdate.organisations.Operator.CustomerServiceContactDetails.Email.$t =
                baseOperatorInfo.ttrteEnq;
        }

        return resourceFrameToUpdate;
    };

    const updateServiceFrame = (serviceFrame: NetexObject): NetexObject | null => {
        const serviceFrameToUpdate = { ...serviceFrame };
        if (isMultiServiceTicket(ticket) || isSchemeOperatorFlatFareTicket(ticket)) {
            serviceFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:ServiceFrame_UK_PI_NETWORK:${coreData.placeholderGroupOfProductsName}:op`;
            serviceFrameToUpdate.lines.Line = getLinesList(ticket, coreData.website, operatorData);

            return serviceFrameToUpdate;
        }
        if (isPointToPointTicket(ticket)) {
            serviceFrameToUpdate.id = `epd:UK:${ticket.nocCode}:ServiceFrame_UK_PI_NETWORK:${coreData.lineIdName}:op`;
            serviceFrameToUpdate.lines.Line.id = coreData.lineName;
            serviceFrameToUpdate.lines.Line.Name.$t = coreData.operatorPublicNameLineNameFormat;
            serviceFrameToUpdate.lines.Line.PublicCode.$t = coreData.lineName;
            if (coreData.lineIdName) {
                serviceFrameToUpdate.lines.Line.PrivateCode.type = 'txc:Line@id';
                serviceFrameToUpdate.lines.Line.PrivateCode.$t = coreData.lineIdName;
            } else {
                delete serviceFrameToUpdate.lines.Line.PrivateCode;
            }
            serviceFrameToUpdate.lines.Line.OperatorRef.ref = coreData.nocCodeFormat;
            serviceFrameToUpdate.lines.Line.OperatorRef.$t = coreData.opIdNocFormat;
            serviceFrameToUpdate.lines.Line.Description.$t = ticket.serviceDescription;

            if (isReturnTicket(ticket)) {
                const outboundStops = getPointToPointScheduledStopPointsList(ticket.outboundFareZones);
                const inboundStops = getPointToPointScheduledStopPointsList(ticket.inboundFareZones);
                const scheduledStopPointList: ScheduledStopPoints[] = outboundStops.concat(inboundStops);
                serviceFrameToUpdate.scheduledStopPoints.ScheduledStopPoint = [
                    ...new Set(scheduledStopPointList.map(({ id }) => id)),
                ].map(e => scheduledStopPointList.find(({ id }) => id === e));
            } else {
                serviceFrameToUpdate.scheduledStopPoints.ScheduledStopPoint = getPointToPointScheduledStopPointsList(
                    ticket.fareZones,
                );
            }

            return serviceFrameToUpdate;
        }
        return null;
    };

    // This method is called for all period-type tickets instead of 'updateZoneFareFrame'.
    // Only GeoZoneTickets need a NetworkFareFrame. MultiServiceTickets do not need a NetworkFareFrame.
    const updateNetworkFareFrame = (networkFareFrame: NetexObject): NetexObject | null => {
        if (isGeoZoneTicket(ticket)) {
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

    // This method is called for all point-to-point-type tickets instead of 'updateNetworkFareFrame'.
    const updateZoneFareFrame = (zoneFareFrame: NetexObject): NetexObject | null => {
        if (isPointToPointTicket(ticket)) {
            const zoneFareFrameToUpdate = { ...zoneFareFrame };
            zoneFareFrameToUpdate.id = `epd:UK:${ticket.nocCode}:FareFrame_UK_PI_FARE_NETWORK:${coreData.lineIdName}:op`;

            if (isReturnTicket(ticket)) {
                const outbound = getFareZoneList(ticket.outboundFareZones);
                const inbound = getFareZoneList(ticket.inboundFareZones);

                const fareZones: FareZoneList[] = inbound.concat(outbound);

                zoneFareFrameToUpdate.fareZones.FareZone = [...new Set(fareZones.map(({ id }) => id))].map(e =>
                    fareZones.find(({ id }) => id === e),
                );
            } else if (isSingleTicket(ticket)) {
                zoneFareFrameToUpdate.fareZones.FareZone = getFareZoneList(ticket.fareZones);
            }

            return zoneFareFrameToUpdate;
        }

        return null;
    };

    const updatePriceFareFrame = (priceFareFrame: NetexObject): NetexObject => {
        const priceFareFrameToUpdate = { ...priceFareFrame };

        priceFareFrameToUpdate.id = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${ticketIdentifier}@pass:op`;
        priceFareFrameToUpdate.tariffs.Tariff.id = isPointToPointTicket(ticket)
            ? `Tariff@${coreData.ticketType}@${coreData.lineIdName}`
            : `op:Tariff@${coreData.placeholderGroupOfProductsName}`;
        priceFareFrameToUpdate.tariffs.Tariff.Name.$t = `${
            coreData.operatorName
        } - ${ticketIdentifier} - Fares for ${startCase(coreData.ticketType)} ticket`;
        let validityCondition;

        if (isPointToPointTicket(ticket)) {
            const fareZones = isReturnTicket(ticket) ? ticket.outboundFareZones : ticket.fareZones;
            if (isSingleTicket(ticket) && ticket.termTime === true) {
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
            priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.ref = coreData.nocCodeFormat;
            priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.$t = coreData.opIdNocFormat;
            priceFareFrameToUpdate.tariffs.Tariff.LineRef.ref = coreData.lineName;

            if (ticket.timeRestriction.length > 0) {
                priceFareFrameToUpdate.tariffs.Tariff.qualityStructureFactors = getTimeRestrictions(
                    ticket.timeRestriction,
                );
            }

            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].Name.$t = `O/D pairs for ${coreData.lineName}`;
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].distanceMatrixElements.DistanceMatrixElement = getDistanceMatrixElements(
                fareZones,
            );
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.validityParameters.LineRef.ref =
                coreData.lineName;

            const users = isGroupTicket(ticket)
                ? ticket.groupDefinition.companions
                : [
                      {
                          ageRangeMin: ticket.ageRangeMin,
                          ageRangeMax: ticket.ageRangeMax,
                          passengerType: ticket.passengerType,
                          proofDocuments: ticket.proofDocuments,
                      } as User,
                  ];
            priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].GenericParameterAssignment.limitations.UserProfile = users.map(
                getUserProfile,
            );
            priceFareFrameToUpdate.fareProducts.PreassignedFareProduct = getPreassignedFareProduct(ticket);

            priceFareFrameToUpdate.salesOfferPackages.SalesOfferPackage = buildSalesOfferPackages(
                ticket.products[0],
                coreData.ticketUserConcat,
            );

            if (isReturnTicket(ticket)) {
                priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].id =
                    'Tariff@return@lines';
                priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[0].GenericParameterAssignment.id =
                    'Tariff@return@lines';

                priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].id =
                    'Tariff@return@eligibility';
                priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[1].GenericParameterAssignment.id =
                    'Tariff@return@eligibility';

                priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement[2] = getConditionsOfTravelFareStructureElement(
                    ticket,
                );
            }

            if (isGroupTicket(ticket)) {
                priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement.push(
                    getGroupElement(ticket),
                );
            }

            if (ticket.timeRestriction.length > 0) {
                priceFareFrameToUpdate.tariffs.Tariff.fareStructureElements.FareStructureElement.push(
                    getAvailabilityElement(`Tariff@${coreData.ticketType}@availability`),
                );
            }

            return priceFareFrameToUpdate;
        }

        if (isGeoZoneTicket(ticket)) {
            priceFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_NETWORK:${coreData.placeholderGroupOfProductsName}@pass:op`;
        } else if (isMultiServiceTicket(ticket) || isSchemeOperatorFlatFareTicket(ticket)) {
            priceFareFrameToUpdate.prerequisites = null;
        }

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

        if (ticket.type === 'multiOperator' || isSchemeOperatorFlatFareTicket(ticket)) {
            priceFareFrameToUpdate.tariffs.Tariff.GroupOfOperatorsRef = {
                version: '1.0',
                ref: 'operators@bus',
            };
            delete priceFareFrameToUpdate.tariffs.Tariff.OperatorRef;
        } else {
            priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.ref = coreData.nocCodeFormat;
            priceFareFrameToUpdate.tariffs.Tariff.OperatorRef.$t = coreData.opIdNocFormat;
            delete priceFareFrameToUpdate.tariffs.Tariff.GroupOfOperatorsRef;
        }

        // Time intervals
        if (isGeoZoneTicket(ticket) || (isMultiServiceTicket(ticket) && isProductDetails(ticket.products[0]))) {
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
            coreData.placeholderGroupOfProductsName,
        );

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

        const fareFrameId = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRICE:${ticketIdentifier}@pass:op`;
        fareTableFareFrameToUpdate.id = fareFrameId;
        fareTableFareFrameToUpdate.Name.$t = `${ticketIdentifier} Prices`;
        fareTableFareFrameToUpdate.prerequisites.FareFrameRef.ref = `epd:UK:${coreData.operatorIdentifier}:FareFrame_UK_PI_FARE_PRODUCT:${ticketIdentifier}@pass:op`;

        if (isPointToPointTicket(ticket)) {
            fareTableFareFrameToUpdate.priceGroups.PriceGroup = getPriceGroups(ticket);
            fareTableFareFrameToUpdate.fareTables.FareTable = getFareTables(ticket, coreData.lineIdName);
        } else if (isGeoZoneTicket(ticket)) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getGeoZoneFareTable(
                ticket,
                coreData.placeholderGroupOfProductsName,
                coreData.ticketUserConcat,
            );
        } else if (isMultiServiceTicket(ticket) || isSchemeOperatorFlatFareTicket(ticket)) {
            fareTableFareFrameToUpdate.fareTables.FareTable = getMultiServiceFareTable(
                ticket,
                coreData.ticketUserConcat,
            );
        }
        return fareTableFareFrameToUpdate;
    };

    const generate = async (): Promise<string> => {
        let netexJson;

        if (isPointToPointTicket(ticket)) {
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

        if (isPointToPointTicket(ticket)) {
            netexFrames.FareFrame[0] = updateZoneFareFrame(netexFrames.FareFrame[0]);
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
