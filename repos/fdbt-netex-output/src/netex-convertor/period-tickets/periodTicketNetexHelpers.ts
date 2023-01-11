import {
    FlatFareGeoZoneTicket,
    FlatFareTicket,
    SelectedService,
    PeriodMultipleServicesTicket,
    SchemeOperatorTicket,
    SchemeOperatorMultiServiceTicket,
    SchemeOperatorGeoZoneTicket,
} from 'fdbt-types/matchingJsonTypes';

import * as db from '../../data/auroradb';

import {
    DistributionAssignment,
    GeoZoneTicket,
    GroupCompanion,
    GroupOfLines,
    GroupOfOperators,
    HybridPeriodTicket,
    isGeoZoneTicket,
    isHybridTicket,
    isMultiOperatorMultipleServicesTicket,
    isMultiServiceTicket,
    isSchemeOperatorFlatFareTicket,
    Line,
    LineRef,
    MultiOperatorMultipleServicesTicket,
    NetexOrganisationOperator,
    NetexSalesOfferPackage,
    Operator,
    PeriodTicket,
    SalesOfferPackageElement,
    ScheduledStopPoint,
    SchemeOperator,
    SchemeOperatorFlatFareTicket,
    BaseSchemeOperatorTicket,
    Stop,
    Ticket,
    TopographicProjectionRef,
    User,
    OperatorWithExpandedAddress,
    SchemeOperatorWithExpandedAddress,
} from '../../types';

import {
    getCarnetQualityStructureFactorRef,
    getCleanWebsite,
    getDistributionChannel,
    getNetexMode,
    getProductType,
    getProfileRef,
    getUserProfile,
    isFlatFareType,
    NetexObject,
    replaceIWBusCoNocCode,
} from '../sharedHelpers';

export const getBaseSchemeOperatorInfo = async (
    userPeriodTicket: BaseSchemeOperatorTicket,
): Promise<SchemeOperatorWithExpandedAddress> => {
    const schemeOperator: SchemeOperator = {
        schemeOperatorName: userPeriodTicket.schemeOperatorName,
        schemeOperatorRegionCode: userPeriodTicket.schemeOperatorRegionCode,
        url: '',
        email: '',
        opId: `${userPeriodTicket.schemeOperatorName}-${userPeriodTicket.schemeOperatorRegionCode}-opId`,
        vosaPsvLicenseName: '',
        contactNumber: '',
        street: '',
        mode: 'bus',
    };

    const schemeCode = `${userPeriodTicket.schemeOperatorName.substr(0, 5)}${
        userPeriodTicket.schemeOperatorRegionCode
    }`.toUpperCase();

    const schemeDetails = await db.getOperatorDetailsByNoc(schemeCode);

    return { ...schemeOperator, ...schemeDetails };
};

export const getScheduledStopPointsList = (stops: Stop[]): ScheduledStopPoint[] =>
    stops.map((stop: Stop) => ({
        versionRef: 'EXTERNAL',
        ref: `naptStop:${stop.naptanCode}`,
        $t: `${stop.stopName}, ${stop.street}, ${stop.localityName}`,
    }));

export const getTopographicProjectionRefList = (stops: Stop[]): TopographicProjectionRef[] =>
    stops.map((stop: Stop) => ({
        versionRef: 'nptg:EXTERNAL',
        ref: `nptgLocality:${stop.localityCode}`,
        $t: `${stop.street}, ${stop.localityName}, ${stop.parentLocalityName}`,
    }));

const getFullServicesList = (
    userPeriodTicket:
        | PeriodMultipleServicesTicket
        | MultiOperatorMultipleServicesTicket
        | SchemeOperatorFlatFareTicket
        | SchemeOperatorMultiServiceTicket,
): SelectedService[] => {
    let servicesList: SelectedService[] = [];

    if ('additionalOperators' in userPeriodTicket) {
        servicesList = userPeriodTicket.additionalOperators.flatMap(operator => operator.selectedServices);
    }
    if ('selectedServices' in userPeriodTicket) {
        servicesList = servicesList.concat(userPeriodTicket.selectedServices);
    }
    return servicesList;
};

