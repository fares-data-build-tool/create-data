import {
    Stop,
    OperatorData,
    PeriodTicket,
    PeriodGeoZoneTicket,
    PeriodMultipleServicesTicket,
    ScheduledStopPoint,
    TopographicProjectionRef,
    Line,
    LineRef,
} from '../types';
import { getCleanWebsite } from '../sharedHelpers';

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

export const getLinesList = (userPeriodTicket: PeriodMultipleServicesTicket, operatorData: OperatorData): Line[] =>
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

export const getGeoZoneFareTable = (userPeriodTicket: PeriodGeoZoneTicket): {}[] =>
    userPeriodTicket.products.map(product => ({
        version: '1.0',
        id: `op:${product.productName}@${userPeriodTicket.zoneName}`,
        Name: { $t: `${userPeriodTicket.zoneName}` },
        specifics: {
            TariffZoneRef: {
                version: '1.0',
                ref: `op:${product.productName}@${userPeriodTicket.zoneName}`,
            },
        },
        columns: {
            FareTableColumn: {
                version: '1.0',
                id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket`,
                Name: { $t: `${userPeriodTicket.zoneName}` },
                representing: {
                    TariffZoneRef: {
                        version: '1.0',
                        ref: `op:${product.productName}@${userPeriodTicket.zoneName}`,
                    },
                },
            },
        },
        includes: {
            FareTable: {
                version: '1.0',
                id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket`,
                Name: { t$: `${product.productName} - Cash` },
                pricesFor: {
                    SalesOfferPacakgeRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}-SOP@p-ticket`,
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
                                ref: 'op:adult',
                            },
                        },
                    },
                },
                includes: {
                    Faretable: {
                        version: '1.0',
                        id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@adult`,
                        Name: { $t: `${product.productName} - Cash - Adult` },
                        limitations: {
                            UserProfileRef: {
                                version: '1.0',
                                ref: 'op:adult',
                            },
                        },
                        columns: {
                            FareTableColumn: {
                                version: '1.0',
                                id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@adult`,
                                Name: { $t: 'Adult' },
                                representing: {
                                    TypeOfTravelDocumentRef: {
                                        version: '1.0',
                                        ref: 'op:p-tciket',
                                    },
                                    UserProfileRef: {
                                        version: '1.0',
                                        ref: 'op:adult',
                                    },
                                },
                            },
                        },
                    },
                },
                cells: {
                    Cell: {
                        version: '1.0',
                        id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@adult@${
                            product.daysValid
                        }${product.daysValid === '1' ? 'day' : 'days'}`,
                        order: '1',
                        TimeIntervalPrice: {
                            version: '1.0',
                            id: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@adult@${
                                product.daysValid
                            }${product.daysValid === '1' ? 'day' : 'days'}`,
                            Amount: { t$: `${product.productPrice}` },
                            TimeIntervalRef: {
                                version: '1.0',
                                ref: `op:Tariff@${product.productName}@${product.daysValid}${
                                    product.daysValid === '1' ? 'day' : 'days'
                                }`,
                            },
                            ColumnRef: {
                                version: '1.0',
                                ref: `op:${product.productName}@${userPeriodTicket.zoneName}@p-ticket@adult`,
                            },
                            RowRef: {
                                version: '1.0',
                                ref: `op:${product.productName}@${product.daysValid}${
                                    product.daysValid === '1' ? 'day' : 'days'
                                }`,
                            },
                        },
                    },
                },
            },
        },
    }));

export const getMultiServiceFareTable = (userPeriodTicket: PeriodMultipleServicesTicket): {}[] => {
    const name = `${userPeriodTicket.nocCode}-multi-service`;
    const netexObjectList = userPeriodTicket.products.map(product => ({
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
                Name: { t$: `${product.productName} - Cash` },
                pricesFor: {
                    SalesOfferPacakgeRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}-SOP@p-ticket`,
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
                                ref: 'op:adult',
                            },
                        },
                    },
                },
                includes: {
                    Faretable: {
                        version: '1.0',
                        id: `op:${product.productName}@${name}@p-ticket@adult`,
                        Name: { $t: `${product.productName} - Cash - Adult` },
                        limitations: {
                            UserProfileRef: {
                                version: '1.0',
                                ref: 'op:adult',
                            },
                        },
                        columns: {
                            FareTableColumn: {
                                version: '1.0',
                                id: `op:${product.productName}@${name}@p-ticket@adult`,
                                Name: { $t: 'Adult' },
                                representing: {
                                    TypeOfTravelDocumentRef: {
                                        version: '1.0',
                                        ref: 'op:p-tciket',
                                    },
                                    UserProfileRef: {
                                        version: '1.0',
                                        ref: 'op:adult',
                                    },
                                },
                            },
                        },
                    },
                },
                cells: {
                    Cell: {
                        version: '1.0',
                        id: `op:${product.productName}@${name}@p-ticket@adult@${product.daysValid}${
                            product.daysValid === '1' ? 'day' : 'days'
                        }`,
                        order: '1',
                        TimeIntervalPrice: {
                            version: '1.0',
                            id: `op:${product.productName}@${name}@p-ticket@adult@${product.daysValid}${
                                product.daysValid === '1' ? 'day' : 'days'
                            }`,
                            Amount: { t$: `${product.productPrice}` },
                            TimeIntervalRef: {
                                version: '1.0',
                                ref: `op:Tariff@${product.productName}@${product.daysValid}${
                                    product.daysValid === '1' ? 'day' : 'days'
                                }`,
                            },
                            ColumnRef: {
                                version: '1.0',
                                ref: `op:${product.productName}@${name}@p-ticket@adult`,
                            },
                            RowRef: {
                                version: '1.0',
                                ref: `op:${product.productName}@${product.daysValid}${
                                    product.daysValid === '1' ? 'day' : 'days'
                                }`,
                            },
                        },
                    },
                },
            },
        },
    }));
    return netexObjectList;
};

