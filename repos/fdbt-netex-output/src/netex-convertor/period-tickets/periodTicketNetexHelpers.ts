import _ from 'lodash';
import {
    Stop,
    Operator,
    PeriodTicket,
    PeriodMultipleServicesTicket,
    PeriodGeoZoneTicket,
    ScheduledStopPoint,
    TopographicProjectionRef,
    Line,
    LineRef,
    ProductDetails,
} from '../types';
import { getCleanWebsite, NetexObject } from '../sharedHelpers';

export const isGeoZoneTicket = (ticket: PeriodTicket): ticket is PeriodGeoZoneTicket =>
    (ticket as PeriodGeoZoneTicket).zoneName !== undefined;

export const isMultiServiceTicket = (ticket: PeriodTicket): ticket is PeriodMultipleServicesTicket =>
    (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

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

export const getLinesList = (userPeriodTicket: PeriodMultipleServicesTicket, operatorData: Operator): Line[] =>
    userPeriodTicket.selectedServices
        ? userPeriodTicket.selectedServices.map(service => ({
              version: '1.0',
              id: `op:${service.lineName}`,
              Name: { $t: `Line ${service.lineName}` },
              Description: { $t: service.serviceDescription },
              Url: { $t: getCleanWebsite(operatorData.website) },
              PublicCode: { $t: service.lineName },
              PrivateCode: { type: 'noc', $t: `${userPeriodTicket.nocCode}_${service.lineName}` },
              OperatorRef: { version: '1.0', ref: `noc:${userPeriodTicket.nocCode}` },
              LineType: { $t: 'local' },
          }))
        : [];

export const getLineRefList = (userPeriodTicket: PeriodMultipleServicesTicket): LineRef[] =>
    userPeriodTicket.selectedServices
        ? userPeriodTicket.selectedServices.map(service => ({
              version: '1.0',
              ref: `op:${service.lineName}`,
          }))
        : [];

export const getGeoZoneFareTable = (
    userPeriodTicket: PeriodGeoZoneTicket,
    placeHolderGroupOfProductsName: string,
): NetexObject[] =>
    userPeriodTicket.products.map(product => ({
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
                Name: { $t: `${product.productName} - Cash` },
                pricesFor: {
                    SalesOfferPackageRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}-SOP@p-ticket`,
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
                        Name: { $t: 'Cash' },
                        representing: {
                            TypeOfTravelDocumentRef: {
                                version: '1.0',
                                ref: 'op:p-ticket',
                            },
                            UserProfileRef: {
                                version: '1.0',
                                ref: `op:${product.productName}@${userPeriodTicket.passengerType}`,
                            },
                        },
                    },
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${userPeriodTicket.passengerType}`,
                        Name: { $t: `${product.productName} - Cash - ${userPeriodTicket.passengerType}` },
                        limitations: {
                            UserProfileRef: {
                                version: '1.0',
                                ref: `op:${product.productName}@${userPeriodTicket.passengerType}`,
                            },
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
                                    UserProfileRef: {
                                        version: '1.0',
                                        ref: `op:${product.productName}@${userPeriodTicket.passengerType}`,
                                    },
                                },
                            },
                        },
                        cells: {
                            Cell: {
                                version: '1.0',
                                id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${
                                    userPeriodTicket.passengerType
                                }@${product.productDuration}${product.productDuration === '1' ? 'day' : 'days'}`,
                                order: '1',
                                TimeIntervalPrice: {
                                    version: '1.0',
                                    id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${
                                        userPeriodTicket.passengerType
                                    }@${product.productDuration}${product.productDuration === '1' ? 'day' : 'days'}`,
                                    Amount: { $t: `${product.productPrice}` },
                                    TimeIntervalRef: {
                                        version: '1.0',
                                        ref: `op:Tariff@${product.productName}@${product.productDuration}${
                                            product.productDuration === '1' ? 'day' : 'days'
                                        }`,
                                    },
                                },
                                ColumnRef: {
                                    version: '1.0',
                                    ref: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@${userPeriodTicket.passengerType}`,
                                },
                                RowRef: {
                                    version: '1.0',
                                    ref: `op:${product.productName}@${product.productDuration}${
                                        product.productDuration === '1' ? 'day' : 'days'
                                    }`,
                                },
                            },
                        },
                    },
                },
            },
        },
    }));

const getMultiServiceList = (userPeriodTicket: PeriodMultipleServicesTicket): NetexObject[] => {
    const name = `${userPeriodTicket.nocCode}-multi-service`;

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
                id: `op:${product.productName}@${name}@p-ticket`,
                Name: { $t: `${product.productName} - Cash` },
                pricesFor: {
                    SalesOfferPackageRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}-SOP@p-ticket`,
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
                        id: `op:${product.productName}@${name}@p-ticket`,
                        Name: { $t: 'Cash' },
                        representing: {
                            TypeOfTravelDocumentRef: {
                                version: '1.0',
                                ref: 'op:p-ticket',
                            },
                            UserProfileRef: {
                                version: '1.0',
                                ref: `op:${product.productName}@${userPeriodTicket.passengerType}`,
                            },
                        },
                    },
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: `op:${product.productName}@${name}@p-ticket@${userPeriodTicket.passengerType}`,
                        Name: { $t: `${product.productName} - Cash - ${userPeriodTicket.passengerType}` },
                        limitations: {
                            UserProfileRef: {
                                version: '1.0',
                                ref: `op:${product.productName}@${userPeriodTicket.passengerType}`,
                            },
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
                                    UserProfileRef: {
                                        version: '1.0',
                                        ref: `op:${product.productName}@${userPeriodTicket.passengerType}`,
                                    },
                                },
                            },
                        },
                        cells: {
                            Cell: {
                                version: '1.0',
                                id: `op:${product.productName}@${name}@p-ticket@${userPeriodTicket.passengerType}@${
                                    product.productDuration
                                }${product.productDuration === '1' ? 'day' : 'days'}`,
                                order: '1',
                                TimeIntervalPrice: {
                                    version: '1.0',
                                    id: `op:${product.productName}@${name}@p-ticket@${userPeriodTicket.passengerType}@${
                                        product.productDuration
                                    }${product.productDuration === '1' ? 'day' : 'days'}`,
                                    Amount: { $t: `${product.productPrice}` },
                                    TimeIntervalRef: {
                                        version: '1.0',
                                        ref: `op:Tariff@${product.productName}@${product.productDuration}${
                                            product.productDuration === '1' ? 'day' : 'days'
                                        }`,
                                    },
                                },
                                ColumnRef: {
                                    version: '1.0',
                                    ref: `op:${product.productName}@${name}@p-ticket@${userPeriodTicket.passengerType}`,
                                },
                                RowRef: {
                                    version: '1.0',
                                    ref: `op:${product.productName}@${product.productDuration}${
                                        product.productDuration === '1' ? 'day' : 'days'
                                    }`,
                                },
                            },
                        },
                    },
                },
            },
        },
    }));
};