export const getLinesList = (
    userPeriodTicket:
        | PeriodMultipleServicesTicket
        | MultiOperatorMultipleServicesTicket
        | SchemeOperatorFlatFareTicket
        | SchemeOperatorMultiServiceTicket
        | HybridPeriodTicket,
    website: string,
    operatorData: Operator[],
): Line[] => {
    let linesList: Line[] = [];

    if (isMultiOperatorMultipleServicesTicket(userPeriodTicket) || isSchemeOperatorFlatFareTicket(userPeriodTicket)) {
        linesList = userPeriodTicket.additionalOperators.flatMap((operator): Line[] => {
            const currentOperator = operatorData.find(o => o.nocCode === operator.nocCode);

            const duplicateLines = operator.selectedServices
                ? operator.selectedServices.map(service => ({
                      version: '1.0',
                      id: service.lineId,
                      Name: { $t: `Line ${service.lineName}` },
                      Description: { $t: service.serviceDescription },
                      Url: { $t: currentOperator ? getCleanWebsite(currentOperator.url) : '' },
                      PublicCode: { $t: service.lineName },
                      PrivateCode: service.lineId
                          ? {
                                type: 'txc:Line@id',
                                $t: service.lineId,
                            }
                          : {},
                      OperatorRef: {
                          version: '1.0',
                          ref: `noc:${operator.nocCode}`,
                      },
                      LineType: { $t: 'local' },
                  }))
                : [];

            const seen: string[] = [];
            return duplicateLines?.filter(item => (seen.includes(item.id) ? false : seen.push(item.id))) ?? [];
        });
    }

    if (!isSchemeOperatorFlatFareTicket(userPeriodTicket)) {
        const duplicateLines = userPeriodTicket.selectedServices
            ? userPeriodTicket.selectedServices.map(service => ({
                  version: '1.0',
                  id: service.lineId,
                  Name: { $t: `Line ${service.lineName}` },
                  Description: { $t: service.serviceDescription },
                  Url: { $t: website },
                  PublicCode: { $t: service.lineName },
                  PrivateCode: service.lineId
                      ? {
                            type: 'txc:Line@id',
                            $t: service.lineId,
                        }
                      : {},
                  OperatorRef: {
                      version: '1.0',
                      ref: `noc:${replaceIWBusCoNocCode(userPeriodTicket.nocCode)}`,
                  },
                  LineType: { $t: 'local' },
              }))
            : [];
        const seen: string[] = [];
        return (
            linesList?.concat(duplicateLines?.filter(item => (seen.includes(item.id) ? false : seen.push(item.id)))) ??
            []
        );
    }

    return linesList;
};

export const getGroupOfLinesList = (operatorIdentifier: string, isHybrid: boolean, lines: Line[]): GroupOfLines[] => {
    const lineReferences = lines.map(line => line.id);
    return [
        {
            version: '1.0',
            id: `${operatorIdentifier}@groupOfLines@1`,
            Name: {
                $t: `A group of available${isHybrid ? ' additional' : ''} services.`,
            },
            members: {
                LineRef: lineReferences.map(lineRef => ({
                    version: '1.0',
                    ref: lineRef,
                })),
            },
        },
    ];
};

export const getLineRefList = (
    userPeriodTicket: PeriodMultipleServicesTicket | SchemeOperatorFlatFareTicket | SchemeOperatorMultiServiceTicket,
): LineRef[] => {
    const fullServicesList = getFullServicesList(userPeriodTicket);
    return fullServicesList.length > 0
        ? fullServicesList.map(service => ({
              version: '1.0',
              ref: service.lineId,
          }))
        : [];
};

