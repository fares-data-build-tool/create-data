import {
    getSingleTicketJson,
    getReturnTicketJson,
    getPeriodGeoZoneTicketJson,
    getPeriodMultipleServicesTicketJson,
    getFlatFareTicketJson,
    generateSalesOfferPackages,
    getProductsAndSalesOfferPackages,
} from '../../../../src/pages/api/apiUtils/userData';
import {
    getMockRequestAndResponse,
    expectedMatchingJsonSingle,
    userFareStages,
    service,
    mockMatchingFaresZones,
    expectedMatchingJsonReturnNonCircular,
    mockOutBoundMatchingFaresZones,
    expectedSingleProductUploadJsonWithZoneUpload,
    zoneStops,
    expectedFlatFareProductUploadJson,
    expectedSalesOfferPackageArray,
    expectedMatchingJsonReturnCircular,
    expectedProductDetailsArray,
    expectedMultiProductUploadJsonWithSelectedServices,
    mockTimeRestriction,
} from '../../../testData/mockData';
import * as s3 from '../../../../src/data/s3';
import * as auroradb from '../../../../src/data/auroradb';
import {
    MATCHING_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
} from '../../../../src/constants';
import { FareZone } from '../../../../src/pages/api/csvZoneUpload';
import { MultipleProductAttribute } from '../../../../src/pages/api/multipleProductValidity';

describe('generateSalesOfferPackages', () => {
    it('should return an array of SalesOfferPackage objects', () => {
        const entry = [
            '{"name":"Onboard (cash)","description":"Purchasable on board the bus, with cash, as a paper ticket.","purchaseLocations":["onBoard"],"paymentMethods":["cash"],"ticketFormats":["paperTicket"]}',
            '{"name":"Onboard (contactless)","description":"Purchasable on board the bus, with a contactless card or device, as a paper ticket.","purchaseLocations":["onBoard"],"paymentMethods":["contactlessPaymentCard"],"ticketFormats":["paperTicket"]}',
        ];
        const result = generateSalesOfferPackages(entry);
        expect(result).toEqual(expectedSalesOfferPackageArray);
    });
});

describe('getProductsAndSalesOfferPackages', () => {
    it('should return an array of ProductDetails objects', () => {
        const { req } = getMockRequestAndResponse({
            body: {
                DayRider:
                    '{"name":"CashRider - Cash - Ticket Machine","description":"A Day Rider ticket for an adult that can bought using cash at a ticket machine","purchaseLocations":["TicketMachine"],"paymentMethods":["Cash"],"ticketFormats":["Paper"]}',
                WeekRider:
                    '{"name":"CashCardRider - Cash & Card - Bus, Ticket Machine, Shop","description":"A Weekly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
            },
        });
        const requestBody: { [key: string]: string } = req.body;
        const multipleProductAttribute: MultipleProductAttribute = {
            products: [
                { productName: 'DayRider', productPrice: '2.99', productDuration: '1', productValidity: '24hr' },
                { productName: 'WeekRider', productPrice: '7.99', productDuration: '7', productValidity: '24hr' },
            ],
        };
        const result = getProductsAndSalesOfferPackages(requestBody, multipleProductAttribute);
        expect(result).toEqual(expectedProductDetailsArray);
    });
});

describe('getSingleTicketJson', () => {
    it('should return a SingleTicket object', () => {
        const { req, res } = getMockRequestAndResponse({
            body: {
                'Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop':
                    '{"name":"Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop","description":"A Weekly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
            },
            session: {
                [MATCHING_ATTRIBUTE]: {
                    service,
                    userFareStages,
                    matchingFareZones: mockMatchingFaresZones,
                },
                [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
            },
        });
        const result = getSingleTicketJson(req, res);
        expect(result).toEqual(expectedMatchingJsonSingle);
    });
});

describe('getReturnTicketJson', () => {
    it('should return a ReturnTicket object for a non circular return journey', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'return' },
            body: {
                'Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop':
                    '{"name":"Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop","description":"A Weekly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
            },
            session: {
                [MATCHING_ATTRIBUTE]: {
                    service,
                    userFareStages,
                    matchingFareZones: mockOutBoundMatchingFaresZones,
                },
                [INBOUND_MATCHING_ATTRIBUTE]: {
                    inboundUserFareStages: userFareStages,
                    inboundMatchingFareZones: mockMatchingFaresZones,
                },
                [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
            },
        });
        const result = getReturnTicketJson(req, res);
        expect(result).toEqual(expectedMatchingJsonReturnNonCircular);
    });
    it('should return a ReturnTicket object for a circular journey', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'return' },
            body: {
                'Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop':
                    '{"name":"Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop","description":"A Weekly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
            },
            session: {
                [MATCHING_ATTRIBUTE]: {
                    service,
                    userFareStages,
                    matchingFareZones: mockMatchingFaresZones,
                },
                [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
            },
        });
        const result = getReturnTicketJson(req, res);
        expect(result).toEqual(expectedMatchingJsonReturnCircular);
    });
});

