import { Stop } from '../types';

export interface NetexObject {
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const getScheduledStopPointsList = (stops: Stop[]): {}[] => stops.map((stop: Stop) => ({
    versionRef: 'EXTERNAL',
    ref: `naptStop:${stop.naptanCode}`,
    $t: `${stop.stopName}, ${stop.street}, ${stop.localityName}`
}));

export const getTopographicProjectionRefList = (stops: Stop[]): {}[] => stops.map((stop: Stop) => ({
    versionRef: 'nptg:EXTERNAL',
    ref: `nptgLocality:${stop.localityCode}`,
    $t: `${stop.street}, ${stop.localityName}, ${stop.parentLocalityName}`
}))