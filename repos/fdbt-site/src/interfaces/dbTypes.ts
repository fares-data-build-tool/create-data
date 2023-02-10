import { CapInfo } from '.';
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
    id: number;
}

export interface MyFaresProduct {
    id: number;
    lineId: string;
    matchingJsonLink: string;
    startDate: string;
    endDate?: string;
    servicesRequiringAttention?: string[];
    fareTriangleModified?: string;
}

export type RawMyFaresProduct = Omit<MyFaresProduct, 'servicesRequiringAttention'> & {
    servicesRequiringAttention: string;
};

export interface DbProduct {
    id: string;
    matchingJsonLink: string;
    lineId: string;
    startDate: string;
    endDate?: string;
}

export type MyFaresOtherProduct = Omit<MyFaresProduct, 'lineId'>;

export interface ServiceQueryData {
    operatorShortName: string;
    serviceDescription: string;
    lineName: string;
    startDate: string;
    lineId: string;
    fromAtcoCode: string;
    toAtcoCode: string;
    fromCommonName: string;
    toCommonName: string;
    journeyPatternId: string;
    order: string;
    direction: string;
    fromSequenceNumber: number;
    toSequenceNumber: number;
    inboundDirectionDescription: string;
    outboundDirectionDescription: string;
}

export type StopPoint = {
    stopPointRef: string;
    commonName: string;
    sequenceNumber?: number;
};

export interface RawJourneyPattern {
    orderedStopPoints: StopPoint[];
    direction: string;
}

export interface RawService {
    serviceDescription: string;
    operatorShortName: string;
    journeyPatterns: RawJourneyPattern[];
    lineId: string;
    lineName: string;
    startDate: string;
    endDate?: string;
    inboundDirectionDescription: string;
    outboundDirectionDescription: string;
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
    isCapped: boolean;
}
export interface GroupPassengerTypeDb {
    id: number;
    name: string;
    groupPassengerType: GroupPassengerTypeReference;
}

export interface CompanionReference {
    id: number;
    name: string;
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

export interface ServiceDetails {
    fromAtcoCode: string;
    toAtcoCode: string;
    direction: string;
    serviceId: string;
}

export interface GroupOfProductsDb {
    id: number;
    products: string;
    name: string;
}