export const getGeoZoneFareTable = (
    userPeriodTicket: GeoZoneTicket | FlatFareGeoZoneTicket | SchemeOperatorGeoZoneTicket,
    placeHolderGroupOfProductsName: string,
    ticketUserConcat: string,
): NetexObject[] => {
    return userPeriodTicket.products.flatMap((product, indexProduct) => {
        return product.salesOfferPackages.map((salesOfferPackage, indexSop) => {
            return {
                version: '1.0',
                id: `op:fareTable@${product.productName}@${salesOfferPackage.name}@zone`,
                Name: {
                    $t: `${product.productName} - ${salesOfferPackage.name} - ${userPeriodTicket.zoneName}`,
                },
                pricesFor: {
                    PreassignedFareProductRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}`,
                    },
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}@product-${indexProduct}@SOP-${indexSop}@zone`,
                        Name: {
                            $t: `FareTable for ${product.productName}`,
                        },
                        specifics: {
                            TariffZoneRef: {
                                version: '1.0',
                                ref: `op:${placeHolderGroupOfProductsName}@${userPeriodTicket.zoneName}`,
                            },
                        },
                        includes: {
                            FareTable: {
                                version: '1.0',
                                id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}@zone@nested`,
                                pricesFor: {
                                    SalesOfferPackageRef: {
                                        version: '1.0',
                                        ref: `Trip@${ticketUserConcat}-${product.productName}-SOP@${salesOfferPackage.name}`,
                                    },
                                    ...getCarnetQualityStructureFactorRef(product),
                                },
                                includes: {
                                    FareTable: {
                                        version: '1.0',
                                        id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}@zone@nested@prices`,
                                        limitations: {
                                            ...getProfileRef(userPeriodTicket),
                                        },
                                        prices:
                                            'productDuration' in product
                                                ? {
                                                      TimeIntervalPrice: {
                                                          version: '1.0',
                                                          id: `op:${product.productName}@${salesOfferPackage.name}@zone`,
                                                          Amount: {
                                                              $t: `${salesOfferPackage.price || product.productPrice}`,
                                                          },
                                                          TimeIntervalRef: {
                                                              version: '1.0',
                                                              ref: `op:Tariff@${
                                                                  product.productName
                                                              }@${product.productDuration.replace(' ', '-')}`,
                                                          },
                                                      },
                                                  }
                                                : {
                                                      DistanceMatrixElementPrice: {
                                                          version: '1.0',
                                                          id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}`,
                                                          Amount: {
                                                              $t: `${salesOfferPackage.price || product.productPrice}`,
                                                          },
                                                      },
                                                  },
                                    },
                                },
                            },
                        },
                    },
                },
            };
        });
    });
};

const getMultiServiceList = (
    userPeriodTicket: PeriodMultipleServicesTicket | SchemeOperatorMultiServiceTicket,
    ticketUserConcat: string,
): NetexObject[] => {
    return userPeriodTicket.products.flatMap((product, indexOne) => {
        return product.salesOfferPackages.map((salesOfferPackage, indexTwo) => {
            const ownServiceCount =
                'selectedServices' in userPeriodTicket ? userPeriodTicket.selectedServices.length : 0;
            const serviceCount =
                'additionalOperators' in userPeriodTicket
                    ? userPeriodTicket.additionalOperators.reduce(
                          (count, it) => count + it.selectedServices.length,
                          ownServiceCount,
                      )
                    : ownServiceCount;

            return {
                version: '1.0',
                id: `op:fareTable@${product.productName}@${salesOfferPackage.name}@services`,
                Name: {
                    $t: `${product.productName} - ${salesOfferPackage.name} - ${serviceCount} services`,
                },
                pricesFor: {
                    PreassignedFareProductRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}`,
                    },
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}@product-${indexOne}@SOP-${indexTwo}@service`,
                        Name: {
                            $t: `FareTable for ${product.productName}`,
                        },
                        includes: {
                            FareTable: {
                                version: '1.0',
                                id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}@service@nested`,
                                pricesFor: {
                                    SalesOfferPackageRef: {
                                        version: '1.0',
                                        ref: `Trip@${ticketUserConcat}-${product.productName}-SOP@${salesOfferPackage.name}`,
                                    },
                                    ...getCarnetQualityStructureFactorRef(product),
                                },
                                includes: {
                                    FareTable: {
                                        version: '1.0',
                                        id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}@service@nested@prices`,
                                        limitations: {
                                            ...getProfileRef(userPeriodTicket),
                                        },
                                        prices: {
                                            TimeIntervalPrice: {
                                                version: '1.0',
                                                id: `op:${product.productName}@${salesOfferPackage.name}@service`,
                                                Amount: { $t: `${salesOfferPackage.price || product.productPrice}` },
                                                TimeIntervalRef: {
                                                    version: '1.0',
                                                    ref: `op:Tariff@${
                                                        product.productName
                                                    }@${product.productDuration.replace(' ', '-')}`,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            };
        });
    });
};

const getFlatFareList = (
    userPeriodTicket: FlatFareTicket | SchemeOperatorFlatFareTicket,
    ticketUserConcat: string,
): NetexObject[] =>
    userPeriodTicket.products.flatMap(product => {
        return product.salesOfferPackages.map(salesOfferPackage => {
            return {
                version: '1.0',
                id: `op:${product.productName}@${salesOfferPackage.name}`,
                Name: { $t: `${product.productName}` },
                pricesFor: {
                    SalesOfferPackageRef: {
                        version: '1.0',
                        ref: `Trip@${ticketUserConcat}-${product.productName}-SOP@${salesOfferPackage.name}`,
                    },
                    ...getCarnetQualityStructureFactorRef(product),
                    PreassignedFareProductRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}`,
                    },
                },
                limitations: {
                    ...getProfileRef(userPeriodTicket),
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}`,
                        Name: {
                            $t: `FareTable for ${product.productName}`,
                        },
                        prices: {
                            DistanceMatrixElementPrice: {
                                version: '1.0',
                                id: `op:${product.productName}@${salesOfferPackage.name}@${userPeriodTicket.passengerType}`,
                                Amount: { $t: `${salesOfferPackage.price || product.productPrice}` },
                            },
                        },
                    },
                },
            };
        });
    });

export const getMultiServiceFareTable = (
    userPeriodTicket:
        | PeriodMultipleServicesTicket
        | SchemeOperatorFlatFareTicket
        | FlatFareTicket
        | SchemeOperatorMultiServiceTicket,
    ticketUserConcat: string,
): NetexObject[] => {
    if (userPeriodTicket.type === 'flatFare') {
        return getFlatFareList(userPeriodTicket, ticketUserConcat);
    } else {
        return getMultiServiceList(userPeriodTicket, ticketUserConcat);
    }
};

export const getHybridFareTable = (
    userPeriodTicket: HybridPeriodTicket,
    placeHolderGroupOfProductsName: string,
    ticketUserConcat: string,
): NetexObject[] => {
    return [
        ...getGeoZoneFareTable(userPeriodTicket, placeHolderGroupOfProductsName, ticketUserConcat),
        ...getMultiServiceFareTable(userPeriodTicket, ticketUserConcat),
    ];
};

export const getSalesOfferPackageList = (
    userPeriodTicket: PeriodTicket | FlatFareTicket | SchemeOperatorTicket,
    ticketUserConcat: string,
): NetexSalesOfferPackage[][] => {
    return userPeriodTicket.products.map(product => {
        return product.salesOfferPackages.map(salesOfferPackage => {
            const combineArrayedStrings = (strings: string[]): string => strings.join(' ');

            const buildDistributionAssignments = (): DistributionAssignment[] => {
                return salesOfferPackage.purchaseLocations.map((purchaseLocation, index) => {
                    return {
                        version: 'any',
                        id: `Trip@${ticketUserConcat}-${product.productName}-SOP@${salesOfferPackage.name}@${purchaseLocation}`,
                        order: `${index + 1}`,
                        DistributionChannelRef: {
                            ref: `fxc:${getDistributionChannel(purchaseLocation)}`,
                            version: 'fxc:v1.0',
                        },
                        DistributionChannelType: { $t: `${purchaseLocation}` },
                        PaymentMethods: {
                            $t: combineArrayedStrings(salesOfferPackage.paymentMethods),
                        },
                    };
                });
            };

            const buildSalesOfferPackageElements = (): SalesOfferPackageElement[] => {
                return salesOfferPackage.ticketFormats.map((ticketFormat, index) => {
                    return {
                        id: `Trip@${ticketUserConcat}-${product.productName}-${salesOfferPackage.name}@${ticketFormat}`,
                        version: '1.0',
                        order: `${index + 1}`,
                        TypeOfTravelDocumentRef: {
                            version: 'fxc:v1.0',
                            ref: `fxc:${ticketFormat}`,
                        },
                        PreassignedFareProductRef: {
                            version: '1.0',
                            ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}`,
                        },
                    };
                });
            };
            return {
                version: '1.0',
                id: `Trip@${ticketUserConcat}-${product.productName}-SOP@${salesOfferPackage.name}`,
                Name: {
                    $t: `${product.productName} - ${userPeriodTicket.passengerType} - ${salesOfferPackage.name}`,
                },
                Description: { $t: `${salesOfferPackage.description ?? ''}` },
                distributionAssignments: { DistributionAssignment: buildDistributionAssignments() },
                salesOfferPackageElements: { SalesOfferPackageElement: buildSalesOfferPackageElements() },
            };
        });
    });
};

