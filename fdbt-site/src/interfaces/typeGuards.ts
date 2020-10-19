import {
    SingleTicketProps,
    ReturnTicketProps,
    PeriodTicketProps,
    FlatFareTicketProps,
} from '../pages/ticketConfirmation';
import { SelectSalesOfferPackageWithError } from '../pages/api/selectSalesOfferPackage';
import {
    PeriodTicket,
    PointToPointTicket,
    PeriodMultipleServicesTicket,
    FlatFareTicket,
    GeoZoneTicket,
    InputMethodInfo,
    ErrorInfo,
    Journey,
    JourneyWithErrors,
    TicketRepresentationAttribute,
    TicketRepresentationAttributeWithErrors,
    SalesOfferPackage,
    ProductWithSalesOfferPackages,
    TicketPeriod,
    MultiOperatorInfo,
    MultiOperatorInfoWithErrors,
} from './index';

import { FareType, FareTypeWithErrors } from '../pages/api/fareType';
import { PassengerType, PassengerTypeWithErrors } from '../pages/api/passengerType';
import { Service, ServiceWithErrors } from '../pages/api/service';
import { FareStagesAttribute, FareStagesAttributeWithErrors } from '../pages/api/chooseStages';
import { InputCheck } from '../pages/stageNames';
import { TicketPeriodWithErrors } from '../pages/api/productDateInformation';
import { MultipleOperatorsAttribute, MultipleOperatorsAttributeWithErrors } from '../pages/api/searchOperators';

export const isNotEmpty = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;

export const isPeriodTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is PeriodTicket =>
    (ticket as PeriodTicket).products?.[0]?.productName !== undefined;

export const isMultipleServicesTicket = (
    ticket: PeriodTicket | PointToPointTicket,
): ticket is PeriodMultipleServicesTicket | FlatFareTicket =>
    (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

export const isPointToPointTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is PointToPointTicket =>
    (ticket as PointToPointTicket).lineName !== undefined;

export const isGeoZoneTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is GeoZoneTicket =>
    (ticket as GeoZoneTicket).zoneName !== undefined;

export const isFareTypeAttributeWithErrors = (
    fareTypeAttribute: FareType | FareTypeWithErrors,
): fareTypeAttribute is FareTypeWithErrors => (fareTypeAttribute as FareTypeWithErrors).errors !== undefined;

export const isFareType = (fareType: FareType | FareTypeWithErrors | undefined): fareType is FareType => {
    return fareType !== undefined && (fareType as FareType).fareType !== undefined;
};

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

export const isJourneyAttributeWithErrors = (
    journeyAttribute: Journey | JourneyWithErrors,
): journeyAttribute is JourneyWithErrors => (journeyAttribute as JourneyWithErrors).errors !== undefined;

export const isJourney = (journey: Journey | JourneyWithErrors | undefined): journey is Journey => {
    return (
        journey !== undefined &&
        ((journey as Journey).directionJourneyPattern !== undefined ||
            (journey as Journey).inboundJourney !== undefined ||
            (journey as Journey).outboundJourney !== undefined ||
            (journey as Journey).errors !== undefined)
    );
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

export const isSingleTicketProps = (
    props: SingleTicketProps | ReturnTicketProps | PeriodTicketProps | FlatFareTicketProps,
): props is SingleTicketProps => (props as SingleTicketProps).journeyDirection !== undefined;

export const isReturnTicketProps = (
    props: SingleTicketProps | ReturnTicketProps | PeriodTicketProps | FlatFareTicketProps,
): props is ReturnTicketProps => (props as ReturnTicketProps).circular !== undefined;

export const isPeriodTicketProps = (
    props: SingleTicketProps | ReturnTicketProps | PeriodTicketProps | FlatFareTicketProps,
): props is PeriodTicketProps => (props as PeriodTicketProps).zone !== undefined;

export const isFlatFareTicketProps = (
    props: SingleTicketProps | ReturnTicketProps | PeriodTicketProps | FlatFareTicketProps,
): props is FlatFareTicketProps => (props as FlatFareTicketProps).productName !== undefined;

export const isTicketPeriodAttributeWithErrors = (
    productDates: TicketPeriod | TicketPeriodWithErrors | undefined,
): productDates is TicketPeriodWithErrors =>
    productDates !== undefined && (productDates as TicketPeriodWithErrors).errors !== undefined;

export const isTicketPeriodAttribute = (
    productDates: TicketPeriod | TicketPeriodWithErrors | undefined,
): productDates is TicketPeriod =>
    productDates !== undefined &&
    (productDates as TicketPeriod).startDate !== undefined &&
    (productDates as TicketPeriod).endDate !== undefined;

export const isMultipleOperatorAttributeWithErrors = (
    searchOperator: MultipleOperatorsAttribute | MultipleOperatorsAttributeWithErrors | undefined,
): searchOperator is MultipleOperatorsAttributeWithErrors =>
    searchOperator !== undefined && (searchOperator as MultipleOperatorsAttributeWithErrors).errors !== undefined;

export const isMultiOperatorInfoWithErrors = (
    multiOperatorInfo: MultiOperatorInfo[] | MultiOperatorInfoWithErrors | undefined,
): multiOperatorInfo is MultiOperatorInfoWithErrors =>
    multiOperatorInfo !== undefined && (multiOperatorInfo as MultiOperatorInfoWithErrors).errors !== undefined;
