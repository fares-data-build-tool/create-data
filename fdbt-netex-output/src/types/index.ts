import { NetexObject } from '../netex-convertor/sharedHelpers';

// Misc

export interface CoreData {
    ticketType: string;
    opIdNocFormat: string;
    nocCodeFormat: string;
    currentDate: Date;
    website: string;
    brandingId: string;
    operatorIdentifier: string;
    baseOperatorInfo: (Operator | SchemeOperator)[];
    placeholderGroupOfProductsName: string;
    ticketUserConcat: string;
    operatorPublicNameLineNameFormat: string;
    nocCodeLineNameFormat: string;
    lineIdName: string;
    lineName: string;
    operatorName: string;
}

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

export interface SchemeOperator {
    schemeOperatorName: string;
    schemeOperatorRegionCode: string;
    website: string;
    ttrteEnq: string;
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

export type Ticket =
    | PointToPointTicket
    | GeoZoneTicket
    | PeriodMultipleServicesTicket
    | FlatFareTicket
    | SchemeOperatorTicket;

export interface SalesOfferPackage {
    name: string;
    description: string;
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
}

export interface TimeBand {
    startTime: string;
    endTime: string;
}

export interface FullTimeRestriction {
    day: string;
    timeBands: TimeBand[];
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
    timeRestriction: FullTimeRestriction[];
    ticketPeriod: TicketPeriod;
}

export interface TicketPeriod {
    startDate: string;
    endDate: string;
}

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
    lineId: string;
    serviceDescription: string;
    products: BaseProduct[];
}