const getFlatFareList = (userPeriodTicket: PeriodMultipleServicesTicket): NetexObject[] =>
    userPeriodTicket.products.map(product => ({
        version: '1.0',
        id: `op:${product.productName}`,
        Name: { $t: `${product.productName}` },
        includes: {
            FareTable: {
                version: '1.0',
                id: `op:${product.productName}@p-ticket@${userPeriodTicket.passengerType}`,
                Name: { $t: `${product.productName} - Cash` },
                pricesFor: {
                    SalesOfferPackageRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}-SOP@p-ticket`,
                    },
                },
                limitations: {
                    UserProfileRef: {
                        version: '1.0',
                        ref: `op:${product.productName}@${userPeriodTicket.passengerType}`,
                    },
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

export const getMultiServiceFareTable = (userPeriodTicket: PeriodMultipleServicesTicket): NetexObject[] => {
    if (userPeriodTicket.products[0].productDuration) {
        return getMultiServiceList(userPeriodTicket);
    }

    return getFlatFareList(userPeriodTicket);
};

export const getSalesOfferPackageList = (userPeriodTicket: PeriodTicket): NetexObject[] =>
    userPeriodTicket.products.map(product => ({
        version: '1.0',
        id: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}-SOP@p-ticket`,
        Name: { $t: `${product.productName} - ${userPeriodTicket.passengerType} - paper ticket` },
        Description: { $t: 'Unlimited Travel in a given zone' },
        distributionAssignments: {
            DistributionAssignment: {
                version: '1.0',
                id: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}-SOP@p-ticket@on_board`,
                order: '1',
                Name: { $t: 'Onboard' },
                Description: { $t: 'Pay for ticket onboard.' },
                DistributionChannelRef: {
                    version: 'fxc:v1.0',
                    ref: 'fxc:on_board',
                },
                DistributionChannelType: { $t: 'onBoard' },
                PaymentMethods: { $t: 'cash contactlessPaymentCard' },
                FulfilmentMethodRef: {
                    ref: 'fxc:collect_on_board',
                    version: 'fxc:v1.0',
                },
            },
        },
        salesOfferPackageElements: {
            SalesOfferPackageElement: {
                version: '1.0',
                id: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}-SOP@p-ticket`,
                order: '3',
                TypeOfTravelDocumentRef: {
                    version: '1.0',
                    ref: 'op:p-ticket',
                },
                PreassignedFareProductRef: {
                    version: '1.0',
                    ref: `op:Pass@${product.productName}_${userPeriodTicket.passengerType}`,
                },
            },
        },
    }));

const getPeriodTicketFareStructureElementRefs = (
    elementZeroRef: string,
    product: ProductDetails,
    passengerType: string,
): NetexObject => ({
    FareStructureElementRef: [
        {
            version: '1.0',
            ref: elementZeroRef,
        },
        {
            version: '1.0',
            ref: `op:Tariff@${product.productName}@eligibility@${passengerType}`,
        },
        {
            version: '1.0',
            ref: `op:Tariff@${product.productName}@durations@${passengerType}`,
        },
        {
            version: '1.0',
            ref: `op:Tariff@${product.productName}@conditions_of_travel`,
        },
    ],
});

const getFlatFareFareStructureElementRefs = (
    elementZeroRef: string,
    product: ProductDetails,
    passengerType: string,
): NetexObject => ({
    FareStructureElementRef: [
        {
            version: '1.0',
            ref: elementZeroRef,
        },
        {
            version: '1.0',
            ref: `op:Tariff@${product.productName}@eligibility@${passengerType}`,
        },
        {
            version: '1.0',
            ref: `op:Tariff@${product.productName}@conditions_of_travel`,
        },
    ],
});

export const getPreassignedFareProducts = (
    userPeriodTicket: PeriodTicket,
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
            fareStructureElementRefs = getFlatFareFareStructureElementRefs(elementZeroRef, product, passengerType);
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
                        $t: 'Unlimited rides available for specified durations',
                    },
                    fareStructureElements: fareStructureElementRefs,
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

export const getTimeIntervals = (userPeriodTicket: PeriodTicket): NetexObject[] => {
    const timeIntervals = userPeriodTicket.products.map(product => {
        const dayOrDays = product.productDuration === '1' ? 'day' : 'days';
        return {
            version: '1.0',
            id: `op:Tariff@${product.productName}@${product.productDuration}${dayOrDays}`,
            Name: { $t: `${product.productDuration} ${dayOrDays}` },
            Description: { $t: `P${product.productDuration}D` },
        };
    });

    return timeIntervals.flatMap(item => item);
};

const getAvailabilityElement = (
    id: string,
    validityParameterGroupingType: string,
    validityParametersObject: object,
): NetexObject => ({
    version: '1.0',
    id: `op:${id}`,
    Name: { $t: 'Available zones' },
    Description: { $t: 'single zone.' },
    TypeOfFareStructureElementRef: {
        version: 'fxc:v1.0',
        ref: 'fxc:access',
    },
    GenericParameterAssignment: {
        id,
        version: '1.0',
        order: '1',
        TypeOfAccessRightAssignmentRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:can_access',
        },
        ValidityParameterGroupingType: { $t: validityParameterGroupingType },
        validityParameters: validityParametersObject,
    },
});

