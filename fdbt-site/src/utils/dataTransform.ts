import { batchGetStopsByAtcoCode, JourneyPattern, RawJourneyPattern, RawService } from '../data/auroradb';

export const enrichJourneyPatternsWithNaptanInfo = async (
    journeyPatterns: RawJourneyPattern[],
): Promise<JourneyPattern[]> =>
    Promise.all(
        journeyPatterns.map(
            async (item: RawJourneyPattern): Promise<JourneyPattern> => {
                const stopList = item.orderedStopPoints.flatMap(stopPoint => stopPoint.stopPointRef);

                const startPoint = item.orderedStopPoints[0];
                const [startPointStopLocality] = await batchGetStopsByAtcoCode([startPoint.stopPointRef]);

                const endPoint = item.orderedStopPoints.slice(-1)[0];
                const [endPointStopLocality] = await batchGetStopsByAtcoCode([endPoint.stopPointRef]);

                return {
                    startPoint: {
                        Display: `${startPoint.commonName}${
                            startPointStopLocality?.localityName ? `, ${startPointStopLocality.localityName}` : ''
                        }`,
                        Id: startPoint.stopPointRef,
                    },
                    endPoint: {
                        Display: `${endPoint.commonName}${
                            endPointStopLocality?.localityName ? `, ${endPointStopLocality.localityName}` : ''
                        }`,
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
