import startCase from 'lodash/startCase';
import { PointToPointPeriodTicket, ReturnTicket, SelectedService, Ticket } from 'fdbt-types/matchingJsonTypes';
import {
    FareZone,
    FareZoneList,
    ScheduledStopPoints,
    Stop,
    PointToPointTicket,
    DistributionAssignment,
    SalesOfferPackageElement,
    SalesOfferPackage,
    BaseProduct,
    NetexSalesOfferPackage,
    isReturnTicket,
    CoreData,
    isPointToPointTicket,
} from '../../types';
import {
    NetexObject,
    getProfileRef,
    getDistributionChannel,
    getUserProfile,
    getCarnetQualityStructureFactorRef,
    getProductType,
} from '../sharedHelpers';

export const getStops = (fareZones: FareZone[]): Stop[] => fareZones.flatMap(zone => zone.stops);

export const getUniquePriceGroups = (fareZones: FareZone[]): string[] => [
    ...new Set(fareZones.flatMap(zone => zone.prices.flatMap(price => price.price))),
];

export const getIdName = (name: string): string => name.replace(/(\s)+/g, '_');

export const hasDuplicates = (array: string[]): boolean => {
    return new Set(array).size !== array.length;
};

export const hasDuplicatesWithinASingleFareZone = (fareZones: FareZone[]): boolean => {
    let hasDuplicatesWithinASingleFareZone = false;

    hasDuplicatesWithinASingleFareZone = fareZones.some(fz => {
        const stopsWithinFareZone = fz.stops;

        const atcoCodesOfStopsWithinFareZone = stopsWithinFareZone.map(s => s.atcoCode);

        const hasDuplicateStops = hasDuplicates(atcoCodesOfStopsWithinFareZone);

        return hasDuplicateStops;
    });

    return hasDuplicatesWithinASingleFareZone;
};

export const hasDuplicatesAcrossFareZones = (fareZones: FareZone[]): boolean => {
    const stops = getStops(fareZones);

    const stopsAtcoCodes = stops.map(s => s.atcoCode);

    const hasDuplicateStops = hasDuplicates(stopsAtcoCodes);

    return hasDuplicateStops;
};

export const getPointToPointScheduledStopPointsList = (fareZones?: FareZone[]): ScheduledStopPoints[] => {
    if (!fareZones) {
        return [];
    }

    let stops = getStops(fareZones);

    if (stops.length !== 0) {
        const fareZonesWithDuplicateStopsRemoved = fareZones.map(fareZone => {
            const set = new Set();

            const stops = fareZone.stops.filter(o => {
                if (!set.has(o.atcoCode)) {
                    set.add(o.atcoCode);

                    return true;
                } else return false;
            });

            fareZone.stops = stops;

            return fareZone;
        });

        stops = getStops(fareZonesWithDuplicateStopsRemoved);

        // we want a copy (by value, not by reference) because we do not want to alter the fare zones array being passed in
        const copyOfFareZones = JSON.parse(JSON.stringify(fareZonesWithDuplicateStopsRemoved));

        const firstFareStage = copyOfFareZones[0];

        const firstStopInFirstFareStage = firstFareStage.stops[0];

        const lastFareStage = copyOfFareZones[copyOfFareZones.length - 1];

        const lastStopInLastFareStage = lastFareStage.stops[lastFareStage.stops.length - 1];

        if (firstStopInFirstFareStage.atcoCode === lastStopInLastFareStage.atcoCode) {
            // remove last element in the stops array
            lastFareStage.stops.pop();
        }

        stops = getStops(copyOfFareZones);
    }

    const set = new Set();

    const stopsWithDuplicatesRemoved = stops.filter(stop => {
        if (!set.has(stop.atcoCode)) {
            set.add(stop.atcoCode);

            return true;
        } else return false;
    });

    return stopsWithDuplicatesRemoved.map(stop => ({
        version: 'any',
        id: stop.atcoCode ? `atco:${stop.atcoCode}` : `naptan:${stop.naptanCode}`,
        Name: { $t: stop.stopName },
        NameSuffix: stop.indicator ? { $t: stop.indicator } : null,
        TopographicPlaceView: {
            TopographicPlaceRef: { ref: `nptgLocality:${stop.localityCode}` },
            Name: { $t: stop.localityName },
            QualifierName: { $t: stop.qualifierName },
        },
    }));
};