const getDurationElement = (userPeriodTicket: PeriodTicket, product: ProductDetails, index: number): NetexObject => ({
    version: '1.0',
    id: `op:Tariff@${product.productName}@durations@${userPeriodTicket.passengerType}`,
    Name: { $t: `Available duration combination - ${userPeriodTicket.passengerType} ticket` },
    Description: {
        $t: 'All periods allowed, 60 mins, but no evening - used in for some mticket, single zone.',
    },
    TypeOfFareStructureElementRef: {
        version: 'fxc:v1.0',
        ref: 'fxc:durations',
    },
    timeIntervals: {
        TimeIntervalRef: [
            {
                ref: `op:Tariff@${product.productName}@${product.productDuration}${
                    product.productDuration === '1' ? 'day' : 'days'
                }`,
            },
        ],
    },
    GenericParameterAssignment: {
        id: `op:Tariff@${product.productName}@${userPeriodTicket.passengerType}`,
        version: '1.0',
        order: `${index + 1}`,
        Description: {
            $t: `${userPeriodTicket.passengerType} cash ticket ${
                product.productDuration ? `available for ${product.productDuration} day${product.productDuration}` : ''
            }`,
        },
        TypeOfAccessRightAssignmentRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:eligible',
        },
        LimitationGroupingType: { $t: 'XOR' },
        limitations: {
            UserProfileRef: {
                version: '1.0',
                ref: `op:${product.productName}@${userPeriodTicket.passengerType}`,
            },
        },
    },
});

