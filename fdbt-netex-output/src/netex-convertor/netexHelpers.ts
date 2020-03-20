import { FareZone, Stop } from './types';

export const getStops = (fareZones: FareZone[]): Stop[] => fareZones.flatMap(zone => zone.stops);

export const getUniquePriceGroups = (fareZones: FareZone[]): string[] => [
    ...new Set(fareZones.flatMap(zone => zone.prices.flatMap(price => price.price))),
];

export const getIdName = (name: string): string => name.replace(/(\s)+/g, '_');

export const getScheduledStopPointsList = (fareZones: FareZone[]): {}[] =>
    getStops(fareZones).map(stop => ({
        version: 'any',
        id: `naptan:${stop.atcoCode}`,
        Name: { $t: stop.stopName },
        TopographicPlaceView: {
            TopographicPlaceRef: { ref: `nptgLocality:${stop.localityCode}` },
            Name: { $t: stop.localityName },
            QualifierName: { $t: stop.qualifierName },
        },
    }));

export const getPriceGroups = (fareZones: FareZone[]): {}[] =>
    getUniquePriceGroups(fareZones).map(price => ({
        version: '1.0',
        id: `price_band_${price}`,
        members: [
            {
                GeographicalIntervalPrice: {
                    version: '1.0',
                    id: `price_band_${price}@adult`,
                    Amount: { $t: price },
                },
            },
        ],
    }));

export const getFareZoneList = (fareZones: FareZone[]): {}[] =>
    fareZones.map(zone => ({
        version: '1.0',
        id: `fs@${getIdName(zone.name)}`,
        Name: { $t: zone.name },
        members: {
            ScheduledStopPointRef: zone.stops.map(stop => ({
                ref: `naptan:${stop.atcoCode}`,
                version: 'any',
                $t: `${stop.stopName}, ${stop.localityName}`,
            })),
        },
    }));

export const getDistanceMatrixElements = (fareZones: FareZone[]): {}[] =>
    fareZones.flatMap(zone =>
        zone.prices.flatMap(price =>
            price.fareZones.map(secondZone => ({
                version: '1.0',
                id: `${getIdName(zone.name)}+${getIdName(secondZone)}`,
                priceGroups: {
                    PriceGroupRef: {
                        version: '1.0',
                        ref: `price_band_${price.price}`,
                    },
                },
                StartTariffZoneRef: {
                    version: '1.0',
                    ref: `fs@${getIdName(zone.name)}`,
                },
                EndTariffZoneRef: {
                    version: '1.0',
                    ref: `fs@${getIdName(secondZone)}`,
                },
            })),
        ),
    );

export const getFareTableElements = (fareZones: FareZone[], lineIdName: string, elementPrefix: string): {}[] =>
    fareZones.slice(0, -1).map((zone, index) => ({
        version: '1.0',
        id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@${elementPrefix}${index + 1}@${getIdName(zone.name)}`,
        order: index + 1,
        Name: { $t: zone.name },
    }));

export const getFareTables = (columns: FareZone[], lineIdName: string): {}[] =>
    columns.flatMap((zone, columnNum) => {
        let rowCount = columns.length - columnNum;
        let order = 0;
        const columnRef = `Trip@single-SOP@p-ticket@${lineIdName}@adult@c${columnNum + 1}@${getIdName(zone.name)}`;

        return {
            id: columnRef,
            version: '1.0',
            Name: { $t: zone.name },
            Description: { $t: `Column ${columnNum + 1}` },
            cells: {
                Cell: zone.prices.flatMap(price =>
                    price.fareZones.map(secondZone => {
                        rowCount -= 1;
                        order += 1;

                        return {
                            version: '1.0',
                            id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@${getIdName(zone.name)}`,
                            order,
                            DistanceMatrixElementPrice: {
                                version: '1.0',
                                id: `Trip@single-SOP@p-ticket@${lineIdName}@adult@${getIdName(zone.name)}+${getIdName(
                                    secondZone,
                                )}`,
                                GeographicalIntervalPriceRef: {
                                    version: '1.0',
                                    ref: `price_band_${price.price}@adult`,
                                },
                                DistanceMatrixElementRef: {
                                    version: '1.0',
                                    ref: `${getIdName(zone.name)}+${getIdName(secondZone)}`,
                                },
                            },
                            ColumnRef: {
                                versionRef: '1',
                                ref: columnRef,
                            },
                            RowRef: {
                                versionRef: '1',
                                ref: `Trip@single-SOP@p-ticket@${lineIdName}@adult@r${rowCount + 1}@${getIdName(
                                    secondZone,
                                )}`,
                            },
                        };
                    }),
                ),
            },
        };
    });

export const getNetexMode = (mode: string): string => {
    const modeMap: { [key: string]: string } = {
        Bus: 'bus',
        Coach: 'coach',
        Tram: 'tram',
        Ferry: 'ferry',
    };

    return modeMap[mode] ?? 'other';
};
