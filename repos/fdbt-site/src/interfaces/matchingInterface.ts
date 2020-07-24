import { Stop } from '../data/auroradb';
import { PassengerDetails, ServicesInfo, BasicService, Product } from '.';
import { UserFareStages } from '../data/s3';

export interface Price {
    price: string;
    fareZones: string[];
}

export interface MatchingInfo {
    service: BasicService;
    userFareStages: UserFareStages;
    matchingFareZones: MatchingFareZones;
}

export interface InboundMatchingInfo {
    inboundUserFareStages: UserFareStages;
    inboundMatchingFareZones: MatchingFareZones;
}

export interface MatchingWithErrors {
    error: boolean;
    selectedFareStages: string[];
}

export interface MatchingFareZonesData {
    name: string;
    stops: Stop[];
    prices: Price[];
}

export interface MatchingFareZones {
    [key: string]: MatchingFareZonesData;
}

export interface MatchingBaseData {
    type: string;
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    serviceDescription: string;
    email: string;
    uuid: string;
}

export interface MatchingData extends MatchingBaseData {
    fareZones: {
        name: string;
        stops: Stop[];
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
}

export interface MatchingReturnData extends MatchingBaseData {
    outboundFareZones: {
        name: string;
        stops: Stop[];
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
    inboundFareZones: {
        name: string;
        stops: Stop[];
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
}

export interface MatchingPeriodData extends PassengerDetails {
    operatorName: string;
    type: string;
    nocCode: string;
    products: Product[];
    selectedServices?: ServicesInfo[];
    zoneName?: string;
    stops?: Stop[];
    email: string;
    uuid: string;
}
