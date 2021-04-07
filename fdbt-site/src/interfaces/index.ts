import { NextApiRequest, NextPageContext } from 'next';
import { DocumentContext } from 'next/document';
import { IncomingMessage, ServerResponse } from 'http';
import { ReactElement } from 'react';

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

export interface Operator {
    name: string;
    nocCode: string;
}

export interface OperatorGroup {
    name: string;
    operators: Operator[];
}

export interface MultiOperatorInfo {
    nocCode: string;
    services: string[];
}

export interface TermTimeAttribute {
    termTime: boolean;
}

export type WithErrors<T> = {
    errors: ErrorInfo[];
} & T;

export interface UserDataUploadsProps {
    csvUploadApiRoute: string;
    csvUploadHintText: string;
    csvUploadTitle: string;
    guidanceDocDisplayName: string;
    guidanceDocAttachmentUrl: string;
    guidanceDocSize: string;
    csvTemplateDisplayName: string;
    csvTemplateAttachmentUrl: string;
    csvTemplateSize: string;
    errors: ErrorInfo[];
    detailSummary?: string;
    detailBody?: ReactElement;
    showPriceOption?: boolean;
    poundsOrPence?: string | null;
    csrfToken: string;
}

export interface GroupDefinitionWithErrors extends GroupDefinition {
    errors: ErrorInfo[];
}

export interface NumberOfStagesAttributeWithError {
    errors: ErrorInfo[];
}

export interface FareStagesAttribute {
    fareStages: string;
}

export interface FareStagesAttributeWithErrors {
    errors: ErrorInfo[];
}

export interface CsvUploadAttributeWithErrors {
    errors: ErrorInfo[];
    poundsOrPence?: string;
}

export interface GroupTicketAttribute {
    maxGroupSize: string;
}

export interface GroupTicketAttributeWithErrors extends GroupTicketAttribute {
    errors: ErrorInfo[];
}

export interface NumberOfProductsAttribute {
    numberOfProductsInput: string;
}

export interface NumberOfProductsAttributeWithErrors {
    errors: ErrorInfo[];
}

export interface MultipleProductAttribute {
    products: MultiProduct[];
}

export interface MultipleProductAttributeWithErrors extends MultipleProductAttribute {
    errors: ErrorInfo[];
}

export interface SchoolFareTypeAttribute {
    schoolFareType: string;
}

export interface MultipleOperatorsAttribute {
    selectedOperators: Operator[];
}

export interface MultipleOperatorsAttributeWithErrors extends MultipleOperatorsAttribute {
    errors: ErrorInfo[];
}

export interface ServiceListAttribute {
    selectedServices: string[];
}

export interface ServiceListAttributeWithErrors {
    errors: ErrorInfo[];
}

// Miscellaneous

export interface PassengerAttributes {
    passengerTypeDisplay: string;
    passengerTypeValue: string;
}

export interface BaseReactElement {
    id: string;
    name: string;
    label: string;
    defaultValue?: string;
    defaultChecked?: boolean;
    options?: string[];
}

export interface InputCheck {
    error: string;
    input: string;
    id: string;
}

export interface ErrorInfo {
    errorMessage: string;
    id: string;
    userInput?: string;
}

export interface Feedback {
    question: string;
    answer: string;
}

export interface PriceEntryError {
    input: string;
    locator: string;
}

export interface ResponseWithLocals extends ServerResponse {
    locals: {
        nonce: string;
        csrfToken: string;
    };
}

