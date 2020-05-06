import { Stop } from '../data/auroradb';

export interface Price {
    price: string;
    fareZones: string[];
}

export interface MatchingFareZonesData {
    name: string;
    stops: Stop[];
    prices: Price[];
}

export interface MatchingFareZones {
    [key: string]: MatchingFareZonesData;
}
