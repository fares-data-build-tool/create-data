import { PeriodMultipleServicesTicket, GeoZoneTicket, PeriodTicket, SchemeOperator } from '../../types/index';

import * as netexHelpers from './periodTicketNetexHelpers';
import { periodGeoZoneTicket, periodMultipleServicesTicket, flatFareTicket } from '../../test-data/matchingData';
import { operatorData, multiOperatorList } from '../test-data/operatorData';
import { getGroupOfOperators, getOrganisations } from './periodTicketNetexHelpers';
import * as db from '../data/auroradb';

describe('periodTicketNetexHelpers', () => {
    const { stops } = periodGeoZoneTicket;
    const geoUserPeriodTicket: GeoZoneTicket = periodGeoZoneTicket;
    const opData = operatorData;
    const placeHolderText = `${geoUserPeriodTicket.nocCode}_products`;
    const opString = expect.stringContaining('op:');
    const tripString = expect.stringContaining('Trip');

    const getExpectedFareTableColumn = (representingObject: {} | null): jest.Expect =>
        expect.objectContaining({
            Name: expect.objectContaining({ $t: expect.any(String) }),
            id: opString,
            representing: representingObject ? expect.objectContaining(representingObject) : null,
            version: '1.0',
        });

    const getExpectedFareTableRow = (representingObject: {} | null): jest.Expect =>
        expect.objectContaining({
            Name: expect.objectContaining({ $t: expect.any(String) }),
            id: opString,
            representing: representingObject ? expect.objectContaining(representingObject) : null,
            version: '1.0',
        });

    const getFareTableSchema = (
        matchingData: PeriodTicket,
        representingColumnsObject: {} | null,
        representingRowsObject: {} | null,
    ): {} => ({
        version: '1.0',
        id: opString,
        Name: expect.objectContaining({ $t: expect.any(String) }),
        specifics: netexHelpers.isGeoZoneTicket(matchingData)
            ? {
                  TariffZoneRef: { ref: opString, version: '1.0' },
              }
            : null,
        columns: expect.objectContaining({
            FareTableColumn: netexHelpers.isGeoZoneTicket(matchingData)
                ? getExpectedFareTableColumn({
                      TariffZoneRef: { ref: opString, version: '1.0' },
                  })
                : getExpectedFareTableColumn(null),
        }),
        includes: {
            FareTable: {
                Name: { $t: expect.any(String) },
                columns: {
                    FareTableColumn: getExpectedFareTableColumn(representingColumnsObject),
                },
                id: opString,
                includes: {
                    FareTable: {
                        Name: { $t: expect.any(String) },
                        cells: {
                            Cell: {
                                TimeIntervalPrice: {
                                    Amount: expect.any(Object),
                                    TimeIntervalRef: { ref: opString, version: '1.0' },
                                    id: opString,
                                    version: '1.0',
                                },
                                id: opString,
                                order: '1',
                                version: '1.0',
                                ColumnRef: { ref: opString, version: '1.0' },
                                RowRef: { ref: opString, version: '1.0' },
                            },
                        },
                        columns: {
                            FareTableColumn: getExpectedFareTableColumn(representingColumnsObject),
                        },
                        rows: {
                            FareTableRow: getExpectedFareTableRow(representingRowsObject),
                        },
                        id: opString,
                        limitations: {
                            UserProfileRef: { ref: opString, version: '1.0' },
                        },
                        version: '1.0',
                    },
                },
                pricesFor: {
                    SalesOfferPackageRef: { ref: tripString, version: '1.0' },
                },
                specifics: {
                    TypeOfTravelDocumentRef: { ref: opString, version: '1.0' },
                },
                version: '1.0',
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
                PrivateCode: expect.objectContaining({ type: 'noc', $t: expect.any(String) }),
                OperatorRef: { version: '1.0', ref: expect.stringContaining('noc:') },
                LineType: { $t: 'local' },
            };
            const expectedLength = periodMultipleServicesTicket.selectedServices.length;

            const linesList = netexHelpers.getLinesList(
                periodMultipleServicesTicket,
                opData.website,
                multiOperatorList,
            );

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
        it('returns a list of geoFareZoneTable objects for the products defined in periodGeoZoneTicket matching data', () => {
            const representingObjectTypeOfTravelDoc = {
                TypeOfTravelDocumentRef: expect.objectContaining({ ref: opString, version: '1.0' }),
                UserProfileRef: expect.objectContaining({ ref: opString, version: '1.0' }),
            };
            const representingObjectTimeIntervalDoc = {
                TimeIntervalRef: expect.objectContaining({ ref: opString, version: '1.0' }),
            };
            const geoZoneFareTableSchema = getFareTableSchema(
                geoUserPeriodTicket,
                representingObjectTypeOfTravelDoc,
                representingObjectTimeIntervalDoc,
            );
            const expectedLength = geoUserPeriodTicket.products.length;
            const geoZoneFareTables = netexHelpers.getGeoZoneFareTable(geoUserPeriodTicket, placeHolderText, 'test');
            expect(geoZoneFareTables).toHaveLength(expectedLength);
            geoZoneFareTables.forEach(fareTable => {
                expect(fareTable).toEqual(geoZoneFareTableSchema);
            });
        });
    });

    describe('getMultiServiceFareTable', () => {
        it('returns a list of fare table objects when given periodMultipleServicesTicket matching data', () => {
            const representingObjectTypeOfTravelDoc = {
                TypeOfTravelDocumentRef: expect.objectContaining({ ref: opString, version: '1.0' }),
                UserProfileRef: expect.objectContaining({ ref: opString, version: '1.0' }),
            };
            const representingObjectTimeIntervalDoc = {
                TimeIntervalRef: expect.objectContaining({ ref: opString, version: '1.0' }),
            };
            const multiServiceFareTableSchema = getFareTableSchema(
                periodMultipleServicesTicket,
                representingObjectTypeOfTravelDoc,
                representingObjectTimeIntervalDoc,
            );
            const expectedLength = periodMultipleServicesTicket.products.length;
            const multiServiceFareTables = netexHelpers.getMultiServiceFareTable(periodMultipleServicesTicket, 'test');
            expect(multiServiceFareTables).toHaveLength(expectedLength);
            multiServiceFareTables.forEach(fareTable => {
                expect(fareTable).toEqual(multiServiceFareTableSchema);
            });
        });

        it('returns a list of fare table objects when given flatFareTicket matching data', () => {
            const flatFareFareTableSchema = {
                version: '1.0',
                id: opString,
                Name: { $t: expect.any(String) },
                includes: {
                    FareTable: {
                        version: '1.0',
                        id: opString,
                        Name: { $t: expect.any(String) },
                        pricesFor: { SalesOfferPackageRef: { version: '1.0', ref: tripString } },
                        limitations: { UserProfileRef: { version: '1.0', ref: opString } },
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
            const expectedLength = flatFareTicket.products.length;
            const flatFareFareTables = netexHelpers.getMultiServiceFareTable(
                flatFareTicket as PeriodMultipleServicesTicket,
                'test',
            );
            expect(flatFareFareTables).toHaveLength(expectedLength);
            flatFareFareTables.forEach(fareTable => {
                expect(fareTable).toEqual(flatFareFareTableSchema);
            });
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
                typesOfFareProduct: expect.objectContaining({
                    TypeOfFareProductRef: expect.objectContaining({
                        ref: expect.any(String),
                        version: expect.any(String),
                    }),
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
                typesOfFareProduct: expect.objectContaining({
                    TypeOfFareProductRef: expect.objectContaining({
                        ref: expect.any(String),
                        version: expect.any(String),
                    }),
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

    describe('getFareStructureElements', () => {
        it('returns 3 fareSructureElements for each product in the products array for multiService; Access Zones, Eligibility and Conditions of Travel', () => {
            const expectedLength = flatFareTicket.products.length * 3;
            const result = netexHelpers.getFareStructuresElements(flatFareTicket as PeriodTicket, placeHolderText);
            const namesOfTypesOfFareStructureElements: string[] = result.map(element => {
                return element.Name.$t;
            });

            namesOfTypesOfFareStructureElements.forEach(name => {
                expect(
                    name === 'Available zones' || name === 'Eligible user types' || name === 'Conditions of travel',
                ).toBeTruthy();
            });

            expect(result.length).toBe(expectedLength);
        });

        it('returns 3 fareSructureElements for each product in the products array for multiService; Access Zones, Durations and Conditions of Travel and 1 for eligibility', () => {
            const expectedLength = periodMultipleServicesTicket.products.length * 3 + 1;
            const result = netexHelpers.getFareStructuresElements(periodMultipleServicesTicket, placeHolderText);
            const namesOfTypesOfFareStructureElements: string[] = result.map(element => {
                return element.Name.$t;
            });

            namesOfTypesOfFareStructureElements.forEach(name => {
                expect(
                    name === 'Available zones' ||
                        name.includes('Available duration combination') ||
                        name === 'Eligible user types' ||
                        name === 'Conditions of travel',
                ).toBeTruthy();
            });
            expect(result.length).toBe(expectedLength);
        });

        it('returns 3 fareStructureElements for each product in the products array for geoZone; Access Zones, Durations and Conditions of Travel and 1 for eligibility', () => {
            const expectedLength = geoUserPeriodTicket.products.length * 3 + 1;
            const result = netexHelpers.getFareStructuresElements(geoUserPeriodTicket, placeHolderText);
            const namesOfTypesOfFareStructureElements: string[] = result.map(element => {
                return element.Name.$t;
            });

            namesOfTypesOfFareStructureElements.forEach(name => {
                expect(
                    name === 'Available zones' ||
                        name.includes('Available duration combination') ||
                        name === 'Eligible user types' ||
                        name === 'Conditions of travel',
                ).toBeTruthy();
            });
            expect(result.length).toBe(expectedLength);
        });

        it('returns the fareStructureElements in the format we expect', () => {
            const geoResult = netexHelpers.getFareStructuresElements(geoUserPeriodTicket, placeHolderText);

            const expectedAccessZonesFareStructureElement = {
                version: '1.0',
                id: expect.stringContaining('op:Tariff@'),
                Name: expect.objectContaining({ $t: expect.any(String) }),
                Description: expect.objectContaining({ $t: expect.any(String) }),
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
                } else if (fareStructureElement.Description) {
                    expect(fareStructureElement).toEqual(expectedAccessZonesFareStructureElement);
                } else if (fareStructureElement.TypeOfFareStructureElementRef) {
                    expect(fareStructureElement).toEqual(expectedEligibilityFareStructureElement);
                } else {
                    expect(fareStructureElement).toEqual(expectedConditionsOfTravelFareStructureElement);
                }
            });
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
                website: '',
                ttrteEnq: '',
                opId: 'Some Random Bus Co-Y',
                vosaPsvLicenseName: '',
                fareEnq: '',
                complEnq: '',
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
