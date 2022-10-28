import * as netexHelpers from './pointToPointTicketNetexHelpers';
import { FareZone, PointToPointTicket, User } from '../../types';
import {
    singleTicket,
    returnNonCircularTicket,
    returnCircularTicket,
    returnNonCircularTicketWithReturnValidity,
    fareZonesWithoutStopIndicator,
} from '../../test-data/matchingData';
import { NetexObject, getUserProfile, getProductType } from '../sharedHelpers';
import {
    buildSalesOfferPackage,
    buildSalesOfferPackages,
    getPointToPointConditionsElement,
    hasDuplicates,
    hasDuplicatesWithinASingleFareZone,
    hasDuplicatesAcrossFareZones,
} from './pointToPointTicketNetexHelpers';

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

    describe('hasDuplicates', () => {
        it('ensure true when duplicates exist', () => {
            const arrayWithDuplicates = ['apple', 'orange', 'banana', 'pear', 'melon', 'apple'];

            const result = hasDuplicates(arrayWithDuplicates);

            expect(result).toBe(true);
        });

        it('ensure false when there are no duplicates', () => {
            const arrayWithDuplicates = ['apple', 'orange', 'banana', 'pear', 'melon'];

            const result = hasDuplicates(arrayWithDuplicates);

            expect(result).toBe(false);
        });
    });

    describe('hasDuplicatesWithinASingleFareZone', () => {
        it('ensure true when duplicates exist within a single fare zone', () => {
            const fareZones: FareZone[] = [
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
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
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ];

            const result = hasDuplicatesWithinASingleFareZone(fareZones);

            expect(result).toBe(true);
        });

        it('ensure false when there are no duplicates within a single fare zone', () => {
            const fareZones: FareZone[] = [
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ];

            const result = hasDuplicatesWithinASingleFareZone(fareZones);

            expect(result).toBe(false);
        });
    });

    describe('hasDuplicatesAcrossFareZones', () => {
        it('ensure true when duplicates exist within a single fare zone', () => {
            const fareZones: FareZone[] = [
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ];

            const result = hasDuplicatesAcrossFareZones(fareZones);

            expect(result).toBe(true);
        });

        it('ensure false when there are no duplicates within a single fare zone', () => {
            const fareZones: FareZone[] = [
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ];

            const result = hasDuplicatesAcrossFareZones(fareZones);

            expect(result).toBe(false);
        });
    });

    describe('getScheduledStopPointsList', () => {
        it('gets a NeTEx scheduled stop point for each stop in the fare zones', () => {
            const stops = netexHelpers.getPointToPointScheduledStopPointsList(fareZones);

            expect(stops).toEqual([
                {
                    Name: { $t: 'Ashton Bus Station' },
                    NameSuffix: { $t: 'Arrivals' },
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
                    NameSuffix: { $t: 'Stop BB' },
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
                    NameSuffix: { $t: 'opp' },
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
                    NameSuffix: { $t: 'opp' },
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

        it('gets a NeTEx scheduled stop point for each stop in the fare zones with NameSuffix omitted', () => {
            fareZones = fareZonesWithoutStopIndicator;
            const stops = netexHelpers.getPointToPointScheduledStopPointsList(fareZones);

            expect(stops).toEqual([
                {
                    Name: { $t: 'Ashton Bus Station' },
                    NameSuffix: null,
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
                    NameSuffix: null,
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
                    NameSuffix: null,
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
                    NameSuffix: null,
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

        it('when a stop exists twice within the same fare zone; the trailing occurrences of the stop are removed', () => {
            const fareZones: FareZone[] = [
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
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
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ];

            const stops = netexHelpers.getPointToPointScheduledStopPointsList(fareZones);

            expect(stops).toEqual([
                {
                    Name: { $t: 'Ashton Bus Station' },
                    NameSuffix: { $t: 'Arrivals' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028492' },
                    },
                    id: 'atco:1800EHQ0081',
                    version: 'any',
                },
                {
                    Name: { $t: 'New Street' },
                    NameSuffix: { $t: 'Arrivals' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028493' },
                    },
                    id: 'atco:1800EHQ0721',
                    version: 'any',
                },
                {
                    Name: { $t: 'Henrietta Street' },
                    NameSuffix: { $t: 'Stop BB' },
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
                    NameSuffix: { $t: 'opp' },
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
                    NameSuffix: { $t: 'opp' },
                    TopographicPlaceView: {
                        Name: { $t: 'Cockbrook' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:N0077788' },
                    },
                    id: 'atco:1800EH21241',
                    version: 'any',
                },
            ]);

            // check to ensure that we have not changed the array being
            // passed into the function
            expect(fareZones).toStrictEqual([
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ]);
        });

        it('when a stop exists twice; as first stop in the first fare zone and last stop in last fare zone, remove said stop', () => {
            const fareZones: FareZone[] = [
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ];

            const stops = netexHelpers.getPointToPointScheduledStopPointsList(fareZones);

            expect(stops).toEqual([
                {
                    Name: { $t: 'Ashton Bus Station' },
                    NameSuffix: { $t: 'Arrivals' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028492' },
                    },
                    id: 'atco:1800EHQ0081',
                    version: 'any',
                },
                {
                    Name: { $t: 'New Street' },
                    NameSuffix: { $t: 'Arrivals' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028493' },
                    },
                    id: 'atco:1800EHQ0721',
                    version: 'any',
                },
                {
                    Name: { $t: 'Henrietta Street' },
                    NameSuffix: { $t: 'Stop BB' },
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
                    NameSuffix: { $t: 'opp' },
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
                    NameSuffix: { $t: 'opp' },
                    TopographicPlaceView: {
                        Name: { $t: 'Cockbrook' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:N0077788' },
                    },
                    id: 'atco:1800EH21241',
                    version: 'any',
                },
            ]);

            // check to ensure that we have not changed the array being
            // passed into the function
            expect(fareZones).toStrictEqual([
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ]);
        });

        it('when a stop exists twice within the same fare zone, but also across different fare zones; the trailing occurrences of the stop are removed within the same fare zone and if first stop and last stop are the same, they are also removed', () => {
            const fareZones: FareZone[] = [
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
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
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ];

            const stops = netexHelpers.getPointToPointScheduledStopPointsList(fareZones);

            expect(stops).toEqual([
                {
                    Name: { $t: 'Ashton Bus Station' },
                    NameSuffix: { $t: 'Arrivals' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028492' },
                    },
                    id: 'atco:1800EHQ0081',
                    version: 'any',
                },
                {
                    Name: { $t: 'New Street' },
                    NameSuffix: { $t: 'Arrivals' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028493' },
                    },
                    id: 'atco:1800EHQ0721',
                    version: 'any',
                },
                {
                    Name: { $t: 'Henrietta Street' },
                    NameSuffix: { $t: 'Stop BB' },
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
                    NameSuffix: { $t: 'opp' },
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
                    NameSuffix: { $t: 'opp' },
                    TopographicPlaceView: {
                        Name: { $t: 'Cockbrook' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:N0077788' },
                    },
                    id: 'atco:1800EH21241',
                    version: 'any',
                },
            ]);

            // check to ensure that we have not changed the array being
            // passed into the function
            expect(fareZones).toStrictEqual([
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ]);
        });

        it('when a stop exists twice across fare zones, the duplicate stop is removed', () => {
            const fareZones: FareZone[] = [
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
                },
            ];

            const stops = netexHelpers.getPointToPointScheduledStopPointsList(fareZones);

            expect(stops).toEqual([
                {
                    Name: { $t: 'Ashton Bus Station' },
                    NameSuffix: { $t: 'Arrivals' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028492' },
                    },
                    id: 'atco:1800EHQ0081',
                    version: 'any',
                },
                {
                    Name: { $t: 'New Street' },
                    NameSuffix: { $t: 'Arrivals' },
                    TopographicPlaceView: {
                        Name: { $t: 'Ashton-under-Lyne' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0028493' },
                    },
                    id: 'atco:1800EHQ0721',
                    version: 'any',
                },
                {
                    Name: { $t: 'Henrietta Street' },
                    NameSuffix: { $t: 'Stop BB' },
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
                    NameSuffix: { $t: 'opp' },
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
                    NameSuffix: { $t: 'opp' },
                    TopographicPlaceView: {
                        Name: { $t: 'Cockbrook' },
                        QualifierName: { $t: '' },
                        TopographicPlaceRef: { ref: 'nptgLocality:N0077788' },
                    },
                    id: 'atco:1800EH21241',
                    version: 'any',
                },
            ]);

            // check to ensure that we have not changed the array being
            // passed into the function
            expect(fareZones).toStrictEqual([
                {
                    name: 'Fare Zone 1',
                    stops: [
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
                            stopName: 'New Street',
                            naptanCode: '',
                            atcoCode: '1800EHQ0721',
                            localityCode: 'E0028493',
                            localityName: 'Ashton-under-Lyne',
                            parentLocalityName: '',
                            indicator: 'Arrivals',
                            street: 'New Street',
                            qualifierName: '',
                        },
                    ],
                    prices: [],
                },
                {
                    name: 'Fare Zone 2',
                    stops: [
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
                    ],
                    prices: [
                        { price: '1.00', fareZones: ['Fare Zone 3'] },
                        { price: '1.20', fareZones: ['Fare Zone 1'] },
                    ],
                },
                {
                    name: 'Fare Zone 3',
                    stops: [
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
                    ],
                    prices: [{ price: '1.30', fareZones: ['Fare Zone 1'] }],
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
                'salesOfferPackageName',
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
                'salesOfferPackageName',
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
            const productNameForPlainText = 'adult - single';
            const fareTables = netexHelpers.getInnerFareTables(
                fareZones.slice(0, -1),
                lineIdName,
                singleTicket.type,
                singleTicket.passengerType,
                'salesOfferPackageName',
                productNameForPlainText,
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
                    MaximumAge: {
                        $t: null,
                    },
                    MinimumAge: {
                        $t: null,
                    },
                    ProofRequired: {
                        $t: null,
                    },
                    TypeOfConcessionRef: {
                        ref: expect.any(String),
                        version: 'fxc:v1.0',
                    },
                    UserType: { $t: expect.any(String) },
                    Name: { $t: expect.any(String) },
                };
                const actualUserProfile = getUserProfile(ticket as User, 0);
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
                    MinimumAge: { $t: expect.any(String) },
                    MaximumAge: { $t: expect.any(String) },
                    ProofRequired: { $t: expect.any(String) },
                    TypeOfConcessionRef: {
                        ref: expect.any(String),
                        version: 'fxc:v1.0',
                    },
                    UserType: { $t: expect.any(String) },
                };
                const ticketWithAgeRangeAndProof: PointToPointTicket = {
                    ...ticket,
                    ageRange: 'Yes',
                    ageRangeMin: '12',
                    ageRangeMax: '45',
                    proof: 'Yes',
                    proofDocuments: ['Membership Card'],
                };
                const actualUserProfile = getUserProfile(ticketWithAgeRangeAndProof as User, 0);
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
                    MaximumAge: {
                        $t: null,
                    },
                    MinimumAge: { $t: expect.any(String) },
                    ProofRequired: {
                        $t: null,
                    },
                    TypeOfConcessionRef: {
                        ref: expect.any(String),
                        version: 'fxc:v1.0',
                    },
                    UserType: { $t: expect.any(String) },
                };
                const ticketWithAgeRange: PointToPointTicket = {
                    ...ticket,
                    ageRange: 'Yes',
                    ageRangeMin: '18',
                };
                const actualUserProfile = getUserProfile(ticketWithAgeRange as User, 0);
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
            const ticketUserConcat = 'adult_single';
            const productNameForPlainText = 'adult - single';
            const expectedPreassignedFareProduct = {
                id: expect.stringContaining(tripString),
                Name: { $t: productNameForPlainText },
                TypeOfFareProductRef: { version: '1.0', ref: expect.stringContaining('fxc:standard_product@trip@') },
                validableElements: {
                    ValidableElement: {
                        id: expect.stringContaining(tripString),
                        Name: { $t: expect.any(String) },
                        fareStructureElements: {
                            FareStructureElementRef: [
                                {
                                    version: '1.0',
                                    ref: expect.stringContaining('@lines'),
                                },
                                {
                                    version: '1.0',
                                    ref: expect.stringContaining('@eligibility'),
                                },
                                {
                                    version: '1.0',
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
                            version: '1.0',
                            ref: expect.stringContaining(tripString),
                        },
                        order: '1',
                        version: '1.0',
                    },
                },
                ProductType: {
                    $t: getProductType(ticket),
                },
                version: '1.0',
            };
            const actualPreassignedFareProduct = netexHelpers.getPreassignedFareProduct(
                ticket,
                [{ id: '@lines' }, { id: '@eligibility' }, { id: '@conditions_of_travel' }],
                ticketUserConcat,
                productNameForPlainText,
            );
            expect(actualPreassignedFareProduct).toEqual(expectedPreassignedFareProduct);
        });
    });

    describe('getSalesOfferPackage', () => {
        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])(
            'should return a sales offer package object in an array for each sales offer package within the ticket for a %s',
            (_ticketType, ticket) => {
                const actualSalesOfferPackages = netexHelpers.buildSalesOfferPackages(
                    ticket.products[0],
                    `${ticket.type}_${ticket.passengerType}`,
                );
                expect(actualSalesOfferPackages.length).toEqual(ticket.products[0].salesOfferPackages.length);
            },
        );
    });

    describe('updatePriceFareFrame', () => {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        it('creates conditions of travel fare frame with usage validity period if user provides a return validity', () => {
            const matchingDataWithReturnValidity = returnNonCircularTicketWithReturnValidity;

            const result = getPointToPointConditionsElement(matchingDataWithReturnValidity);

            expect(result.GenericParameterAssignment.limitations.UsageValidityPeriod).toStrictEqual({
                version: '1.0',
                id: `op:Trip@back@frequency`,
                UsageTrigger: { $t: 'startOutboundRide' },
                UsageEnd: {
                    $t: 'standardDuration',
                },
                StandardDuration: {
                    $t: 'P0Y1M0D',
                },
                ActivationMeans: { $t: 'noneRequired' },
            });
        });

        it('does not create conditions of travel fare frame with usage validity period if user does not provide a return validity', () => {
            const matchingDataWithoutReturnValidity = returnNonCircularTicket;

            const result = getPointToPointConditionsElement(matchingDataWithoutReturnValidity);

            expect(result.GenericParameterAssignment.limitations.UsageValidityPeriod).toBeUndefined();
        });
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
    });

    describe('getFareTable', () => {
        it.each([
            ['single ticket', singleTicket, 'single_anyone'],
            ['return non-circular ticket', returnNonCircularTicket, 'return_anyone'],
            ['return circular ticket', returnCircularTicket, 'return_student'],
        ])(
            'should return a fare table object array for each sales offer package for a %s',
            (_ticketType, ticket, ticketUserConcat) => {
                const actualFareTable = netexHelpers.getFareTables(ticket, lineIdName, ticketUserConcat);
                expect(actualFareTable.length).toEqual(ticket.products[0].salesOfferPackages.length);
            },
        );
    });

    describe('buildSalesOfferPackage', () => {
        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])(
            'should return a single salesOfferPackage with a distribution assignment for each purchase location and a sales offer package element for each ticket format for a %s',
            (_ticketType, ticket) => {
                const returnedSalesOfferPackage = buildSalesOfferPackage(
                    ticket.products[0].salesOfferPackages[0],
                    `${ticket.type}_${ticket.passengerType}`,
                );
                expect(returnedSalesOfferPackage.distributionAssignments.DistributionAssignment.length).toBe(
                    ticket.products[0].salesOfferPackages[0].purchaseLocations.length,
                );
                expect(returnedSalesOfferPackage.salesOfferPackageElements.SalesOfferPackageElement.length).toBe(
                    ticket.products[0].salesOfferPackages[0].ticketFormats.length,
                );
            },
        );
    });

    describe('buildSalesOfferPackages', () => {
        it.each([
            ['single ticket', singleTicket],
            ['return non-circular ticket', returnNonCircularTicket],
            ['return circular ticket', returnCircularTicket],
        ])(
            'should return an array of sales Offer Packages for each sales offer package inside the ticket  %s',
            (_ticketType, ticket) => {
                const returnedSalesOfferPackageArray = buildSalesOfferPackages(ticket.products[0], 'a string');

                const testDataSalesOfferPackage = ticket.products[0].salesOfferPackages;

                expect(returnedSalesOfferPackageArray.length).toBe(ticket.products[0].salesOfferPackages.length);

                returnedSalesOfferPackageArray.forEach((salesOfferPackage, index) => {
                    expect(salesOfferPackage.Name.$t).toBe(testDataSalesOfferPackage[index].name);
                    expect(salesOfferPackage.Description.$t).toBe(testDataSalesOfferPackage[index].description);
                });
            },
        );
    });
});