export const getFareTableList = (userPeriodTicket: PeriodTicket, placeHolderGroupOfProductsName: string): {}[] =>
    userPeriodTicket.products.map(product => ({
        version: '1.0',
        id: `epd:UK:${userPeriodTicket.nocCode}:FareFrame_UK_PI_FARE_PRICE:${product.productName}@pass:op`,
        Name: { $t: `${product.productName} Fares` },
        pricesFor: {
            PreassignedFareProductRef: { version: '1.0', ref: `op:Pass@${product.productName}` },
        },
        usedIn: {
            TariffRef: { version: '1.0', ref: `op:Tariff@${placeHolderGroupOfProductsName}` },
        },
        rows: {
            FareTableRow: {
                version: '1.0',
                id: `op:${product.productName}@${product.daysValid}${product.daysValid === '1' ? 'day' : 'days'}`,
                order: '2',
                Name: { $t: `${product.daysValid} ${product.daysValid === '1' ? 'day' : 'days'}` },
                representing: {
                    TimeIntervalRef: {
                        version: '1.0',
                        ref: `op:Tariff@${product.productName}@${product.daysValid}${
                            product.daysValid === '1' ? 'day' : 'days'
                        }`,
                    },
                },
            },
        },
    }));

export const getSalesOfferPackageList = (
    userPeriodTicket: PeriodTicket,
    placeHolderGroupOfProductsName: string,
): {}[] =>
    userPeriodTicket.products.map(product => ({
        version: '1.0',
        id: `op:Pass@${product.productName}-SOP@p-ticket`,
        BrandingRef: { version: '1.0', ref: `op:${userPeriodTicket.operatorName}@brand` },
        Name: { $t: `${placeHolderGroupOfProductsName} - paper ticket` },
        Description: { $t: 'Unlimited Travel in a given zone' },
        distributionAssignments: {
            DistributionAssignment: {
                version: '1.0',
                id: `op:Pass@${product.productName}-GSOP@p-ticket@on_board`,
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
                id: `op:Pass@${product.productName}-SOP@p-ticket`,
                order: '3',
                TypeOfTravelDocumentRef: {
                    version: '1.0',
                    ref: 'op:p-ticket',
                },
                PreassignedFareProductRef: {
                    version: '1.0',
                    ref: `op:Pass@${product.productName}`,
                },
            },
        },
    }));

