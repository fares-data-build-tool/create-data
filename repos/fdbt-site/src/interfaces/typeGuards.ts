import { FlatFareTicket, PeriodMultipleServicesTicket, Ticket } from 'shared/matchingJsonTypes';
import {
    CarnetProductInfo,
    ErrorInfo,
    FareStagesAttribute,
    FareStagesAttributeWithErrors,
    FareType,
    FareTypeWithErrors,
    GeoZoneTicket,
    InputCheck,
    InputMethodInfo,
    MultiOperatorInfo,
    MultiOperatorInfoWithErrors,
    MultipleOperatorsAttribute,
    MultipleOperatorsAttributeWithErrors,
    PassengerType,
    PassengerTypeWithErrors,
    PeriodExpiry,
    PeriodTicket,
    PointToPointTicket,
    ProductData,
    ProductInfo,
    ProductInfoWithErrors,
    ProductWithSalesOfferPackages,
    SalesOfferPackage,
    SelectSalesOfferPackageWithError,
    Service,
    ServiceWithErrors,
    TicketPeriodWithErrors,
    TicketPeriodWithInput,
    TicketRepresentationAttribute,
    TicketRepresentationAttributeWithErrors,
    WithErrors,
} from '.';
import { validFareTypes } from '../constants';

export const isNotEmpty = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;

export const isPeriodTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is PeriodTicket =>
    (ticket as PeriodTicket).products?.[0]?.productName !== undefined;

