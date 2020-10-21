import { NetexObject } from '../netex-convertor/sharedHelpers';

// Reference Data (from NOC, TNDS, NaPTAN datasets)

export interface Operator {
    nocCode: string;
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

export interface SalesOfferPackage {
    name: string;
    description: string;
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
}

export interface TimeRestriction {
    startTime?: string;
    endTime?: string;
    validDays?: DayOfWeek[];
}

export interface BaseTicket {
    nocCode: string;
    type: string;
    passengerType: string;
    ageRange?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proof?: string;
    proofDocuments?: string[];
    email: string;
    uuid: string;
    timeRestriction?: TimeRestriction;
    ticketPeriod: TicketPeriod;
}

export interface TicketPeriod {
    startDate: string;
    endDate: string;
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface User {
    passengerType: string;
    ageRangeMin?: number;
    ageRangeMax?: number;
    proofDocuments?: string[];
}

export interface GroupCompanion extends User {
    minNumber: number;
    maxNumber: number;
}

export type GroupTicket = (PointToPointTicket | PeriodTicket) & {
    groupDefinition: {
        maxPeople: string;
        companions: GroupCompanion[];
    };
};

export type PointToPointTicket = SingleTicket | ReturnTicket;

export interface BasePointToPointTicket extends BaseTicket {
    operatorShortName: string;
    lineName: string;
    serviceDescription: string;
    products: BaseProduct[];
}

export interface SingleTicket extends BasePointToPointTicket {
    fareZones: FareZone[];
}

export interface ReturnTicket extends BasePointToPointTicket {
    inboundFareZones: FareZone[];
    outboundFareZones: FareZone[];
    returnPeriodValidity?: ReturnPeriodValidity;
}

export interface ReturnPeriodValidity {
    amount: string;
    typeOfDuration: TypeOfDuration;
}

type TypeOfDuration = 'day' | 'week' | 'month' | 'year';

export interface FareZone {
    name: string;
    stops: Stop[];
    prices: FareZonePrices[];
}

export interface FareZonePrices {
    price: string;
    fareZones: string[];
}

export type PeriodTicket = GeoZoneTicket | MultipleServicesTicket;

export interface BasePeriodTicket extends BaseTicket {
    operatorName: string;
    products: ProductDetails[];
}

export interface PeriodGeoZoneTicket extends BasePeriodTicket {
    zoneName: string;
    stops: Stop[];
}

export interface MultiOperatorGeoZoneTicket extends PeriodGeoZoneTicket {
    additionalNocs: string[];
}

export const isMultiOperatorGeoZoneTicket = (
    userPeriodTicket: PeriodTicket,
): userPeriodTicket is MultiOperatorGeoZoneTicket =>
    (userPeriodTicket as MultiOperatorGeoZoneTicket).additionalNocs &&
    (userPeriodTicket as MultiOperatorGeoZoneTicket).additionalNocs.length > 0;

export type GeoZoneTicket = PeriodGeoZoneTicket | MultiOperatorGeoZoneTicket;

export interface PeriodMultipleServicesTicket extends BasePeriodTicket {
    selectedServices: SelectedService[];
}

export interface MultiOperatorMultipleServicesTicket extends PeriodMultipleServicesTicket {
    additionalOperators: {
        nocCode: string;
        selectedServices: SelectedService[];
    }[];
}

export const isMultiOperatorMultipleServicesTicket = (
    userPeriodTicket: PeriodTicket,
): userPeriodTicket is MultiOperatorMultipleServicesTicket =>
    (userPeriodTicket as MultiOperatorMultipleServicesTicket).additionalOperators &&
    (userPeriodTicket as MultiOperatorMultipleServicesTicket).additionalOperators.length > 0;

export type MultipleServicesTicket = PeriodMultipleServicesTicket | MultiOperatorMultipleServicesTicket;

export interface FlatFareTicket extends BaseTicket {
    operatorName: string;
    products: FlatFareProductDetails[];
    selectedServices: SelectedService[];
}

export interface SelectedService {
    lineName: string;
    serviceCode: string;
    startDate: string;
    serviceDescription: string;
}

export interface BaseProduct {
    salesOfferPackages: SalesOfferPackage[];
}

interface FlatFareProductDetails extends BaseProduct {
    productName: string;
    productPrice: string;
}

export interface ProductDetails extends BaseProduct {
    productName: string;
    productPrice: string;
    productDuration: string;
    productValidity: string;
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
    GenericParameterAssignment: NetexObject;
    timeIntervals?: object;
}

export interface DistributionAssignment {
    version: string;
    id: string;
    order: string;
    DistributionChannelRef: {
        ref: string;
        version: string;
    };
    PaymentMethods: {
        $t: string;
    };
    DistributionChannelType: {
        $t: string;
    };
}

export interface SalesOfferPackageElement {
    id: string;
    version: string;
    order: string;
    TypeOfTravelDocumentRef: {
        version: string;
        ref: string;
    };
    PreassignedFareProductRef: {
        ref: string;
    };
}

export interface NetexSalesOfferPackage {
    Name: {
        $t: string;
    };
    Description: {
        $t: string;
    };
    version: string;
    id: string;
    distributionAssignments: { DistributionAssignment: DistributionAssignment[] };
    salesOfferPackageElements: { SalesOfferPackageElement: SalesOfferPackageElement[] };
}

export interface NetexOrganisationOperator {
    version: string;
    id: string;
    PublicCode: {
        $t: string;
    };
    Name: {
        $t: string;
    };
    ShortName: {
        $t: string;
    };
    TradingName: {
        $t: string;
    };
    ContactDetails: {
        Phone: {
            $t: string;
        };
        Url: {
            $t: string;
        };
    };
    Address: {
        Street: {
            $t: string;
        };
    };
    PrimaryMode: {
        $t: string;
    };
}

export interface GroupMember {
    version: string;
    ref: string;
    $t: string;
}

export interface GroupOfOperators {
    GroupOfOperators: {
        version: string;
        id: string;
        Name: {
            $t: string;
        };
        members: {
            OperatorRef: GroupMember[];
        };
    };
}

export interface OperatorRef {
    version: string;
    ref: string;
    $t: string;
}
