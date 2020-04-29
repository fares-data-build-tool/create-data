import { batchGetStopsByAtcoCode, JourneyPattern, RawJourneyPattern } from '../data/auroradb';

// eslint-disable-next-line import/prefer-default-export
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
