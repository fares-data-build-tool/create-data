import {
    FlatFareTicket,
    MultiOperatorMultipleServicesTicket,
    isMultiOperatorMultipleServicesTicket,
    GroupOfOperators,
    NetexOrganisationOperator,
    NetexSalesOfferPackage,
    Stop,
    PeriodTicket,
    PeriodMultipleServicesTicket,
    GeoZoneTicket,
    ScheduledStopPoint,
    TopographicProjectionRef,
    Line,
    LineRef,
    ProductDetails,
    DistributionAssignment,
    SalesOfferPackageElement,
    User,
    GroupCompanion,
    Operator,
    SelectedService,
    SchemeOperator,
    SchemeOperatorTicket,
    Ticket,
    isSchemeOperatorTicket,
} from '../../types/index';

import {
    getNetexMode,
    NetexObject,
    isGroupTicket,
    getUserProfile,
    getGroupElement,
    getProfileRef,
    getCleanWebsite,
    replaceIWBusCoNocCode,
    getDistributionChannel,
} from '../sharedHelpers';

export const isGeoZoneTicket = (ticket: Ticket): ticket is GeoZoneTicket =>
    (ticket as GeoZoneTicket).zoneName !== undefined;

export const isMultiServiceTicket = (ticket: Ticket): ticket is PeriodMultipleServicesTicket =>
    (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

export const isBaseSchemeOperatorInfo = (operatorInfo: Operator | SchemeOperator): operatorInfo is SchemeOperator =>
    (operatorInfo as SchemeOperator).schemeOperatorName !== undefined &&
    (operatorInfo as SchemeOperator).schemeOperatorRegionCode !== undefined;

export const getBaseSchemeOperatorInfo = (userPeriodTicket: SchemeOperatorTicket): SchemeOperator => ({
    schemeOperatorName: userPeriodTicket.schemeOperatorName,
    schemeOperatorRegionCode: userPeriodTicket.schemeOperatorRegionCode,
    website: '',
    ttrteEnq: '',
    opId: `${userPeriodTicket.schemeOperatorName}-${userPeriodTicket.schemeOperatorRegionCode}-opId`,
    vosaPsvLicenseName: '',
    fareEnq: '',
    complEnq: '',
    mode: 'bus',
});

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
    userPeriodTicket: PeriodMultipleServicesTicket | MultiOperatorMultipleServicesTicket,
): SelectedService[] => {
    let servicesList: SelectedService[] = [];

    if (isMultiOperatorMultipleServicesTicket(userPeriodTicket)) {
        servicesList = userPeriodTicket.additionalOperators.flatMap(operator => operator.selectedServices);
    }

    return servicesList.concat(userPeriodTicket.selectedServices);
};

export const getLinesList = (
    userPeriodTicket: PeriodMultipleServicesTicket | MultiOperatorMultipleServicesTicket,
    website: string,
    operatorData: Operator[],
): Line[] => {
    let linesList: Line[] = [];

    if (isMultiOperatorMultipleServicesTicket(userPeriodTicket)) {
        linesList = userPeriodTicket.additionalOperators.flatMap((operator): Line[] => {
            const currentOperator = operatorData.find(o => o.nocCode === operator.nocCode);

            return operator.selectedServices.map(service => ({
                version: '1.0',
                id: `op:${service.lineName}#${service.serviceCode}#${service.startDate}`,
                Name: { $t: `Line ${service.lineName}` },
                Description: { $t: service.serviceDescription },
                Url: { $t: currentOperator ? getCleanWebsite(currentOperator.website) : '' },
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
            }));
        });
    }

    linesList = linesList.concat(
        userPeriodTicket.selectedServices
            ? userPeriodTicket.selectedServices.map(service => ({
                  version: '1.0',
                  id: `op:${service.lineName}#${service.serviceCode}#${service.startDate}`,
                  Name: { $t: `Line ${service.lineName}` },
                  Description: { $t: service.serviceDescription },
                  Url: { $t: website },
                  PublicCode: { $t: service.lineName },
                  PrivateCode: { type: 'noc', $t: `${userPeriodTicket.nocCode}_${service.lineName}` },
                  OperatorRef: {
                      version: '1.0',
                      ref: `noc:${replaceIWBusCoNocCode(userPeriodTicket.nocCode)}`,
                  },
                  LineType: { $t: 'local' },
              }))
            : [],
    );
    return linesList;
};

