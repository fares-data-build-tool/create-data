import { GeoZoneTicket, SchemeOperator } from '../../types';
import * as netexHelpers from './periodTicketNetexHelpers';
import { getGroupOfLinesList, getGroupOfOperators, getOrganisations } from './periodTicketNetexHelpers';
import {
    periodGeoZoneTicket,
    periodMultipleServicesTicket,
    flatFareTicket,
    carnetPeriodGeoZoneTicket,
    carnetPeriodMultipleServicesTicket,
} from '../../test-data/matchingData';
import { operatorData, multiOperatorList } from '../test-data/operatorData';
import * as db from '../../data/auroradb';

describe('periodTicketNetexHelpers', () => {
    const { stops } = periodGeoZoneTicket;
    const geoUserPeriodTicket: GeoZoneTicket = periodGeoZoneTicket;
    const carnetGeoUserPeriodTicket: GeoZoneTicket = carnetPeriodGeoZoneTicket;
    const opData = operatorData;
    const placeHolderText = `${geoUserPeriodTicket.nocCode}_products`;
    const opString = expect.stringContaining('op:');

    const multiServiceFareTableSchema = (carnet: boolean): {} => ({
        version: '1.0',
        id: expect.any(String),
        Name: {
            $t: expect.any(String),
        },
        pricesFor: {
            PreassignedFareProductRef: {
                version: '1.0',
                ref: expect.any(String),
            },
        },
        includes: {
            FareTable: {
                version: '1.0',
                id: expect.any(String),
                Name: {
                    $t: expect.any(String),
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: expect.any(String),
                        pricesFor: {
                            SalesOfferPackageRef: {
                                version: '1.0',
                                ref: expect.any(String),
                            },
                            ...(carnet
                                ? {
                                      QualityStructureFactorRef: {
                                          ref: expect.any(String),
                                          version: '1.0',
                                      },
                                  }
                                : null),
                        },
                        includes: {
                            FareTable: {
                                version: '1.0',
                                id: expect.any(String),
                                limitations: {
                                    UserProfileRef: {
                                        version: '1.0',
                                        ref: expect.any(String),
                                    },
                                },
                                prices: {
                                    TimeIntervalPrice: {
                                        version: '1.0',
                                        id: expect.any(String),
                                        Amount: { $t: expect.any(String) },
                                        TimeIntervalRef: {
                                            version: '1.0',
                                            ref: expect.any(String),
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const geoZoneFareTableSchema = (carnet: boolean): {} => ({
        version: '1.0',
        id: expect.any(String),
        Name: {
            $t: expect.any(String),
        },
        pricesFor: {
            PreassignedFareProductRef: {
                version: '1.0',
                ref: expect.any(String),
            },
        },
        includes: {
            FareTable: {
                version: '1.0',
                id: expect.any(String),
                Name: {
                    $t: expect.any(String),
                },
                specifics: {
                    TariffZoneRef: {
                        version: '1.0',
                        ref: expect.any(String),
                    },
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: expect.any(String),
                        pricesFor: {
                            SalesOfferPackageRef: {
                                version: '1.0',
                                ref: expect.any(String),
                            },
                            ...(carnet
                                ? {
                                      QualityStructureFactorRef: {
                                          ref: expect.any(String),
                                          version: '1.0',
                                      },
                                  }
                                : null),
                        },
                        includes: {
                            FareTable: {
                                version: '1.0',
                                id: expect.any(String),
                                limitations: {
                                    UserProfileRef: {
                                        version: '1.0',
                                        ref: expect.any(String),
                                    },
                                },
                                prices: {
                                    TimeIntervalPrice: {
                                        version: '1.0',
                                        id: expect.any(String),
                                        Amount: { $t: expect.any(String) },
                                        TimeIntervalRef: {
                                            version: '1.0',
                                            ref: expect.any(String),
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    describe('getScheduledStopPointsList', () => {
        it('returns a list of NeTEx scheduled stop points given a list of stops', () => {
            const scheduledStopPointsList = netexHelpers.getScheduledStopPointsList(stops);
            const expectedLength = stops.length;

            expect(scheduledStopPointsList).toHaveLength(expectedLength);
            scheduledStopPointsList.forEach(scheduledStopPoint => {
                expect(scheduledStopPoint).toEqual(
                    expect.objectContaining({
                        versionRef: 'EXTERNAL',
                        ref: expect.any(String),
                        $t: expect.any(String),
                    }),
                );
            });
        });
    });

    describe('getTopographicProjectionRefList', () => {
        it('returns a list of NeTEx topographic projections given a list of stops', () => {
            const topographicProjectionsList = netexHelpers.getTopographicProjectionRefList(stops);
            const expectedLength = stops.length;

            expect(topographicProjectionsList).toHaveLength(expectedLength);
            topographicProjectionsList.forEach(topographicProjection => {
                expect(topographicProjection).toEqual(
                    expect.objectContaining({
                        versionRef: 'nptg:EXTERNAL',
                        ref: expect.any(String),
                        $t: expect.any(String),
                    }),
                );
            });
        });
    });

    describe('getLinesList', () => {
        it('returns a list of NeTEx lines given periodMultipleServicesTicket matching data', () => {
            const expectedLineSchema = {
                version: '1.0',
                id: expect.stringContaining('op:'),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                Description: { $t: expect.any(String) },
                Url: expect.objectContaining({ $t: expect.any(String) }),
                PublicCode: expect.objectContaining({ $t: expect.any(String) }),
                PrivateCode: expect.objectContaining({ type: 'txc:Line@id', $t: expect.any(String) }),
                OperatorRef: { version: '1.0', ref: expect.stringContaining('noc:') },
                LineType: { $t: 'local' },
            };
            let seen: string[] = [];
            const expectedLength = periodMultipleServicesTicket.selectedServices.filter((item) =>{
                return seen.includes(item.serviceCode) ? false : (seen.push(item.serviceCode));
            }).length;
            const linesList = netexHelpers.getLinesList(periodMultipleServicesTicket, opData.url, multiOperatorList);

            expect(linesList).toHaveLength(expectedLength);
            linesList.forEach(line => {
                expect(line).toEqual(expectedLineSchema);
            });
        });
    });

    describe('getLineRefList', () => {
        it('returns a list of NeTEx line refs given periodMultipleServicesTicket matching data', () => {
            const expectLineRefFormat = {
                version: '1.0',
                ref: expect.stringContaining('op:'),
            };
            const expectedLength = periodMultipleServicesTicket.selectedServices.length;

            const lineRefList = netexHelpers.getLineRefList(periodMultipleServicesTicket);

            expect(lineRefList).toHaveLength(expectedLength);
            lineRefList.forEach(lineRef => {
                expect(lineRef).toEqual(expectLineRefFormat);
            });
        });
    });

    describe('getGeoZoneFareTable', () => {
        it.each([
            ['periodGeoZoneTicket', geoUserPeriodTicket, false],
            ['carnetPeriodGeoZoneTicket', carnetGeoUserPeriodTicket, true],
        ])(
            'returns a list of geoFareZoneTable objects for the products defined in %s matching data',
            (_ticketType, matchingData, carnet) => {
                const expectedLength = matchingData.products
                    .map(product => product.salesOfferPackages.length)
                    .reduce((a, b) => a + b);
                const geoZoneFareTables = netexHelpers.getGeoZoneFareTable(matchingData, placeHolderText, 'test');
                expect(geoZoneFareTables).toHaveLength(expectedLength);
                geoZoneFareTables.forEach(fareTable => {
                    expect(fareTable).toEqual(geoZoneFareTableSchema(carnet));
                });
            },
        );
    });

    describe('getMultiServiceFareTable', () => {
        it.each([
            ['periodMultipleServicesTicket', periodMultipleServicesTicket, false],
            ['carnetPeriodMultipleServicesTicket', carnetPeriodMultipleServicesTicket, true],
        ])(
            'returns a list of fare table objects when given %s matching data',
            (_ticketType, matchingData, carnet: boolean) => {
                const expectedLength = periodMultipleServicesTicket.products
                    .map(product => product.salesOfferPackages.length)
                    .reduce((a, b) => a + b);
                const multiServiceFareTables = netexHelpers.getMultiServiceFareTable(matchingData, 'test');
                expect(multiServiceFareTables).toHaveLength(expectedLength);
                multiServiceFareTables.forEach(fareTable => {
                    expect(fareTable).toEqual(multiServiceFareTableSchema(carnet));
                });
            },
        );

        it('returns a list of fare table objects when given flatFareTicket matching data', () => {
            const flatFareFareTableSchema = {
                version: '1.0',
                id: opString,
                Name: { $t: expect.any(String) },
                pricesFor: {
                    SalesOfferPackageRef: {
                        version: '1.0',
                        ref: expect.any(String),
                    },
                    PreassignedFareProductRef: {
                        version: '1.0',
                        ref: expect.any(String),
                    },
                },
                limitations: {
                    UserProfileRef: {
                        version: '1.0',
                        ref: expect.any(String),
                    },
                },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: opString,
                        Name: { $t: expect.any(String) },
                        prices: {
                            DistanceMatrixElementPrice: {
                                version: '1.0',
                                id: opString,
                                Amount: { $t: expect.any(String) },
                            },
                        },
                    },
                },
            };
            const expectedLength = flatFareTicket.products
                .map(product => product.salesOfferPackages.length)
                .reduce((a, b) => a + b);
            const flatFareFareTables = netexHelpers.getMultiServiceFareTable(flatFareTicket, 'test');
            expect(flatFareFareTables).toHaveLength(expectedLength);
            flatFareFareTables.forEach(fareTable => {
                expect(fareTable).toEqual(flatFareFareTableSchema);
            });
        });
    });

    describe('getGroupOfLinesList', () => {
        const lines = [
            {
                version: '',
                id: '1',
                Name: {},
                Description: {},
                Url: {},
                PublicCode: {},
                PrivateCode: {},
                OperatorRef: {},
                LineType: {},
            },
            {
                version: '',
                id: '2',
                Name: {},
                Description: {},
                Url: {},
                PublicCode: {},
                PrivateCode: {},
                OperatorRef: {},
                LineType: {},
            },
            {
                version: '',
                id: '3',
                Name: {},
                Description: {},
                Url: {},
                PublicCode: {},
                PrivateCode: {},
                OperatorRef: {},
                LineType: {},
            },
        ];

        it('takes a list of lines, gets their references, and builds a group of lines from it for hybrid', () => {
            const result = getGroupOfLinesList('opId', true, lines);
            expect(result[0].members).toStrictEqual({
                LineRef: [
                    { ref: '1', version: '1.0' },
                    { ref: '2', version: '1.0' },
                    { ref: '3', version: '1.0' },
                ],
            });
            expect(result[0].Name.$t).toBe('A group of available additional services.');
        });

        it('takes a list of lines, gets their references, and builds a group of lines from it for non-hybrid', () => {
            const result = getGroupOfLinesList('opId', false, lines);
            expect(result[0].members).toStrictEqual({
                LineRef: [
                    { ref: '1', version: '1.0' },
                    { ref: '2', version: '1.0' },
                    { ref: '3', version: '1.0' },
                ],
            });
            expect(result[0].Name.$t).toBe('A group of available services.');
        });
    });

    describe('getSalesOfferPackageList', () => {
        it('returns a sales offer package for each product in the products array', () => {
            const expectedLength = geoUserPeriodTicket.products.length;
            const result = netexHelpers.getSalesOfferPackageList(geoUserPeriodTicket, 'test');

            const expectedFormat = {
                Description: expect.objectContaining({ $t: expect.any(String) }),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                id: expect.any(String),
                version: expect.any(String),
                distributionAssignments: expect.objectContaining({
                    DistributionAssignment: expect.arrayContaining([
                        expect.objectContaining({
                            DistributionChannelRef: expect.objectContaining({
                                ref: expect.any(String),
                                version: expect.any(String),
                            }),
                            DistributionChannelType: expect.objectContaining({ $t: expect.any(String) }),
                            PaymentMethods: expect.objectContaining({ $t: expect.any(String) }),
                            id: expect.any(String),
                            order: expect.any(String),
                            version: expect.any(String),
                        }),
                    ]),
                }),
                salesOfferPackageElements: expect.objectContaining({
                    SalesOfferPackageElement: expect.arrayContaining([
                        expect.objectContaining({
                            PreassignedFareProductRef: expect.objectContaining({
                                ref: expect.any(String),
                                version: expect.any(String),
                            }),
                            TypeOfTravelDocumentRef: expect.objectContaining({
                                ref: expect.any(String),
                                version: expect.any(String),
                            }),
                            id: expect.any(String),
                            order: expect.any(String),
                            version: expect.any(String),
                        }),
                    ]),
                }),
            };

            const flattenedArrays = result.flat();

            flattenedArrays.forEach(salesOfferPackage => {
                expect(salesOfferPackage).toEqual(expectedFormat);
            });

            expect(result.length).toBe(expectedLength);
        });
    });

    describe('getPreassignedFareProducts', () => {
        it('returns a preassigned fare product per each product in the products array for geoZone', () => {
            const expectedLength = geoUserPeriodTicket.products.length;
            const result = netexHelpers.getPreassignedFareProducts(
                geoUserPeriodTicket,
                `noc:${geoUserPeriodTicket.nocCode}`,
                'noc:TestOperatorOpId',
            );

            const expectedFormat = {
                ChargingMomentType: expect.objectContaining({ $t: expect.any(String) }),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                OperatorRef: expect.objectContaining({
                    $t: expect.any(String),
                    ref: expect.any(String),
                    version: '1.0',
                }),
                ProductType: expect.objectContaining({ $t: expect.any(String) }),
                accessRightsInProduct: expect.any(Object),
                id: expect.any(String),
                TypeOfFareProductRef: expect.objectContaining({
                    ref: expect.any(String),
                    version: expect.any(String),
                }),
                validableElements: expect.any(Object),
                version: '1.0',
            };

            result.forEach(preassignedFareProduct => {
                expect(preassignedFareProduct).toEqual(expectedFormat);
            });

            expect(result.length).toBe(expectedLength);
        });

        it('returns a preassigned fare product per each product in the products array for multiService', () => {
            const expectedLength = periodMultipleServicesTicket.products.length;
            const result = netexHelpers.getPreassignedFareProducts(
                periodMultipleServicesTicket,
                `noc:${periodMultipleServicesTicket.nocCode}`,
                'noc:TestOperatorOpId',
            );

            const expectedFormat = {
                ChargingMomentType: expect.objectContaining({ $t: expect.any(String) }),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                OperatorRef: expect.objectContaining({
                    $t: expect.any(String),
                    ref: expect.any(String),
                    version: '1.0',
                }),
                ProductType: expect.objectContaining({ $t: expect.any(String) }),
                accessRightsInProduct: expect.any(Object),
                id: expect.any(String),
                TypeOfFareProductRef: expect.objectContaining({
                    ref: expect.any(String),
                    version: expect.any(String),
                }),
                validableElements: expect.any(Object),
                version: '1.0',
            };

            result.forEach(preassignedFareProduct => {
                expect(preassignedFareProduct).toEqual(expectedFormat);
            });

            expect(result.length).toBe(expectedLength);
        });
    });

    describe('getTimeIntervals', () => {
        it('returns a time interval for each product in the products array', () => {
            const expectedLength = periodMultipleServicesTicket.products.length;
            const result = netexHelpers.getTimeIntervals(periodMultipleServicesTicket);
            const expectedFormat = {
                Description: expect.objectContaining({ $t: expect.any(String) }),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                id: expect.any(String),
                version: '1.0',
            };

            if (!result) throw Error('result was not defined');

            result.forEach(timeInterval => {
                expect(timeInterval).toEqual(expectedFormat);
            });
            expect(result[0]).toStrictEqual({
                version: '1.0',
                id: 'op:Tariff@Day Rider@1-day',
                Name: { $t: '1 day' },
                Description: { $t: 'P1D' },
            });
            expect(result[1]).toStrictEqual({
                version: '1.0',
                id: 'op:Tariff@Weekly Rider@7-weeks',
                Name: { $t: '7 weeks' },
                Description: { $t: 'P49D' },
            });
            expect(result.length).toBe(expectedLength);
        });
    });

    describe('getGroupOfOperators', () => {
        beforeEach(() => {
            jest.spyOn(db, 'getOperatorDataByNocCode').mockImplementationOnce(() => Promise.resolve(multiOperatorList));
        });
        it('returns a group of operators object with a populated members array', () => {
            const result = getGroupOfOperators(multiOperatorList);
            expect(result).toStrictEqual({
                GroupOfOperators: {
                    Name: { $t: 'Bus Operators' },
                    id: 'operators@bus',
                    members: {
                        OperatorRef: [
                            { $t: 'Test Buses', ref: 'noc:aaa', version: '1.0' },
                            { $t: 'Super Buses', ref: 'noc:bbb', version: '1.0' },
                            { $t: 'Another Buses', ref: 'noc:ccc', version: '1.0' },
                        ],
                    },
                    version: '1.0',
                },
            });
        });
    });

    describe('getOrganisations', () => {
        beforeEach(() => {
            jest.spyOn(db, 'getOperatorDataByNocCode').mockImplementationOnce(() => Promise.resolve(multiOperatorList));
        });

        it('returns an array of operators with length equal to the length of arrays passed in', () => {
            const result = getOrganisations(multiOperatorList);
            expect(result).toStrictEqual([
                {
                    Address: { Street: { $t: '334' } },
                    ContactDetails: { Phone: { $t: 'SSSS' }, Url: { $t: 'www.unittest.com' } },
                    Name: { $t: 'Test Buses' },
                    PrimaryMode: { $t: 'bus' },
                    PublicCode: { $t: 'aaa' },
                    ShortName: { $t: 'Test Buses' },
                    TradingName: { $t: 'CCD' },
                    id: 'noc:aaa',
                    version: '1.0',
                },
                {
                    Address: { Street: { $t: '445' } },
                    ContactDetails: { Phone: { $t: 'DDDD' }, Url: { $t: 'www.besttest.com' } },
                    Name: { $t: 'Super Buses' },
                    PrimaryMode: { $t: 'bus' },
                    PublicCode: { $t: 'bbb' },
                    ShortName: { $t: 'Super Buses' },
                    TradingName: { $t: 'CVD' },
                    id: 'noc:bbb',
                    version: '1.0',
                },
                {
                    Address: { Street: { $t: '556' } },
                    ContactDetails: { Phone: { $t: 'QQQQQ' }, Url: { $t: 'www.anothertest.com' } },
                    Name: { $t: 'Another Buses' },
                    PrimaryMode: { $t: 'bus' },
                    PublicCode: { $t: 'ccc' },
                    ShortName: { $t: 'Another Buses' },
                    TradingName: { $t: 'CCQ' },
                    id: 'noc:ccc',
                    version: '1.0',
                },
            ]);
        });

        it('returns an array of operators with length equal to the length of arrays passed in, plus additional scheme operator info', () => {
            const mockSchemeOperatorInfo: SchemeOperator = {
                schemeOperatorName: 'Some Random Bus Co',
                schemeOperatorRegionCode: 'Y',
                url: '',
                email: '',
                opId: 'Some Random Bus Co-Y',
                vosaPsvLicenseName: '',
                contactNumber: '',
                street: '',
                mode: 'bus',
            };
            const result = getOrganisations(multiOperatorList, mockSchemeOperatorInfo);
            expect(result).toStrictEqual([
                {
                    Address: { Street: { $t: '334' } },
                    ContactDetails: { Phone: { $t: 'SSSS' }, Url: { $t: 'www.unittest.com' } },
                    Name: { $t: 'Test Buses' },
                    PrimaryMode: { $t: 'bus' },
                    PublicCode: { $t: 'aaa' },
                    ShortName: { $t: 'Test Buses' },
                    TradingName: { $t: 'CCD' },
                    id: 'noc:aaa',
                    version: '1.0',
                },
                {
                    Address: { Street: { $t: '445' } },
                    ContactDetails: { Phone: { $t: 'DDDD' }, Url: { $t: 'www.besttest.com' } },
                    Name: { $t: 'Super Buses' },
                    PrimaryMode: { $t: 'bus' },
                    PublicCode: { $t: 'bbb' },
                    ShortName: { $t: 'Super Buses' },
                    TradingName: { $t: 'CVD' },
                    id: 'noc:bbb',
                    version: '1.0',
                },
                {
                    Address: { Street: { $t: '556' } },
                    ContactDetails: { Phone: { $t: 'QQQQQ' }, Url: { $t: 'www.anothertest.com' } },
                    Name: { $t: 'Another Buses' },
                    PrimaryMode: { $t: 'bus' },
                    PublicCode: { $t: 'ccc' },
                    ShortName: { $t: 'Another Buses' },
                    TradingName: { $t: 'CCQ' },
                    id: 'noc:ccc',
                    version: '1.0',
                },
                {
                    Address: { Street: { $t: '' } },
                    ContactDetails: { Phone: { $t: '' }, Url: { $t: '' } },
                    Name: { $t: 'Some Random Bus Co' },
                    PrimaryMode: { $t: 'bus' },
                    PublicCode: { $t: 'Some Random Bus Co-Y' },
                    ShortName: { $t: 'Some Random Bus Co' },
                    TradingName: { $t: '' },
                    id: 'noc:Some Random Bus Co-Y',
                    version: '1.0',
                },
            ]);
        });
    });
});
