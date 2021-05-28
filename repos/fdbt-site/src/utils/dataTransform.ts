import { Stop, StopPoint, JourneyPattern, RawJourneyPattern, RawService } from '../interfaces';
import { batchGetStopsByAtcoCode } from '../data/auroradb';

export const formatStopPoint = (stop: Stop, stopPoint: StopPoint): string =>
    stop?.localityName ? `${stop.localityName} (${stopPoint.commonName})` : `${stopPoint.commonName}`;

export const enrichJourneyPatternsWithNaptanInfo = async (
    journeyPatterns: RawJourneyPattern[],
): Promise<JourneyPattern[]> =>
    Promise.all(
        journeyPatterns.map(
            async (item: RawJourneyPattern): Promise<JourneyPattern> => {
                const stopList = item.orderedStopPoints.flatMap((stopPoint: StopPoint) => stopPoint.stopPointRef);

                const startPoint: StopPoint = item.orderedStopPoints[0];
                const [startPointStop] = await batchGetStopsByAtcoCode([startPoint.stopPointRef]);

                const endPoint: StopPoint = item.orderedStopPoints.slice(-1)[0];
                const [endPointStop] = await batchGetStopsByAtcoCode([endPoint.stopPointRef]);

                return {
                    startPoint: {
                        Display: formatStopPoint(startPointStop, startPoint),
                        Id: startPoint.stopPointRef,
                    },
                    endPoint: {
                        Display: formatStopPoint(endPointStop, endPoint),
                        Id: endPoint.stopPointRef,
                    },
                    stopList,
                };
            },
        ),
    );

// Gets a list of journey pattern sections with a given start and end point
export const getJourneysByStartAndEndPoint = (
    service: RawService,
    selectedStartPoint: string,
    selectedEndPoint: string,
): RawJourneyPattern[] =>
    service.journeyPatterns.filter(
        item =>
            item.orderedStopPoints[0].stopPointRef === selectedStartPoint &&
            item.orderedStopPoints.slice(-1)[0].stopPointRef === selectedEndPoint,
    );

// Gets a unique set of stop point refs from an array of journey pattern sections
export const getMasterStopList = (journeys: RawJourneyPattern[]): string[] => {
    const sortedJourneys = journeys.sort((a, b) => {
        return b.orderedStopPoints.length - a.orderedStopPoints.length;
    });

    return [...new Set(sortedJourneys.flatMap(journey => journey.orderedStopPoints.map(item => item.stopPointRef)))];
};
