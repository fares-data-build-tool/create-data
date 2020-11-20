import {
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
} from '../../../../src/constants/index';

import {
    defaultSalesOfferPackageOne,
    defaultSalesOfferPackageTwo,
} from '../../../../src/pages/selectSalesOfferPackage';
import {
    getSingleTicketJson,
    getReturnTicketJson,
    getGeoZoneTicketJson,
    getMultipleServicesTicketJson,
    getFlatFareTicketJson,
    getProductsAndSalesOfferPackages,
    getSchemeOperatorTicketJson,
} from '../../../../src/pages/api/apiUtils/userData';
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
} from '../../../testData/mockData';
import * as s3 from '../../../../src/data/s3';
import * as auroradb from '../../../../src/data/auroradb';

import { FareZone } from '../../../../src/pages/api/csvZoneUpload';
import { MultipleProductAttribute } from '../../../../src/pages/api/multipleProductValidity';
import { Operator } from '../../../../src/data/auroradb';

describe('getProductsAndSalesOfferPackages', () => {
    it('should return an array of ProductDetails objects', () => {
        const multipleProductAttribute: MultipleProductAttribute = {
            products: [
                {
                    productName: 'Product',
                    productPrice: '2.99',
                    productDuration: '1',
                    productDurationUnits: 'week',
                    productValidity: '24hr',
                },
                {
                    productName: 'Product Two',
                    productPrice: '7.99',
                    productDuration: '7',
                    productDurationUnits: 'day',
                    productValidity: '24hr',
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
        const result = getProductsAndSalesOfferPackages(productSops, multipleProductAttribute);
        expect(result).toEqual(expectedProductDetailsArray);
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
                },
                [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
            },
        });
        const result = getSingleTicketJson(req, res);
        expect(result).toStrictEqual(expectedSingleTicket);
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
                },
                [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
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
                },
                [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: mockFullTimeRestrictions,
            },
        });
        const result = getReturnTicketJson(req, res);
        expect(result).toStrictEqual(expectedCircularReturnTicket);
    });
});

describe('getGeoZoneTicketJson', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockMultiOpSelectedOperators: Operator[] = [
        {
            nocCode: 'MCTR',
            operatorPublicName: 'Manchester Community Transport',
        },
        {
            nocCode: 'WBTR',
            operatorPublicName: "Warrington's Own Buses",
        },
        {
            nocCode: 'BLAC',
            operatorPublicName: 'Blackpool Transport',
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
        const mockFareZoneAttribute: FareZone = { fareZoneName: 'Green Lane Shops' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {},
            session: {
                [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                [FARE_TYPE_ATTRIBUTE]: { fareType },
                [FARE_ZONE_ATTRIBUTE]: mockFareZoneAttribute,
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
                },
                [MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE]: [
                    {
                        nocCode: 'WBTR',
                        services: [
                            '237#11-237-_-y08-1#07/04/2020#Ashton Under Lyne - Glossop',
                            '391#NW_01_MCT_391_1#23/04/2019#Macclesfield - Bollington - Poynton - Stockport',
                            '232#NW_04_MCTR_232_1#06/04/2020#Ashton - Hurst Cross - Broadoak Circular',
                        ],
                    },
                    {
                        nocCode: 'BLAC',
                        services: [
                            '343#11-444-_-y08-1#07/04/2020#Test Under Lyne - Glossop',
                            '444#NW_01_MCT_391_1#23/04/2019#Macclesfield - Bollington - Poynton - Stockport',
                            '543#NW_04_MCTR_232_1#06/04/2020#Ashton - Hurst Cross - Broadoak Circular',
                        ],
                    },
                    {
                        nocCode: 'LEDS',
                        services: [
                            '342#11-237-_-y08-1#07/04/2020#Another Test Under Lyne - Glossop',
                            '221#NW_01_MCT_391_1#23/04/2019#Macclesfield - Bollington - Poynton - Stockport',
                            '247#NW_04_MCTR_232_1#06/04/2020#Ashton - Hurst Cross - Broadoak Circular',
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
                [PRODUCT_DETAILS_ATTRIBUTE]: {
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
                },
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
            operatorPublicName: 'Manchester Community Transport',
        },
        {
            nocCode: 'WBTR',
            operatorPublicName: "Warrington's Own Buses",
        },
        {
            nocCode: 'BLAC',
            operatorPublicName: 'Blackpool Transport',
        },
    ];

    const atcoCodes: string[] = ['13003305E', '13003622B', '13003655B'];
    let batchGetStopsByAtcoCodeSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.spyOn(s3, 'getCsvZoneUploadData').mockImplementation(() => Promise.resolve(atcoCodes));

        batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
    });

    it('should return a SchemeOperatorTicket object', async () => {
        const mockFareZoneAttribute: FareZone = { fareZoneName: 'Green Lane Shops' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {
                operator: { operator: 'SCHEME_OPERATOR', region: 'SCHEME_REGION' },
                idToken: mockSchemOpIdToken,
            },
            session: {
                [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                [FARE_TYPE_ATTRIBUTE]: { fareType: 'multiOperator' },
                [FARE_ZONE_ATTRIBUTE]: mockFareZoneAttribute,
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
                },
                [MULTIPLE_OPERATOR_ATTRIBUTE]: { selectedOperators: mockMultiOpSelectedOperators },
                [FULL_TIME_RESTRICTIONS_ATTRIBUTE]: {
                    fullTimeRestrictions: [
                        {
                            day: 'monday',
                            startTime: '0900',
                            endTime: '',
                        },
                        {
                            day: 'tuesday',
                            startTime: '',
                            endTime: '1800',
                        },
                        {
                            day: 'bank holiday',
                            startTime: '0900',
                            endTime: '1750',
                        },
                        {
                            day: 'friday',
                            startTime: '',
                            endTime: '',
                        },
                    ],
                    errors: [],
                },
            },
        });
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve(zoneStops));
        const result = await getSchemeOperatorTicketJson(req, res);
        expect(result).toEqual(expectedSchemeOperatorTicket);
    });
});
