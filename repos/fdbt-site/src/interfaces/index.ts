import { NextApiRequest, NextPageContext } from 'next';
import { DocumentContext } from 'next/document';
import { IncomingMessage } from 'http';

// Session Attributes and Cookies

export interface Session {
    session: Express.Session;
}

export type NextApiRequestWithSession = NextApiRequest & Session;

export type NextPageContextWithSession = NextPageContext & {
    req: Session;
};

export type DocumentContextWithSession = DocumentContext & {
    req: Session;
};

export type IncomingMessageWithSession = IncomingMessage & Session;

export interface CookiePolicy {
    essential: boolean;
    usage: boolean;
}

export interface ProductInfo {
    productName: string;
    productPrice: string;
}

export interface ProductInfoWithErrors extends ProductInfo {
    errors: ErrorInfo[];
}

export interface DurationValidInfo {
    amount: string;
    duration: string;
    errors: ErrorInfo[];
}

export interface InputMethodInfo {
    inputMethod: string;
}

export interface Journey extends JourneyWithErrors {
    directionJourneyPattern?: string;
    inboundJourney?: string;
    outboundJourney?: string;
}

export interface JourneyWithErrors {
    errors?: ErrorInfo[];
}

export interface TicketRepresentationAttribute {
    name: string;
}

export interface TicketRepresentationAttributeWithErrors {
    errors: ErrorInfo[];
}

export interface MultiOperatorInfo {
    nocCode: string;
    services: string[];
}

export interface TermTimeAttribute {
    termTime: boolean;
}

// Miscellaneous

export type PassengerAttributes = {
    passengerTypeDisplay: string;
    passengerTypeValue: string;
};

export interface BaseReactElement {
    id: string;
    name: string;
    label: string;
    defaultValue?: string;
    options?: string[];
}

export interface InputCheck {
    id: string;
    inputValue: string;
    error: string;
}

export interface ErrorInfo {
    errorMessage: string;
    id: string;
    userInput?: string;
}

// AWS and Reference Data (e.g. NOC, TNDS, NaPTAN datasets)

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

export interface S3NetexFile {
    name: string;
    noc: string;
    reference: string;
    fareType: string;
    productNames?: string;
    passengerType: string;
    serviceNames?: string;
    lineName?: string;
    zoneName?: string;
    sopNames: string;
    date: string;
    signedUrl: string;
    fileSize: number;
}

/* eslint-disable camelcase */
export interface CognitoIdToken {
    sub: string;
    aud: string;
    email_verified: boolean;
    event_id: string;
    'custom:noc': string;
    token_use: string;
    auth_time: number;
    iss: string;
    'cognito:username': string;
    exp: number;
    iat: number;
    email: string;
    'custom:contactable': string;
    'custom:schemeOperator': string;
    'custom:schemeRegionCode': string;
}

// Ticket Types

export type Ticket =
    | PointToPointTicket
    | GeoZoneTicket
    | PeriodMultipleServicesTicket
    | FlatFareTicket
    | SchemeOperatorTicket;

export type PointToPointTicket = SingleTicket | ReturnTicket;

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

export type PeriodTicket = PeriodGeoZoneTicket | PeriodMultipleServicesTicket;

export interface BasePeriodTicket extends BaseTicket {
    operatorName: string;
    products: ProductDetails[];
}

export interface PeriodGeoZoneTicket extends BasePeriodTicket {
    zoneName: string;
    stops: Stop[];
}

export interface Product {
    productName: string;
    productPrice: string;
    productDuration?: string;
    productValidity?: string;
    productDurationUnits?: string;
}

export interface MultiOperatorGeoZoneTicket extends PeriodGeoZoneTicket {
    additionalNocs: string[];
}

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

export interface FlatFareTicket extends BaseTicket {
    operatorName: string;
    products: FlatFareProductDetails[];
    selectedServices: SelectedService[];
}

export interface BaseGroupTicket {
    nocCode: string;
    type: string;
    groupDefinition: GroupDefinition;
    email: string;
    uuid: string;
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
    timeRestriction: FullTimeRestriction[];
    ticketPeriod: TicketPeriod;
    products: ProductDetails[];
    zoneName: string;
    stops: Stop[];
    additionalNocs: string[];
}

export const isSchemeOperatorTicket = (data: Ticket): data is SchemeOperatorTicket =>
    (data as SchemeOperatorTicket).schemeOperatorName !== undefined &&
    (data as SchemeOperatorTicket).schemeOperatorRegionCode !== undefined;

// Matching Data (created by the user on the site)

export interface PassengerDetails {
    passengerType: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proofDocuments?: string[];
    email: string;
    uuid: string;
    timeRestriction: FullTimeRestriction[];
    ticketPeriod: TicketPeriod;
    proof?: string[];
}

export interface CompanionInfo {
    passengerType: string;
    minNumber?: string;
    maxNumber: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proofDocuments?: string[];
}

export interface GroupPassengerInfo extends CompanionInfo {
    ageRange: string;
    proof: string;
}

export interface GroupDefinition {
    maxGroupSize: number;
    companions: CompanionInfo[];
}

export interface TimeRestriction {
    startTime?: string;
    endTime?: string;
    validDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
}

export interface ReturnPeriodValidity {
    amount: string;
    typeOfDuration: string;
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

export interface SelectedService {
    lineName: string;
    serviceCode: string;
    startDate: string;
    serviceDescription: string;
}

export interface BasicService {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    serviceDescription: string;
}

export interface SalesOfferPackage {
    name: string;
    description: string;
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
}

export interface TicketPeriod {
    startDate?: string;
    endDate?: string;
}

export interface BaseProduct {
    salesOfferPackages: SalesOfferPackage[];
}

export interface ProductWithSalesOfferPackages extends BaseProduct {
    productName: string;
}

export interface FlatFareProductDetails extends BaseProduct {
    productName: string;
    productPrice: string;
}

export interface ProductData {
    products: Product[];
}

export interface MultiOperatorInfoWithErrors {
    multiOperatorInfo: MultiOperatorInfo[];
    errors: ErrorInfo[];
}

export interface FullTimeRestriction {
    day: string;
    startTime: string;
    endTime: string;
}

export interface FullTimeRestrictionAttribute {
    fullTimeRestrictions: FullTimeRestriction[];
    errors: ErrorInfo[];
}

export interface TimeInput {
    timeInput: string;
    day: string;
}
export interface ProductDetails extends Product, BaseProduct {}
