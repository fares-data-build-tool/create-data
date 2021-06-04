import {
    isTermTime,
    getSingleTicketJson,
    getReturnTicketJson,
    getGeoZoneTicketJson,
    getMultipleServicesTicketJson,
    getFlatFareTicketJson,
    getProductsAndSalesOfferPackages,
    getSchemeOperatorTicketJson,
    getBaseTicketAttributes,
    adjustSchemeOperatorJson,
} from '../../../../src/pages/api/apiUtils/userData';
import {
    TERM_TIME_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
} from '../../../../src/constants/attributes';
import {
    defaultSalesOfferPackageOne,
    defaultSalesOfferPackageTwo,
} from '../../../../src/pages/selectSalesOfferPackage';
import {
    getMockRequestAndResponse,
    expectedSingleTicket,
    userFareStages,
    service,
    mockMatchingFaresZones,
    expectedNonCircularReturnTicket,
    mockOutboundMatchingFaresZones,
    expectedPeriodGeoZoneTicketWithMultipleProducts,
    zoneStops,
    expectedFlatFareTicket,
    expectedCircularReturnTicket,
    expectedProductDetailsArray,
    expectedPeriodMultipleServicesTicketWithMultipleProducts,
    mockTimeRestriction,
    expectedMultiOperatorGeoZoneTicketWithMultipleProducts,
    expectedPeriodMultipleServicesTicketWithMultipleProductsAndMultipleOperators,
    mockSchemOpIdToken,
    expectedSchemeOperatorTicket,
    mockFullTimeRestrictions,
    expectedSchemeOperatorTicketAfterGeoZoneAdjustment,
    expectedSchemeOperatorAfterFlatFareAdjustmentTicket,
    expectedCarnetSingleTicket,
    expectedCarnetReturnTicket,
} from '../../../testData/mockData';
import * as s3 from '../../../../src/data/s3';
import * as auroradb from '../../../../src/data/auroradb';
import { Operator, MultipleProductAttribute, ExpiryUnit, CarnetExpiryUnit } from '../../../../src/interfaces';

