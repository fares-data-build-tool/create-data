import {
    FareZone,
    FareZoneList,
    ScheduledStopPoints,
    Stop,
    PointToPointTicket,
    ReturnTicket,
    DistributionAssignment,
    SalesOfferPackageElement,
    SalesOfferPackage,
    BaseProduct,
    NetexSalesOfferPackage,
    FareStructureElement,
    isReturnTicket,
} from '../../types';
import { NetexObject, getProfileRef, isGroupTicket, getDistributionChannel } from '../sharedHelpers';

export const getStops = (fareZones: FareZone[]): Stop[] => fareZones.flatMap(zone => zone.stops);

export const getUniquePriceGroups = (fareZones: FareZone[]): string[] => [
    ...new Set(fareZones.flatMap(zone => zone.prices.flatMap(price => price.price))),
];

export const getIdName = (name: string): string => name.replace(/(\s)+/g, '_');

export const getPointToPointScheduledStopPointsList = (fareZones: FareZone[]): ScheduledStopPoints[] =>
    getStops(fareZones).map(stop => ({
        version: 'any',
        id: stop.atcoCode ? `atco:${stop.atcoCode}` : `naptan:${stop.naptanCode}`,
        Name: { $t: stop.stopName },
        TopographicPlaceView: {
            TopographicPlaceRef: { ref: `nptgLocality:${stop.localityCode}` },
            Name: { $t: stop.localityName },
            QualifierName: { $t: stop.qualifierName },
        },
    }));

export const getPriceGroups = (matchingData: PointToPointTicket): {}[] => {
    const fareZones = isReturnTicket(matchingData) ? matchingData.outboundFareZones : matchingData.fareZones;
    const priceGroups = getUniquePriceGroups(fareZones).map(price => ({
        version: '1.0',
        id: `price_band_${price}`,
        members: [
            {
                GeographicalIntervalPrice: {
                    version: '1.0',
                    id: `price_band_${price}@${matchingData.passengerType}`,
                    Amount: { $t: price },
                },
            },
        ],
    }));
    return priceGroups;
};

export const getFareZoneList = (fareZones: FareZone[]): FareZoneList[] =>
    fareZones.map(zone => ({
        version: '1.0',
        id: `fs@${getIdName(zone.name)}`,
        Name: { $t: zone.name },
        members: {
            ScheduledStopPointRef: zone.stops.map(stop => ({
                ref: stop.atcoCode ? `atco:${stop.atcoCode}` : `naptan:${stop.naptanCode}`,
                version: 'any',
                $t: `${stop.stopName}, ${stop.localityName}`,
            })),
        },
    }));

export const getDistanceMatrixElements = (fareZones: FareZone[]): {}[] =>
    fareZones.flatMap(zone =>
        zone.prices.flatMap(price =>
            price.fareZones.map(secondZone => ({
                version: '1.0',
                id: `${getIdName(zone.name)}+${getIdName(secondZone)}`,
                priceGroups: {
                    PriceGroupRef: {
                        version: '1.0',
                        ref: `price_band_${price.price}`,
                    },
                },
                StartTariffZoneRef: {
                    version: '1.0',
                    ref: `fs@${getIdName(zone.name)}`,
                },
                EndTariffZoneRef: {
                    version: '1.0',
                    ref: `fs@${getIdName(secondZone)}`,
                },
            })),
        ),
    );

export const getFareTableElements = (
    fareZones: FareZone[],
    lineIdName: string,
    elementPrefix: string,
    type: string,
    userType: string,
    salesOfferPackageName: string,
): {}[] =>
    fareZones.slice(0, -1).map((zone, index) => ({
        version: '1.0',
        id: `Trip@${type}-SOP@${salesOfferPackageName}@${lineIdName}@${userType}@${elementPrefix}${index +
            1}@${getIdName(zone.name)}`,
        order: index + 1,
        Name: { $t: zone.name },
    }));

export const getInnerFareTables = (
    columns: FareZone[],
    lineIdName: string,
    type: string,
    userType: string,
    salesOfferPackageName: string,
): {}[] =>
    columns.flatMap((zone, columnNum) => {
        let rowCount = columns.length - columnNum;
        let order = 0;
        const columnRef = `Trip@${type}-SOP@${salesOfferPackageName}@${lineIdName}@${userType}@c${columnNum +
            1}@${getIdName(zone.name)}`;

        return {
            id: columnRef,
            version: '1.0',
            Name: { $t: zone.name },
            Description: { $t: `Column ${columnNum + 1}` },
            cells: {
                Cell: zone.prices.flatMap(price =>
                    price.fareZones.map(secondZone => {
                        rowCount -= 1;
                        order += 1;

                        return {
                            version: '1.0',
                            id: `Trip@${type}-SOP@${salesOfferPackageName}@${lineIdName}@${userType}@${getIdName(
                                zone.name,
                            )}`,
                            order,
                            DistanceMatrixElementPrice: {
                                version: '1.0',
                                id: `Trip@${type}-SOP@${salesOfferPackageName}@${lineIdName}@${userType}@${getIdName(
                                    zone.name,
                                )}+${getIdName(secondZone)}`,
                                GeographicalIntervalPriceRef: {
                                    version: '1.0',
                                    ref: `price_band_${price.price}@${userType}`,
                                },
                                DistanceMatrixElementRef: {
                                    version: '1.0',
                                    ref: `${getIdName(zone.name)}+${getIdName(secondZone)}`,
                                },
                            },
                            ColumnRef: {
                                versionRef: '1',
                                ref: columnRef,
                            },
                            RowRef: {
                                versionRef: '1',
                                ref: `Trip@${type}-SOP@${salesOfferPackageName}@${lineIdName}@${userType}@r${rowCount +
                                    1}@${getIdName(secondZone)}`,
                            },
                        };
                    }),
                ),
            },
        };
    });