describe('getPeriodGeoZoneTicketJson', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const atcoCodes: string[] = ['13003305E', '13003622B', '13003655B'];
    let batchGetStopsByAtcoCodeSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.spyOn(s3, 'getCsvZoneUploadData').mockImplementation(() => Promise.resolve(atcoCodes));

        batchGetStopsByAtcoCodeSpy = jest.spyOn(auroradb, 'batchGetStopsByAtcoCode');
    });

    it('should return a PeriodGeoZoneTicket object', async () => {
        const mockFareZoneAttribute: FareZone = { fareZoneName: 'Green Lane Shops' };
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {
                fareType: 'period',
            },
            body: {
                'Product A':
                    '{"name":"Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop","description":"A Weekly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
            },
            session: {
                [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                [FARE_ZONE_ATTRIBUTE]: mockFareZoneAttribute,
                [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                    products: [
                        {
                            productName: 'Product A',
                            productPrice: '1234',
                            productDuration: '2',
                            productValidity: '24hr',
                        },
                    ],
                },
            },
        });
        batchGetStopsByAtcoCodeSpy.mockImplementation(() => Promise.resolve(zoneStops));
        const result = await getPeriodGeoZoneTicketJson(req, res);
        expect(result).toEqual(expectedSingleProductUploadJsonWithZoneUpload);
    });
});

describe('getPeriodMulipleServicesTicketJson', () => {
    it('should return a PeriodMultipleServicesTicket object', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: {
                fareType: 'period',
            },
            body: {
                'Weekly Ticket':
                    '{"name":"Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop","description":"A Weekly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
                'Day Ticket':
                    '{"name":"Adult - Day Rider - Cash, Card - OnBus, TicketMachine, Shop","description":"A Day Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
                'Monthly Ticket':
                    '{"name":"Adult - Monthly Rider - Cash, Card - OnBus, TicketMachine, Shop","description":"A Monthly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
            },
            session: {
                [TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE]: mockTimeRestriction,
                [MULTIPLE_PRODUCT_ATTRIBUTE]: {
                    products: [
                        {
                            productName: 'Weekly Ticket',
                            productPrice: '50',
                            productDuration: '5',
                            productValidity: '24hr',
                        },
                        {
                            productName: 'Day Ticket',
                            productPrice: '2.50',
                            productDuration: '1',
                            productValidity: '24hr',
                        },
                        {
                            productName: 'Monthly Ticket',
                            productPrice: '200',
                            productDuration: '28',
                            productValidity: 'endOfCalendarDay',
                        },
                    ],
                },
            },
        });
        const result = getPeriodMultipleServicesTicketJson(req, res);
        expect(result).toEqual(expectedMultiProductUploadJsonWithSelectedServices);
    });
});

describe('getFlatFareTicketJson', () => {
    it('should return a string a FlatFareTicket object', () => {
        const { req, res } = getMockRequestAndResponse({
            cookieValues: { fareType: 'flatFare' },
            body: {
                'Weekly Rider':
                    '{"name":"Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop","description":"A Weekly Rider ticket for an adult that can bought using cash and card, on a bus and at a ticket machine or shop","purchaseLocations":["OnBus","TicketMachine","Shop"],"paymentMethods":["Cash","Card"],"ticketFormats":["Paper","Mobile"]}',
            },
            session: {
                [PRODUCT_DETAILS_ATTRIBUTE]: {
                    products: [
                        {
                            productName: 'Weekly Rider',
                            productPrice: '7',
                        },
                    ],
                },
            },
        });
        const result = getFlatFareTicketJson(req, res);
        expect(result).toEqual(expectedFlatFareProductUploadJson);
    });
});
