export interface PointToPointCarnetProductDetails extends BaseProduct {
  productName: string;
  carnetDetails: CarnetDetails;
}

export type FlatFareGeoZone = Omit<PeriodGeoZoneTicket, "products"> & {
  type: "flatFare";
  products: FlatFareProductDetails[];
};

export interface PeriodGeoZoneTicket extends BasePeriodTicket {
  zoneName: string;
  stops: Stop[];
}

export interface BasePeriodTicket extends BaseTicket {
  operatorName: string;
  products: ProductDetails[];
}

export interface SelectedService {
  lineName: string;
  lineId: string;
  serviceCode: string;
  startDate: string;
  serviceDescription: string;
}

export interface PeriodMultipleServicesTicket extends BasePeriodTicket {
  selectedServices: SelectedService[];
  termTime: boolean;
}

export interface FlatFareProductDetails extends BaseProduct {
  productName: string;
  productPrice: string;
  carnetDetails?: CarnetDetails;
}

export type FlatFareMultipleServices = Omit<
  PeriodMultipleServicesTicket,
  "products"
> & {
  type: "flatFare";
  products: FlatFareProductDetails[];
  termTime: boolean;
};

export type FlatFareTicket = FlatFareGeoZone | FlatFareMultipleServices;

export interface SalesOfferPackage {
  id?: string;
  name: string;
  description: string;
  purchaseLocations: string[];
  paymentMethods: string[];
  ticketFormats: string[];
  price?: string;
}

export type TicketType =
  | "flatFare"
  | "period"
  | "multiOperator"
  | "schoolService"
  | "single"
  | "return";

export interface BaseTicket {
  nocCode: string;
  type: TicketType;
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

export interface SchemeOperatorTicket extends Omit<BaseTicket, "nocCode"> {
  schemeOperatorName: string;
  schemeOperatorRegionCode: string;
}

export interface BasePointToPointTicket extends BaseTicket {
  operatorName: string;
  lineName: string;
  lineId: string;
  serviceDescription: string;
  products: (BaseProduct | PointToPointCarnetProductDetails)[];
}

export type PointToPointTicket = SingleTicket | ReturnTicket;

export interface SingleTicket extends BasePointToPointTicket {
  type: "single";
  fareZones: FareZone[];
  termTime: boolean;
}

export interface ReturnTicket extends BasePointToPointTicket {
  type: "return";
  inboundFareZones: FareZone[];
  outboundFareZones: FareZone[];
  returnPeriodValidity?: ReturnPeriodValidity;
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
export interface ProductDetails extends Product, BaseProduct {}

export interface PointToPointPeriodTicket
  extends Omit<ReturnTicket, "products" | "type">,
    BaseTicket {
  type: "period";
  products: (PointToPointPeriodProduct & ProductDetails)[];
}

export type TimeRestrictionDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
  | "bankHoliday";

export interface FullTimeRestriction {
  day: TimeRestrictionDay;
  timeBands: TimeBand[];
}

export interface TicketPeriod {
  startDate?: string;
  endDate?: string;
}

export interface BaseProduct {
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
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  NO_EXPIRY = "no expiry",
}

export enum ExpiryUnit {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
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
