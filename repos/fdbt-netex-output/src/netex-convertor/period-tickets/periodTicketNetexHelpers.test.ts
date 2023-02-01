import { GeoZoneTicket, SchemeOperator } from '../../types';
import * as netexHelpers from './periodTicketNetexHelpers';
import {
    getGeographicalIntervalPrices,
    getGeographicalIntervals,
    getGroupOfLinesList,
    getGroupOfOperators,
    getOrganisations,
} from './periodTicketNetexHelpers';
import {
    periodGeoZoneTicket,
    periodMultipleServicesTicket,
    flatFareTicket,
    carnetPeriodGeoZoneTicket,
    carnetPeriodMultipleServicesTicket,
    multiOperatorFlatFareMultiServicesTicket,
} from '../../test-data/matchingData';
import { operatorData, multiOperatorList } from '../test-data/operatorData';
import * as db from '../../data/auroradb';
import { replaceIWBusCoNocCode } from '../sharedHelpers';
import { PeriodMultipleServicesTicket } from 'fdbt-types/matchingJsonTypes';

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

    const multiOpFlatFareFareTableSchema = {
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
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

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
                id: expect.any(String),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                Description: { $t: expect.any(String) },
                Url: expect.objectContaining({ $t: expect.any(String) }),
                PublicCode: expect.objectContaining({ $t: expect.any(String) }),
                PrivateCode: expect.objectContaining({ type: 'txc:Line@id', $t: expect.any(String) }),
                OperatorRef: { version: '1.0', ref: expect.stringContaining('noc:') },
                LineType: { $t: 'local' },
            };
            const seen: string[] = [];
            const expectedLength = periodMultipleServicesTicket.selectedServices.filter(item => {
                return seen.includes(item.lineId) ? false : seen.push(item.lineId);
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
                ref: expect.any(String),
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

    describe('getMultiServiceList', () => {
        it('returns a list of fare table objects when given multi operator flat fare matching data', () => {
            const expectedLength = multiOperatorFlatFareMultiServicesTicket.products
                .map(product => product.salesOfferPackages.length)
                .reduce((a, b) => a + b);

            const flatFareFareTables = netexHelpers.getMultiServiceList(
                multiOperatorFlatFareMultiServicesTicket as PeriodMultipleServicesTicket,
                'test',
            );
            expect(flatFareFareTables).toHaveLength(expectedLength);

            flatFareFareTables.forEach(fareTable => {
                expect(fareTable).toEqual(multiOpFlatFareFareTableSchema);
            });
        });

        it('returns a list of fare table objects when given multi operator matching data', () => {
            const expectedLength = periodMultipleServicesTicket.products
                .map(product => product.salesOfferPackages.length)
                .reduce((a, b) => a + b);

            const flatFareFareTables = netexHelpers.getMultiServiceList(periodMultipleServicesTicket, 'test');
            expect(flatFareFareTables).toHaveLength(expectedLength);

            flatFareFareTables.forEach(fareTable => {
                expect(fareTable).toEqual(multiServiceFareTableSchema(false));
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
                false,
            );

            const expectedFormat = {
                ChargingMomentRef: expect.objectContaining({
                    ref: expect.any(String),
                    versionRef: 'fxc:v1.0',
                }),
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
                false,
            );

            const expectedFormat = {
                ChargingMomentRef: expect.objectContaining({
                    ref: expect.any(String),
                    versionRef: 'fxc:v1.0',
                }),
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
            expect(result.length).toBe(1);
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

    describe('getGeographicalIntervals', () => {
        it('returns an array of geographical intervals for a given pricing per distance', () => {
            const input = {
                productName: 'Flat Fare With Distances',
                salesOfferPackages: [
                    {
                        id: 1,
                        name: 'cash',
                        description: 'Purchase method automatically created',
                        purchaseLocations: ['onBoard'],
                        paymentMethods: ['cash'],
                        ticketFormats: ['paperTicket'],
                        isCapped: false,
                    },
                ],
                pricingByDistance: {
                    maximumPrice: '8',
                    minimumPrice: '6',
                    distanceBands: [
                        { distanceFrom: '0', distanceTo: '2', pricePerKm: '3' },
                        { distanceFrom: '2', distanceTo: '4', pricePerKm: '2' },
                        { distanceFrom: '4', distanceTo: '5', pricePerKm: '1.50' },
                        { distanceFrom: '5', distanceTo: '8', pricePerKm: '1' },
                        { distanceFrom: '8', distanceTo: 'Max', pricePerKm: '0.50' },
                    ],
                    productName: 'Flat Fare With Distances',
                },
            };

            const result = getGeographicalIntervals(input);

            expect(result).toStrictEqual([
                {
                    EndGeographicalValue: { $t: '1' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 0km to 1km' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '0' },
                    id: 'distance_band_0_to_1',
                    version: '1.0',
                },
                {
                    EndGeographicalValue: { $t: '2' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 1km to 2km' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '1' },
                    id: 'distance_band_1_to_2',
                    version: '1.0',
                },
                {
                    EndGeographicalValue: { $t: '3' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 2km to 3km' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '2' },
                    id: 'distance_band_2_to_3',
                    version: '1.0',
                },
                {
                    EndGeographicalValue: { $t: '4' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 3km to 4km' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '3' },
                    id: 'distance_band_3_to_4',
                    version: '1.0',
                },
                {
                    EndGeographicalValue: { $t: '5' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 4km to 5km' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '4' },
                    id: 'distance_band_4_to_5',
                    version: '1.0',
                },
                {
                    EndGeographicalValue: { $t: '6' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 5km to 6km' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '5' },
                    id: 'distance_band_5_to_6',
                    version: '1.0',
                },
                {
                    EndGeographicalValue: { $t: '7' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 6km to 7km' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '6' },
                    id: 'distance_band_6_to_7',
                    version: '1.0',
                },
                {
                    EndGeographicalValue: { $t: '8' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 7km to 8km' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '7' },
                    id: 'distance_band_7_to_8',
                    version: '1.0',
                },
                {
                    EndGeographicalValue: { $t: '100' },
                    GeographicalUnitRef: { ref: 'kilometers', version: '1.0' },
                    IntervalType: { $t: 'distance' },
                    Name: { $t: 'One kilometer, 8km to the next, until end of the journey' },
                    NumberOfUnits: { $t: '1' },
                    StartGeographicalValue: { $t: '8' },
                    id: 'distance_band_8_to_Max',
                    version: '1.0',
                },
            ]);
        });
    });

    describe('getGeographicalIntervalPrices', () => {
        it('returns an array of geographical interval prices for a given array of distance bands', () => {
            const input = [
                { distanceFrom: '0', distanceTo: '2', pricePerKm: '3' },
                { distanceFrom: '2', distanceTo: '4', pricePerKm: '2' },
                { distanceFrom: '4', distanceTo: '5', pricePerKm: '1.50' },
                { distanceFrom: '5', distanceTo: '8', pricePerKm: '1' },
                { distanceFrom: '8', distanceTo: 'Max', pricePerKm: '0.50' },
            ];

            const result = getGeographicalIntervalPrices(input);

            expect(result).toStrictEqual([
                {
                    Amount: { $t: '3' },
                    GeographicalIntervalRef: { ref: 'distance_band_0_to_1', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_0_to_1',
                    version: '1.0',
                },
                {
                    Amount: { $t: '3' },
                    GeographicalIntervalRef: { ref: 'distance_band_1_to_2', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_1_to_2',
                    version: '1.0',
                },
                {
                    Amount: { $t: '2' },
                    GeographicalIntervalRef: { ref: 'distance_band_2_to_3', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_2_to_3',
                    version: '1.0',
                },
                {
                    Amount: { $t: '2' },
                    GeographicalIntervalRef: { ref: 'distance_band_3_to_4', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_3_to_4',
                    version: '1.0',
                },
                {
                    Amount: { $t: '1.50' },
                    GeographicalIntervalRef: { ref: 'distance_band_4_to_5', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_4_to_5',
                    version: '1.0',
                },
                {
                    Amount: { $t: '1' },
                    GeographicalIntervalRef: { ref: 'distance_band_5_to_6', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_5_to_6',
                    version: '1.0',
                },
                {
                    Amount: { $t: '1' },
                    GeographicalIntervalRef: { ref: 'distance_band_6_to_7', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_6_to_7',
                    version: '1.0',
                },
                {
                    Amount: { $t: '1' },
                    GeographicalIntervalRef: { ref: 'distance_band_7_to_8', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_7_to_8',
                    version: '1.0',
                },
                {
                    Amount: { $t: '0.50' },
                    GeographicalIntervalRef: { ref: 'distance_band_8_to_Max', version: '1.0' },
                    Units: { $t: '1' },
                    id: 'price_for_1km_travelling_8_to_Max',
                    version: '1.0',
                },
            ]);
        });
    });

    describe('getExemptedLinesList', () => {
        it('returns a NeTEx list of exempted lines', () => {
            const exemptedServices = [
                {
                    lineName: '1',
                    lineId: '4YyoI0',
                    serviceCode: 'NW_05_BLAC_1_1',
                    serviceDescription: 'FLEETWOOD - BLACKPOOL via Promenade',
                    startDate: '11/06/2020',
                },
                {
                    lineName: '2',
                    lineId: 'YpQjUw',
                    serviceCode: 'NW_05_BLAC_2_1',
                    serviceDescription: 'POULTON - BLACKPOOL via Victoria Hospital Outpatients',
                    startDate: '11/06/2020',
                },
            ];
            const exemptionElement = netexHelpers.getExemptedLinesList(exemptedServices, 'BLAC', 'www.unittest.com');

            expect(exemptionElement).toStrictEqual([
                {
                    version: '1.0',
                    id: '4YyoI0',
                    Name: { $t: 'Line 1' },
                    Description: { $t: 'FLEETWOOD - BLACKPOOL via Promenade' },
                    Url: { $t: 'www.unittest.com' },
                    PublicCode: { $t: '1' },
                    PrivateCode: {
                        type: 'txc:Line@id',
                        $t: '4YyoI0',
                    },
                    OperatorRef: {
                        version: '1.0',
                        ref: `noc:${replaceIWBusCoNocCode('BLAC')}`,
                    },
                    LineType: { $t: 'local' },
                },
                {
                    version: '1.0',
                    id: 'YpQjUw',
                    Name: { $t: 'Line 2' },
                    Description: { $t: 'POULTON - BLACKPOOL via Victoria Hospital Outpatients' },
                    Url: { $t: 'www.unittest.com' },
                    PublicCode: { $t: '2' },
                    PrivateCode: {
                        type: 'txc:Line@id',
                        $t: 'YpQjUw',
                    },
                    OperatorRef: {
                        version: '1.0',
                        ref: `noc:${replaceIWBusCoNocCode('BLAC')}`,
                    },
                    LineType: { $t: 'local' },
                },
            ]);
        });
    });

    describe('getExemptedGroupOfLinesList', () => {
        it('returns a NeTEx list of exempted lines as a group', () => {
            const exemptedLines = [
                {
                    version: '1.0',
                    id: '4YyoI0',
                    Name: { $t: 'Line 1' },
                    Description: { $t: 'FLEETWOOD - BLACKPOOL via Promenade' },
                    Url: { $t: 'www.unittest.com' },
                    PublicCode: { $t: '1' },
                    PrivateCode: {
                        type: 'txc:Line@id',
                        $t: '4YyoI0',
                    },
                    OperatorRef: {
                        version: '1.0',
                        ref: `noc:${replaceIWBusCoNocCode('BLAC')}`,
                    },
                    LineType: { $t: 'local' },
                },
                {
                    version: '1.0',
                    id: 'YpQjUw',
                    Name: { $t: 'Line 2' },
                    Description: { $t: 'POULTON - BLACKPOOL via Victoria Hospital Outpatients' },
                    Url: { $t: 'www.unittest.com' },
                    PublicCode: { $t: '2' },
                    PrivateCode: {
                        type: 'txc:Line@id',
                        $t: 'YpQjUw',
                    },
                    OperatorRef: {
                        version: '1.0',
                        ref: `noc:${replaceIWBusCoNocCode('BLAC')}`,
                    },
                    LineType: { $t: 'local' },
                },
            ];
            const exemptionElement = netexHelpers.getExemptedGroupOfLinesList('abc', exemptedLines);
            const lineReferences = exemptedLines.map(line => line.id);
            expect(exemptionElement).toStrictEqual([
                {
                    version: '1.0',
                    id: 'abc@groupOfLines@1',
                    Name: {
                        $t: `A group of exempt services.`,
                    },
                    members: {
                        LineRef: lineReferences.map(lineRef => ({
                            version: '1.0',
                            ref: lineRef,
                        })),
                    },
                },
            ]);
        });
    });

    describe('getExemptionsElement', () => {
        it('returns a NeTEx object containing reference to exempt group of lines', () => {
            const exemptionElement = netexHelpers.getExemptionsElement('abc', {}, false);

            expect(exemptionElement).toStrictEqual({
                version: '1.0',
                id: 'op:abc',
                Name: { $t: 'Exempted Services' },
                TypeOfFareStructureElementRef: {
                    version: 'fxc:v1.0',
                    ref: 'fxc:access',
                },
                qualityStructureFactors: null,
                GenericParameterAssignment: {
                    id: 'abc',
                    version: '1.0',
                    order: '1',
                    TypeOfAccessRightAssignmentRef: {
                        version: 'fxc:v1.0',
                        ref: 'fxc:cannot_access',
                    },
                    ValidityParameterGroupingType: { $t: 'NOT' },
                    validityParameters: {},
                },
            });
        });
    });
});
