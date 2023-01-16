export interface PointToPointCarnetProductDetails extends BaseProduct {
    carnetDetails: CarnetDetails;
}

export type FlatFareGeoZoneTicket = Omit<PeriodGeoZoneTicket, 'products' | 'type'> & {
    type: 'flatFare';
    products: FlatFareProductDetails[];
};

export interface PeriodGeoZoneTicket extends BasePeriodTicket {
    zoneName: string;
    stops: Stop[];
}

export interface BasePeriodTicket extends BaseTicket<'period' | 'multiOperator'> {
    operatorName: string;
    products: ProductDetails[];
    fareDayEnd?: string;
}

export interface SelectedService {
    lineName: string;
    lineId: string;
    serviceCode: string;
    startDate: string;
    serviceDescription: string;
}

export interface AdditionalService extends SelectedService {
    serviceId: number;
}
export interface PeriodMultipleServicesTicket extends BasePeriodTicket {
    selectedServices: SelectedService[];
    termTime: boolean;
}

export interface FlatFareProductDetails extends BaseProduct {
    productPrice: string;
    carnetDetails?: CarnetDetails;
}

export interface FlatFareMultipleServices extends BaseTicket<'flatFare'> {
    products: FlatFareProductDetails[];
    termTime: boolean;
    selectedServices: SelectedService[];
    operatorName: string;
}

export type FlatFareTicket = FlatFareGeoZoneTicket | FlatFareMultipleServices;

export interface SalesOfferPackage {
    id: number;
    name: string;
    description?: string;
    purchaseLocations: string[];
    paymentMethods: string[];
    ticketFormats: string[];
    price?: string;
}

export type FromDb<T> = T & { id: number };

export type TicketType = 'flatFare' | 'period' | 'multiOperator' | 'schoolService' | 'single' | 'return' | 'capped';

export type Ticket =
    | PointToPointTicket
    | GeoZoneTicket
    | PeriodMultipleServicesTicket
    | FlatFareTicket
    | SchemeOperatorGeoZoneTicket
    | SchemeOperatorFlatFareTicket
    | SchemeOperatorMultiServiceTicket
    | MultiOperatorGeoZoneTicket
    | PointToPointPeriodTicket
    | PeriodHybridTicket
    | CappedTicket;

export type TicketWithIds =
    | WithIds<SingleTicket>
    | WithIds<ReturnTicket>
    | WithIds<GeoZoneTicket>
    | WithIds<PeriodMultipleServicesTicket>
    | WithIds<FlatFareTicket>
    | WithIds<SchemeOperatorGeoZoneTicket>
    | WithIds<SchemeOperatorFlatFareTicket>
    | WithIds<SchemeOperatorMultiServiceTicket>
    | WithIds<MultiOperatorGeoZoneTicket>
    | WithIds<PointToPointPeriodTicket>
    | WithIds<PeriodHybridTicket>
    | WithIds<CappedTicket>;

export type GeoZoneTicket = PeriodGeoZoneTicket | MultiOperatorGeoZoneTicket;

export interface PeriodHybridTicket extends PeriodGeoZoneTicket, PeriodMultipleServicesTicket {}

export interface CappedGeoZoneTicket extends BaseTicket<'capped'> {
    cappedProductInfo: ByDistanceCapInfo | ByTapCapInfo | ByProductsCapInfo;
    type: 'capped';
    products: CappedProductDetails[];
    zoneName: string;
    stops: Stop[];
    operatorName: string;
}

export interface CappedMultipleServicesTicket extends Omit<BaseTicket<'capped'>, 'products'> {
    cappedProductInfo: ByDistanceCapInfo | ByTapCapInfo | ByProductsCapInfo;
    type: 'capped';
    products: CappedProductDetails[];
    selectedServices: SelectedService[];
    operatorName: string;
}
export interface CappedProductDetails extends BaseProduct {
    productName: string;
}

export interface ByDistanceCapInfo {
    capDetails: DistanceCap;
    additionalDiscount?: AdditionalPricing;
}

export interface ByTapCapInfo {
    tapDetails: MultiTap;
    capDetails: CapDetails;
    capExpiry: PeriodExpiry;
    capStart: CapStartInfo;
}

export interface ByProductsCapInfo {
    productGroup: { id: number };
    capDetails: CapDetails;
    capExpiry: PeriodExpiry;
    capStart: CapStartInfo;
}

export interface CapDetails {
    caps: Cap[];
    productName: string;
}

export type CappedTicket = CappedGeoZoneTicket | CappedMultipleServicesTicket;

export interface Cap {
    name: string;
    price: string;
    durationAmount: string;
    durationUnits: ExpiryUnit;
}

export interface AdditionalPricing {
    pricingStructureStart: string;
    structureDiscount: string;
}

export interface CapDistancePricing {
    distanceFrom: string;
    distanceTo: string;
    pricePerKm: string;
}

export interface DistanceCap {
    productName: string;
    maximumPrice: string;
    minimumPrice: string;
    capPricing: CapDistancePricing[];
}

export interface MultiTap {
    [tapNumber: string]: string;
}

export interface MultiTapPricing {
    tapDetails: MultiTap;
}

export type DayOfTheWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type CapStart = 'rollingDays' | 'fixedWeekdays';

export interface CapStartInfo {
    type: CapStart;
    startDay?: DayOfTheWeek;
}

