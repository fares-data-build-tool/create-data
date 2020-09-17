import { SelectSalesOfferPackageWithError } from '../pages/api/selectSalesOfferPackage';
import {
    PeriodTicket,
    PointToPointTicket,
    PeriodMultipleServicesTicket,
    FlatFareTicket,
    PeriodGeoZoneTicket,
    InputMethodInfo,
    ErrorInfo,
    Journey,
    JourneyWithErrors,
    PeriodTypeAttribute,
    PeriodTypeAttributeWithErrors,
    SalesOfferPackage,
    ProductWithSalesOfferPackages,
} from './index';

import { FareType, FareTypeWithErrors } from '../pages/api/fareType';
import { PassengerType, PassengerTypeWithErrors } from '../pages/api/passengerType';
import { Service, ServiceWithErrors } from '../pages/api/service';
import { FareStagesAttribute, FareStagesAttributeWithErrors } from '../pages/api/chooseStages';
import { InputCheck } from '../pages/stageNames';

export const isNotEmpty = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;

export const isPeriodTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is PeriodTicket =>
    (ticket as PeriodTicket).products?.[0]?.productName !== undefined;

export const isMultipleServicesTicket = (
    ticket: PeriodTicket | PointToPointTicket,
): ticket is PeriodMultipleServicesTicket | FlatFareTicket =>
    (ticket as PeriodMultipleServicesTicket).selectedServices !== undefined;

export const isPointToPointTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is PointToPointTicket =>
    (ticket as PointToPointTicket).lineName !== undefined;

export const isGeoZoneTicket = (ticket: PeriodTicket | PointToPointTicket): ticket is PeriodGeoZoneTicket =>
    (ticket as PeriodGeoZoneTicket).zoneName !== undefined;

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

export const isPeriodTypeWithErrors = (
    periodType: PeriodTypeAttribute | PeriodTypeAttributeWithErrors | undefined,
): periodType is PeriodTypeAttributeWithErrors =>
    periodType !== undefined && (periodType as PeriodTypeAttributeWithErrors).errors !== undefined;

export const isPeriodType = (
    periodType: PeriodTypeAttribute | PeriodTypeAttributeWithErrors | undefined,
): periodType is PeriodTypeAttribute =>
    periodType !== undefined && (periodType as PeriodTypeAttribute).name !== undefined;

export const isInputCheck = (stageNamesInfo: string[] | InputCheck[] | undefined): stageNamesInfo is InputCheck[] =>
    stageNamesInfo !== undefined && (stageNamesInfo[0] as InputCheck).error !== undefined;

export const isFareStageWithErrors = (
    periodType: FareStagesAttribute | FareStagesAttributeWithErrors | undefined,
): periodType is FareStagesAttributeWithErrors =>
    periodType !== undefined && (periodType as FareStagesAttributeWithErrors).errors !== undefined;

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