const getPeriodTicketFareStructureElementRefs = (
    elementZeroRef: string,
    productName: string,
    passengerType: string,
): NetexObject[] => [
    {
        version: '1.0',
        ref: elementZeroRef,
    },
    {
        version: '1.0',
        ref: `op:Tariff@${productName}@durations@${passengerType}`,
    },
    {
        version: '1.0',
        ref: `op:Tariff@${productName}@conditions_of_travel`,
    },
];

const getFlatFareFareStructureElementRefs = (elementZeroRef: string, productName: string): NetexObject[] => [
    {
        version: '1.0',
        ref: elementZeroRef,
    },
    {
        version: '1.0',
        ref: `op:Tariff@${productName}@conditions_of_travel`,
    },
];

export const getPreassignedFareProducts = (
    userPeriodTicket: PeriodTicket | FlatFareTicket | SchemeOperatorTicket,
    nocCodeNocFormat: string,
    opIdNocFormat: string,
    isCarnet: boolean,
): NetexObject[] => {
    const { passengerType } = userPeriodTicket;
    return userPeriodTicket.products.map(product => {
        let elementZeroRef = '';
        let fareStructureElementRefs: NetexObject;

        if (isGeoZoneTicket(userPeriodTicket) || isHybridTicket(userPeriodTicket)) {
            elementZeroRef = `op:Tariff@${product.productName}@access_zones`;
        } else if (isMultiServiceTicket(userPeriodTicket) || isSchemeOperatorFlatFareTicket(userPeriodTicket)) {
            elementZeroRef = `op:Tariff@${product.productName}@access_lines`;
        }

        if ('productDuration' in product) {
            fareStructureElementRefs = getPeriodTicketFareStructureElementRefs(
                elementZeroRef,
                product.productName,
                passengerType,
            );
        } else {
            fareStructureElementRefs = getFlatFareFareStructureElementRefs(elementZeroRef, product.productName);
        }

        if (userPeriodTicket.groupDefinition) {
            fareStructureElementRefs.push({
                version: '1.0',
                ref: `op:Tariff@group`,
            });
        } else {
            fareStructureElementRefs.push({
                version: '1.0',
                ref: `op:Tariff@eligibility@${passengerType}`,
            });
        }

        return {
            version: '1.0',
            id: `op:Pass@${product.productName}_${passengerType}`,
            Name: {
                $t: product.productName,
            },
            ChargingMomentRef: {
                versionRef: 'fxc:v1.0',
                ref: isCarnet ? 'fxc:prepayment@bundled' : 'fxc:prepayment',
            },
            ChargingMomentType: {
                $t: 'beforeTravel',
            },
            TypeOfFareProductRef: {
                version: 'fxc:v1.0',
                ref: isFlatFareType(userPeriodTicket)
                    ? 'fxc:standard_product@trip@single'
                    : 'fxc:standard_product@pass@period',
            },
            OperatorRef: {
                version: '1.0',
                ref: nocCodeNocFormat,
                $t: opIdNocFormat,
            },
            validableElements: {
                ValidableElement: {
                    version: '1.0',
                    id: `op:Pass@${product.productName}_${passengerType}@travel`,
                    Name: {
                        $t: 'Rides available for specified durations',
                    },
                    fareStructureElements: { FareStructureElementRef: fareStructureElementRefs },
                },
            },
            accessRightsInProduct: {
                AccessRightInProduct: {
                    version: '1.0',
                    id: `op:Pass@${product.productName}_${passengerType}@travel`,
                    order: '1',
                    ValidableElementRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}_${passengerType}@travel`,
                    },
                },
            },
            ProductType: {
                $t: getProductType(userPeriodTicket),
            },
        };
    });
};

export const getTimeIntervals = (ticket: Ticket): NetexObject[] | undefined => {
    const timeIntervals = ticket.products.flatMap(product => {
        if ('productDuration' in product && product.productDuration) {
            const amount = product.productDuration.split(' ')[0];
            const type = product.productDuration.split(' ')[1];
            let firstLetterOfType = type.charAt(0).toUpperCase();
            let finalAmount = amount;
            if (firstLetterOfType === 'W') {
                finalAmount = (Number(amount) * 7).toString();
                firstLetterOfType = 'D';
            }
            return {
                version: '1.0',
                id: `op:Tariff@${product.productName}@${product.productDuration.replace(' ', '-')}`,
                Name: { $t: `${product.productDuration}` },
                Description: { $t: `P${finalAmount}${firstLetterOfType}` },
            };
        }

        return [];
    });

    return timeIntervals.length ? timeIntervals : undefined;
};

export const getPeriodAvailabilityElement = (
    id: string,
    validityParametersObject: {},
    hasTimeRestriction: boolean,
    productName?: string,
    groupOfLinesRef?: string,
): NetexObject => ({
    version: '1.0',
    id: `op:${id}`,
    Name: { $t: 'Available lines and/or zones' },
    TypeOfFareStructureElementRef: {
        version: 'fxc:v1.0',
        ref: 'fxc:access',
    },
    qualityStructureFactors: hasTimeRestriction
        ? {
              FareDemandFactorRef: {
                  ref: 'op@Tariff@Demand',
                  version: '1.0',
              },
          }
        : null,
    GenericParameterAssignment: {
        id,
        version: '1.0',
        order: '1',
        TypeOfAccessRightAssignmentRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:can_access',
        },
        ValidityParameterGroupingType: { $t: 'OR' },
        validityParameters: validityParametersObject,
        includes: groupOfLinesRef
            ? {
                  GenericParameterAssignment: {
                      version: '1.0',
                      id: `${productName}-groupsOfLinesWrapper`,
                      order: '2',
                      TypeOfAccessRightAssignmentRef: {
                          version: 'fxc:v1.0',
                          ref: 'fxc:can_access',
                      },
                      validityParameters: {
                          GroupOfLinesRef: {
                              version: '1.0',
                              ref: groupOfLinesRef,
                          },
                      },
                  },
              }
            : null,
    },
});

export const getDurationElement = (
    userPeriodTicket: Ticket,
    product: { productName: string; productDuration: string },
): NetexObject => ({
    version: '1.0',
    id: `op:Tariff@${product.productName}@durations@${userPeriodTicket.passengerType}`,
    Name: { $t: `Available duration combination - ${userPeriodTicket.passengerType} ticket` },
    TypeOfFareStructureElementRef: {
        version: 'fxc:v1.0',
        ref: 'fxc:durations',
    },
    timeIntervals: {
        TimeIntervalRef: [
            {
                version: '1.0',
                ref: `op:Tariff@${product.productName}@${product.productDuration.replace(' ', '-')}`,
            },
        ],
    },
});

export const getPeriodEligibilityElement = (userPeriodTicket: Ticket): NetexObject[] => {
    const users = userPeriodTicket.groupDefinition
        ? userPeriodTicket.groupDefinition.companions
        : [
              {
                  ageRangeMin: userPeriodTicket.ageRangeMin,
                  ageRangeMax: userPeriodTicket.ageRangeMax,
                  passengerType: userPeriodTicket.passengerType,
                  proofDocuments: userPeriodTicket.proofDocuments,
              },
          ];

    return users.map((user: GroupCompanion | User, index) => ({
        version: '1.0',
        id: `op:Tariff@eligibility@${user.passengerType}${users.length > 1 ? `-${index}` : ''}`,
        Name: { $t: 'Eligible user types' },
        TypeOfFareStructureElementRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:eligibility',
        },
        GenericParameterAssignment: {
            id: `op:Tariff@${user.passengerType}-${index}`,
            version: '1.0',
            order: '0',
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:eligible',
            },
            LimitationGroupingType: { $t: 'XOR' },
            limitations: {
                UserProfile: getUserProfile(user, index),
            },
        },
    }));
};

export const getPeriodConditionsElement = (
    userPeriodTicket: Ticket,
    product: { productName: string; productValidity?: string },
): NetexObject => {
    let usagePeriodValidity = {};

    if ('productValidity' in product) {
        usagePeriodValidity = {
            UsageValidityPeriod: {
                version: '1.0',
                id: `op:Trip@${product.productName}@back@frequency`,
                UsageTrigger: { $t: 'purchase' },
                UsageEnd: {
                    $t:
                        product.productValidity === 'endOfCalendarDay' || product.productValidity === 'fareDayEnd'
                            ? 'endOfFareDay'
                            : 'standardDuration',
                },
                ActivationMeans: { $t: 'noneRequired' },
            },
        };
    }

    return {
        id: `op:Tariff@${product.productName}@conditions_of_travel`,
        version: '1.0',
        Name: { $t: 'Conditions of travel' },
        TypeOfFareStructureElementRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:travel_conditions',
        },
        GenericParameterAssignment: {
            version: '1.0',
            order: '1',
            id: `op:Tariff@${product.productName}@conditions_of_travel`,
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:condition_of_use',
            },
            LimitationGroupingType: { $t: 'AND' },
            limitations: {
                FrequencyOfUse: {
                    version: '1.0',
                    id: `op:Pass@${product.productName}@frequency`,
                    FrequencyOfUseType: { $t: userPeriodTicket.type === 'flatFare' ? 'single' : 'unlimited' },
                },
                ...usagePeriodValidity,
            },
        },
    };
};

export const getOrganisations = (
    operatorData: OperatorWithExpandedAddress[],
    baseOperatorInfo?: SchemeOperatorWithExpandedAddress,
): NetexOrganisationOperator[] => {
    const organisations = operatorData.map(operator => {
        const organisationOperator = {
            version: '1.0',
            id: `noc:${operator.nocCode}`,
            PublicCode: {
                $t: operator.nocCode,
            },
            Name: {
                $t: operator.operatorName,
            },
            ShortName: {
                $t: operator.operatorName,
            },
            TradingName: {
                $t: operator.vosaPsvLicenseName,
            },
            ContactDetails: {
                Phone: {
                    $t: operator.contactNumber,
                },
                Url: {
                    $t: getCleanWebsite(operator.url),
                },
            },
            Address: {
                Street: {
                    $t: operator.street,
                },
                ...('postcode' in operator
                    ? {
                          Town: { $t: operator.town },
                          PostCode: { $t: operator.postcode },
                          PostalRegion: { $t: operator.county },
                      }
                    : undefined),
            },
            PrimaryMode: {
                $t: getNetexMode(operator.mode),
            },
        };

        return organisationOperator;
    });

    if (baseOperatorInfo) {
        organisations.push({
            version: '1.0',
            id: `noc:${baseOperatorInfo.schemeOperatorName}-${baseOperatorInfo.schemeOperatorRegionCode}`,
            PublicCode: {
                $t: `${baseOperatorInfo.schemeOperatorName}-${baseOperatorInfo.schemeOperatorRegionCode}`,
            },
            Name: {
                $t: baseOperatorInfo.schemeOperatorName,
            },
            ShortName: {
                $t: baseOperatorInfo.schemeOperatorName,
            },
            TradingName: {
                $t: baseOperatorInfo.vosaPsvLicenseName,
            },
            ContactDetails: {
                Phone: {
                    $t: baseOperatorInfo.contactNumber,
                },
                Url: {
                    $t: baseOperatorInfo.url,
                },
            },
            Address: {
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
            },
            PrimaryMode: {
                $t: getNetexMode(baseOperatorInfo.mode),
            },
        });
    }

    return organisations;
};

export const getGroupOfOperators = (operatorData: Operator[]): GroupOfOperators => {
    const group: GroupOfOperators = {
        GroupOfOperators: {
            version: '1.0',
            id: 'operators@bus',
            Name: {
                $t: 'Bus Operators',
            },
            members: {
                OperatorRef: [],
            },
        },
    };
    const members = operatorData.map(operator => ({
        version: '1.0',
        ref: `noc:${operator.nocCode}`,
        $t: operator.operatorName,
    }));

    group.GroupOfOperators.members.OperatorRef = members;
    return group;
};