export const getPriceGroups = (matchingData: PointToPointTicket | PointToPointPeriodTicket): {}[] => {
    const fareZones = isReturnTicket(matchingData)
        ? [...matchingData.outboundFareZones, ...matchingData.inboundFareZones]
        : matchingData.fareZones;

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

export const getFareZoneList = (fareZones?: FareZone[]): FareZoneList[] => {
    if (!fareZones) {
        return [];
    }

    return fareZones.map(zone => ({
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
};

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
    productName: string,
): {}[] =>
    columns.flatMap((zone, columnNum) => {
        let rowCount = columns.length - columnNum;
        let order = 0;
        const columnRef = `Trip@${type}-SOP@${salesOfferPackageName}@${lineIdName}@${userType}@c${columnNum +
            1}@${getIdName(zone.name)}`;

        return {
            id: columnRef,
            version: '1.0',
            Name: { $t: `FareTable for ${productName}` },
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

export const getPointToPointAvailabilityElement = (
    ticket: PointToPointTicket | PointToPointPeriodTicket,
): NetexObject => ({
    version: '1.0',
    id: `Tariff@${ticket.type}@availability`,
    TypeOfFareStructureElementRef: {
        version: 'fxc:v1.0',
        ref: 'fxc:access_when',
    },
    qualityStructureFactors: {
        FareDemandFactorRef: {
            ref: 'op@Tariff@Demand',
            version: '1.0',
        },
    },
});

export const getPreassignedFareProduct = (
    matchingData: PointToPointTicket | PointToPointPeriodTicket,
    fareStructuresElements: NetexObject[],
    ticketUserConcat: string,
    productNameForPlainText: string,
    isCarnet: boolean,
): NetexObject => {
    const fareStructureElementRefs = fareStructuresElements.map(element => ({
        version: '1.0',
        ref: element.id,
    }));

    const productType = getProductType(matchingData);
    const hasCaps = matchingData.caps && matchingData.caps.length > 0;

    let typeOfFareProductRef = '';

    if (isCarnet) {
        typeOfFareProductRef = productType.includes('trip')
            ? 'fxc:standard_product@carnet@trips'
            : 'fxc:standard_product@carnet@days';
    } else {
        typeOfFareProductRef = `fxc:standard_product@trip@${matchingData.type === 'return' ? 'day_return' : 'single'}`;
    }

    return {
        id: `Trip@${ticketUserConcat}`,
        version: '1.0',
        Name: {
            $t: productNameForPlainText,
        },
        ChargingMomentRef: {
            versionRef: 'fxc:v1.0',
            ref: isCarnet ? 'fxc:prepayment@bundled' : hasCaps ? 'fxc:post_payment' : 'fxc:prepayment',
        },
        ChargingMomentType: {
            $t: hasCaps ? 'atEndOfTravel' : 'beforeTravel',
        },
        TypeOfFareProductRef: {
            version: '1.0',
            ref: typeOfFareProductRef,
        },
        validableElements: {
            ValidableElement: {
                id: `Trip@${ticketUserConcat}@travel`,
                version: '1.0',
                Name: { $t: `${matchingData.type} Ride` },
                fareStructureElements: {
                    FareStructureElementRef: fareStructureElementRefs,
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
        ProductType: {
            $t: productType,
        },
    };
};

export const getCappedDiscountRight = (matchingData: Ticket, ticketUserConcat: string, noc: string): NetexObject => {
    const getCappingRules = () => {
        if (matchingData.caps && matchingData.caps.length > 0) {
            return matchingData.caps?.map(cap => {
                return {
                    CappingRule: {
                        version: '1.0',
                        id: `op:${cap.capDetails.name}@${matchingData.type}_trip`,
                        Name: {
                            $t: cap.capDetails.name,
                        },
                        CappingPeriod: {
                            $t: cap.capDetails.durationUnits,
                        },
                        ValidableElementRef: {
                            version: '1.0',
                            ref: isPointToPointTicket(matchingData)
                                ? `Trip@${ticketUserConcat}@travel`
                                : `op:Pass@${matchingData.products[0].productName}_${matchingData.passengerType}@travel`,
                        },
                        GenericParameterAssignment: {
                            version: '1.0',
                            id: `${cap.capDetails.name}@${ticketUserConcat}`,
                            order: '1',
                            Name: {
                                $t: `limit a ${matchingData.passengerType} to ${cap.capDetails.durationAmount} ${cap.capDetails.durationUnits}`,
                            },
                            PreassignedFareProductRef: {
                                version: '1.0',
                                ref: isPointToPointTicket(matchingData)
                                    ? `Trip@${ticketUserConcat}`
                                    : `op:Pass@${matchingData.products[0].productName}_${matchingData.passengerType}`,
                            },
                            limitations: {
                                ...getProfileRef(matchingData),
                            },
                            TimeIntervalRef: {
                                version: '1.0',
                                ref: `op:Tariff@${cap.capDetails.name.replace(' ', '-')}@${
                                    cap.capDetails.durationAmount
                                }${cap.capDetails.durationUnits}`,
                            },
                        },
                    },
                };
            });
        }
        return [];
    };

    return {
        id: `op:Cap:@trip`,
        version: '1.0',
        Name: {
            $t: `Cap ${noc}`,
        },
        cappingRules: getCappingRules(),
    };
};

export const buildSalesOfferPackage = (
    salesOfferPackageInfo: SalesOfferPackage,
    ticketUserConcat: string,
    isCarnet: boolean,
    capId?: string,
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

    const buildSalesOfferPackageElements = (isCarnet: boolean, capId?: string): SalesOfferPackageElement[] => {
        const salesOfferPackageElements = salesOfferPackageInfo.ticketFormats.map((ticketFormat, index) => {
            return {
                id: `${salesOfferPackageInfo.name}@${ticketUserConcat}-SOP${capId ? '-cap' : ''}@${ticketFormat}`,
                version: '1.0',
                order: capId ? `${index + 2}` : `${index + 1}`,
                TypeOfTravelDocumentRef: {
                    version: 'fxc:v1.0',
                    ref: `fxc:${ticketFormat}`,
                },
                ...(capId
                    ? { CappedDiscountRightRef: { version: '1.0', ref: capId } }
                    : {
                          ...(isCarnet && {
                              AmountOfPriceUnitProductRef: { version: '1.0', ref: `Trip@${ticketUserConcat}` },
                          }),
                          ...(!isCarnet && {
                              PreassignedFareProductRef: {
                                  version: '1.0',
                                  ref: `Trip@${ticketUserConcat}`,
                              },
                          }),
                      }),
            };
        });
        return salesOfferPackageElements;
    };

    const salesOfferPackageElements = buildSalesOfferPackageElements(isCarnet);
    return {
        Name: {
            $t: salesOfferPackageInfo.name,
        },
        Description: {
            $t: salesOfferPackageInfo.description ?? '',
        },
        version: '1.0',
        id: `Trip@${ticketUserConcat}-SOP@${salesOfferPackageInfo.name}`,
        distributionAssignments: {
            DistributionAssignment: buildDistributionAssignments(),
        },
        salesOfferPackageElements: {
            SalesOfferPackageElement: [
                ...salesOfferPackageElements,
                ...(capId ? buildSalesOfferPackageElements(isCarnet, capId) : []),
            ],
        },
    };
};

export const buildSalesOfferPackages = (
    product: BaseProduct,
    ticketUserConcat: string,
    capId: string,
): NetexSalesOfferPackage[] => {
    return product.salesOfferPackages.map(salesOfferPackage => {
        return buildSalesOfferPackage(salesOfferPackage, ticketUserConcat, 'carnetDetails' in product, capId);
    });
};

export const getFareTables = (
    matchingData: PointToPointTicket | PointToPointPeriodTicket,
    lineIdName: string,
    ticketUserConcat: string,
    isCarnet: boolean,
): NetexObject[] => {
    const fareZones = isReturnTicket(matchingData) ? matchingData.outboundFareZones : matchingData.fareZones;

    return matchingData.products[0].salesOfferPackages.map(salesOfferPackage => {
        return {
            id: `Trip@${matchingData.type}-SOP@${salesOfferPackage.name}@Line_${lineIdName}@${matchingData.passengerType}`,
            version: '1.0',
            Name: { $t: `FareTable for ${matchingData.products[0].productName}` },
            Description: {
                $t: `${matchingData.passengerType} ${matchingData.type} fares - Organised as a fare triangle`,
            },
            pricesFor: {
                ...(isCarnet && {
                    AmountOfPriceUnitProductRef: {
                        version: '1.0',
                        ref: `Trip@${ticketUserConcat}`,
                    },
                }),
                ...(!isCarnet && {
                    PreassignedFareProductRef: {
                        version: '1.0',
                        ref: `Trip@${ticketUserConcat}`,
                    },
                }),
                SalesOfferPackageRef: {
                    version: '1.0',
                    ref: `Trip@${ticketUserConcat}-SOP@${salesOfferPackage.name}`,
                },
                ...getProfileRef(matchingData),
                ...getCarnetQualityStructureFactorRef(matchingData.products[0]),
            },
            usedIn: {
                TariffRef: { version: '1.0', ref: `Tariff@${matchingData.type}@${lineIdName}` },
            },
            specifics: {
                LineRef: {
                    version: '1.0',
                    ref: matchingData.lineId,
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
                    matchingData.products[0].productName,
                ),
            },
        };
    });
};

export const getCapFareTables = (matchingData: Ticket, lineIdName: string, coreData: CoreData): NetexObject[] => {
    if (matchingData.caps && matchingData.caps.length > 0) {
        return matchingData.caps.map(cap => {
            return {
                version: '1.0',
                id: `Trip@${matchingData.type}-cap@${cap.capDetails.name}@Line_${lineIdName}@${matchingData.passengerType}`,
                Name: { $t: `FareTable for ${cap.capDetails.name}` },
                pricesFor: {
                    CappedDiscountRightRef: {
                        version: '1.0',
                        ref: `op:Cap:@trip`,
                    },
                },
                OperatorRef: {
                    version: '1.0',
                    ref: coreData.nocCodeFormat,
                    $t: coreData.opIdNocFormat,
                },
                limitations: {
                    ...getProfileRef(matchingData),
                },
                prices: {
                    CappingRulePrice: {
                        version: '1.0',
                        id: `op:Price:${cap.capDetails.name}@${matchingData.type}_trip`,
                        Name: {
                            $t: 'Cap based on daily pass price',
                        },
                        Amount: {
                            $t: cap.capDetails.price,
                        },
                        CappingRuleRef: {
                            version: '1.0',
                            ref: `op:${cap.capDetails.name}@${matchingData.type}_trip`,
                        },
                    },
                },
            };
        });
    }
    return [];
};

/**
 * This method will combine `ticket.outboundFareZones` and `ticket.inboundFareZones`
 * by finding unique fare zones between inbound and outbound also combine their unique stops
 *
 * @param outbound an array of outbound fare zones.
 * @param inbound an array of inbound fare zones.
 *
 * @returns a new array combining the inbound and outbound without duplication of fare zones or their stops.
 */
export const combineFareZones = (outbound: FareZone[], inbound: FareZone[]): FareZone[] => {
    const combinedFareZones = [...outbound];

    inbound.forEach(zone => {
        const outboundZone = combinedFareZones.find(x => x.name === zone.name);
        if (!outboundZone) {
            combinedFareZones.push(zone);
        } else {
            zone.stops.forEach(stop => {
                if (!outboundZone.stops.some(s => s.naptanCode === stop.naptanCode)) {
                    outboundZone.stops.push(stop);
                }
            });
        }
    });

    return combinedFareZones;
};

export const getLinesElement = (
    ticket: PointToPointTicket | PointToPointPeriodTicket,
    lineIdName: string,
    lineName: string,
): NetexObject => {
    const typeOfPointToPoint = ticket.type;

    if (isReturnTicket(ticket) && ticket.additionalServices && ticket.additionalServices.length > 0) {
        const lineRefs = [
            {
                version: '1.0',
                ref: lineIdName,
            },
            {
                version: '1.0',
                ref: ticket.additionalServices[0].lineId,
            },
        ];

        return {
            version: '1.0',
            id: `Tariff@${typeOfPointToPoint}@lines`,
            Name: { $t: `O/D pairs for ${lineName}` },
            TypeOfFareStructureElementRef: {
                versionRef: 'fxc:v1.0',
                ref: 'fxc:access',
            },
            distanceMatrixElements: {
                DistanceMatrixElement: getDistanceMatrixElements(
                    combineFareZones(ticket.outboundFareZones, ticket.inboundFareZones),
                ),
            },
            GenericParameterAssignment: {
                version: '1.0',
                order: '01',
                id: `Tariff@${typeOfPointToPoint}@lines`,
                TypeOfAccessRightAssignmentRef: {
                    version: 'fxc:v1.0',
                    ref: 'fxc:can_access',
                },
                ValidityParameterGroupingType: { $t: 'XOR' },
                validityParameters: { LineRef: lineRefs },
            },
        };
    }

    return {
        version: '1.0',
        id: `Tariff@${typeOfPointToPoint}@lines`,
        Name: { $t: `O/D pairs for ${lineName}` },
        TypeOfFareStructureElementRef: {
            versionRef: 'fxc:v1.0',
            ref: 'fxc:access',
        },
        distanceMatrixElements: {
            DistanceMatrixElement: isReturnTicket(ticket)
                ? getDistanceMatrixElements(combineFareZones(ticket.outboundFareZones, ticket.inboundFareZones))
                : getDistanceMatrixElements(ticket.fareZones),
        },
        GenericParameterAssignment: {
            version: '1.0',
            order: '01',
            id: `Tariff@${typeOfPointToPoint}@lines`,
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:can_access',
            },
            ValidityParameterAssignmentType: { $t: 'EQ' },
            validityParameters: {
                LineRef: {
                    version: '1.0',
                    ref: lineIdName,
                },
            },
        },
    };
};

export const getEligibilityElement = (ticket: PointToPointTicket | PointToPointPeriodTicket): NetexObject => {
    const typeOfPointToPoint = ticket.type;
    const users = ticket.groupDefinition
        ? ticket.groupDefinition.companions
        : [
              {
                  ageRangeMin: ticket.ageRangeMin,
                  ageRangeMax: ticket.ageRangeMax,
                  passengerType: ticket.passengerType,
                  proofDocuments: ticket.proofDocuments,
              },
          ];

    return {
        version: '1.0',
        id: `Tariff@${typeOfPointToPoint}@eligibility`,
        Name: { $t: `eligible user types` },
        TypeOfFareStructureElementRef: {
            versionRef: 'fxc:v1.0',
            ref: 'fxc:eligibility',
        },
        GenericParameterAssignment: {
            version: '1.0',
            order: '1',
            id: `Tariff@${typeOfPointToPoint}@eligibility`,
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:eligible',
            },
            LimitationGroupingType: { $t: 'XOR' },
            limitations: {
                UserProfile: users.map((user, index) => {
                    return getUserProfile(user, index);
                }),
            },
        },
    };
};

export const getPointToPointConditionsElement = (ticket: PointToPointTicket): NetexObject => {
    const typeOfPointToPoint = ticket.type;
    let usagePeriodValidity = {};

    if (isReturnTicket(ticket) && ticket.returnPeriodValidity) {
        const years =
            ticket.returnPeriodValidity.typeOfDuration === 'year' ? `${ticket.returnPeriodValidity.amount}` : '0';
        const months =
            ticket.returnPeriodValidity.typeOfDuration === 'month' ? `${ticket.returnPeriodValidity.amount}` : '0';
        let days = '0';

        if (ticket.returnPeriodValidity.typeOfDuration === 'week') {
            days = String(Number(ticket.returnPeriodValidity.amount) * 7);
        } else if (ticket.returnPeriodValidity.typeOfDuration === 'day') {
            days = ticket.returnPeriodValidity.amount;
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
            },
        };
    }

    return {
        version: '1.0',
        id: `Tariff@${typeOfPointToPoint}@conditions_of_travel`,
        Name: { $t: 'Conditions of travel' },
        TypeOfFareStructureElementRef: {
            versionRef: 'fxc:v1.0',
            ref: 'fxc:travel_conditions',
        },
        GenericParameterAssignment: {
            version: '1.0',
            order: '1',
            id: `Tariff@${typeOfPointToPoint}@conditions_of_travel`,
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:condition_of_use',
            },
            LimitationGroupingType: { $t: 'AND' },
            limitations: {
                RoundTrip: {
                    version: '1.0',
                    id: `Tariff@${typeOfPointToPoint}@condition@direction`,
                    Name: { $t: `${startCase(typeOfPointToPoint)} Trip` },
                    TripType: { $t: `${typeOfPointToPoint}` },
                },
                FrequencyOfUse: {
                    version: '1.0',
                    id: `Tariff@${typeOfPointToPoint}@oneTrip`,
                    Name: { $t: 'One trip no transfers' },
                    FrequencyOfUseType: { $t: 'single' },
                    MaximalFrequency: { $t: '1' },
                },
                ...usagePeriodValidity,
            },
        },
    };
};

export const getAdditionalReturnLines = (
    ticket: ReturnTicket | PointToPointPeriodTicket,
    coreData: CoreData,
    additionalService: SelectedService,
): NetexObject[] => {
    const firstLine = {
        version: '1.0',
        id: coreData.lineIdName,
        Name: { $t: coreData.operatorPublicNameLineNameFormat },
        Description: { $t: ticket.serviceDescription },
        PublicCode: { $t: coreData.lineName },
        PrivateCode: { type: 'txc:Line@id', $t: coreData.lineIdName },
        OperatorRef: {
            version: '1.0',
            ref: coreData.nocCodeFormat,
            $t: coreData.opIdNocFormat,
        },
        LineType: { $t: 'local' },
    };
    const secondLine = {
        version: '1.0',
        id: additionalService.lineId,
        Name: { $t: `${ticket.operatorName} ${additionalService.lineName}` },
        Description: { $t: additionalService.serviceDescription },
        PublicCode: { $t: additionalService.lineName },
        PrivateCode: { type: 'txc:Line@id', $t: additionalService.lineId },
        OperatorRef: {
            version: '1.0',
            ref: coreData.nocCodeFormat,
            $t: coreData.opIdNocFormat,
        },
        LineType: { $t: 'local' },
    };
    return [firstLine, secondLine];
};
