export interface OperatorData {
    website: string;
    ttrteEnq: string;
    operatorPublicName: string;
    opId: string;
    vosaPsvLicenseName: string;
    fareEnq: string;
    complEnq: string;
    mode: string;
}

export interface ServiceData {
    description: string;
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

export interface MatchingSingleData {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    serviceDescription: string;
    fareZones: FareZone[];
}

export interface MatchingReturnData {
    type: string;
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    serviceDescription: string;
    inboundFareZones: FareZone[];
    outboundFareZones: FareZone[];
}

export type MatchingData = MatchingSingleData | MatchingReturnData;

export interface SelectedService {
    lineName: string;
    startDate: string;
    serviceDescription: string;
}

export interface ProductDetails {
    productName: string;
    productPrice: string;
    daysValid?: string;
    expiryRules?: string;
}

export interface BasePeriodTicket {
    operatorName: string;
    nocCode: string;
    products: ProductDetails[];
}

export interface PeriodGeoZoneTicket extends BasePeriodTicket {
    zoneName: string;
    stops: Stop[];
}

export interface MultipleServicesTicket extends BasePeriodTicket {
    selectedServices: SelectedService[];
}

export type PeriodTicket = PeriodGeoZoneTicket | MultipleServicesTicket;

export interface ScheduledStopPoint {
    versionRef: string;
    ref: string;
    $t: string;
}

export interface TopographicProjectionRef {
    versionRef: string;
    ref: string;
    $t: string;
}

export interface Line {
    version: string;
    id: string;
    Name: object;
    Description: object;
    Url: object;
    PublicCode: object;
    PrivateCode: object;
    OperatorRef: object;
    LineType: object;
}

export interface LineRef {
    version: string;
    ref: string;
}

export interface ScheduledStopPoints {
    version: string;
    id: string;
    Name: object;
    TopographicPlaceView: object;
}

export interface FareZoneList {
    version: string;
    id: string;
    Name: object;
    members: object;
}

export interface FareStructureElement {
    version: string;
    id: string;
    Name: object;
    Description?: object;
    TypeOfFareStructureElementRef?: object;
    GenericParameterAssignment: object;
    timeIntervals?: object;
}
