import {
    FareZone,
    FareZoneList,
    ScheduledStopPoints,
    Stop,
    PointToPointTicket,
    ReturnTicket,
    SingleTicket,
} from '../../types';
import { NetexObject } from '../sharedHelpers';

export const isReturnTicket = (ticket: PointToPointTicket): ticket is ReturnTicket =>
    ((ticket as ReturnTicket).inboundFareZones !== undefined && (ticket as ReturnTicket).inboundFareZones.length > 0) ||
    ((ticket as ReturnTicket).outboundFareZones !== undefined && (ticket as ReturnTicket).outboundFareZones.length > 0);

export const isSingleTicket = (ticket: PointToPointTicket): ticket is SingleTicket =>
    (ticket as SingleTicket).fareZones !== undefined && (ticket as SingleTicket).fareZones.length > 0;

export const getStops = (fareZones: FareZone[]): Stop[] => fareZones.flatMap(zone => zone.stops);

export const getUniquePriceGroups = (fareZones: FareZone[]): string[] => [
    ...new Set(fareZones.flatMap(zone => zone.prices.flatMap(price => price.price))),
];

export const getIdName = (name: string): string => name.replace(/(\s)+/g, '_');

export const getScheduledStopPointsList = (fareZones: FareZone[]): ScheduledStopPoints[] =>
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
): {}[] =>
    fareZones.slice(0, -1).map((zone, index) => ({
        version: '1.0',
        id: `Trip@${type}-SOP@p-ticket@${lineIdName}@${userType}@${elementPrefix}${index + 1}@${getIdName(zone.name)}`,
        order: index + 1,
        Name: { $t: zone.name },
    }));

