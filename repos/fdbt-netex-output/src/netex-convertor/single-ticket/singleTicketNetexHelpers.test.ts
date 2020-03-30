import * as netexHelpers from './singleTicketNetexHelpers';
import { FareZone } from '../types';
import { fareZoneList, expectedFareTables } from '../testdata/test-data';

describe('Netex Helpers', () => {
    let fareZones: FareZone[];
    let lineIdName: string;

    beforeEach(() => {
        fareZones = fareZoneList.fareZones;
        lineIdName = 'line_123';
    });

    describe('getStops', () => {
        it('returns a list of all stops given a list of fare zones', () => {
            const stops = netexHelpers.getStops(fareZones);

            expect(stops).toEqual([
                {
                    atcoCode: '3290YYA03623',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    parentLocalityName: 'IW Test',
                    naptanCode: '32903623',
                    qualifierName: 'West Sussex',
                    stopName: 'Queenswood Grove',
                },
                {
                    atcoCode: '3290YYA00077',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    parentLocalityName: 'IW Test',
                    naptanCode: '32900077',
                    qualifierName: 'West Sussex',
                    stopName: 'Kingsthorpe',
                },
                {
                    atcoCode: '3290YYA00359',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    parentLocalityName: 'IW Test',
                    naptanCode: '32900359',
                    qualifierName: 'West Sussex',
                    stopName: 'Mattison Way',
                },
                {
                    atcoCode: '3290YYA00357',
                    localityCode: 'E0026633',
                    localityName: 'Bewbush',
                    parentLocalityName: 'IW Test',
                    naptanCode: '32900357',
                    qualifierName: 'West Sussex',
                    stopName: 'Campbell Avenue',
                },
            ]);
        });
    });

    describe('getUniquePriceGroups', () => {
        it('returns a list of unique price groups given a list of farezones', () => {
            const prices = netexHelpers.getUniquePriceGroups(fareZones);

            expect(prices).toEqual(['1.10', '1.70', '2.20']);
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
                    Name: { $t: 'Queenswood Grove' },
                    TopographicPlaceView: {
                        Name: { $t: 'Bewbush' },
                        QualifierName: { $t: 'West Sussex' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0026633' },
                    },
                    id: 'naptan:3290YYA03623',
                    version: 'any',
                },
                {
                    Name: { $t: 'Kingsthorpe' },
                    TopographicPlaceView: {
                        Name: { $t: 'Bewbush' },
                        QualifierName: { $t: 'West Sussex' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0026633' },
                    },
                    id: 'naptan:3290YYA00077',
                    version: 'any',
                },
                {
                    Name: { $t: 'Mattison Way' },
                    TopographicPlaceView: {
                        Name: { $t: 'Bewbush' },
                        QualifierName: { $t: 'West Sussex' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0026633' },
                    },
                    id: 'naptan:3290YYA00359',
                    version: 'any',
                },
                {
                    Name: { $t: 'Campbell Avenue' },
                    TopographicPlaceView: {
                        Name: { $t: 'Bewbush' },
                        QualifierName: { $t: 'West Sussex' },
                        TopographicPlaceRef: { ref: 'nptgLocality:E0026633' },
                    },
                    id: 'naptan:3290YYA00357',
                    version: 'any',
                },
            ]);
        });
    });

    describe('getPriceGroups', () => {
        it('gets a NeTEx price group for each unique price in the fare zones', () => {
            const priceGroups = netexHelpers.getPriceGroups(fareZones);

            expect(priceGroups).toEqual([
                {
                    id: 'price_band_1.10',
                    members: [
                        {
                            GeographicalIntervalPrice: {
                                Amount: { $t: '1.10' },
                                id: 'price_band_1.10@adult',
                                version: '1.0',
                            },
                        },
                    ],
                    version: '1.0',
                },
                {
                    id: 'price_band_1.70',
                    members: [
                        {
                            GeographicalIntervalPrice: {
                                Amount: { $t: '1.70' },
                                id: 'price_band_1.70@adult',
                                version: '1.0',
                            },
                        },
                    ],
                    version: '1.0',
                },
                {
                    id: 'price_band_2.20',
                    members: [
                        {
                            GeographicalIntervalPrice: {
                                Amount: { $t: '2.20' },
                                id: 'price_band_2.20@adult',
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
                    Name: { $t: 'Acomb Green Lane' },
                    id: 'fs@Acomb_Green_Lane',
                    members: {
                        ScheduledStopPointRef: [
                            {
                                $t: 'Queenswood Grove, Bewbush',
                                ref: 'naptan:3290YYA03623',
                                version: 'any',
                            },
                            {
                                $t: 'Kingsthorpe, Bewbush',
                                ref: 'naptan:3290YYA00077',
                                version: 'any',
                            },
                        ],
                    },
                    version: '1.0',
                },
                {
                    Name: { $t: 'Mattison Way' },
                    id: 'fs@Mattison_Way',
                    members: {
                        ScheduledStopPointRef: [
                            {
                                $t: 'Mattison Way, Bewbush',
                                ref: 'naptan:3290YYA00359',
                                version: 'any',
                            },
                        ],
                    },
                    version: '1.0',
                },
                {
                    Name: { $t: 'Nursery Drive' },
                    id: 'fs@Nursery_Drive',
                    members: {
                        ScheduledStopPointRef: [
                            {
                                $t: 'Campbell Avenue, Bewbush',
                                ref: 'naptan:3290YYA00357',
                                version: 'any',
                            },
                        ],
                    },
                    version: '1.0',
                },
                {
                    Name: { $t: 'Holl Bank/Beech Ave' },
                    id: 'fs@Holl_Bank/Beech_Ave',
                    members: { ScheduledStopPointRef: [] },
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
                    EndTariffZoneRef: { ref: 'fs@Mattison_Way', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Acomb_Green_Lane', version: '1.0' },
                    id: 'Acomb_Green_Lane+Mattison_Way',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_1.10', version: '1.0' } },
                    version: '1.0',
                },
                {
                    EndTariffZoneRef: { ref: 'fs@Nursery_Drive', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Acomb_Green_Lane', version: '1.0' },
                    id: 'Acomb_Green_Lane+Nursery_Drive',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_1.70', version: '1.0' } },
                    version: '1.0',
                },
                {
                    EndTariffZoneRef: { ref: 'fs@Holl_Bank/Beech_Ave', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Acomb_Green_Lane', version: '1.0' },
                    id: 'Acomb_Green_Lane+Holl_Bank/Beech_Ave',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_2.20', version: '1.0' } },
                    version: '1.0',
                },
                {
                    EndTariffZoneRef: { ref: 'fs@Nursery_Drive', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Mattison_Way', version: '1.0' },
                    id: 'Mattison_Way+Nursery_Drive',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_1.10', version: '1.0' } },
                    version: '1.0',
                },
                {
                    EndTariffZoneRef: { ref: 'fs@Holl_Bank/Beech_Ave', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Mattison_Way', version: '1.0' },
                    id: 'Mattison_Way+Holl_Bank/Beech_Ave',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_1.70', version: '1.0' } },
                    version: '1.0',
                },
                {
                    EndTariffZoneRef: { ref: 'fs@Holl_Bank/Beech_Ave', version: '1.0' },
                    StartTariffZoneRef: { ref: 'fs@Nursery_Drive', version: '1.0' },
                    id: 'Nursery_Drive+Holl_Bank/Beech_Ave',
                    priceGroups: { PriceGroupRef: { ref: 'price_band_1.10', version: '1.0' } },
                    version: '1.0',
                },
            ]);
        });
    });

    describe('getFareTableElements', () => {
        it('removes the last item when generating the fare table elements', () => {
            const fareTableElements = netexHelpers.getFareTableElements(fareZones, lineIdName, 'c');

            expect(fareTableElements).toHaveLength(fareZones.length - 1);
        });

        it('correctly generates elements using the prefix', () => {
            const fareTableElements = netexHelpers.getFareTableElements(fareZones, lineIdName, 'c');

            expect(fareTableElements).toEqual([
                {
                    Name: { $t: 'Acomb Green Lane' },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@c1@Acomb_Green_Lane',
                    order: 1,
                    version: '1.0',
                },
                {
                    Name: { $t: 'Mattison Way' },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@c2@Mattison_Way',
                    order: 2,
                    version: '1.0',
                },
                {
                    Name: { $t: 'Nursery Drive' },
                    id: 'Trip@single-SOP@p-ticket@line_123@adult@c3@Nursery_Drive',
                    order: 3,
                    version: '1.0',
                },
            ]);
        });
    });

    describe('getFareTables', () => {
        it('gets the fare tables for all fare zones and price groups', () => {
            const fareTables = netexHelpers.getFareTables(fareZones.slice(0, -1), lineIdName);

            expect(fareTables).toEqual(expectedFareTables);
        });
    });
});