export const getLineRefList = (userPeriodTicket: PeriodMultipleServicesTicket): LineRef[] =>
    userPeriodTicket.selectedServices
        ? getFullServicesList(userPeriodTicket).map(service => ({
              version: '1.0',
              ref: `op:${service.lineName}#${service.serviceCode}#${service.startDate}`,
          }))
        : [];

export const getGeoZoneFareTable = (
    userPeriodTicket: GeoZoneTicket,
    placeHolderGroupOfProductsName: string,
    ticketUserConcat: string,
): NetexObject[] => {
    const operatorIdentifier = isSchemeOperatorTicket(userPeriodTicket)
        ? `${userPeriodTicket.schemeOperatorName}-${userPeriodTicket.schemeOperatorRegionCode}`
        : userPeriodTicket.nocCode;
    const name = `${operatorIdentifier}-geo-zone`;
    const profileRef = getProfileRef(userPeriodTicket);

    return userPeriodTicket.products.map(product => ({
        version: '1.0',
        id: `op:${product.productName}@${userPeriodTicket.zoneName}`,
        Name: { $t: `${userPeriodTicket.zoneName}` },
        specifics: {
            TariffZoneRef: {
                version: '1.0',
                ref: `op:${placeHolderGroupOfProductsName}@${userPeriodTicket.zoneName}`,
            },
        },
        columns: {
            FareTableColumn: {
                version: '1.0',
                id: `op:${product.productName}@${userPeriodTicket.zoneName}`,
                Name: { $t: `${userPeriodTicket.zoneName}` },
                representing: {
                    TariffZoneRef: {
                        version: '1.0',
                        ref: `op:${placeHolderGroupOfProductsName}@${userPeriodTicket.zoneName}`,
                    },
                },
            },
        },
        includes: {
            FareTable: {
                version: '1.0',
                id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket`,
                Name: { $t: `${product.productName}` },
                pricesFor: {
                    SalesOfferPackageRef: {
                        version: '1.0',
                        ref: `Trip@${ticketUserConcat}-${product.productName}-SOP@${product.salesOfferPackages[0].name}`,
                    },
                },
                specifics: {
                    TypeOfTravelDocumentRef: {
                        version: '1.0',
                        ref: 'op:p-ticket',
                    },
                },
                columns: {
                    FareTableColumn: {
                        version: '1.0',
                        id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket`,
                        Name: { $t: `${product.productName}` },
                        representing: {
                            TypeOfTravelDocumentRef: {
                                version: '1.0',
                                ref: 'op:p-ticket',
                            },
                            ...profileRef,
                        },
                    },
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${userPeriodTicket.passengerType}`,
                        Name: { $t: `${product.productName} - ${userPeriodTicket.passengerType}` },
                        limitations: {
                            ...profileRef,
                        },
                        columns: {
                            FareTableColumn: {
                                version: '1.0',
                                id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${userPeriodTicket.passengerType}`,
                                Name: { $t: userPeriodTicket.passengerType },
                                representing: {
                                    TypeOfTravelDocumentRef: {
                                        version: '1.0',
                                        ref: 'op:p-ticket',
                                    },
                                    ...profileRef,
                                },
                            },
                        },
                        rows: {
                            FareTableRow: {
                                version: '1.0',
                                id: `op:${product.productName}@${name}@p-ticket@${product.productDuration.replace(
                                    ' ',
                                    '-',
                                )}`,
                                Name: { $t: product.productDuration },
                                representing: {
                                    TimeIntervalRef: {
                                        version: '1.0',
                                        ref: `op:Tariff@${product.productName}@${product.productDuration.replace(
                                            ' ',
                                            '-',
                                        )}`,
                                    },
                                },
                            },
                        },
                        cells: {
                            Cell: {
                                version: '1.0',
                                id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${
                                    userPeriodTicket.passengerType
                                }@${product.productDuration.replace(' ', '-')}`,
                                order: '1',
                                TimeIntervalPrice: {
                                    version: '1.0',
                                    id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${
                                        userPeriodTicket.passengerType
                                    }@${product.productDuration.replace(' ', '-')}`,
                                    Amount: { $t: `${product.productPrice}` },
                                    TimeIntervalRef: {
                                        version: '1.0',
                                        ref: `op:Tariff@${product.productName}@${product.productDuration.replace(
                                            ' ',
                                            '-',
                                        )}`,
                                    },
                                },
                                ColumnRef: {
                                    version: '1.0',
                                    ref: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${userPeriodTicket.passengerType}`,
                                },
                                RowRef: {
                                    version: '1.0',
                                    ref: `op:${product.productName}@${name}@p-ticket@${product.productDuration.replace(
                                        ' ',
                                        '-',
                                    )}`,
                                },
                            },
                        },
                    },
                },
            },
        },
    }));
};

const getMultiServiceList = (
    userPeriodTicket: PeriodMultipleServicesTicket,
    ticketUserConcat: string,
): NetexObject[] => {
    const name = `${userPeriodTicket.nocCode}-multi-service`;
    const profileRef = getProfileRef(userPeriodTicket);

    return userPeriodTicket.products.map(product => ({
        version: '1.0',
        id: `op:${product.productName}@${name}`,
        Name: { $t: name },
        specifics: null,
        columns: {
            FareTableColumn: {
                version: '1.0',
                id: `op:${product.productName}@${name}@p-ticket`,
                Name: { $t: name },
                representing: null,
            },
        },
        includes: {
            FareTable: {
                version: '1.0',
                id: `op:${product.productName}@${name}@all_media`,
                Name: { $t: `${product.productName}` },
                pricesFor: {
                    SalesOfferPackageRef: {
                        version: '1.0',
                        ref: `Trip@${ticketUserConcat}-${product.productName}-SOP@${product.salesOfferPackages[0].name}`,
                    },
                },
                specifics: {
                    TypeOfTravelDocumentRef: {
                        version: '1.0',
                        ref: 'op:p-ticket',
                    },
                },
                columns: {
                    FareTableColumn: {
                        version: '1.0',
                        id: `op:${product.productName}@${name}@all_media@paper`,
                        Name: { $t: `${product.productName}` },
                        representing: {
                            TypeOfTravelDocumentRef: {
                                version: '1.0',
                                ref: 'op:p-ticket',
                            },
                            ...profileRef,
                        },
                    },
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: `op:${product.productName}@${name}@p-ticket@${userPeriodTicket.passengerType}`,
                        Name: { $t: `${product.productName} - ${userPeriodTicket.passengerType}` },
                        limitations: {
                            ...profileRef,
                        },
                        columns: {
                            FareTableColumn: {
                                version: '1.0',
                                id: `op:${product.productName}@${name}@p-ticket@${userPeriodTicket.passengerType}`,
                                Name: { $t: userPeriodTicket.passengerType },
                                representing: {
                                    TypeOfTravelDocumentRef: {
                                        version: '1.0',
                                        ref: 'op:p-ticket',
                                    },
                                    ...profileRef,
                                },
                            },
                        },
                        rows: {
                            FareTableRow: {
                                version: '1.0',
                                id: `op:${product.productName}@${name}@p-ticket@${product.productDuration.replace(
                                    ' ',
                                    '-',
                                )}`,
                                Name: { $t: product.productDuration },
                                representing: {
                                    TimeIntervalRef: {
                                        version: '1.0',
                                        ref: `op:Tariff@${product.productName}@${product.productDuration.replace(
                                            ' ',
                                            '-',
                                        )}`,
                                    },
                                },
                            },
                        },
                        cells: {
                            Cell: {
                                version: '1.0',
                                id: `op:${product.productName}@${name}@p-ticket@${
                                    userPeriodTicket.passengerType
                                }@${product.productDuration.replace(' ', '-')}`,
                                order: '1',
                                TimeIntervalPrice: {
                                    version: '1.0',
                                    id: `op:${product.productName}@${name}@p-ticket@${
                                        userPeriodTicket.passengerType
                                    }@${product.productDuration.replace(' ', '-')}`,
                                    Amount: { $t: `${product.productPrice}` },
                                    TimeIntervalRef: {
                                        version: '1.0',
                                        ref: `op:Tariff@${product.productName}@${product.productDuration.replace(
                                            ' ',
                                            '-',
                                        )}`,
                                    },
                                },
                                ColumnRef: {
                                    version: '1.0',
                                    ref: `op:${product.productName}@${name}@p-ticket@${userPeriodTicket.passengerType}`,
                                },
                                RowRef: {
                                    version: '1.0',
                                    ref: `op:${product.productName}@${name}@p-ticket@${product.productDuration.replace(
                                        ' ',
                                        '-',
                                    )}`,
                                },
                            },
                        },
                    },
                },
            },
        },
    }));
};

const getFlatFareList = (userPeriodTicket: FlatFareTicket, ticketUserConcat: string): NetexObject[] =>
    userPeriodTicket.products.map(product => ({
        version: '1.0',
        id: `op:${product.productName}`,
        Name: { $t: `${product.productName}` },
        includes: {
            FareTable: {
                version: '1.0',
                id: `op:${product.productName}@p-ticket@${userPeriodTicket.passengerType}`,
                Name: { $t: `${product.productName}` },
                pricesFor: {
                    SalesOfferPackageRef: {
                        version: '1.0',
                        ref: `Trip@${ticketUserConcat}-${product.productName}-SOP@${product.salesOfferPackages[0].name}`,
                    },
                },
                limitations: {
                    ...getProfileRef(userPeriodTicket),
                },
                prices: {
                    DistanceMatrixElementPrice: {
                        version: '1.0',
                        id: `op:${product.productName}@p-ticket@${userPeriodTicket.passengerType}`,
                        Amount: { $t: `${product.productPrice}` },
                    },
                },
            },
        },
    }));

export const getMultiServiceFareTable = (
    userPeriodTicket: PeriodMultipleServicesTicket,
    ticketUserConcat: string,
): NetexObject[] => {
    if (userPeriodTicket.products[0].productDuration) {
        return getMultiServiceList(userPeriodTicket, ticketUserConcat);
    }

    return getFlatFareList(userPeriodTicket, ticketUserConcat);
};

export const getSalesOfferPackageList = (
    userPeriodTicket: PeriodTicket | SchemeOperatorTicket,
    ticketUserConcat: string,
): NetexSalesOfferPackage[][] =>
    userPeriodTicket.products.map(product => {
        return product.salesOfferPackages.map(salesOfferPackage => {
            const combineArrayedStrings = (strings: string[]): string => strings.join(' ');

            const buildDistributionAssignments = (): DistributionAssignment[] => {
                const distribAssignments = salesOfferPackage.purchaseLocations.map((purchaseLocation, index) => {
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
                return distribAssignments;
            };

            const buildSalesOfferPackageElements = (): SalesOfferPackageElement[] => {
                const salesOfferPackageElements = salesOfferPackage.ticketFormats.map((ticketFormat, index) => {
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
                return salesOfferPackageElements;
            };
            return {
                version: '1.0',
                id: `Trip@${ticketUserConcat}-${product.productName}-SOP@${salesOfferPackage.name}`,
                Name: {
                    $t: `${product.productName} - ${userPeriodTicket.passengerType} - ${salesOfferPackage.name}`,
                },
                Description: { $t: `${salesOfferPackage.description}` },
                distributionAssignments: { DistributionAssignment: buildDistributionAssignments() },
                salesOfferPackageElements: { SalesOfferPackageElement: buildSalesOfferPackageElements() },
            };
        });
    });

const getPeriodTicketFareStructureElementRefs = (
    elementZeroRef: string,
    product: ProductDetails,
    passengerType: string,
): NetexObject[] => [
    {
        version: '1.0',
        ref: elementZeroRef,
    },
    {
        version: '1.0',
        ref: `op:Tariff@${product.productName}@durations@${passengerType}`,
    },
    {
        version: '1.0',
        ref: `op:Tariff@${product.productName}@conditions_of_travel`,
    },
];

const getFlatFareFareStructureElementRefs = (elementZeroRef: string, product: ProductDetails): NetexObject[] => [
    {
        version: '1.0',
        ref: elementZeroRef,
    },
    {
        version: '1.0',
        ref: `op:Tariff@${product.productName}@conditions_of_travel`,
    },
];

export const getPreassignedFareProducts = (
    userPeriodTicket: PeriodTicket | SchemeOperatorTicket,
    nocCodeNocFormat: string,
    opIdNocFormat: string,
): NetexObject[] => {
    const { passengerType } = userPeriodTicket;
    return userPeriodTicket.products.map(product => {
        let elementZeroRef: string;
        let fareStructureElementRefs: NetexObject;

        if (isGeoZoneTicket(userPeriodTicket)) {
            elementZeroRef = `op:Tariff@${product.productName}@access_zones`;
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            elementZeroRef = `op:Tariff@${product.productName}@access_lines`;
        } else {
            elementZeroRef = '';
        }

        if (
            isGeoZoneTicket(userPeriodTicket) ||
            (isMultiServiceTicket(userPeriodTicket) && userPeriodTicket.products[0].productDuration)
        ) {
            fareStructureElementRefs = getPeriodTicketFareStructureElementRefs(elementZeroRef, product, passengerType);
        } else {
            fareStructureElementRefs = getFlatFareFareStructureElementRefs(elementZeroRef, product);
        }

        if (isGroupTicket(userPeriodTicket)) {
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
                $t: `${product.productName} Pass - ${passengerType}`,
            },
            ChargingMomentType: {
                $t: 'beforeTravel',
            },
            typesOfFareProduct: {
                TypeOfFareProductRef: {
                    version: 'fxc:v1.0',
                    ref: 'fxc:standard_product@pass@period',
                },
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
                $t: 'periodPass',
            },
        };
    });
};

export const getTimeIntervals = (userPeriodTicket: PeriodTicket | SchemeOperatorTicket): NetexObject[] => {
    const timeIntervals = userPeriodTicket.products.map(product => {
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
    });

    return timeIntervals.flatMap(item => item);
};

const getAvailabilityElement = (
    id: string,
    validityParametersObject: object,
    hasTimeRestriction: boolean,
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
    },
});

const getDurationElement = (
    userPeriodTicket: PeriodTicket | SchemeOperatorTicket,
    product: ProductDetails,
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

const getEligibilityElement = (userPeriodTicket: PeriodTicket | SchemeOperatorTicket): NetexObject[] => {
    const users = isGroupTicket(userPeriodTicket)
        ? userPeriodTicket.groupDefinition.companions
        : [
              {
                  ageRangeMin: userPeriodTicket.ageRangeMin,
                  ageRangeMax: userPeriodTicket.ageRangeMax,
                  passengerType: userPeriodTicket.passengerType,
                  proofDocuments: userPeriodTicket.proofDocuments,
              } as User,
          ];

    return users.map((user: GroupCompanion | User) => ({
        version: '1.0',
        id: `op:Tariff@eligibility@${user.passengerType}`,
        Name: { $t: 'Eligible user types' },
        TypeOfFareStructureElementRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:eligibility',
        },
        GenericParameterAssignment: {
            id: `op:Tariff@${user.passengerType}`,
            version: '1.0',
            order: '0',
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:eligible',
            },
            LimitationGroupingType: { $t: 'XOR' },
            limitations: {
                UserProfile: getUserProfile(user),
            },
        },
    }));
};

const getConditionsElement = (
    userPeriodTicket: PeriodTicket | SchemeOperatorTicket,
    product: ProductDetails,
): NetexObject => {
    let usagePeriodValidity = {};

    if (product.productValidity) {
        usagePeriodValidity = {
            UsageValidityPeriod: {
                version: '1.0',
                id: `op:Trip@${product.productName}@back@frequency`,
                UsageTrigger: { $t: 'purchase' },
                UsageEnd: {
                    $t:
                        product.productValidity === 'endOfCalendarDay' || product.productValidity === 'endOfServiceDay'
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

export const getFareStructuresElements = (
    userPeriodTicket: PeriodTicket | SchemeOperatorTicket,
    placeHolderGroupOfProductsName: string,
): NetexObject[] => {
    const fareStructureElements = userPeriodTicket.products.flatMap((product: ProductDetails) => {
        let availabilityElementId = '';
        let validityParametersObject = {};
        const hasTimeRestriction = !!userPeriodTicket.timeRestriction && userPeriodTicket.timeRestriction.length > 0;

        if (isGeoZoneTicket(userPeriodTicket)) {
            availabilityElementId = `Tariff@${product.productName}@access_zones`;
            validityParametersObject = {
                FareZoneRef: {
                    version: '1.0',
                    ref: `op:${placeHolderGroupOfProductsName}@${userPeriodTicket.zoneName}`,
                },
            };
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            availabilityElementId = `Tariff@${product.productName}@access_lines`;
            validityParametersObject = { LineRef: getLineRefList(userPeriodTicket) };
        }

        if (
            isGeoZoneTicket(userPeriodTicket) ||
            (isMultiServiceTicket(userPeriodTicket) && userPeriodTicket.products[0].productDuration)
        ) {
            return [
                getAvailabilityElement(availabilityElementId, validityParametersObject, hasTimeRestriction),
                getDurationElement(userPeriodTicket, product),
                getConditionsElement(userPeriodTicket, product),
            ];
        }

        return [
            getAvailabilityElement(availabilityElementId, validityParametersObject, hasTimeRestriction),
            getConditionsElement(userPeriodTicket, product),
        ];
    });

    fareStructureElements.push(...getEligibilityElement(userPeriodTicket));

    if (isGroupTicket(userPeriodTicket)) {
        fareStructureElements.push(getGroupElement(userPeriodTicket));
    }

    return fareStructureElements;
};

export const getOrganisations = (
    operatorData: Operator[],
    baseOperatorInfo?: SchemeOperator,
): NetexOrganisationOperator[] => {
    const organisations = operatorData.map(operator => ({
        version: '1.0',
        id: `noc:${operator.nocCode}`,
        PublicCode: {
            $t: operator.nocCode,
        },
        Name: {
            $t: operator.operatorPublicName,
        },
        ShortName: {
            $t: operator.operatorPublicName,
        },
        TradingName: {
            $t: operator.vosaPsvLicenseName,
        },
        ContactDetails: {
            Phone: {
                $t: operator.fareEnq,
            },
            Url: {
                $t: getCleanWebsite(operator.website),
            },
        },
        Address: {
            Street: {
                $t: operator.complEnq,
            },
        },
        PrimaryMode: {
            $t: getNetexMode(operator.mode),
        },
    }));
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
                    $t: baseOperatorInfo.fareEnq,
                },
                Url: {
                    $t: baseOperatorInfo.website,
                },
            },
            Address: {
                Street: {
                    $t: baseOperatorInfo.complEnq,
                },
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
        $t: operator.operatorPublicName,
    }));

    group.GroupOfOperators.members.OperatorRef = members;
    return group;
};
