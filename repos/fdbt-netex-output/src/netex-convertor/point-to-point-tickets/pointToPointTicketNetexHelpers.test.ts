import * as netexHelpers from './pointToPointTicketNetexHelpers';
import { FareZone, PointToPointTicket } from '../../types';
import { singleTicket, returnNonCircularTicket, returnCircularTicket } from '../../test-data/matchingData';
import { NetexObject } from '../sharedHelpers';

describe('Netex Helpers', () => {
    let fareZones: FareZone[];
    let lineIdName: string;

    beforeEach(() => {
        fareZones = singleTicket.fareZones;
        lineIdName = 'line_123';
    });

    describe('getStops', () => {
        it('returns a list of all stops given a list of fare zones', () => {
            const stops = netexHelpers.getStops(fareZones);

            expect(stops).toEqual([
                {
                    stopName: 'Ashton Bus Station',
                    naptanCode: '',
                    atcoCode: '1800EHQ0081',
                    localityCode: 'E0028492',
                    localityName: 'Ashton-under-Lyne',
                    parentLocalityName: '',
                    indicator: 'Arrivals',
                    street: 'Wellington Road',
                    qualifierName: '',
                },
                {
                    stopName: 'Henrietta Street',
                    naptanCode: 'MANDAMPT',
                    atcoCode: '1800EH24201',
                    localityCode: 'E0028492',
                    localityName: 'Ashton-under-Lyne',
                    parentLocalityName: '',
                    indicator: 'Stop BB',
                    street: '',
                    qualifierName: '',
                },
                {
                    stopName: 'Crickets Ln',
                    naptanCode: 'MANDAMPA',
                    atcoCode: '1800EH24151',
                    localityCode: 'E0028492',
                    localityName: 'Ashton-under-Lyne',
                    parentLocalityName: '',
                    indicator: 'opp',
                    street: 'PENNY MEADOW',
                    qualifierName: '',
                },
                {
                    stopName: 'Tameside College',
                    naptanCode: 'MANDAJAM',
                    atcoCode: '1800EH21241',
                    localityCode: 'N0077788',
                    localityName: 'Cockbrook',
                    parentLocalityName: 'Ashton-under-Lyne',
                    indicator: 'opp',
                    street: 'BEAUFORT RD',
                    qualifierName: '',
                },
            ]);
        });
    });

    describe('getUniquePriceGroups', () => {
        it('returns a list of unique price groups given a list of farezones', () => {
            const prices = netexHelpers.getUniquePriceGroups(fareZones);

            expect(prices).toEqual(['1.00', '1.20', '1.30']);
        });
    });

    describe('getIdName', () => {
        it('replaces spaces with underscores', () => {
            const id = netexHelpers.getIdName('some name for a fare zone');

            expect(id).toBe('some_name_for_a_fare_zone');
        });

        it('replaces multiple spaces with a single underscore', () => {
            const id = netexHelpers.getIdName('multiple   spaces        here');

            expect(id).toBe('multiple_spaces_here');
        });
    });

    describe('getScheduledStopPointsList', () => {
        it('gets a NeTEx scheduled stop point for each stop in the fare zones', () => {
            const stops = netexHelpers.getScheduledStopPointsList(fareZones);

            expect(stops).toEqual([
                {
                    Name: { $t: 'Ashton Bus Station' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028492' },
                    },
                    id: 'atco:1800EHQ0081',
                    version: 'any',
                },
                {
                    Name: { $t: 'Henrietta Street' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028492' },
                    },
                    id: 'atco:1800EH24201',
                    version: 'any',
                },
                {
                    Name: { $t: 'Crickets Ln' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028492' },
                    },
                    id: 'atco:1800EH24151',
                    version: 'any',
                },
                {
                    Name: { $t: 'Tameside College' },
                    TopographicPlaceView: {
                        Name: { $t: 'Cockbrook' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:N0077788' },
                    },
                    id: 'atco:1800EH21241',
                    version: 'any',
                },
            ]);
        });
    });

    describe('getPriceGroups', () => {
        it('gets a NeTEx price group for each unique price in the fare zones', () => {
            const priceGroups = netexHelpers.getPriceGroups(singleTicket);

            expect(priceGroups).toEqual([
                {
                    id: expect.any(String),
                    members: [
                        {
                            GeographicalIntervalPrice: {
                                Amount: { $t: expect.any(String) },
                                id: expect.any(String),
                                version: '1.0',
                            },
                        },
                    ],
                    version: '1.0',
                },
                {
                    id: expect.any(String),
                    members: [
                        {
                            GeographicalIntervalPrice: {
                                Amount: { $t: expect.any(String) },
                                id: expect.any(String),
                                version: '1.0',
                            },
                        },
                    ],
                    version: '1.0',
                },
                {
                    id: expect.any(String),
                    members: [
                        {
                            GeographicalIntervalPrice: {
                                Amount: { $t: expect.any(String) },
                                id: expect.any(String),
                                version: '1.0',
                            },
                        },
                    ],
                    version: '1.0',
                },
            ]);
        });
    });

    describe('getFareZoneList', () => {
        it('gets a NeTEx list of fare zones', () => {
            const netexZones = netexHelpers.getFareZoneList(fareZones);

            expect(netexZones).toEqual([
                {
                    Name: { $t: expect.any(String) },
                    id: expect.stringContaining('fs'),
                    members: {
                        ScheduledStopPointRef: [
                            {
                                $t: expect.any(String),
                                ref: expect.any(String),
                                version: 'any',
                            },
                        ],
                    },
                    version: '1.0',
                },
                {
                    Name: { $t: expect.any(String) },
                    id: expect.stringContaining('fs'),
                    members: {
                        ScheduledStopPointRef: [
                            {
                                $t: expect.any(String),
                                ref: expect.any(String),
                                version: 'any',
                            },
                        ],
                    },
                    version: '1.0',
                },
                {
                    Name: { $t: expect.any(String) },
                    id: expect.stringContaining('fs'),
                    members: {
                        ScheduledStopPointRef: [
                            {
                                $t: expect.any(String),
                                ref: expect.any(String),
                                version: 'any',
                            },
                            {
                                $t: expect.any(String),
                                ref: expect.any(String),
                                version: 'any',
                            },
                        ],
                    },
                    version: '1.0',
                },
            ]);
        });
    });

    describe('getDistanceMatrixElements', () => {
        it('creates a list of NeTEx distance matrix elements which show the prices between fare zones', () => {
            const matrixElements = netexHelpers.getDistanceMatrixElements(fareZones);

            expect(matrixElements).toEqual([
                {
                    EndTariffZoneRef: { ref: 'fs@Fare_Zone_3', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Fare_Zone_2', version: '1.0' },
                    id: 'Fare_Zone_2+Fare_Zone_3',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_1.00', version: '1.0' } },
                    version: '1.0',
                },
                {
                    EndTariffZoneRef: { ref: 'fs@Fare_Zone_1', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Fare_Zone_2', version: '1.0' },
                    id: 'Fare_Zone_2+Fare_Zone_1',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_1.20', version: '1.0' } },
                    version: '1.0',
                },
                {
                    EndTariffZoneRef: { ref: 'fs@Fare_Zone_1', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Fare_Zone_3', version: '1.0' },
                    id: 'Fare_Zone_3+Fare_Zone_1',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_1.30', version: '1.0' } },
                    version: '1.0',
                },
            ]);
        });
    });

    describe('getFareTableElements', () => {
        it('removes the last item when generating the fare table elements', () => {
            const fareTableElements = netexHelpers.getFareTableElements(
                fareZones,
                lineIdName,
                'c',
                singleTicket.type,
                singleTicket.passengerType,
            );

            expect(fareTableElements).toHaveLength(fareZones.length - 1);
        });

        it('correctly generates elements using the prefix', () => {
            const fareTableElements = netexHelpers.getFareTableElements(
                fareZones,
                lineIdName,
                'c',
                singleTicket.type,
                singleTicket.passengerType,
            );

            expect(fareTableElements).toEqual([
                {
                    Name: { $t: expect.any(String) },
                    id: expect.stringContaining('Trip@'),
                    order: 1,
                    version: '1.0',
                },
                {
                    Name: { $t: expect.any(String) },
                    id: expect.stringContaining('Trip@'),
                    order: 2,
                    version: '1.0',
                },
            ]);
        });
    });

    describe('getFareTables', () => {
        it('gets the fare tables for all fare zones and price groups', () => {
            const fareTables = netexHelpers.getInnerFareTables(
                fareZones.slice(0, -1),
                lineIdName,
                singleTicket.type,
                singleTicket.passengerType,
            );

            const cells = fareTables.flatMap((table: NetexObject) => {
                return table.cells.Cell;
            });

            const expectedCellFormat = {
                ColumnRef: expect.objectContaining({
                    ref: expect.any(String),
                    versionRef: '1',
                }),
                DistanceMatrixElementPrice: expect.objectContaining({
                    DistanceMatrixElementRef: { ref: expect.any(String), version: '1.0' },
                    GeographicalIntervalPriceRef: { ref: expect.any(String), version: '1.0' },
                    id: expect.any(String),
                    version: '1.0',
                }),
                RowRef: expect.objectContaining({
                    ref: expect.any(String),
                    versionRef: '1',
                }),
                id: expect.any(String),
                order: expect.any(Number),
                version: '1.0',
            };

            const expectedFormat = {
                id: expect.any(String),
                version: '1.0',
                Name: expect.objectContaining({ $t: expect.any(String) }),
                Description: expect.objectContaining({ $t: expect.any(String) }),
                cells: expect.objectContaining({ Cell: expect.any(Array) }),
            };

            fareTables.forEach(table => {
                expect(table).toEqual(expectedFormat);
            });

            cells.forEach(cell => {
                expect(cell).toEqual(expectedCellFormat);
            });
        });
    });

    describe('getUserProfile', () => {
        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])(
            'should return a user profile for %s with no age range or proof documents defined when they are missing',
            (_ticketType, ticket) => {
                const expectedUserProfile = {
                    version: '1.0',
                    id: expect.any(String),
                    Name: { $t: expect.any(String) },
                    UserType: { $t: expect.any(String) },
                };
                const actualUserProfile = netexHelpers.getUserProfile(ticket);
                expect(actualUserProfile).toEqual(expectedUserProfile);
            },
        );

        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])(
            'should return a user profile for %s with an age range and proof documents defined if they are given',
            (_ticketType, ticket) => {
                const expectedUserProfile = {
                    version: '1.0',
                    id: expect.any(String),
                    Name: { $t: expect.any(String) },
                    UserType: { $t: expect.any(String) },
                    MinimumAge: { $t: expect.any(String) },
                    MaximumAge: { $t: expect.any(String) },
                    ProofRequired: { $t: expect.any(String) },
                };
                const ticketWithAgeRangeAndProof: PointToPointTicket = {
                    ...ticket,
                    ageRange: 'Yes',
                    ageRangeMin: '12',
                    ageRangeMax: '45',
                    proof: 'Yes',
                    proofDocuments: ['Membership Card'],
                };
                const actualUserProfile = netexHelpers.getUserProfile(ticketWithAgeRangeAndProof);
                expect(actualUserProfile).toEqual(expectedUserProfile);
            },
        );

        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])(
            'should return a user profile for %s with only an age range defined if it is given and proof documents are missing',
            (_ticketType, ticket) => {
                const expectedUserProfile = {
                    version: '1.0',
                    id: expect.any(String),
                    Name: { $t: expect.any(String) },
                    UserType: { $t: expect.any(String) },
                    MinimumAge: { $t: expect.any(String) },
                };
                const ticketWithAgeRange: PointToPointTicket = {
                    ...ticket,
                    ageRange: 'Yes',
                    ageRangeMin: '18',
                };
                const actualUserProfile = netexHelpers.getUserProfile(ticketWithAgeRange);
                expect(actualUserProfile).toEqual(expectedUserProfile);
            },
        );
    });

    describe('getPreassignedFareProduct', () => {
        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])('should return a preassigned fare product object for a %s', (_ticketType, ticket) => {
            const tripString = 'Trip@';
            const expectedPreassignedFareProduct = {
                id: expect.stringContaining(tripString),
                Name: { $t: expect.any(String) },
                TypeOfFareProductRef: { ref: expect.stringContaining('fxc:standard_product@trip@') },
                validableElements: {
                    ValidableElement: {
                        id: expect.stringContaining(tripString),
                        Name: { $t: expect.any(String) },
                        fareStructureElements: {
                            FareStructureElementRef: [
                                {
                                    ref: expect.stringContaining('@lines'),
                                },
                                {
                                    ref: expect.stringContaining('@eligibility'),
                                },
                                {
                                    ref: expect.stringContaining('@conditions_of_travel'),
                                },
                            ],
                        },
                        version: '1.0',
                    },
                },
                accessRightsInProduct: {
                    AccessRightInProduct: {
                        id: expect.stringContaining(tripString),
                        ValidableElementRef: {
                            ref: expect.stringContaining(tripString),
                        },
                        order: '1',
                        version: '1.0',
                    },
                },
                version: '1.0',
            };
            const actualPreassignedFareProduct = netexHelpers.getPreassignedFareProduct(ticket);
            expect(actualPreassignedFareProduct).toEqual(expectedPreassignedFareProduct);
        });
    });

    describe('getSalesOfferPackage', () => {
        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])('should return a sales offer package object object for a %s', (_ticketType, ticket) => {
            const tripString = 'Trip@';
            const getDistributionAssigmentSchema = (purchaseLocation: string): {} => ({
                version: '1.0',
                id: expect.stringContaining(purchaseLocation),
                order: expect.any(String),
                Name: { $t: expect.any(String) },
                Description: { $t: expect.any(String) },
                DistributionChannelRef: {
                    ref: expect.stringContaining('fxc:'),
                    version: 'fxc:v1.0',
                },
                PaymentMethods: { $t: 'debitCard creditCard cash' },
                FulfilmentMethodRef: {
                    ref: expect.stringContaining('fxc:collect'),
                    version: 'fxc:v1.0',
                },
            });
            const expectedSalesOfferPackage = {
                id: expect.stringContaining(tripString),
                BrandingRef: {
                    ref: expect.stringContaining('@brand'),
                },
                distributionAssignments: {
                    DistributionAssignment: [
                        getDistributionAssigmentSchema('atStop'),
                        getDistributionAssigmentSchema('onBoard'),
                    ],
                },
                salesOfferPackageElements: {
                    SalesOfferPackageElement: {
                        id: expect.stringContaining(tripString),
                        order: '2',
                        version: '1.0',
                        TypeOfTravelDocumentRef: {
                            version: 'fxc:v1.0',
                            ref: 'fxc:printed_ticket',
                        },
                        PreassignedFareProductRef: {
                            ref: expect.stringContaining(tripString),
                        },
                    },
                },
                version: '1.0',
            };
            const actualSalesOfferPackage = netexHelpers.getSalesOfferPackage(ticket);
            expect(actualSalesOfferPackage).toEqual(expectedSalesOfferPackage);
        });
    });

    describe('getFareTable', () => {
        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])('should return a fare table object object for a %s', (_ticketType, ticket) => {
            const tripString = 'Trip@';
            const expectedFareTable = {
                id: expect.stringContaining(tripString),
                version: '1.0',
                Name: { $t: expect.any(String) },
                Description: {
                    $t: expect.any(String),
                },
                pricesFor: {
                    PreassignedFareProductRef: {
                        ref: expect.stringContaining(tripString),
                    },
                    SalesOfferPackageRef: {
                        ref: expect.stringContaining(tripString),
                    },
                    UserProfileRef: {
                        ref: expect.any(String),
                    },
                },
                usedIn: {
                    TariffRef: { version: '1.0', ref: expect.stringContaining('Tariff') },
                },
                specifics: {
                    LineRef: {
                        ref: expect.any(String),
                    },
                },
                columns: {
                    FareTableColumn: expect.any(Array),
                },
                rows: {
                    FareTableRow: expect.any(Array),
                },
                includes: {
                    FareTable: expect.any(Array),
                },
            };
            const actualFareTable = netexHelpers.getFareTable(ticket);
            expect(actualFareTable).toEqual(expectedFareTable);
        });
    });
});
