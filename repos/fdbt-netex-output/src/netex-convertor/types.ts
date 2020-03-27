export interface OperatorData {
    website: string;
    ttrteEnq: string;
    publicName: string;
    opId: string;
    vosaPSVLicenseName: string;
    fareEnq: string;
    complEnq: string;
    mode: string;
}

export interface ServiceData {
    serviceDescription: string;
}

export interface Stop {
    stopName: string;
    naptanCode: string;
    atcoCode: string;
    localityCode: string;
    localityName: string;
    parentLocalityName: string;
    qualifierName?: string;
    indicator?: string;
    street?: string;
}

export interface FareZonePrices {
    price: string;
    fareZones: string[];
}

export interface FareZone {
    name: string;
    stops: Stop[];
    prices: FareZonePrices[];
}

export interface MatchingData {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    fareZones: FareZone[];
}

export interface GeographicalFareZonePass {
    operatorName: string;
    nocCode: string;
    type: string;
    productName: string;
    productPrice: string;
    fareZoneName: string;
    stops: Stop[];
    daysValid: string;
    expiryRules: string;
}