export const isMultipleServicesTicket = (ticket: Ticket): ticket is PeriodMultipleServicesTicket | FlatFareTicket =>
    (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

export const isPointToPointTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is PointToPointTicket =>
    (ticket as PointToPointTicket).lineName !== undefined;

export const isGeoZoneTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is GeoZoneTicket =>
    (ticket as GeoZoneTicket).zoneName !== undefined;

export const isFareTypeAttributeWithErrors = (
    fareTypeAttribute: FareType | FareTypeWithErrors,
): fareTypeAttribute is FareTypeWithErrors => (fareTypeAttribute as FareTypeWithErrors).errors !== undefined;

export const isFareType = (fareType: FareType | FareTypeWithErrors | undefined): fareType is FareType =>
    fareType !== undefined &&
    (fareType as FareType).fareType !== undefined &&
    validFareTypes.includes((fareType as FareType).fareType);

export const inputMethodErrorsExist = (
    inputMethodAttribute: InputMethodInfo | ErrorInfo | undefined,
): inputMethodAttribute is ErrorInfo => (inputMethodAttribute as ErrorInfo)?.errorMessage !== undefined;

export const isPassengerTypeAttributeWithErrors = (
    fareTypeAttribute: PassengerType | PassengerTypeWithErrors | undefined,
): fareTypeAttribute is PassengerTypeWithErrors => (fareTypeAttribute as PassengerTypeWithErrors).errors !== undefined;

export const isPassengerType = (
    passengerType: PassengerType | PassengerTypeWithErrors | undefined,
): passengerType is PassengerType => {
    return passengerType !== undefined && (passengerType as PassengerType).passengerType !== undefined;
};

export const isServiceAttributeWithErrors = (
    serviceAttribute: Service | ServiceWithErrors,
): serviceAttribute is ServiceWithErrors => (serviceAttribute as ServiceWithErrors).errors !== undefined;

export const isService = (service: Service | ServiceWithErrors | undefined): service is Service => {
    return service !== undefined && (service as Service).service !== undefined;
};

export const isTicketRepresentationWithErrors = (
    ticketType: TicketRepresentationAttribute | TicketRepresentationAttributeWithErrors | undefined,
): ticketType is TicketRepresentationAttributeWithErrors =>
    ticketType !== undefined && (ticketType as TicketRepresentationAttributeWithErrors).errors !== undefined;

export const isTicketRepresentation = (
    ticketType: TicketRepresentationAttribute | TicketRepresentationAttributeWithErrors | undefined,
): ticketType is TicketRepresentationAttribute =>
    ticketType !== undefined && (ticketType as TicketRepresentationAttribute).name !== undefined;

export const isInputCheck = (stageNamesInfo: string[] | InputCheck[] | undefined): stageNamesInfo is InputCheck[] =>
    stageNamesInfo !== undefined && (stageNamesInfo[0] as InputCheck).error !== undefined;

export const isFareStageWithErrors = (
    fareStages: FareStagesAttribute | FareStagesAttributeWithErrors | undefined,
): fareStages is FareStagesAttributeWithErrors =>
    fareStages !== undefined && (fareStages as FareStagesAttributeWithErrors).errors !== undefined;

export const isFareStage = (
    fareStages: FareStagesAttribute | FareStagesAttributeWithErrors | undefined,
): fareStages is FareStagesAttribute =>
    fareStages !== undefined && (fareStages as FareStagesAttribute).fareStages !== undefined;

export const isSalesOfferPackageWithErrors = (
    salesOfferPackageInfo:
        | SelectSalesOfferPackageWithError
        | SalesOfferPackage[]
        | ProductWithSalesOfferPackages[]
        | undefined,
): salesOfferPackageInfo is SelectSalesOfferPackageWithError =>
    salesOfferPackageInfo !== undefined &&
    (salesOfferPackageInfo as SelectSalesOfferPackageWithError).errors !== undefined;

export const isProductWithSalesOfferPackages = (
    salesOfferPackageInfo:
        | SelectSalesOfferPackageWithError
        | SalesOfferPackage[]
        | ProductWithSalesOfferPackages[]
        | undefined,
): salesOfferPackageInfo is ProductWithSalesOfferPackages[] =>
    salesOfferPackageInfo !== undefined &&
    (salesOfferPackageInfo as ProductWithSalesOfferPackages[])[0].productName !== undefined;

export const isSalesOfferPackages = (
    salesOfferPackageInfo:
        | SelectSalesOfferPackageWithError
        | SalesOfferPackage[]
        | ProductWithSalesOfferPackages[]
        | undefined,
): salesOfferPackageInfo is SalesOfferPackage[] =>
    salesOfferPackageInfo !== undefined &&
    (salesOfferPackageInfo as SalesOfferPackage[])[0].ticketFormats !== undefined;

export const isTicketPeriodAttributeWithErrors = (
    productDates: TicketPeriodWithInput | TicketPeriodWithErrors | undefined,
): productDates is TicketPeriodWithErrors =>
    productDates !== undefined && (productDates as TicketPeriodWithErrors).errors !== undefined;

export const isTicketPeriodAttributeWithInput = (
    productDates: TicketPeriodWithInput | TicketPeriodWithErrors | undefined,
): productDates is TicketPeriodWithInput =>
    productDates !== undefined &&
    (productDates as TicketPeriodWithInput).startDate !== undefined &&
    (productDates as TicketPeriodWithInput).endDate !== undefined;

export const isMultipleOperatorAttributeWithErrors = (
    searchOperator: MultipleOperatorsAttribute | MultipleOperatorsAttributeWithErrors | undefined,
): searchOperator is MultipleOperatorsAttributeWithErrors =>
    searchOperator !== undefined && (searchOperator as MultipleOperatorsAttributeWithErrors).errors !== undefined;

export const isMultiOperatorInfoWithErrors = (
    multiOperatorInfo: MultiOperatorInfo[] | MultiOperatorInfoWithErrors | undefined,
): multiOperatorInfo is MultiOperatorInfoWithErrors =>
    multiOperatorInfo !== undefined && (multiOperatorInfo as MultiOperatorInfoWithErrors).errors !== undefined;

export const isWithErrors = <T>(value: T): value is WithErrors<T> =>
    !!value && (value as WithErrors<T>).errors !== undefined && (value as WithErrors<T>).errors.length > 0;

export const isProductInfo = (
    productDetailsAttribute: ProductInfo | ProductData | CarnetProductInfo | ProductInfoWithErrors | undefined,
): productDetailsAttribute is ProductInfo => !!productDetailsAttribute && 'productName' in productDetailsAttribute;

export const isPeriodExpiry = (
    periodExpiryAttribute: PeriodExpiry | ErrorInfo[] | undefined,
): periodExpiryAttribute is PeriodExpiry => !!periodExpiryAttribute && 'productValidity' in periodExpiryAttribute;
