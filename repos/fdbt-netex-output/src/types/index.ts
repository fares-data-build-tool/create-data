import {
    PointToPointTicket,
    BaseTicket,
    PointToPointCarnetProductDetails,
    PointToPointPeriodTicket,
    ReturnTicket,
    SalesOfferPackage,
    BaseSchemeOperatorTicket,
    SingleTicket,
    FlatFareGeoZoneTicket,
    SelectedService,
    PeriodMultipleServicesTicket,
    BasePeriodTicket,
    Ticket,
    GeoZoneTicket,
    SchemeOperatorGeoZoneTicket,
    MultiOperatorGeoZoneTicket,
    SchemeOperatorFlatFareTicket,
    SchemeOperatorTicket,
    SchemeOperatorMultiServiceTicket,
} from 'fdbt-types/matchingJsonTypes';
import { NetexObject } from '../netex-convertor/sharedHelpers';

// Misc

export interface CoreData {
    ticketType: string;
    opIdNocFormat: string;
    nocCodeFormat: string;
    currentDate: Date;
    url: string;
    brandingId: string;
    operatorIdentifier: string;
    baseOperatorInfo: (OperatorWithExpandedAddress | SchemeOperatorWithExpandedAddress)[];
    placeholderGroupOfProductsName: string;
    ticketUserConcat: string;
    operatorPublicNameLineNameFormat: string;
    nocCodeLineNameFormat: string;
    lineIdName: string;
    lineName: string;
    operatorName: string;
    productNameForPlainText: string;
    isCarnet: boolean;
}

export interface OperatorDetails {
    operatorName: string;
    contactNumber: string;
    email: string;
    url: string;
    street: string;
    town: string;
    county: string;
    postcode: string;
}

// Reference Data (from NOC, TNDS, NaPTAN datasets)

export interface Operator {
    nocCode: string;
    url: string;
    email: string;
    operatorName: string;
    opId: string;
    vosaPsvLicenseName: string;
    contactNumber: string;
    street: string;
    mode: string;
}

export type OperatorWithExpandedAddress = Operator | (OperatorDetails & Operator);

export interface SchemeOperator {
    schemeOperatorName: string;
    schemeOperatorRegionCode: string;
    url: string;
    email: string;
    opId: string;
    vosaPsvLicenseName: string;
    contactNumber: string;
    street: string;
    mode: string;
}

export type SchemeOperatorWithExpandedAddress = SchemeOperator | (SchemeOperator & OperatorDetails);

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

export interface TimeBand {
    startTime: string;
    endTime: string;
}

export interface FullTimeRestriction {
    day: string;
    timeBands: TimeBand[];
}

export interface TicketPeriod {
    startDate: string;
    endDate: string;
}

export interface User {
    passengerType: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proofDocuments?: string[];
}

