import { PeriodTicket, PointToPointTicket, PeriodMultipleServicesTicket, FlatFareTicket, PeriodGeoZoneTicket } from '.';

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