export const getInnerFareTables = (columns: FareZone[], lineIdName: string, type: string, userType: string): {}[] =>
    columns.flatMap((zone, columnNum) => {
        let rowCount = columns.length - columnNum;
        let order = 0;
        const columnRef = `Trip@${type}-SOP@p-ticket@${lineIdName}@${userType}@c${columnNum + 1}@${getIdName(
            zone.name,
        )}`;

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
                            id: `Trip@${type}-SOP@p-ticket@${lineIdName}@${userType}@${getIdName(zone.name)}`,
                            order,
                            DistanceMatrixElementPrice: {
                                version: '1.0',
                                id: `Trip@${type}-SOP@p-ticket@${lineIdName}@${userType}@${getIdName(
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
                                ref: `Trip@${type}-SOP@p-ticket@${lineIdName}@${userType}@r${rowCount + 1}@${getIdName(
                                    secondZone,
                                )}`,
                            },
                        };
                    }),
                ),
            },
        };
    });

export const getNetexMode = (mode: string): string => {
    const modeMap: { [key: string]: string } = {
        Bus: 'bus',
        Coach: 'coach',
        Tram: 'tram',
        Ferry: 'ferry',
    };

    return modeMap[mode] ?? 'other';
};

export const getUserProfile = (matchingData: PointToPointTicket): NetexObject => {
    let userProfile: NetexObject = {
        version: '1.0',
        id: matchingData.passengerType,
        Name: { $t: matchingData.passengerType },
        UserType: { $t: matchingData.passengerType },
    };
    if (matchingData.ageRange && matchingData.ageRange === 'Yes') {
        if (matchingData.ageRangeMin) {
            userProfile = {
                ...userProfile,
                MinimumAge: { $t: matchingData.ageRangeMin },
            };
        }
        if (matchingData.ageRangeMax) {
            userProfile = {
                ...userProfile,
                MaximumAge: { $t: matchingData.ageRangeMax },
            };
        }
    }
    if (matchingData.proof && matchingData.proof === 'Yes') {
        userProfile = {
            ...userProfile,
            ProofRequired: { $t: matchingData.proofDocuments?.join(' ') },
        };
    }
    return userProfile;
};

export const getPreassignedFareProduct = (matchingData: PointToPointTicket): NetexObject => {
    const ticketUserConcat = `${matchingData.type}_${matchingData.passengerType}`;
    return {
        id: `Trip@${ticketUserConcat}`,
        version: '1.0',
        Name: {
            $t: `${matchingData.type} Ticket - ${matchingData.passengerType}`,
        },
        TypeOfFareProductRef: {
            ref: `fxc:standard_product@trip@${matchingData.type}`,
        },
        validableElements: {
            ValidableElement: {
                id: `Trip@${ticketUserConcat}@travel`,
                version: '1.0',
                Name: { $t: `${matchingData.type} Ride` },
                fareStructureElements: {
                    FareStructureElementRef: [
                        {
                            ref: `Tariff@${matchingData.type}@lines`,
                        },
                        {
                            ref: `Tariff@${matchingData.type}@eligibility`,
                        },
                        {
                            ref: `Tariff@${matchingData.type}@conditions_of_travel`,
                        },
                    ],
                },
            },
        },
        accessRightsInProduct: {
            AccessRightInProduct: {
                id: `Trip@${ticketUserConcat}`,
                version: '1.0',
                order: '1',
                ValidableElementRef: {
                    ref: `Trip@${ticketUserConcat}@travel`,
                },
            },
        },
    };
};

export const getSalesOfferPackage = (matchingData: PointToPointTicket): NetexObject => {
    const ticketUserConcat = `${matchingData.type}_${matchingData.passengerType}`;
    return {
        version: '1.0',
        id: `Trip@${ticketUserConcat}-SOP@p-ticket`,
        BrandingRef: {
            ref: `${matchingData.nocCode}@brand`,
        },
        distributionAssignments: {
            DistributionAssignment: [
                {
                    version: '1.0',
                    id: `Trip@${ticketUserConcat}-SOP@p-ticket@atStop`,
                    order: '0',
                    Name: { $t: 'At Stop' },
                    Description: { $t: 'Bought at stop' },
                    DistributionChannelRef: {
                        ref: 'fxc:at_stop',
                        version: 'fxc:v1.0',
                    },
                    PaymentMethods: { $t: 'debitCard creditCard cash' },
                    FulfilmentMethodRef: {
                        ref: 'fxc:collect_from_machine',
                        version: 'fxc:v1.0',
                    },
                },
                {
                    version: '1.0',
                    id: `Trip@${ticketUserConcat}-SOP@p-ticket@onBoard`,
                    order: '1',
                    Name: { $t: 'Onboard' },
                    Description: { $t: 'Bought onboard' },
                    DistributionChannelRef: {
                        ref: 'fxc:on_board',
                        version: 'fxc:v1.0',
                    },
                    PaymentMethods: { $t: 'debitCard creditCard cash' },
                    FulfilmentMethodRef: {
                        ref: 'fxc:collect_on_board',
                        version: 'fxc:v1.0',
                    },
                },
            ],
        },
        salesOfferPackageElements: {
            SalesOfferPackageElement: {
                id: `Trip@${ticketUserConcat}-SOP@p-ticket`,
                version: '1.0',
                order: '2',
                TypeOfTravelDocumentRef: {
                    version: 'fxc:v1.0',
                    ref: 'fxc:printed_ticket',
                },
                PreassignedFareProductRef: {
                    ref: `Trip@${ticketUserConcat}`,
                },
            },
        },
    };
};

export const getFareTable = (matchingData: PointToPointTicket): NetexObject => {
    const fareZones = isReturnTicket(matchingData) ? matchingData.outboundFareZones : matchingData.fareZones;
    const ticketUserConcat = `${matchingData.type}_${matchingData.passengerType}`;
    const lineIdName = `Line_${matchingData.lineName}`;
    return {
        id: `Trip@${matchingData.type}-SOP@p-ticket@Line_${lineIdName}@${matchingData.passengerType}`,
        version: '1.0',
        Name: { $t: matchingData.serviceDescription },
        Description: { $t: `${matchingData.passengerType} ${matchingData.type} fares - Organised as a fare triangle` },
        pricesFor: {
            PreassignedFareProductRef: {
                ref: `Trip@${ticketUserConcat}`,
            },
            SalesOfferPackageRef: {
                ref: `Trip@${ticketUserConcat}-SOP@p-ticket`,
            },
            UserProfileRef: {
                ref: matchingData.passengerType,
            },
        },
        usedIn: {
            TariffRef: { version: '1.0', ref: `Tariff@${matchingData.type}@${lineIdName}` },
        },
        specifics: {
            LineRef: {
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
            ),
        },
        rows: {
            FareTableRow: getFareTableElements(
                [...fareZones].reverse(),
                lineIdName,
                'r',
                matchingData.type,
                matchingData.passengerType,
            ),
        },
        includes: {
            FareTable: getInnerFareTables(
                [...fareZones].slice(0, -1),
                lineIdName,
                matchingData.type,
                matchingData.passengerType,
            ),
        },
    };
};