export const getAvailabilityElement = (id: string): NetexObject => ({
    version: '1.0',
    id,
    TypeOfFareStructureElementRef: {
        version: 'fxc:v1.0',
        ref: 'fxc:access',
    },
    qualityStructureFactors: {
        FareDemandFactorRef: {
            ref: 'op@Tariff@Demand',
            version: '1.0',
        },
    },
});

export const getPreassignedFareProduct = (matchingData: PointToPointTicket): NetexObject => {
    const ticketUserConcat = `${matchingData.type}_${matchingData.passengerType}`;
    const fareStructureElementList = [
        {
            version: '1.0',
            ref: `Tariff@${matchingData.type}@lines`,
        },
        {
            version: '1.0',
            ref: isGroupTicket(matchingData) ? 'op:Tariff@group' : `Tariff@${matchingData.type}@eligibility`,
        },
        {
            version: '1.0',
            ref: `Tariff@${matchingData.type}@conditions_of_travel`,
        },
    ];

    if (matchingData.timeRestriction.length > 0) {
        fareStructureElementList.push({
            version: '1.0',
            ref: `Tariff@${matchingData.type}@availability`,
        });
    }

    return {
        id: `Trip@${ticketUserConcat}`,
        version: '1.0',
        Name: {
            $t: `${matchingData.type} Ticket - ${matchingData.passengerType}`,
        },
        TypeOfFareProductRef: {
            version: '1.0',
            ref: `fxc:standard_product@trip@${matchingData.type === 'return' ? 'day_return' : 'single'}`,
        },
        validableElements: {
            ValidableElement: {
                id: `Trip@${ticketUserConcat}@travel`,
                version: '1.0',
                Name: { $t: `${matchingData.type} Ride` },
                fareStructureElements: {
                    FareStructureElementRef: fareStructureElementList,
                },
            },
        },
        accessRightsInProduct: {
            AccessRightInProduct: {
                id: `Trip@${ticketUserConcat}`,
                version: '1.0',
                order: '1',
                ValidableElementRef: {
                    version: '1.0',
                    ref: `Trip@${ticketUserConcat}@travel`,
                },
            },
        },
    };
};

export const buildSalesOfferPackage = (
    salesOfferPackageInfo: SalesOfferPackage,
    ticketUserConcat: string,
): NetexSalesOfferPackage => {
    const combineArrayedStrings = (strings: string[]): string => strings.join(' ');

    const buildDistributionAssignments = (): DistributionAssignment[] => {
        const distribAssignments = salesOfferPackageInfo.purchaseLocations.map((purchaseLocation, index) => {
            return {
                version: 'any',
                id: `Trip@${ticketUserConcat}-SOP@${salesOfferPackageInfo.name}@${purchaseLocation}`,
                order: `${index + 1}`,
                DistributionChannelRef: {
                    ref: `fxc:${getDistributionChannel(purchaseLocation)}`,
                    version: 'fxc:v1.0',
                },
                DistributionChannelType: { $t: `${purchaseLocation}` },
                PaymentMethods: {
                    $t: combineArrayedStrings(salesOfferPackageInfo.paymentMethods),
                },
            };
        });
        return distribAssignments;
    };

    const buildSalesOfferPackageElements = (): SalesOfferPackageElement[] => {
        const salesOfferPackageElements = salesOfferPackageInfo.ticketFormats.map((ticketFormat, index) => {
            return {
                id: `${salesOfferPackageInfo.name}@${ticketUserConcat}-SOP@${ticketFormat}`,
                version: '1.0',
                order: `${index + 1}`,
                TypeOfTravelDocumentRef: {
                    version: 'fxc:v1.0',
                    ref: `fxc:${ticketFormat}`,
                },
                PreassignedFareProductRef: {
                    version: '1.0',
                    ref: `Trip@${ticketUserConcat}`,
                },
            };
        });
        return salesOfferPackageElements;
    };

    return {
        Name: {
            $t: salesOfferPackageInfo.name,
        },
        Description: {
            $t: salesOfferPackageInfo.description,
        },
        version: '1.0',
        id: `Trip@${ticketUserConcat}-SOP@${salesOfferPackageInfo.name}`,
        distributionAssignments: {
            DistributionAssignment: buildDistributionAssignments(),
        },
        salesOfferPackageElements: {
            SalesOfferPackageElement: buildSalesOfferPackageElements(),
        },
    };
};

