// Reference Data (from NOC, TNDS, NaPTAN datasets)

export interface Operator {
    website: string;
    ttrteEnq: string;
    operatorPublicName: string;
    opId: string;
    vosaPsvLicenseName: string;
    fareEnq: string;
    complEnq: string;
    mode: string;
}

export interface Service {
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

// Matching Data (created by the user on the site)

export interface BaseTicket {
    nocCode: string;
    type: string;
    passengerType: string;
    ageRange?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proof?: string;
    proofDocuments?: string[];
}

export type PointToPointTicket = SingleTicket | ReturnTicket;

export interface BasePointToPointTicket extends BaseTicket {
    operatorShortName: string;
    lineName: string;
    serviceDescription: string;
}

export interface SingleTicket extends BasePointToPointTicket {
    fareZones: FareZone[];
}

export interface ReturnTicket extends BasePointToPointTicket {
    inboundFareZones: FareZone[];
    outboundFareZones: FareZone[];
}

export interface FareZone {
    name: string;
    stops: Stop[];
    prices: FareZonePrices[];
}

export interface FareZonePrices {
    price: string;
    fareZones: string[];
}

export type PeriodTicket = PeriodGeoZoneTicket | PeriodMultipleServicesTicket;

export interface BasePeriodTicket extends BaseTicket {
    operatorName: string;
    products: ProductDetails[];
}

export interface PeriodGeoZoneTicket extends BasePeriodTicket {
    zoneName: string;
    stops: Stop[];
}

export interface PeriodMultipleServicesTicket extends BasePeriodTicket {
    selectedServices: SelectedService[];
}

export interface FlatFareTicket extends BaseTicket {
    operatorName: string;
    products: {
        productName: string;
        productPrice: string;
    }[];
    selectedServices: SelectedService[];
}

export interface SelectedService {
    lineName: string;
    serviceCode: string;
    startDate: string;
    serviceDescription: string;
}

export interface ProductDetails {
    productName: string;
    productPrice: string;
    productDuration?: string;
    productValidity?: string;
}

// NeTEx

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