export interface GroupCompanion extends User {
    minNumber: number;
    maxNumber: number;
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

export type PeriodTicket = GeoZoneTicket | MultipleServicesTicket | HybridPeriodTicket | PointToPointPeriodTicket;

export interface PeriodGeoZoneTicket extends BasePeriodTicket {
    zoneName: string;
    stops: Stop[];
}

export interface MultiOperatorMultipleServicesTicket extends PeriodMultipleServicesTicket {
    additionalOperators: {
        nocCode: string;
        selectedServices: SelectedService[];
    }[];
}

export type MultipleServicesTicket = PeriodMultipleServicesTicket | MultiOperatorMultipleServicesTicket;

export interface BaseProduct {
    salesOfferPackages: SalesOfferPackage[];
}

export interface FlatFareProductDetails extends BaseProduct {
    productName: string;
    productPrice: string;
    carnetDetails?: CarnetDetails;
}

export interface ProductDetails extends BaseProduct {
    productName: string;
    productPrice: string;
    productDuration: string;
    productValidity: string;
    carnetDetails?: CarnetDetails;
}

export interface HybridPeriodTicket extends PeriodGeoZoneTicket, PeriodMultipleServicesTicket {}

export enum CarnetExpiryUnit {
    HOUR = 'hour',
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
    NO_EXPIRY = 'no expiry',
}

export interface CarnetDetails {
    quantity: string;
    expiryTime: string;
    expiryUnit: CarnetExpiryUnit;
}

const passengerTypes = ['adult', 'child', 'infant' ,'senior' , 'student' , 'youngPerson' , 'schoolPupil' , 'military' 
, 'disabled' , 'disabledCompanion' , 'jobSeeker' , 'employee' , 'animal' , 'anyone']
type PassengerType = (typeof passengerTypes)[number];
export const isPassengerType = (passengerType : any): passengerType is PassengerType => passengerTypes.includes(passengerType);

export const isPointToPointTicket = (ticketData: Ticket): ticketData is PointToPointTicket =>
    ticketData.type === 'single' || ticketData.type === 'return';

export const isReturnTicket = (ticket: Ticket): ticket is ReturnTicket | PointToPointPeriodTicket =>
    ((ticket as ReturnTicket).inboundFareZones !== undefined && (ticket as ReturnTicket).inboundFareZones.length > 0) ||
    ((ticket as ReturnTicket).outboundFareZones !== undefined && (ticket as ReturnTicket).outboundFareZones.length > 0);

export const isSingleTicket = (ticket: Ticket): ticket is SingleTicket =>
    (ticket as SingleTicket).fareZones !== undefined && (ticket as SingleTicket).fareZones.length > 0;

export const isGeoZoneTicket = (
    ticket: Ticket,
): ticket is GeoZoneTicket | FlatFareGeoZoneTicket | SchemeOperatorGeoZoneTicket =>
    'zoneName' in ticket && !('selectedServices' in ticket);

export const isMultiServiceTicket = (ticket: Ticket): ticket is PeriodMultipleServicesTicket =>
    !('zoneName' in ticket) && 'selectedServices' in ticket;

export const isHybridTicket = (ticket: Ticket): ticket is HybridPeriodTicket =>
    'zoneName' in ticket && 'selectedServices' in ticket;

export const isPeriodMultipleServicesTicket = (ticket: Ticket): ticket is PeriodMultipleServicesTicket =>
    ticket.type === 'period' && (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

export const isMultiOperatorTicket = (
    ticketData: Ticket,
): ticketData is MultiOperatorGeoZoneTicket | MultiOperatorMultipleServicesTicket | SchemeOperatorGeoZoneTicket =>
    ticketData.type === 'multiOperator';

export const isMultiOperatorGeoZoneTicket = (ticket: Ticket): ticket is MultiOperatorGeoZoneTicket =>
    'zoneName' in ticket &&
    !!(ticket as MultiOperatorGeoZoneTicket).nocCode &&
    (ticket as MultiOperatorGeoZoneTicket).additionalNocs &&
    (ticket as MultiOperatorGeoZoneTicket).additionalNocs.length > 0;

export const isMultiOperatorMultipleServicesTicket = (ticket: Ticket): ticket is MultiOperatorMultipleServicesTicket =>
    !!(ticket as MultiOperatorGeoZoneTicket).nocCode &&
    (ticket as MultiOperatorMultipleServicesTicket).additionalOperators &&
    (ticket as MultiOperatorMultipleServicesTicket).additionalOperators.length > 0 &&
    'selectedServices' in ticket;

export const isSchemeOperatorTicket = (data: Ticket): data is SchemeOperatorTicket =>
    (data as BaseSchemeOperatorTicket).schemeOperatorName !== undefined &&
    (data as BaseSchemeOperatorTicket).schemeOperatorRegionCode !== undefined;

export const isPeriodGeoZoneTicket = (ticket: Ticket): ticket is PeriodGeoZoneTicket =>
    !isSchemeOperatorTicket(ticket) && ticket.type === 'period' && 'zoneName' in ticket;

export const isSchemeOperatorGeoZoneTicket = (data: Ticket): data is SchemeOperatorGeoZoneTicket =>
    isSchemeOperatorTicket(data) && (data as SchemeOperatorGeoZoneTicket).zoneName !== undefined;

export const isSchemeOperatorFlatFareTicket = (
    data: Ticket,
): data is SchemeOperatorFlatFareTicket | SchemeOperatorMultiServiceTicket =>
    isSchemeOperatorTicket(data) && (data as SchemeOperatorFlatFareTicket).additionalOperators !== undefined;

export const isProductDetails = (
    product: ProductDetails | FlatFareProductDetails | PointToPointCarnetProductDetails | BaseProduct,
): product is ProductDetails => (product as ProductDetails).productDuration !== undefined;

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

export interface GroupOfLines {
    version: string;
    id: string;
    Name: { $t: string };
    members: { LineRef: LineRef[] };
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
    TypeOfFareStructureElementRef: object;
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

// eslint-disable-next-line prettier/prettier
export type {
    SalesOfferPackage,
    PointToPointCarnetProductDetails,
    ReturnTicket,
    BaseTicket,
    BaseSchemeOperatorTicket,
    SingleTicket,
    PointToPointTicket,
    Ticket,
    SchemeOperatorGeoZoneTicket,
    SchemeOperatorFlatFareTicket,
    MultiOperatorGeoZoneTicket,
    GeoZoneTicket,
};

export const assertNever = (never: never): never => {
    throw new Error(`This should never happen!! ${never}`);
};
