import { FullTimeRestriction, GeoZoneTicket } from '../types';
import * as sharedHelpers from './sharedHelpers';
import { getTimeRestrictions, getEarliestTime, getProductType } from './sharedHelpers';
import {
    periodGeoZoneTicket,
    periodMultipleServicesTicket,
    flatFareTicket,
    singleTicket,
    hybridPeriodTicket,
    pointToPointPeriodTicket,
    returnCircularTicket,
    returnNonCircularTicketWithReturnValidity,
} from '../test-data/matchingData';

describe('Shared Helpers', () => {
    describe('getTimeRestrictions', () => {
        const fullTimeRestriction: FullTimeRestriction[] = [
            {
                day: 'bankHoliday',
                timeBands: [
                    {
                        startTime: '',
                        endTime: '',
                    },
                ],
            },
            {
                day: 'tuesday',
                timeBands: [
                    {
                        startTime: '0900',
                        endTime: '1700',
                    },
                    {
                        startTime: '1800',
                        endTime: '2200',
                    },
                ],
            },
            {
                day: 'wednesday',
                timeBands: [
                    {
                        startTime: '1350',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                ],
            },
            {
                day: 'thursday',
                timeBands: [
                    {
                        startTime: '0000',
                        endTime: '2359',
                    },
                ],
            },
        ];

        it('generates the correct fareDayType', () => {
            const timeRestrictionNetex = getTimeRestrictions(fullTimeRestriction);

            expect(timeRestrictionNetex).toEqual({
                FareDemandFactor: {
                    id: 'op@Tariff@Demand',
                    validityConditions: {
                        AvailabilityCondition: {
                            IsAvailable: {
                                $t: true,
                            },
                            dayTypes: {
                                FareDayType: [
                                    {
                                        EarliestTime: {
                                            $t: null,
                                        },
                                        id: 'op@Tariff@DayType@bankHoliday',
                                        properties: {
                                            PropertyOfDay: {
                                                DaysOfWeek: {
                                                    $t: 'Everyday',
                                                },
                                                HolidayTypes: {
                                                    $t: 'NationalHoliday',
                                                },
                                            },
                                        },
                                        timebands: { Timeband: [] },
                                        version: '1.0',
                                    },
                                    {
                                        EarliestTime: {
                                            $t: '09:00:00',
                                        },
                                        id: 'op@Tariff@DayType@tuesday',
                                        properties: {
                                            PropertyOfDay: {
                                                DaysOfWeek: {
                                                    $t: 'Tuesday',
                                                },
                                                HolidayTypes: {
                                                    $t: null,
                                                },
                                            },
                                        },
                                        timebands: {
                                            Timeband: [
                                                {
                                                    EndTime: {
                                                        $t: '17:00:00',
                                                    },
                                                    StartTime: {
                                                        $t: '09:00:00',
                                                    },
                                                    id: 'op:timeband_for_tuesday@timeband_1',
                                                    version: '1.0',
                                                },
                                                {
                                                    EndTime: {
                                                        $t: '22:00:00',
                                                    },
                                                    StartTime: {
                                                        $t: '18:00:00',
                                                    },
                                                    id: 'op:timeband_for_tuesday@timeband_2',
                                                    version: '1.0',
                                                },
                                            ],
                                        },
                                        version: '1.0',
                                    },
                                    {
                                        EarliestTime: {
                                            $t: '13:50:00',
                                        },
                                        id: 'op@Tariff@DayType@wednesday',
                                        properties: {
                                            PropertyOfDay: {
                                                DaysOfWeek: {
                                                    $t: 'Wednesday',
                                                },
                                                HolidayTypes: {
                                                    $t: null,
                                                },
                                            },
                                        },
                                        timebands: {
                                            Timeband: [
                                                {
                                                    EndTime: {
                                                        $t: '19:50:00',
                                                    },
                                                    StartTime: {
                                                        $t: '13:50:00',
                                                    },
                                                    id: 'op:timeband_for_wednesday@timeband_1',
                                                    version: '1.0',
                                                },
                                                {
                                                    EndTime: {
                                                        $t: null,
                                                    },
                                                    StartTime: {
                                                        $t: '23:50:00',
                                                    },
                                                    id: 'op:timeband_for_wednesday@timeband_2',
                                                    version: '1.0',
                                                },
                                            ],
                                        },
                                        version: '1.0',
                                    },
                                    {
                                        EarliestTime: {
                                            $t: '00:00:00',
                                        },
                                        id: 'op@Tariff@DayType@thursday',
                                        properties: {
                                            PropertyOfDay: {
                                                DaysOfWeek: {
                                                    $t: 'Thursday',
                                                },
                                                HolidayTypes: {
                                                    $t: null,
                                                },
                                            },
                                        },
                                        timebands: {
                                            Timeband: [
                                                {
                                                    EndTime: {
                                                        $t: '23:59:00',
                                                    },
                                                    StartTime: {
                                                        $t: '00:00:00',
                                                    },
                                                    id: 'op:timeband_for_thursday@timeband_1',
                                                    version: '1.0',
                                                },
                                            ],
                                        },
                                        version: '1.0',
                                    },
                                ],
                            },
                            id: 'op@Tariff@Condition',
                            version: '1.0',
                        },
                    },
                    version: '1.0',
                },
            });
        });
    });
    describe('getEarliestTime', () => {
        it('returns the earliest time in the array', () => {
            const times = {
                day: 'wednesday',
                timeBands: [
                    {
                        startTime: '0200',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '0200',
                    },
                    {
                        startTime: '2200',
                        endTime: '1950',
                    },
                    {
                        startTime: '0300',
                        endTime: '',
                    },
                    {
                        startTime: '1500',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                    {
                        startTime: '2300',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                    {
                        startTime: '',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                    {
                        startTime: '0100',
                        endTime: '1950',
                    },
                    {
                        startTime: '2350',
                        endTime: '',
                    },
                ],
            };
            const result = getEarliestTime(times);
            expect(result).toBe('0100');
        });
    });

    describe('getFareStructureElements', () => {
        const geoUserPeriodTicket: GeoZoneTicket = periodGeoZoneTicket;
        const placeHolderText = `${geoUserPeriodTicket.nocCode}_products`;

        it('returns 3 fareSructureElements for each product in the products array for multiService; Access Zones, Eligibility and Conditions of Travel', () => {
            const expectedLength = flatFareTicket.products.length * 3;
            const result = sharedHelpers.getFareStructuresElements(
                flatFareTicket,
                false,
                '',
                placeHolderText,
                'groupOfLinesRef',
            );
            const namesOfTypesOfFareStructureElements: string[] = result.map(element => {
                return element.Name.$t;
            });

            namesOfTypesOfFareStructureElements.forEach(name => {
                expect(
                    name === 'Available lines and/or zones' ||
                        name === 'Eligible user types' ||
                        name === 'Conditions of travel',
                ).toBeTruthy();
            });

            expect(result.length).toBe(expectedLength);
        });

        it('returns 3 fareSructureElements for each product in the products array for multiService; Access Zones, Durations and Conditions of Travel and 1 for eligibility', () => {
            const expectedLength = periodMultipleServicesTicket.products.length * 3 + 1;
            const result = sharedHelpers.getFareStructuresElements(
                periodMultipleServicesTicket,
                false,
                '',
                placeHolderText,
                'groupOfLinesRef',
            );
            const namesOfTypesOfFareStructureElements: string[] = result.map(element => {
                return element.Name.$t;
            });

            namesOfTypesOfFareStructureElements.forEach(name => {
                expect(
                    name === 'Available lines and/or zones' ||
                        name.includes('Available duration combination') ||
                        name === 'Eligible user types' ||
                        name === 'Conditions of travel',
                ).toBeTruthy();
            });
            expect(result.length).toBe(expectedLength);
        });

        it('returns 3 fareStructureElements for each product in the products array for geoZone; Access Zones, Durations and Conditions of Travel and 1 for eligibility', () => {
            const expectedLength = geoUserPeriodTicket.products.length * 3 + 1;
            const result = sharedHelpers.getFareStructuresElements(
                geoUserPeriodTicket,
                false,
                '',
                placeHolderText,
                'groupOfLinesRef',
            );
            const namesOfTypesOfFareStructureElements: string[] = result.map(element => {
                return element.Name.$t;
            });

            namesOfTypesOfFareStructureElements.forEach(name => {
                expect(
                    name === 'Available lines and/or zones' ||
                        name.includes('Available duration combination') ||
                        name === 'Eligible user types' ||
                        name === 'Conditions of travel',
                ).toBeTruthy();
            });
            expect(result.length).toBe(expectedLength);
        });

        it('returns the fareStructureElements in the format we expect', () => {
            const geoResult = sharedHelpers.getFareStructuresElements(
                geoUserPeriodTicket,
                false,
                '',
                placeHolderText,
                'groupOfLinesRef',
            );

            const expectedAccessZonesFareStructureElement = {
                version: '1.0',
                id: expect.stringContaining('op:Tariff@'),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                TypeOfFareStructureElementRef: expect.objectContaining({
                    version: expect.any(String),
                    ref: expect.any(String),
                }),
                GenericParameterAssignment: expect.any(Object),
                qualityStructureFactors: null,
            };

            const expectedDurationsFareStructureElement = {
                version: '1.0',
                id: expect.stringContaining('op:Tariff@'),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                TypeOfFareStructureElementRef: expect.objectContaining({
                    version: expect.any(String),
                    ref: expect.any(String),
                }),
                timeIntervals: expect.objectContaining({ TimeIntervalRef: expect.anything() }),
            };

            const expectedCarnetFareStructureElement = {
                version: '1.0',
                id: 'mb:Tariff@multitrip@units',
                Name: { $t: 'Carnet denominations' },
                Description: { $t: `Number of period units in bundle.` },
                TypeOfFareStructureElementRef: {
                    version: 'fxc:v1.0',
                    ref: 'fxc:carnet_units',
                },
                qualityStructureFactors: {
                    QualityStructureFactor: [
                        {
                            version: '1.0',
                            id: `mb:Tariff@multitrip@5`,
                            Value: { $t: '5' },
                        },
                        {
                            version: '1.0',
                            id: `mb:Tariff@multitrip@5`,
                            Value: { $t: '10' },
                        },
                        {
                            version: '1.0',
                            id: `mb:Tariff@multitrip@5`,
                            Value: { $t: '15' },
                        },
                    ],
                },
            };

            const expectedEligibilityFareStructureElement = {
                version: '1.0',
                id: expect.stringContaining('op:Tariff@'),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                TypeOfFareStructureElementRef: expect.objectContaining({
                    version: expect.any(String),
                    ref: expect.any(String),
                }),
                GenericParameterAssignment: expect.any(Object),
            };

            const expectedConditionsOfTravelFareStructureElement = {
                version: '1.0',
                id: expect.stringContaining('op:Tariff@'),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                GenericParameterAssignment: expect.any(Object),
            };

            geoResult.forEach(fareStructureElement => {
                if (fareStructureElement.timeIntervals) {
                    expect(fareStructureElement).toEqual(expectedDurationsFareStructureElement);
                } else if (fareStructureElement.qualityStructureFactors === null) {
                    expect(fareStructureElement).toEqual(expectedAccessZonesFareStructureElement);
                } else if (fareStructureElement.qualityStructureFactors) {
                    expect(fareStructureElement).toEqual(expectedCarnetFareStructureElement);
                } else if (fareStructureElement.TypeOfFareStructureElementRef) {
                    expect(fareStructureElement).toEqual(expectedEligibilityFareStructureElement);
                } else {
                    expect(fareStructureElement).toEqual(expectedConditionsOfTravelFareStructureElement);
                }
            });
        });
    });

    describe('getCarnetQualityStructureFactorRef', () => {
        it('returns a carnetQualityStructureFactorRef when carnetDetails present', () => {
            const productDetails = {
                productName: 'Product 1',
                carnetDetails: {
                    quantity: '10',
                    expiryTime: '5',
                    expiryUnit: 'day',
                },
                salesOfferPackages: [
                    {
                        id: 1,
                        name: 'Onboard (cash)',
                        description: 'Purchasable on board the bus, with cash, as a paper ticket.',
                        purchaseLocations: ['onBoard'],
                        paymentMethods: ['cash'],
                        ticketFormats: ['paperTicket'],
                    },
                ],
            };

            const expectedCarnetQualityStructureFactorRef = {
                QualityStructureFactorRef: {
                    version: '1.0',
                    ref: `mb:Tariff@multitrip@10`,
                },
            };

            expect(sharedHelpers.getCarnetQualityStructureFactorRef(productDetails)).toEqual(
                expectedCarnetQualityStructureFactorRef,
            );
        });

        it('returns an empty object when carnetDetails not present', () => {
            const productDetails = {
                productName: 'Product 1',
                salesOfferPackages: [
                    {
                        id: 1,
                        name: 'Onboard (cash)',
                        description: 'Purchasable on board the bus, with cash, as a paper ticket.',
                        purchaseLocations: ['onBoard'],
                        paymentMethods: ['cash'],
                        ticketFormats: ['paperTicket'],
                    },
                ],
            };

            const expectedCarnetQualityStructureFactorRef = {};

            expect(sharedHelpers.getCarnetQualityStructureFactorRef(productDetails)).toEqual(
                expectedCarnetQualityStructureFactorRef,
            );
        });
    });

    describe.only('getProductType', () => {
        const returnCircularTicketForOneDay = {
            ...returnCircularTicket,
            returnPeriodValidity: {
                amount: '1',
                typeOfDuration: 'day',
            },
        };
        it.each([
            ['singleTrip', singleTicket],
            ['periodReturnTrip', returnNonCircularTicketWithReturnValidity],
            ['dayReturnTrip', returnCircularTicketForOneDay],
            ['periodPass', periodGeoZoneTicket],
            ['dayPass', periodMultipleServicesTicket],
            ['singleTrip', flatFareTicket],
            ['periodPass', hybridPeriodTicket],
            ['periodPass', pointToPointPeriodTicket],
        ])('should return %s when given %s', (expectedResult, ticket) => {
            const result = getProductType(ticket);

            expect(result).toEqual(expectedResult);
        });
    });
});
