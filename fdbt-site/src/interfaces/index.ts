import { AppInitialProps } from 'next/app';
import { NextApiRequest, NextPageContext } from 'next';
import { DocumentContext } from 'next/document';
import { IncomingMessage } from 'http';

export interface BaseReactElement {
    id: string;
    name: string;
    label: string;
    defaultValue?: string;
    options?: string[];
}

export interface ProductInfo {
    productName: string;
    productPrice: string;
}

export interface DaysValidInfo {
    daysValid: string;
    errors: ErrorInfo[];
}

export interface CookiePolicy {
    essential: boolean;
    usage: boolean;
}

export interface ProductInfoWithErrors extends ProductInfo {
    errors: ErrorInfo[];
}

export type PassengerAttributes = {
    passengerTypeDisplay: string;
    passengerTypeValue: string;
};

export interface BasicService {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    serviceDescription: string;
}

export interface PassengerDetails {
    passengerType: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proof?: string[];
}

export interface ErrorInfo {
    errorMessage: string;
    id: string;
    userInput?: string;
}

export interface InputCheck {
    id: string;
    inputValue: string;
    error: string;
}

export interface InputMethodInfo {
    inputMethod: string;
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
}

export interface CustomAppProps extends AppInitialProps {
    csrfToken: string;
}

export interface Breadcrumb {
    name: string;
    link: string;
    show: boolean;
}

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

export interface SalesOfferPackage {
    name: string;
    description: string;
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
}

export interface Product {
    productName: string;
    productPrice: string;
    productDuration?: string;
    productValidity?: string;
}

export interface ProductData {
    products: Product[];
}

export interface GroupPassengerInfo extends CompanionInfo {
    ageRange: string;
    proof: string;
}

export interface CompanionInfo {
    passengerType: string;
    minNumber?: string;
    maxNumber: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proofDocuments?: string[];
}

export interface GroupDefinition {
    maxGroupSize: number;
    companions: CompanionInfo[];
}

export interface BaseGroupTicket {
    nocCode: string;
    type: string;
    groupDefinition: GroupDefinition;
    email: string;
    uuid: string;
}

export interface TimeRestriction {
    startTime?: string;
    endTime?: string;
    validDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
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
    startDate?: string;
    endDate?: string;
}

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

export type PeriodTicket = PeriodGeoZoneTicket | PeriodMultipleServicesTicket;

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
}

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

export interface ProductWithSalesOfferPackages extends BaseProduct {
    productName: string;
}

export interface FlatFareProductDetails extends BaseProduct {
    productName: string;
    productPrice: string;
}

export interface ProductDetails extends Product, BaseProduct {}

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

export interface MultiOperatorInfo {
    nocCode: string;
    services: string[];
}

export interface MultiOperatorInfoWithErrors {
    multiOperatorInfo: MultiOperatorInfo[];
    errors: ErrorInfo[];
}