export const buildSalesOfferPackages = (product: BaseProduct, ticketUserConcat: string): NetexSalesOfferPackage[] => {
    return product.salesOfferPackages.map(salesOfferPackage => {
        return buildSalesOfferPackage(salesOfferPackage, ticketUserConcat);
    });
};

export const getFareTables = (matchingData: PointToPointTicket): NetexObject[] => {
    const fareZones = isReturnTicket(matchingData) ? matchingData.outboundFareZones : matchingData.fareZones;
    const ticketUserConcat = `${matchingData.type}_${matchingData.passengerType}`;
    const lineIdName = `Line_${matchingData.lineName}`;

    return matchingData.products[0].salesOfferPackages.map(salesOfferPackage => {
        return {
            id: `Trip@${matchingData.type}-SOP@${salesOfferPackage.name}@Line_${lineIdName}@${matchingData.passengerType}`,
            version: '1.0',
            Name: { $t: matchingData.serviceDescription },
            Description: {
                $t: `${matchingData.passengerType} ${matchingData.type} fares - Organised as a fare triangle`,
            },
            pricesFor: {
                PreassignedFareProductRef: {
                    version: '1.0',
                    ref: `Trip@${ticketUserConcat}`,
                },
                SalesOfferPackageRef: {
                    version: '1.0',
                    ref: `Trip@${ticketUserConcat}-SOP@${salesOfferPackage.name}`,
                },
                ...getProfileRef(matchingData),
            },
            usedIn: {
                TariffRef: { version: '1.0', ref: `Tariff@${matchingData.type}@${lineIdName}` },
            },
            specifics: {
                LineRef: {
                    version: '1.0',
                    ref: matchingData.lineName,
                },
            },
            columns: {
                FareTableColumn: getFareTableElements(
                    [...fareZones],
                    lineIdName,
                    'c',
                    matchingData.type,
                    matchingData.passengerType,
                    salesOfferPackage.name,
                ),
            },
            rows: {
                FareTableRow: getFareTableElements(
                    [...fareZones].reverse(),
                    lineIdName,
                    'r',
                    matchingData.type,
                    matchingData.passengerType,
                    salesOfferPackage.name,
                ),
            },
            includes: {
                FareTable: getInnerFareTables(
                    [...fareZones].slice(0, -1),
                    lineIdName,
                    matchingData.type,
                    matchingData.passengerType,
                    salesOfferPackage.name,
                ),
            },
        };
    });
};

export const getConditionsOfTravelFareStructureElement = (matchingData: ReturnTicket): FareStructureElement => {
    let usagePeriodValidity = {};

    if (matchingData.returnPeriodValidity) {
        const years =
            matchingData.returnPeriodValidity.typeOfDuration === 'year'
                ? `${matchingData.returnPeriodValidity.amount}`
                : '0';
        const months =
            matchingData.returnPeriodValidity.typeOfDuration === 'month'
                ? `${matchingData.returnPeriodValidity.amount}`
                : '0';
        let days = '0';

        if (matchingData.returnPeriodValidity.typeOfDuration === 'week') {
            days = String(Number(matchingData.returnPeriodValidity.amount) * 7);
        } else if (matchingData.returnPeriodValidity.typeOfDuration === 'day') {
            days = matchingData.returnPeriodValidity.amount;
        }

        usagePeriodValidity = {
            UsageValidityPeriod: {
                version: '1.0',
                id: `op:Trip@back@frequency`,
                UsageTrigger: { $t: 'startOutboundRide' },
                UsageEnd: {
                    $t: 'standardDuration',
                },
                StandardDuration: {
                    $t: `P${years}Y${months}M${days}D`,
                },
                ActivationMeans: { $t: 'noneRequired' },
            },
        };
    }
    return {
        id: 'Tariff@return@conditions_of_travel',
        version: '1.0',
        Name: { $t: 'Conditions of travel' },
        GenericParameterAssignment: {
            version: '1.0',
            order: '1',
            id: 'Tariff@return@conditions_of_travel',
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:condition_of_use',
            },
            LimitationGroupingType: { $t: 'AND' },
            limitations: {
                RoundTrip: {
                    version: '1.0',
                    id: 'Tariff@return@condition@direction',
                    Name: { $t: 'return Trip' },
                    TripType: { $t: 'return' },
                },
                FrequencyOfUse: {
                    version: '1.0',
                    id: 'Tariff@return@oneTrip',
                    Name: { $t: 'One trip no transfers' },
                },
                ...usagePeriodValidity,
            },
        },
    };
};
