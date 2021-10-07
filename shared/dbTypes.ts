import { CompanionInfo, DbTimeBand, TimeRestrictionDay } from './matchingJsonTypes';

export interface FullGroupPassengerType {
    id: number;
    name: string;
    groupPassengerType: GroupPassengerType;
}

export interface SinglePassengerType {
    id: number;
    name: string;
    passengerType: PassengerType;
}

export interface PassengerType {
    passengerType: string;
    ageRange?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proof?: string;
    proofDocuments?: string[];
    id?: number;
}

export interface GroupPassengerType {
    name: string;
    maxGroupSize: string;
    companions: CompanionInfo[];
}

export interface RawSalesOfferPackage {
    name: string;
    description: string;
    id: number;
    purchaseLocations: string;
    paymentMethods: string;
    ticketFormats: string;
}
export interface GroupPassengerTypeDb {
    id: number;
    name: string;
    groupPassengerType: GroupPassengerTypeReference;
}

export interface CompanionReference {
    id: number;
    minNumber?: string;
    maxNumber: string;
}

export interface GroupPassengerTypeReference {
    name: string;
    maxGroupSize: string;
    companions: CompanionReference[];
}

export interface DbTimeRestriction {
    day: TimeRestrictionDay;
    timeBands: DbTimeBand[];
}