export interface PremadeTimeRestriction {
    name: string;
    contents: FullTimeRestriction[];
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

export interface StopPoint {
    stopPointRef: string;
    commonName: string;
}

export interface S3NetexFile {
    name: string;
    noc: string | undefined;
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
    termTime: boolean;
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
    productEndTime?: string;
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

export interface FlatFareTicket extends BaseTicket {
    operatorName: string;
    products: FlatFareProductDetails[];
    selectedServices: SelectedService[];
    termTime: boolean;
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
    nocCode?: string;
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
    ticketPeriod: TicketPeriodWithInput;
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
    validDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'bankHoliday')[];
}

export interface ReturnPeriodValidity {
    amount: string;
    typeOfDuration: string;
}

export interface ReturnPeriodValidityWithErrors {
    amount?: string;
    typeOfDuration?: string;
    errors: ErrorInfo[];
}

export interface FareZone {
    name: string;
    stops: Stop[];
    prices: FareZonePrices[];
}

export interface FareZoneWithErrors {
    errors: ErrorInfo[];
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

export interface SalesOfferPackageInfo {
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
}

export interface SalesOfferPackageInfoWithErrors extends SalesOfferPackageInfo {
    errors: ErrorInfo[];
}

export interface SalesOfferPackage extends SalesOfferPackageInfo {
    name: string;
    description: string;
    id?: string;
}

export interface SalesOfferPackageWithErrors extends SalesOfferPackage {
    errors: ErrorInfo[];
}

export interface TicketPeriod {
    startDate?: string;
    endDate?: string;
}

export interface TicketPeriodWithInput extends TicketPeriod {
    dateInput: ProductDateInformation;
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

export interface TimeBand {
    startTime: string;
    endTime: string;
}

export interface FullTimeRestriction {
    day: string;
    timeBands: TimeBand[];
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
export interface FareStage {
    stageName: string;
    prices: {
        price: string;
        fareZones: string[];
    }[];
}

export interface UserFareStages {
    fareStages: FareStage[];
}

export interface UserFareZone {
    FareZoneName: string;
    NaptanCodes: string;
    AtcoCodes: string;
}

export interface DefinePassengerTypeWithErrors extends CompanionInfo {
    errors: ErrorInfo[];
}

export interface TimeRestrictionsDefinition extends TimeRestriction {
    timeRestrictionChoice?: string;
}

export interface TimeRestrictionsDefinitionWithErrors extends TimeRestrictionsDefinition {
    errors: ErrorInfo[];
}

export interface FareType {
    fareType: string;
}

export interface FareTypeWithErrors {
    errors: ErrorInfo[];
}

export interface GroupPassengerTypesCollection {
    passengerTypes: string[];
}
export interface GroupPassengerTypesCollectionWithErrors {
    errors: ErrorInfo[];
}

export interface MultiProduct {
    productName: string;
    productNameId: string;
    productPrice: string;
    productPriceId: string;
    productDuration: string;
    productDurationId: string;
    productDurationUnits: string;
    productDurationUnitsId: string;
    productValidity: string;
    productValidityId: string;
    productEndTime?: string;
    productEndTimeId?: string;
}

export interface MultiProductWithErrors extends MultiProduct {
    productNameError?: string;
    productPriceError?: string;
    productDurationError?: string;
    productDurationUnitsError?: string;
}

export interface PassengerType {
    passengerType: string;
    ageRange?: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proof?: string;
    proofDocuments?: string[];
}

export interface PassengerTypeWithErrors {
    errors: ErrorInfo[];
}

export interface FaresInput {
    input: string;
    locator: string;
}

export interface FaresInformation {
    inputs: FaresInput[];
    errorInformation: PriceEntryError[];
}

export interface TicketPeriodWithErrors {
    errors: ErrorInfo[];
    dates: ProductDateInformation;
}

export interface ProductDateInformation {
    startDateDay: string;
    startDateMonth: string;
    startDateYear: string;
    endDateDay: string;
    endDateMonth: string;
    endDateYear: string;
}

export interface SelectSalesOfferPackageWithError {
    errors: ErrorInfo[];
    selected: { [key: string]: string[] };
}

export interface Service {
    service: string;
}

export interface ServiceWithErrors {
    errors: ErrorInfo[];
}

export interface ServiceType {
    lineName: string;
    startDate: string;
    description: string;
    origin?: string;
    destination?: string;
    serviceCode: string;
    dataSource?: string;
}

export interface ServicesInfo extends ServiceType {
    checked?: boolean;
}

export interface ServiceDB {
    serviceDescription: string;
    operatorShortName: string;
    journeyPatterns: JourneyPattern[];
}

export interface RawService {
    serviceDescription: string;
    operatorShortName: string;
    journeyPatterns: RawJourneyPattern[];
}

export interface JourneyPattern {
    startPoint: {
        Id: string;
        Display: string;
    };
    endPoint: {
        Id: string;
        Display: string;
    };
    stopList: string[];
}

export interface RawJourneyPattern {
    orderedStopPoints: {
        stopPointRef: string;
        commonName: string;
    }[];
}

// Components

export interface ConfirmationElement {
    name: string;
    content: string;
    href: string;
}

export interface FareTypeRadio {
    fareType: string;
    label: string;
}
export interface FareTypeRadioProps {
    standardFares: FareTypeRadio[];
    otherFares?: FareTypeRadio[];
}

export interface RadioWithoutConditionals extends BaseReactElement {
    value: string;
    radioButtonHint?: {
        id: string;
        content: string;
    };
}

export interface RadioWithConditionalInputs extends RadioWithoutConditionals {
    dataAriaControls: string;
    inputHint: {
        id: string;
        content: string;
        hidden?: boolean;
    };
    inputType: 'text' | 'checkbox' | 'date' | 'textWithUnits' | 'dropdown';
    inputs: BaseReactElement[] | PremadeTimeRestriction[];
    inputErrors: ErrorInfo[];
    selectIdentifier?: string;
}

export type RadioButton = RadioWithoutConditionals | RadioWithConditionalInputs;

export interface RadioConditionalInputFieldset {
    heading: {
        id: string;
        content: string;
        hidden?: boolean;
    };
    radios: RadioButton[];
    radioError: ErrorInfo[];
}

export interface UserAttribute {
    redirectFrom?: string;
}

export interface OperatorAttribute {
    name?: string;
    region?: string;
    nocCode?: string;
    uuid?: string;
    email?: string;
}

export interface ForgotPasswordAttribute {
    email: string;
}

export interface TxcSourceAttribute {
    source: 'tnds' | 'bods';
    hasTnds: boolean;
    hasBods: boolean;
}