export interface  SchemeOperatorGeoZoneTicket extends BaseSchemeOperatorTicket {
    zoneName: string;
    stops: Stop[];
    products: ProductDetails[];
    additionalNocs: string[];
}

export interface SchemeOperatorFlatFareTicket extends BaseSchemeOperatorTicket {
    type: 'flatFare';
    products: FlatFareProductDetails[];
    additionalOperators: {
        nocCode: string;
        selectedServices: SelectedService[];
    }[];
}

export interface SchemeOperatorMultiServiceTicket extends BaseSchemeOperatorTicket {
    type: 'period';
    products: ProductDetails[];
    additionalOperators: {
        nocCode: string;
        selectedServices: SelectedService[];
    }[];
}

export interface MultiOperatorGeoZoneTicket extends PeriodGeoZoneTicket {
    additionalNocs: string[];
}

export interface BaseTicket<T extends TicketType = TicketType> {
    nocCode: string;
    type: T;
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
    groupDefinition?: GroupDefinition;
    carnet?: boolean;
}

export type WithIds<T extends { products: BaseProduct[] }> = WithBaseIds<
    Omit<T, 'products'> & {
        products: (Omit<T['products'][0], 'salesOfferPackages'> & {
            salesOfferPackages: { id: number; price: string | undefined }[];
        })[];
    }
>;

export type WithBaseIds<T> = Omit<
    T,
    | 'passengerType'
    | 'ageRange'
    | 'ageRangeMin'
    | 'ageRangeMax'
    | 'proof'
    | 'proofDocuments'
    | 'timeRestriction'
    | 'fareDayEnd'
> & { passengerType: { id: number }; timeRestriction?: { id: number } };

export interface GroupDefinition {
    maxPeople: string;
    companions: CompanionInfo[];
}

export interface CompanionInfo {
    id: number;
    name?: string;
    passengerType: string;
    minNumber?: string;
    maxNumber: string;
    ageRangeMin?: string;
    ageRangeMax?: string;
    proofDocuments?: string[];
}

export interface DbTimeBand {
    startTime: string;
    endTime: string | { fareDayEnd: boolean };
}

export interface UnassignedStop {
    atcoCode: string;
}

export interface UnassignedStops {
    singleUnassignedStops?: UnassignedStop[];
    outboundUnassignedStops?: UnassignedStop[];
    inboundUnassignedStops?: UnassignedStop[];
}

export interface BaseSchemeOperatorTicket extends Omit<BaseTicket, 'nocCode'> {
    schemeOperatorName: string;
    schemeOperatorRegionCode: string;
}

export type SchemeOperatorTicket =
    | SchemeOperatorMultiServiceTicket
    | SchemeOperatorGeoZoneTicket
    | SchemeOperatorFlatFareTicket;

export interface BasePointToPointTicket extends BaseTicket {
    operatorName: string;
    lineName: string;
    lineId: string;
    serviceDescription: string;
    products: (BaseProduct | PointToPointCarnetProductDetails)[];
    unassignedStops: UnassignedStops;
}

export type PointToPointTicket = SingleTicket | ReturnTicket;

export interface SingleTicket extends BasePointToPointTicket {
    type: 'single';
    fareZones: FareZone[];
    termTime: boolean;
    journeyDirection: string;
}

export interface MatchingJsonMetaData {
    productId: string;
    serviceId?: string;
    matchingJsonLink: string;
}

export interface ReturnTicket extends BasePointToPointTicket {
    type: 'return';
    inboundFareZones: FareZone[];
    outboundFareZones: FareZone[];
    returnPeriodValidity?: ReturnPeriodValidity;
    additionalServices?: AdditionalService[];
}

export interface Product {
    productName: string;
    productPrice?: string;
    productDuration?: string;
    productValidity?: string;
    productDurationUnits?: string;
    productEndTime?: string;
    carnetDetails?: CarnetDetails;
}

export interface ProductDetails extends BaseProduct {
    productPrice: string;
    productDuration: string;
    productValidity: string;
    carnetDetails?: CarnetDetails;
}

export interface PointToPointPeriodTicket extends Omit<ReturnTicket, 'products' | 'type'> {
    type: 'period';
    products: (PointToPointPeriodProduct & Product & BaseProduct)[];
}

export type TimeRestrictionDay =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
    | 'bankHoliday';

export interface FullTimeRestriction {
    day: TimeRestrictionDay;
    timeBands: TimeBand[];
}

export interface TicketPeriod {
    startDate: string;
    endDate?: string;
}

export interface BaseProduct {
    productName: string;
    salesOfferPackages: SalesOfferPackage[];
}

export interface CarnetProductInfo {
    productName: string;
    carnetDetails: CarnetDetails;
}

export interface PointToPointPeriodProduct {
    productName: string;
    productDuration: string;
    productDurationUnits: ExpiryUnit;
}

export interface PeriodExpiry {
    productValidity: string;
    productEndTime?: string;
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

export interface CarnetDetails {
    quantity: string;
    expiryTime: string;
    expiryUnit: CarnetExpiryUnit;
}

export interface TimeBand {
    startTime: string;
    endTime: string;
}

export interface ReturnPeriodValidity {
    amount: string;
    typeOfDuration: string;
}

export enum CarnetExpiryUnit {
    HOUR = 'hour',
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
    NO_EXPIRY = 'no expiry',
}

export enum ExpiryUnit {
    HOUR = 'hour',
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
    TERM = 'term',
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