export const getPreassignedFareProduct = (
    userPeriodTicket: PeriodTicket,
    nocCodeNocFormat: string,
    opIdNocFormat: string,
): {}[] => {
    return userPeriodTicket.products.map(product => {
        let elementZeroRef: string;

        if (isGeoZoneTicket(userPeriodTicket)) {
            elementZeroRef = `op:Tariff@${product.productName}@access_zones`;
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            elementZeroRef = `op:Tariff@${product.productName}@access_lines`;
        } else {
            elementZeroRef = '';
        }

        return {
            version: '1.0',
            id: `op:Pass@${product.productName}`,
            Name: {
                $t: `${product.productName} Pass`,
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
                    id: `op:Pass@${product.productName}@travel`,
                    Name: {
                        $t: 'Unlimited rides available for specified durations',
                    },
                    fareStructureElements: {
                        FareStructureElementRef: [
                            {
                                version: '1.0',
                                ref: elementZeroRef,
                            },
                            {
                                version: '1.0',
                                ref: `op:Tariff@eligibility`,
                            },
                            {
                                version: '1.0',
                                ref: `op:Tariff@${product.productName}@durations@adult`,
                            },
                            {
                                version: '1.0',
                                ref: `op:Tariff@${product.productName}@conditions_of_travel`,
                            },
                        ],
                    },
                },
            },
            accessRightsInProduct: {
                AccessRightInProduct: {
                    version: '1.0',
                    id: `op:Pass@${product.productName}@travel`,
                    order: '1',
                    ValidableElementRef: {
                        version: '1.0',
                        ref: `op:Pass@${product.productName}@travel`,
                    },
                },
            },
            ProductType: {
                $t: 'periodPass',
            },
        };
    });
};

export const getTimeIntervals = (userPeriodTicket: PeriodTicket): {}[] => {
    const timeIntervals = userPeriodTicket.products.map(product => {
        const dayOrDays = product.daysValid === '1' ? 'day' : 'days';
        return {
            version: '1.0',
            id: `op:Tariff@${product.productName}@${product.daysValid}${dayOrDays}`,
            Name: { $t: `${product.daysValid} ${dayOrDays}` },
            Description: { $t: `P${product.daysValid}D` },
        };
    });

    return timeIntervals.flatMap(item => item);
};

export const getFareStructuresElements = (
    userPeriodTicket: PeriodTicket,
    placeHolderGroupOfProductsName: string,
): {}[] => {
    const arrayOfArraysOfFareStructureElements = userPeriodTicket.products.map(product => {
        // FareStructureElement 1 - availability
        let id = '';
        let genericParameterAssignmentId = '';
        let validityParametersObject = {};
        let validityParameterGroupingType = '';
        if (isGeoZoneTicket(userPeriodTicket)) {
            id = `op:Tariff@${product.productName}@access_zones`;
            genericParameterAssignmentId = `op:Tariff@${product.productName}@access_zones`;
            validityParameterGroupingType = 'XOR';
            validityParametersObject = {
                FareZoneRef: {
                    version: '1.0',
                    ref: `op:${placeHolderGroupOfProductsName}@${userPeriodTicket.zoneName}`,
                },
            };
        } else if (isMultiServiceTicket(userPeriodTicket)) {
            id = `op:Tariff@${product.productName}@access_lines`;
            genericParameterAssignmentId = `Tariff@${product.productName}@access_lines`;
            validityParameterGroupingType = 'OR';
            validityParametersObject = { LineRef: getLineRefList(userPeriodTicket) };
        }

        const availabilityElement = {
            version: '1.0',
            id,
            Name: { $t: 'Available zones' },
            Description: { $t: 'single zone.' },
            TypeOfFareStructureElementRef: {
                version: 'fxc:v1.0',
                ref: 'fxc:access',
            },
            GenericParameterAssignment: {
                id: genericParameterAssignmentId,
                version: '1.0',
                order: '1',
                TypeOfAccessRightAssignmentRef: {
                    version: 'fxc:v1.0',
                    ref: 'fxc:can_access',
                },
                ValidityParameterGroupingType: { $t: validityParameterGroupingType },
                validityParameters: validityParametersObject,
            },
        };

        // FareStructureElement 2 - duration
        const durationElement = {
            version: '1.0',
            id: `op:Tariff@${product.productName}@durations@adult`,
            Name: { $t: 'Available duration combination' },
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
                        ref: `op:Tariff@${product.productName}@${product.daysValid}${
                            product.daysValid === '1' ? 'day' : 'days'
                        }`,
                    },
                ],
            },
            GenericParameterAssignment: {
                id: `op:Tariff@${product.productName}@adult_or_child`,
                version: '1.0',
                order: '1',
                Description: {
                    // should the below line use the actual daysValid?
                    $t: 'Adult/Child Cash ticket Only available for 1 Day or 1week',
                },
                TypeOfAccessRightAssignmentRef: {
                    version: 'fxc:v1.0',
                    ref: 'fxc:eligible',
                },
                LimitationGroupingType: { $t: 'XOR' },
                limitations: {
                    UserProfileRef: {
                        version: '1.0',
                        ref: 'op:adult',
                    },
                },
            },
        };

        // FareStructureElement 3 - conditions of travel
        const conditionsElement = {
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
                },
            },
        };
        return [availabilityElement, durationElement, conditionsElement];
    });

    return arrayOfArraysOfFareStructureElements.flatMap(item => item);
};