describe('userData', () => {
    describe('isTermTime', () => {
        it('should return true if term time is true', () => {
            const { req } = getMockRequestAndResponse({
                session: {
                    [TERM_TIME_ATTRIBUTE]: { termTime: true },
                },
            });
            expect(isTermTime(req)).toBeTruthy();
        });
        it('should return false if term time is false', () => {
            const { req } = getMockRequestAndResponse({
                session: {
                    [TERM_TIME_ATTRIBUTE]: { termTime: false },
                },
            });
            expect(isTermTime(req)).toBeFalsy();
        });
    });

    describe('getProductsAndSalesOfferPackages', () => {
        it('should return an array of ProductDetails objects', () => {
            const multipleProductAttribute: MultipleProductAttribute = {
                products: [
                    {
                        productName: 'Product',
                        productNameId: '',
                        productPrice: '2.99',
                        productPriceId: '',
                        productDuration: '1',
                        productDurationId: '',
                        productDurationUnits: ExpiryUnit.DAY,
                        productDurationUnitsId: '',
                        productValidity: '24hr',
                        productValidityId: '',
                    },
                    {
                        productName: 'Product Two',
                        productNameId: '',
                        productPrice: '7.99',
                        productPriceId: '',
                        productDuration: '7',
                        productDurationId: '',
                        productDurationUnits: ExpiryUnit.DAY,
                        productDurationUnitsId: '',
                        productValidity: '24hr',
                        productValidityId: '',
                    },
                ],
            };
            const productSops = [
                {
                    productName: 'Product',
                    salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                },
                {
                    productName: 'Product Two',
                    salesOfferPackages: [defaultSalesOfferPackageTwo],
                },
            ];
            const result = getProductsAndSalesOfferPackages(productSops, multipleProductAttribute, false);
            expect(result).toEqual(expectedProductDetailsArray);
        });
    });

    describe('getBaseTicketAttributes', () => {
        it('should replace the fareType attribute with the schoolFareType attribute for a schoolService', () => {
            const { req, res } = getMockRequestAndResponse({
                session: {
                    [MATCHING_ATTRIBUTE]: {
                        service,
                        userFareStages,
                        matchingFareZones: mockMatchingFaresZones,
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'schoolService' },
                    [SCHOOL_FARE_TYPE_ATTRIBUTE]: { schoolFareType: 'single' },
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                    },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                    [TERM_TIME_ATTRIBUTE]: { termTime: true },
                },
            });
            const result = getBaseTicketAttributes(req, res, 'single');
            expect(result.type).toEqual('single');
        });
    });

    describe('getSingleTicketJson', () => {
        it('should return a SingleTicket object', () => {
            const { req, res } = getMockRequestAndResponse({
                session: {
                    [MATCHING_ATTRIBUTE]: {
                        service,
                        userFareStages,
                        matchingFareZones: mockMatchingFaresZones,
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                    [TERM_TIME_ATTRIBUTE]: { termTime: true },
                    [PRODUCT_DETAILS_ATTRIBUTE]: undefined,
                },
            });
            const result = getSingleTicketJson(req, res);
            expect(result).toStrictEqual(expectedSingleTicket);
        });

        it('should correctly add carnet detail', () => {
            const { req, res } = getMockRequestAndResponse({
                session: {
                    [MATCHING_ATTRIBUTE]: {
                        service,
                        userFareStages,
                        matchingFareZones: mockMatchingFaresZones,
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'single' },
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                    [TERM_TIME_ATTRIBUTE]: { termTime: true },
                    [PRODUCT_DETAILS_ATTRIBUTE]: {
                        productName: 'Test Product',
                        carnetDetails: {
                            quantity: '5',
                            expiryTime: '10',
                            expiryUnit: ExpiryUnit.DAY,
                        },
                    },
                },
            });
            const result = getSingleTicketJson(req, res);
            expect(result).toStrictEqual(expectedCarnetSingleTicket);
        });
    });

    describe('getReturnTicketJson', () => {
        it('should return a ReturnTicket object for a non circular return journey', () => {
            const { req, res } = getMockRequestAndResponse({
                session: {
                    [MATCHING_ATTRIBUTE]: {
                        service,
                        userFareStages,
                        matchingFareZones: mockOutboundMatchingFaresZones,
                    },
                    [INBOUND_MATCHING_ATTRIBUTE]: {
                        inboundUserFareStages: userFareStages,
                        inboundMatchingFareZones: mockMatchingFaresZones,
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' },
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                    [PRODUCT_DETAILS_ATTRIBUTE]: undefined,
                },
            });
            const result = getReturnTicketJson(req, res);
            expect(result).toStrictEqual(expectedNonCircularReturnTicket);
        });

        it('should return a ReturnTicket object for a circular journey', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                session: {
                    [MATCHING_ATTRIBUTE]: {
                        service,
                        userFareStages,
                        matchingFareZones: mockMatchingFaresZones,
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' },
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                    [PRODUCT_DETAILS_ATTRIBUTE]: undefined,
                },
            });
            const result = getReturnTicketJson(req, res);
            expect(result).toStrictEqual(expectedCircularReturnTicket);
        });

        it('should correctly add carnet detail', () => {
            const { req, res } = getMockRequestAndResponse({
                session: {
                    [MATCHING_ATTRIBUTE]: {
                        service,
                        userFareStages,
                        matchingFareZones: mockOutboundMatchingFaresZones,
                    },
                    [INBOUND_MATCHING_ATTRIBUTE]: {
                        inboundUserFareStages: userFareStages,
                        inboundMatchingFareZones: mockMatchingFaresZones,
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'return' },
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                    [PRODUCT_DETAILS_ATTRIBUTE]: {
                        productName: 'Test Return Product',
                        carnetDetails: {
                            quantity: '10',
                            expiryTime: '',
                            expiryUnit: CarnetExpiryUnit.NO_EXPIRY,
                        },
                    },
                },
            });
            const result = getReturnTicketJson(req, res);
            expect(result).toStrictEqual(expectedCarnetReturnTicket);
        });
    });

    describe('getGeoZoneTicketJson', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        const mockMultiOpSelectedOperators: Operator[] = [
            {
                nocCode: 'MCTR',
                name: 'Manchester Community Transport',
            },
            {
                nocCode: 'WBTR',
                name: "Warrington's Own Buses",
            },
            {
                nocCode: 'BLAC',
                name: 'Blackpool Transport',
            },
        ];

        const atcoCodes: string[] = ['13003305E', '13003622B', '13003655B'];
        let batchGetStopsByAtcoCodeSpy: jest.SpyInstance;

        beforeEach(() => {
            jest.spyOn(s3, 'getCsvZoneUploadData').mockImplementation(() => Promise.resolve(atcoCodes));

            batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
        });

        it.each([
            ['period', expectedPeriodGeoZoneTicketWithMultipleProducts],
            ['multiOperator', expectedMultiOperatorGeoZoneTicketWithMultipleProducts],
        ])('should return a %s geoZoneTicket object', async (fareType, expectedJson) => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                session: {
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType },
                    [FARE_ZONE_ATTRIBUTE]: 'Green Lane Shops',
                    [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                        products: [
                            {
                                productName: 'Weekly Ticket',
                                productPrice: '50',
                                productDuration: '5',
                                productDurationUnits: 'week',
                                productValidity: '24hr',
                                salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                            },
                            {
                                productName: 'Day Ticket',
                                productPrice: '2.50',
                                productDuration: '1',
                                productDurationUnits: 'year',
                                productValidity: '24hr',
                                salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                            },
                            {
                                productName: 'Monthly Ticket',
                                productPrice: '200',
                                productDuration: '28',
                                productDurationUnits: 'month',
                                productValidity: 'endOfCalendarDay',
                                salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                            },
                        ],
                    },
                    [SALES_OFFER_PACKAGES_ATTRIBUTE]: [
                        {
                            productName: 'Weekly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Day Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Monthly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                    ],
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    ...(fareType === 'multiOperator' && {
                        [MULTIPLE_OPERATOR_ATTRIBUTE]: { selectedOperators: mockMultiOpSelectedOperators },
                    }),
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                },
            });
            batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve(zoneStops));
            const result = await getGeoZoneTicketJson(req, res);
            expect(result).toStrictEqual(expectedJson);
        });
    });

    describe('getPeriodMulipleServicesTicketJson', () => {
        it('should return a PeriodMultipleServicesTicket object', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                session: {
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                    [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'multipleServices' },
                    [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                        products: [
                            {
                                productName: 'Weekly Ticket',
                                productPrice: '50',
                                productDuration: '5',
                                productDurationUnits: 'week',
                                productValidity: '24hr',
                            },
                            {
                                productName: 'Day Ticket',
                                productPrice: '2.50',
                                productDuration: '1',
                                productDurationUnits: 'year',
                                productValidity: '24hr',
                            },
                            {
                                productName: 'Monthly Ticket',
                                productPrice: '200',
                                productDuration: '28',
                                productDurationUnits: 'month',
                                productValidity: 'endOfCalendarDay',
                            },
                        ],
                    },
                    [SALES_OFFER_PACKAGES_ATTRIBUTE]: [
                        {
                            productName: 'Weekly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Day Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Monthly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                    ],
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                },
            });
            const result = getMultipleServicesTicketJson(req, res);
            expect(result).toStrictEqual(expectedPeriodMultipleServicesTicketWithMultipleProducts);
        });

        it('should return a MultiOperatorMultipleServicesTicket object if the ticket is multipleOperators', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {},
                session: {
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                    [TICKET_REPRESENTATION_ATTRIBUTE]: { name: 'multipleServices' },
                    [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                        products: [
                            {
                                productName: 'Weekly Ticket',
                                productPrice: '50',
                                productDuration: '5',
                                productDurationUnits: 'week',
                                productValidity: '24hr',
                            },
                            {
                                productName: 'Day Ticket',
                                productPrice: '2.50',
                                productDuration: '1',
                                productDurationUnits: 'year',
                                productValidity: '24hr',
                            },
                            {
                                productName: 'Monthly Ticket',
                                productPrice: '200',
                                productDuration: '28',
                                productDurationUnits: 'month',
                                productValidity: 'endOfCalendarDay',
                            },
                        ],
                    },
                    [SALES_OFFER_PACKAGES_ATTRIBUTE]: [
                        {
                            productName: 'Weekly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Day Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Monthly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                    ],
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: [
                        {
                            nocCode: 'WBTR',
                            services: [
                                {
                                    lineName: '343',
                                    lineId: '3h3vsergesrhg',
                                    serviceCode: '11-444-_-y08-1',
                                    serviceDescription: 'Test Under Lyne - Glossop',
                                    startDate: '07/04/2020',
                                },
                                {
                                    lineName: '444',
                                    lineId: '3h3vtrhtherhed',
                                    serviceCode: 'NW_01_MCT_391_1',
                                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                                    startDate: '23/04/2019',
                                },
                                {
                                    lineName: '543',
                                    lineId: '3h3vb32ik',
                                    serviceCode: 'NW_04_MCTR_232_1',
                                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                                    startDate: '06/04/2020',
                                },
                            ],
                        },
                        {
                            nocCode: 'BLAC',
                            services: [
                                {
                                    lineName: '100',
                                    lineId: '3h3rthsrty56y5',
                                    serviceCode: '11-444-_-y08-1',
                                    serviceDescription: 'Test Under Lyne - Glossop',
                                    startDate: '07/04/2020',
                                },
                                {
                                    lineName: '101',
                                    lineId: '3h34t43deefsf',
                                    serviceCode: 'NW_01_MCT_391_1',
                                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                                    startDate: '23/04/2019',
                                },
                                {
                                    lineName: '102',
                                    lineId: '34tvwevdsvb32ik',
                                    serviceCode: 'NW_04_MCTR_232_1',
                                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                                    startDate: '06/04/2020',
                                },
                            ],
                        },
                        {
                            nocCode: 'LEDS',
                            services: [
                                {
                                    lineName: '63',
                                    lineId: '45t34gvfdx2ik',
                                    serviceCode: '11-444-_-y08-1',
                                    serviceDescription: 'Test Under Lyne - Glossop',
                                    startDate: '07/04/2020',
                                },
                                {
                                    lineName: '64',
                                    lineId: 'q45g4rgergik',
                                    serviceCode: 'NW_01_MCT_391_1',
                                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                                    startDate: '23/04/2019',
                                },
                                {
                                    lineName: '65',
                                    lineId: 'q34ttfwerfsxfc',
                                    serviceCode: 'NW_04_MCTR_232_1',
                                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                                    startDate: '06/04/2020',
                                },
                            ],
                        },
                    ],
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
                },
            });
            const result = getMultipleServicesTicketJson(req, res);
            expect(result).toStrictEqual(expectedPeriodMultipleServicesTicketWithMultipleProductsAndMultipleOperators);
        });
    });

    describe('getFlatFareTicketJson', () => {
        it('should return a FlatFareTicket object', () => {
            const { req, res } = getMockRequestAndResponse({
                session: {
                    [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                        products: [
                            {
                                productName: 'Weekly Rider',
                                productPrice: '7',
                            },
                        ],
                    },
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' },
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [SALES_OFFER_PACKAGES_ATTRIBUTE]: [
                        {
                            productName: 'Weekly Rider',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                    ],
                },
            });
            const result = getFlatFareTicketJson(req, res);
            expect(result).toEqual(expectedFlatFareTicket);
        });
    });

    describe('getSchemeOperatorTicketJson', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        const mockMultiOpSelectedOperators: Operator[] = [
            {
                nocCode: 'MCTR',
                name: 'Manchester Community Transport',
            },
            {
                nocCode: 'WBTR',
                name: "Warrington's Own Buses",
            },
            {
                nocCode: 'BLAC',
                name: 'Blackpool Transport',
            },
        ];

        const atcoCodes: string[] = ['13003305E', '13003622B', '13003655B'];
        let batchGetStopsByAtcoCodeSpy: jest.SpyInstance;

        beforeEach(() => {
            jest.spyOn(s3, 'getCsvZoneUploadData').mockImplementation(() => Promise.resolve(atcoCodes));

            batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
        });

        it('should return a SchemeOperatorTicket object', () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {
                    idToken: mockSchemOpIdToken,
                },
                session: {
                    [OPERATOR_ATTRIBUTE]: {
                        name: 'SCHEME_OPERATOR',
                        region: 'SCHEME_REGION',
                        nocCode: 'TESTSCHEME',
                        uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                    [FARE_ZONE_ATTRIBUTE]: 'Green Lane Shops',
                    [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                        products: [
                            {
                                productName: 'Weekly Ticket',
                                productPrice: '50',
                                productDuration: '5',
                                productDurationUnits: 'week',
                                productValidity: '24hr',
                                salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                            },
                            {
                                productName: 'Day Ticket',
                                productPrice: '2.50',
                                productDuration: '1',
                                productDurationUnits: 'month',
                                productValidity: '24hr',
                                salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                            },
                            {
                                productName: 'Monthly Ticket',
                                productPrice: '200',
                                productDuration: '28',
                                productDurationUnits: 'year',
                                productValidity: 'endOfCalendarDay',
                                salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                            },
                        ],
                    },
                    [SALES_OFFER_PACKAGES_ATTRIBUTE]: [
                        {
                            productName: 'Weekly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Day Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Monthly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                    ],
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [MULTIPLE_OPERATOR_ATTRIBUTE]: { selectedOperators: mockMultiOpSelectedOperators },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: {
                        fullTimeRestrictions: [
                            {
                                day: 'monday',
                                timeBands: [
                                    {
                                        startTime: '0900',
                                        endTime: '',
                                    },
                                ],
                            },
                            {
                                day: 'tuesday',
                                timeBands: [
                                    {
                                        startTime: '',
                                        endTime: '1800',
                                    },
                                ],
                            },
                            {
                                day: 'bank holiday',
                                timeBands: [
                                    {
                                        startTime: '0900',
                                        endTime: '1750',
                                    },
                                ],
                            },
                            {
                                day: 'friday',
                                timeBands: [
                                    {
                                        startTime: '',
                                        endTime: '',
                                    },
                                ],
                            },
                        ],
                        errors: [],
                    },
                },
            });
            batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve(zoneStops));
            const result = getSchemeOperatorTicketJson(req, res);
            expect(result).toEqual(expectedSchemeOperatorTicket('multiOperator'));
        });
    });

    describe('adjustSchemeOperatorTicketJson', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        const mockMultiOpSelectedOperators: Operator[] = [
            {
                nocCode: 'MCTR',
                name: 'Manchester Community Transport',
            },
            {
                nocCode: 'WBTR',
                name: "Warrington's Own Buses",
            },
            {
                nocCode: 'BLAC',
                name: 'Blackpool Transport',
            },
        ];

        const atcoCodes: string[] = ['13003305E', '13003622B', '13003655B'];
        let batchGetStopsByAtcoCodeSpy: jest.SpyInstance;

        beforeEach(() => {
            jest.spyOn(s3, 'getCsvZoneUploadData').mockImplementation(() => Promise.resolve(atcoCodes));

            batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
        });

        it('should adjust SchemeOperatorTicket json for a period geozone ticket', async () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {
                    idToken: mockSchemOpIdToken,
                },
                session: {
                    [OPERATOR_ATTRIBUTE]: {
                        name: 'SCHEME_OPERATOR',
                        region: 'SCHEME_REGION',
                        nocCode: 'TESTSCHEME',
                        uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'period' },
                    [FARE_ZONE_ATTRIBUTE]: 'Green Lane Shops',
                    [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                        products: [
                            {
                                productName: 'Weekly Ticket',
                                productPrice: '50',
                                productDuration: '5',
                                productDurationUnits: 'week',
                                productValidity: '24hr',
                            },
                            {
                                productName: 'Day Ticket',
                                productPrice: '2.50',
                                productDuration: '1',
                                productDurationUnits: 'month',
                                productValidity: '24hr',
                            },
                            {
                                productName: 'Monthly Ticket',
                                productPrice: '200',
                                productDuration: '28',
                                productDurationUnits: 'year',
                                productValidity: 'endOfCalendarDay',
                            },
                        ],
                    },
                    [SALES_OFFER_PACKAGES_ATTRIBUTE]: [
                        {
                            productName: 'Weekly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Day Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                        {
                            productName: 'Monthly Ticket',
                            salesOfferPackages: [defaultSalesOfferPackageOne, defaultSalesOfferPackageTwo],
                        },
                    ],
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [MULTIPLE_OPERATOR_ATTRIBUTE]: { selectedOperators: mockMultiOpSelectedOperators },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: {
                        fullTimeRestrictions: [
                            {
                                day: 'monday',
                                timeBands: [
                                    {
                                        startTime: '0900',
                                        endTime: '',
                                    },
                                ],
                            },
                            {
                                day: 'tuesday',
                                timeBands: [
                                    {
                                        startTime: '',
                                        endTime: '1800',
                                    },
                                ],
                            },
                            {
                                day: 'bank holiday',
                                timeBands: [
                                    {
                                        startTime: '0900',
                                        endTime: '1750',
                                    },
                                ],
                            },
                            {
                                day: 'friday',
                                timeBands: [
                                    {
                                        startTime: '',
                                        endTime: '',
                                    },
                                ],
                            },
                        ],
                        errors: [],
                    },
                },
            });
            batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve(zoneStops));
            const result = await adjustSchemeOperatorJson(req, res, expectedSchemeOperatorTicket('period'));
            expect(result).toEqual(expectedSchemeOperatorTicketAfterGeoZoneAdjustment);
        });
        it('should adjust SchemeOperatorTicket json for a flat fare ticket', async () => {
            const { req, res } = getMockRequestAndResponse({
                cookieValues: {
                    idToken: mockSchemOpIdToken,
                },
                session: {
                    [OPERATOR_ATTRIBUTE]: {
                        name: 'SCHEME_OPERATOR',
                        region: 'SCHEME_REGION',
                        nocCode: 'TESTSCHEME',
                        uuid: '1e0459b3-082e-4e70-89db-96e8ae173e10',
                    },
                    [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                    [FARE_TYPE_ATTRIBUTE]: { fareType: 'flatFare' },
                    [FARE_ZONE_ATTRIBUTE]: 'Green Lane Shops',
                    [SALES_OFFER_PACKAGES_ATTRIBUTE]: [
                        {
                            productName: 'product one',
                            salesOfferPackages: [
                                {
                                    name: 'Onboard (cash)',
                                    description: '',
                                    purchaseLocations: ['onBoard'],
                                    paymentMethods: ['cash'],
                                    ticketFormats: ['paperTicket'],
                                },
                            ],
                        },
                        {
                            productName: 'product two',
                            salesOfferPackages: [
                                {
                                    name: 'Onboard (contactless)',
                                    description: '',
                                    purchaseLocations: ['onBoard'],
                                    paymentMethods: ['contactlessPaymentCard'],
                                    ticketFormats: ['paperTicket'],
                                },
                                {
                                    name: 'Online (smart card)',
                                    description: '',
                                    purchaseLocations: ['online'],
                                    paymentMethods: ['directDebit', 'creditCard', 'debitCard'],
                                    ticketFormats: ['smartCard'],
                                },
                            ],
                        },
                    ],
                    [PRODUCT_DATE_ATTRIBUTE]: {
                        startDate: '2020-12-17T09:30:46.0Z',
                        endDate: '2020-12-18T09:30:46.0Z',
                        dateInput: {
                            startDateDay: '17',
                            startDateMonth: '12',
                            startDateYear: '2020',
                            endDateDay: '18',
                            endDateMonth: '12',
                            endDateYear: '2020',
                        },
                    },
                    [MULTIPLE_OPERATOR_ATTRIBUTE]: { selectedOperators: mockMultiOpSelectedOperators },
                    [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: {
                        fullTimeRestrictions: [
                            {
                                day: 'monday',
                                timeBands: [
                                    {
                                        startTime: '0900',
                                        endTime: '',
                                    },
                                ],
                            },
                            {
                                day: 'tuesday',
                                timeBands: [
                                    {
                                        startTime: '',
                                        endTime: '1800',
                                    },
                                ],
                            },
                            {
                                day: 'bank holiday',
                                timeBands: [
                                    {
                                        startTime: '0900',
                                        endTime: '1750',
                                    },
                                ],
                            },
                            {
                                day: 'friday',
                                timeBands: [
                                    {
                                        startTime: '',
                                        endTime: '',
                                    },
                                ],
                            },
                        ],
                        errors: [],
                    },
                    [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                        products: [
                            {
                                productName: 'product one',
                                productPrice: '50',
                            },
                            {
                                productName: 'product two',
                                productPrice: '502',
                            },
                        ],
                    },
                    [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: [
                        {
                            nocCode: 'WBTR',
                            services: [
                                {
                                    lineName: '343',
                                    lineId: '3h3vsergesrhg',
                                    serviceCode: '11-444-_-y08-1',
                                    serviceDescription: 'Test Under Lyne - Glossop',
                                    startDate: '07/04/2020',
                                },
                                {
                                    lineName: '444',
                                    lineId: '3h3vtrhtherhed',
                                    serviceCode: 'NW_01_MCT_391_1',
                                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                                    startDate: '23/04/2019',
                                },
                                {
                                    lineName: '543',
                                    lineId: '3h3vb32ik',
                                    serviceCode: 'NW_04_MCTR_232_1',
                                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                                    startDate: '06/04/2020',
                                },
                            ],
                        },
                        {
                            nocCode: 'BLAC',
                            services: [
                                {
                                    lineName: '100',
                                    lineId: '3h3rthsrty56y5',
                                    serviceCode: '11-444-_-y08-1',
                                    serviceDescription: 'Test Under Lyne - Glossop',
                                    startDate: '07/04/2020',
                                },
                                {
                                    lineName: '101',
                                    lineId: '3h34t43deefsf',
                                    serviceCode: 'NW_01_MCT_391_1',
                                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                                    startDate: '23/04/2019',
                                },
                                {
                                    lineName: '102',
                                    lineId: '34tvwevdsvb32ik',
                                    serviceCode: 'NW_04_MCTR_232_1',
                                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                                    startDate: '06/04/2020',
                                },
                            ],
                        },
                        {
                            nocCode: 'LEDS',
                            services: [
                                {
                                    lineName: '63',
                                    lineId: '45t34gvfdx2ik',
                                    serviceCode: '11-444-_-y08-1',
                                    serviceDescription: 'Test Under Lyne - Glossop',
                                    startDate: '07/04/2020',
                                },
                                {
                                    lineName: '64',
                                    lineId: 'q45g4rgergik',
                                    serviceCode: 'NW_01_MCT_391_1',
                                    serviceDescription: 'Macclesfield - Bollington - Poynton - Stockport',
                                    startDate: '23/04/2019',
                                },
                                {
                                    lineName: '65',
                                    lineId: 'q34ttfwerfsxfc',
                                    serviceCode: 'NW_04_MCTR_232_1',
                                    serviceDescription: 'Ashton - Hurst Cross - Broadoak Circular',
                                    startDate: '06/04/2020',
                                },
                            ],
                        },
                    ],
                },
            });
            const result = await adjustSchemeOperatorJson(req, res, expectedSchemeOperatorTicket('flatFare'));
            expect(result).toEqual(expectedSchemeOperatorAfterFlatFareAdjustmentTicket);
        });
    });
});
