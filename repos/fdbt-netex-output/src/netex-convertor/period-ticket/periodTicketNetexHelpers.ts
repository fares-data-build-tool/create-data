import {
    Stop,
    OperatorData,
    PeriodGeoZoneTicket,
    PeriodMultipleServicesTicket,
    ScheduledStopPoint,
    TopographicProjectionRef,
    Line,
    LineRef
} from '../types';
import { NetexObject, getCleanWebsite } from '../sharedHelpers';

export const getScheduledStopPointsList = (stops: Stop[]): ScheduledStopPoint[] =>
    stops.map((stop: Stop) => ({
        versionRef: 'EXTERNAL',
        ref: `naptStop:${stop.naptanCode}`,
        $t: `${stop.stopName}, ${stop.street}, ${stop.localityName}`,
    }));

export const getTopographicProjectionRefList = (stops: Stop[]): TopographicProjectionRef[] =>
    stops.map((stop: Stop) => ({
        versionRef: 'nptg:EXTERNAL',
        ref: `nptgLocality:${stop.localityCode}`,
        $t: `${stop.street}, ${stop.localityName}, ${stop.parentLocalityName}`,
    }));

export const getLinesList = (userPeriodTicket: PeriodMultipleServicesTicket, operatorData: OperatorData): Line[] =>
    userPeriodTicket.selectedServices
        ? userPeriodTicket.selectedServices.map(service => ({
            version: '1.0',
            id: `op:${service.lineName}`,
            Name: { $t: `Line ${service.lineName}` },
            Description: { $t: service.serviceDescription },
            Url: { $t: getCleanWebsite(operatorData.website) },
            PublicCode: { $t: service.lineName },
            PrivateCode: { type: 'noc', $t: `${userPeriodTicket.nocCode}_${service.lineName}` },
            OperatorRef: { version: '1.0', ref: `noc:${userPeriodTicket.nocCode}` },
            LineType: { $t: 'local' },
        }))
        : [];

export const getLineRefList = (userPeriodTicket: PeriodMultipleServicesTicket): LineRef[] =>
    userPeriodTicket.selectedServices
        ? userPeriodTicket.selectedServices.map(service => ({
            version: '1.0',
            ref: `op:${service.lineName}`,
        }))
        : [];

export const getGeoZoneFareTable = (userPeriodTicket: PeriodGeoZoneTicket, fareTable: NetexObject): NetexObject => {
    const fareTableToUpdate = fareTable;

    fareTableToUpdate.id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}`;
    fareTableToUpdate.Name.$t = userPeriodTicket.zoneName;
    fareTableToUpdate.specifics.TariffZoneRef.ref = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}`;
    fareTableToUpdate.columns.FareTableColumn.id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket`;
    fareTableToUpdate.columns.FareTableColumn.Name.$t = userPeriodTicket.zoneName;
    fareTableToUpdate.columns.FareTableColumn.representing.TariffZoneRef.ref = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}`;
    fareTableToUpdate.includes.FareTable.id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket`;
    fareTableToUpdate.includes.FareTable.Name.$t = `${userPeriodTicket.productName} - Cash`;
    fareTableToUpdate.includes.FareTable.pricesFor.SalesOfferPackageRef.ref = `op:Pass@${userPeriodTicket.productName}-SOP@p-ticket`;
    fareTableToUpdate.includes.FareTable.columns.FareTableColumn.id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.Name.$t = `${userPeriodTicket.productName} - Cash - Adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.columns.FareTableColumn.id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult@1day`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].TimeIntervalPrice.id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult@1day`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].TimeIntervalPrice.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1day`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].ColumnRef.ref = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].RowRef.ref = `op:${userPeriodTicket.productName}@1day`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult@1week`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].TimeIntervalPrice.id = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult@1week`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].TimeIntervalPrice.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1week`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].RowRef.ref = `op:${userPeriodTicket.productName}@1week`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].ColumnRef.ref = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].ColumnRef.ref = `op:${userPeriodTicket.productName}@${userPeriodTicket.zoneName}@p-ticket@adult`;

    return fareTableToUpdate;
};

export const getMultiServiceFareTable = (
    userPeriodTicket: PeriodMultipleServicesTicket,
    fareTable: NetexObject,
): NetexObject => {
    const fareTableToUpdate = fareTable;
    const name = `${userPeriodTicket.nocCode}-multi-service`;

    fareTableToUpdate.id = `op:${userPeriodTicket.productName}@${name}`;
    fareTableToUpdate.Name.$t = name;
    fareTableToUpdate.specifics = null;
    fareTableToUpdate.columns.FareTableColumn.id = `op:${userPeriodTicket.productName}@${name}@p-ticket`;
    fareTableToUpdate.columns.FareTableColumn.Name.$t = name;
    fareTableToUpdate.columns.FareTableColumn.representing = null;
    fareTableToUpdate.includes.FareTable.id = `op:${userPeriodTicket.productName}@${name}@p-ticket`;
    fareTableToUpdate.includes.FareTable.Name.$t = `${userPeriodTicket.productName} - Cash`;
    fareTableToUpdate.includes.FareTable.pricesFor.SalesOfferPackageRef.ref = `op:Pass@${userPeriodTicket.productName}-SOP@p-ticket`;
    fareTableToUpdate.includes.FareTable.columns.FareTableColumn.id = `op:${userPeriodTicket.productName}@${name}@p-ticket`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.id = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.Name.$t = `${userPeriodTicket.productName} - Cash - Adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.columns.FareTableColumn.id = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].id = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult@1day`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].TimeIntervalPrice.id = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult@1day`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].TimeIntervalPrice.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1day`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].ColumnRef.ref = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[0].RowRef.ref = `op:${userPeriodTicket.productName}@1day`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].id = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult@1week`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].TimeIntervalPrice.id = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult@1week`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].TimeIntervalPrice.TimeIntervalRef.ref = `op:Tariff@${userPeriodTicket.productName}@1week`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].RowRef.ref = `op:${userPeriodTicket.productName}@1week`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].ColumnRef.ref = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult`;
    fareTableToUpdate.includes.FareTable.includes.FareTable.cells.Cell[1].ColumnRef.ref = `op:${userPeriodTicket.productName}@${name}@p-ticket@adult`;

    return fareTableToUpdate;
};