export interface SingleTicket extends BasePointToPointTicket {
    fareZones: FareZone[];
    termTime: boolean;
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

export type GeoZoneTicket = PeriodGeoZoneTicket | MultiOperatorGeoZoneTicket;

export interface PeriodMultipleServicesTicket extends BasePeriodTicket {
    selectedServices: SelectedService[];
    termTime: boolean;
}

export interface MultiOperatorMultipleServicesTicket extends PeriodMultipleServicesTicket {
    additionalOperators: {
        nocCode: string;
        selectedServices: SelectedService[];
    }[];
}

export type MultipleServicesTicket = PeriodMultipleServicesTicket | MultiOperatorMultipleServicesTicket;

export interface FlatFareTicket extends BaseTicket {
    operatorName: string;
    products: FlatFareProductDetails[];
    selectedServices: SelectedService[];
    termTime: boolean;
}

export interface SelectedService {
    lineName: string;
    lineId: string;
    serviceCode: string;
    startDate: string;
    serviceDescription: string;
}

export interface BaseProduct {
    salesOfferPackages: SalesOfferPackage[];
}

export interface FlatFareProductDetails extends BaseProduct {
    productName: string;
    productPrice: string;
}

export interface ProductDetails extends BaseProduct {
    productName: string;
    productPrice: string;
    productDuration: string;
    productValidity: string;
}

export interface SchemeOperatorTicket {
    schemeOperatorName: string;
    schemeOperatorRegionCode: string;
    type: string;
    passengerType: string;
    ageRange?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proof?: string;
    proofDocuments?: string[];
    email: string;
    uuid: string;
    timeRestriction?: FullTimeRestriction[];
    ticketPeriod: TicketPeriod;
}

export interface SchemeOperatorGeoZoneTicket extends SchemeOperatorTicket {
    zoneName: string;
    stops: Stop[];
    products: ProductDetails[];
    additionalNocs: string[];
}

export interface SchemeOperatorFlatFareTicket extends SchemeOperatorTicket {
    products: FlatFareProductDetails[];
    additionalOperators: {
        nocCode: string;
        selectedServices: SelectedService[];
    }[];
}

export const isPointToPointTicket = (ticketData: Ticket): ticketData is PointToPointTicket =>
    ticketData.type === 'single' || ticketData.type === 'return';

export const isReturnTicket = (ticket: PointToPointTicket): ticket is ReturnTicket =>
    ((ticket as ReturnTicket).inboundFareZones !== undefined && (ticket as ReturnTicket).inboundFareZones.length > 0) ||
    ((ticket as ReturnTicket).outboundFareZones !== undefined && (ticket as ReturnTicket).outboundFareZones.length > 0);

export const isSingleTicket = (ticket: PointToPointTicket): ticket is SingleTicket =>
    (ticket as SingleTicket).fareZones !== undefined && (ticket as SingleTicket).fareZones.length > 0;

export const isGeoZoneTicket = (ticket: Ticket): ticket is GeoZoneTicket =>
    (ticket as GeoZoneTicket).zoneName !== undefined;

export const isMultiServiceTicket = (ticket: Ticket): ticket is PeriodMultipleServicesTicket =>
    (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

export const isPeriodGeoZoneTicket = (ticket: Ticket): ticket is PeriodGeoZoneTicket =>
    ticket.type === 'period' && (ticket as PeriodGeoZoneTicket).zoneName !== undefined;

export const isPeriodMultipleServicesTicket = (ticket: Ticket): ticket is PeriodMultipleServicesTicket =>
    ticket.type === 'period' && (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

export const isMultiOperatorTicket = (
    ticketData: Ticket,
): ticketData is MultiOperatorGeoZoneTicket | MultiOperatorMultipleServicesTicket | SchemeOperatorGeoZoneTicket =>
    ticketData.type === 'multiOperator';

export const isMultiOperatorGeoZoneTicket = (ticketData: Ticket): ticketData is MultiOperatorGeoZoneTicket =>
    !!(ticketData as MultiOperatorGeoZoneTicket).nocCode &&
    (ticketData as MultiOperatorGeoZoneTicket).additionalNocs &&
    (ticketData as MultiOperatorGeoZoneTicket).additionalNocs.length > 0;

export const isMultiOperatorMultipleServicesTicket = (
    ticketData: Ticket,
): ticketData is MultiOperatorMultipleServicesTicket =>
    !!(ticketData as MultiOperatorGeoZoneTicket).nocCode &&
    (ticketData as MultiOperatorMultipleServicesTicket).additionalOperators &&
    (ticketData as MultiOperatorMultipleServicesTicket).additionalOperators.length > 0;

export const isSchemeOperatorTicket = (data: Ticket): data is SchemeOperatorTicket =>
    (data as SchemeOperatorTicket).schemeOperatorName !== undefined &&
    (data as SchemeOperatorTicket).schemeOperatorRegionCode !== undefined;

export const isSchemeOperatorGeoZoneTicket = (data: Ticket): data is SchemeOperatorGeoZoneTicket =>
    isSchemeOperatorTicket(data) && (data as SchemeOperatorGeoZoneTicket).zoneName !== undefined;

export const isSchemeOperatorFlatFareTicket = (data: Ticket): data is SchemeOperatorFlatFareTicket =>
    isSchemeOperatorTicket(data) && (data as SchemeOperatorFlatFareTicket).additionalOperators !== undefined;

export const isFlatFareTicket = (ticket: Ticket): ticket is FlatFareTicket =>
    ticket.type === 'flatFare' && (ticket as FlatFareTicket).nocCode !== undefined;

export const isGroupTicket = (
    ticket: PeriodTicket | PointToPointTicket | FlatFareTicket | SchemeOperatorTicket,
): ticket is GroupTicket => (ticket as GroupTicket).groupDefinition !== undefined;

export const isProductDetails = (product: ProductDetails | FlatFareProductDetails): product is ProductDetails =>
    (product as ProductDetails).productDuration !== undefined;

export const isBaseSchemeOperatorInfo = (operatorInfo: Operator | SchemeOperator): operatorInfo is SchemeOperator =>
    (operatorInfo as SchemeOperator).schemeOperatorName !== undefined &&
    (operatorInfo as SchemeOperator).schemeOperatorRegionCode !== undefined;

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