const getUserProfile = (userPeriodTicket: PeriodTicket, product: ProductDetails): NetexObject => {
    let userProfile: NetexObject = {
        version: '1.0',
        id: `op:${product.productName}@${userPeriodTicket.passengerType}`,
        Name: { $t: userPeriodTicket.passengerType },
        prices: {
            UsageParameterPrice: {
                version: '1.0',
                id: `op:${product.productName}@${userPeriodTicket.passengerType}`,
            },
        },
        TypeOfConcessionRef: {
            version: 'fxc:v1.0',
            ref: `fxc:${
                userPeriodTicket.passengerType === 'anyone' || userPeriodTicket.passengerType === 'adult'
                    ? 'none'
                    : _.snakeCase(userPeriodTicket.passengerType)
            }`,
        },
    };
    if (userPeriodTicket.ageRange && userPeriodTicket.ageRange === 'Yes') {
        if (userPeriodTicket.ageRangeMin) {
            userProfile = {
                ...userProfile,
                MinimumAge: { $t: userPeriodTicket.ageRangeMin },
            };
        }
        if (userPeriodTicket.ageRangeMax) {
            userProfile = {
                ...userProfile,
                MaximumAge: { $t: userPeriodTicket.ageRangeMax },
            };
        }
    }
    if (userPeriodTicket.proof && userPeriodTicket.proof === 'Yes') {
        userProfile = {
            ...userProfile,
            ProofRequired: { $t: userPeriodTicket.proofDocuments },
        };
    }
    return userProfile;
};

const getEligibilityElement = (userPeriodTicket: PeriodTicket, product: ProductDetails, index: number): NetexObject => {
    return {
        version: '1.0',
        id: `op:Tariff@${product.productName}@eligibility@${userPeriodTicket.passengerType}`,
        Name: { $t: 'Eligible user types' },
        TypeOfFareStructureElementRef: {
            version: 'fxc:v1.0',
            ref: 'fxc:eligibility',
        },
        GenericParameterAssignment: {
            id: `op:Tariff@${product.productName}@${userPeriodTicket.passengerType}`,
            version: '1.0',
            order: `${index + 2}`,
            TypeOfAccessRightAssignmentRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:eligible',
            },
            LimitationGroupingType: { $t: 'XOR' },
            limitations: {
                UserProfile: getUserProfile(userPeriodTicket, product),
            },
        },
    };
};

const getConditionsElement = (product: ProductDetails): NetexObject => {
    let usagePeriodValidity = {};

    if (product.productValidity) {
        usagePeriodValidity = {
            UsageValidityPeriod: {
                version: '1.0',
                id: `op:Trip@${product.productName}@back@frequency`,
                UsageTrigger: { $t: 'purchase' },
                UsageEnd: { $t: product.productValidity === 'endOfCalendarDay' ? 'endOfFareDay' : 'standardDuration' },
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
                Transferability: {
                    version: '1.0',
                    id: `op:Pass@${product.productName}@transferability`,
                    Name: { $t: 'Ticket is not transferable' },
                    CanTransfer: { $t: 'false' },
                },
                FrequencyOfUse: {
                    version: '1.0',
                    id: `op:Pass@${product.productName}@frequency`,
                    FrequencyOfUseType: { $t: 'unlimited' },
                },
                Interchanging: {
                    version: '1.0',
                    id: `op:Pass@${product.productName}@interchanging`,
                    CanInterchange: { $t: 'true' },
                },
                ...usagePeriodValidity,
            },
        },
    };
};

export const getFareStructuresElements = (
    userPeriodTicket: PeriodTicket,
    placeHolderGroupOfProductsName: string,
): NetexObject[] => {
    const arrayOfArraysOfFareStructureElements = userPeriodTicket.products.map((product: ProductDetails, index) => {
        let availabilityElementId = '';
        let validityParametersObject: {} = {};
        let validityParameterGroupingType = '';
        if (isGeoZoneTicket(userPeriodTicket)) {
            availabilityElementId = `Tariff@${product.productName}@access_zones`;
            validityParameterGroupingType = 'XOR';
            validityParametersObject = {
                FareZoneRef: {
                    version: '1.0',
                    ref: `op:${placeHolderGroupOfProductsName}@${userPeriodTicket.zoneName}`,
                },
            };
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            availabilityElementId = `Tariff@${product.productName}@access_lines`;
            validityParameterGroupingType = 'OR';
            validityParametersObject = { LineRef: getLineRefList(userPeriodTicket) };
        }
        if (
            isGeoZoneTicket(userPeriodTicket) ||
            (isMultiServiceTicket(userPeriodTicket) && userPeriodTicket.products[0].productDuration)
        ) {
            return [
                getAvailabilityElement(availabilityElementId, validityParameterGroupingType, validityParametersObject),
                getDurationElement(userPeriodTicket, product, index),
                getEligibilityElement(userPeriodTicket, product, index),
                getConditionsElement(product),
            ];
        }
        return [
            getAvailabilityElement(availabilityElementId, validityParameterGroupingType, validityParametersObject),
            getEligibilityElement(userPeriodTicket, product, index),
            getConditionsElement(product),
        ];
    });

    return arrayOfArraysOfFareStructureElements.flatMap(item => item);
};
