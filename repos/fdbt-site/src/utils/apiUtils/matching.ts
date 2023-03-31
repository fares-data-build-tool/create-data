import { NextApiRequest } from 'next';
import { UserFareStages, NextPageContextWithSession } from '../../interfaces';
import { MatchingFareZones, MatchingFareZonesData, MatchingWithErrors } from '../../interfaces/matchingInterface';
import toposort from 'toposort';
import { MatchingProps } from '../../pages/matching';
import { getSessionAttribute, getRequiredSessionAttribute } from '../sessions';
import {
    SERVICE_ATTRIBUTE,
    DIRECTION_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../../constants/attributes';
import { getAndValidateNoc, getCsrfToken } from '../index';
import { isService } from '../../interfaces/typeGuards';
import logger from '../logger';
import { getServiceByIdAndDataSource, batchGetStopsByAtcoCode } from '../../data/auroradb';
import { getUserFareStages } from '../../data/s3';
import { RawJourneyPattern, StopPoint } from '../../interfaces/dbTypes';
import { FareZone, Stop, UnassignedStop } from '../../interfaces/matchingJsonTypes';

export const getFareZones = (
    userFareStages: UserFareStages,
    matchingFareZones: MatchingFareZones,
): MatchingFareZonesData[] => {
    return userFareStages.fareStages
        .filter((userStage) => matchingFareZones[userStage.stageName])
        .map((userStage) => {
            const matchedZone = matchingFareZones[userStage.stageName];

            return {
                name: userStage.stageName,
                stops: matchedZone.stops.map((stop: Stop) => ({
                    ...stop,
                    qualifierName: '',
                })),
                prices: userStage.prices,
            };
        });
};

export const getFareZonesEditTicket = (
    fareStages: string[],
    matchingFareZones: MatchingFareZones,
    fareZones: FareZone[],
): MatchingFareZonesData[] => {
    return fareStages
        .filter((userStage) => matchingFareZones[userStage])
        .map((userStage) => {
            const matchedZone = matchingFareZones[userStage];

            const filteredFareZones = fareZones.filter((fareZone) => fareZone.name === userStage);

            return {
                name: userStage,
                stops: matchedZone.stops.map((stop: Stop) => ({
                    ...stop,
                    qualifierName: '',
                })),
                prices: filteredFareZones.length > 0 ? filteredFareZones[0].prices : [],
            };
        });
};

export const getMatchingFareZonesAndUnassignedStopsFromForm = (
    req: NextApiRequest,
): { matchingFareZones: MatchingFareZones; unassignedStops: UnassignedStop[] } => {
    const matchingFareZones: MatchingFareZones = {};
    const bodyValues: string[] = Object.values(req.body);
    const unassignedStops: Stop[] = [];

    bodyValues.forEach((stopSelection: string | string[]) => {
        if (stopSelection === 'yes') {
            // skip the 'yes' value
        } else if (Array.isArray(stopSelection) && stopSelection[0] === 'notApplicable') {
            unassignedStops.push(JSON.parse(stopSelection[1]));
        } else if (!Array.isArray(stopSelection)) {
            const item = JSON.parse(stopSelection);
            if ('stopName' in item) {
                unassignedStops.push(item);
            }
        } else if (Array.isArray(stopSelection) && stopSelection[0]) {
            const stop = JSON.parse(stopSelection[1]);

            const stageName = stopSelection[0];

            if (matchingFareZones[stageName]) {
                matchingFareZones[stageName].stops.push(stop);
            } else {
                matchingFareZones[stageName] = {
                    name: stageName,
                    stops: [stop],
                    prices: [],
                };
            }
        }
    });

    return {
        matchingFareZones,
        unassignedStops: unassignedStops.map((stop) => ({
            atcoCode: stop.atcoCode,
        })),
    };
};

export const isFareStageUnassigned = (userFareStages: UserFareStages, matchingFareZones: MatchingFareZones): boolean =>
    userFareStages.fareStages.some((stage) => !matchingFareZones[stage.stageName]);

export const isAnyFareStageUnassigned = (fareStages: string[], matchingFareZones: MatchingFareZones): boolean =>
    fareStages.some((stage) => !matchingFareZones[stage]);

export const fareStageIsUnused = (userFareStageNames: string[], uploadedFareStages: UserFareStages): boolean => {
    let fareStageIsUnused = false;

    uploadedFareStages.fareStages.forEach((uploadedFareStage) => {
        if (!userFareStageNames.find((stageName) => uploadedFareStage.stageName === stageName)) {
            fareStageIsUnused = true;
        }
    });

    return fareStageIsUnused;
};

export const sortingWithoutSequenceNumbers = (journeyPatterns: RawJourneyPattern[]): string[] => {
    try {
        const graph = journeyPatterns.flatMap((journeyPattern) =>
            journeyPattern.orderedStopPoints.flatMap<[string, string]>((stop, index, arr) =>
                arr[index - 1] && arr[index].stopPointRef !== arr[index - 1].stopPointRef
                    ? [[arr[index - 1].stopPointRef, stop.stopPointRef]]
                    : [],
            ),
        );

        return toposort(graph);
    } catch (error) {
        logger.warn('failed to toposort, attempting fallback sort', {
            error: error.stack,
            journeyPatterns: journeyPatterns,
        });

        const orderedStopPoints = journeyPatterns.flatMap((x) => x.orderedStopPoints);

        const stopsAndPossibleSequenceNumbers = orderedStopPoints.map((x) => ({
            stopPointRef: x.stopPointRef,
            sequenceNumber: x.sequenceNumber,
        }));

        const stopsWithSequenceNumbers = stopsAndPossibleSequenceNumbers.filter(
            (x) => x.sequenceNumber !== undefined,
        ) as { stopPointRef: string; sequenceNumber: number }[];

        const stopRefs = new Set();

        const stopsWithSequenceNumbersWithDuplicateStopRefsRemoved = stopsWithSequenceNumbers.filter((x) => {
            if (stopRefs.has(x.stopPointRef)) {
                return false;
            } else {
                stopRefs.add(x.stopPointRef);

                return true;
            }
        });

        const sortedStopsBySequenceNumbers = stopsWithSequenceNumbersWithDuplicateStopRefsRemoved.sort((a, b) => {
            return a.sequenceNumber - b.sequenceNumber;
        });

        return sortedStopsBySequenceNumbers.map((x) => x.stopPointRef);
    }
};

export const validateSequenceNumbers = (stops: StopPoint[]): stops is (StopPoint & { sequenceNumber: number })[] => {
    const sequenceToStop = new Map<number, StopPoint>();
    return !stops.some((stop) => {
        if (stop.sequenceNumber === undefined) {
            return true;
        }
        const stopA = sequenceToStop.get(stop.sequenceNumber);

        sequenceToStop.set(stop.sequenceNumber, stop);

        return stopA && stop.stopPointRef !== stopA.stopPointRef;
    });
};

export const removeDuplicateAdjacentStops = (stops: string[]): string[] => {
    return stops.reduce<string[]>((newStops, stop, index, stops) => {
        if (stop !== stops[index - 1]) {
            newStops.push(stop);
        }
        return newStops;
    }, []);
};

export const getMatchingProps = async (
    ctx: NextPageContextWithSession,
    matchingAttribute: MatchingWithErrors | object | undefined,
    isInbound?: boolean,
): Promise<{ props: MatchingProps }> => {
    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);
    const directionAttribute = getRequiredSessionAttribute(ctx.req, DIRECTION_ATTRIBUTE);
    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const nocCode = getAndValidateNoc(ctx);
    const csrfToken = getCsrfToken(ctx);

    if (!operatorAttribute?.uuid || !isService(serviceAttribute) || !('direction' in directionAttribute) || !nocCode) {
        logger.info('missing attributes', { operatorAttribute, serviceAttribute, directionAttribute, nocCode });
        throw new Error('Necessary attributes not found to show matching page');
    }

    const lineName = serviceAttribute.service.split('#')[0];
    const dataSource = getRequiredSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE).source;
    const service = await getServiceByIdAndDataSource(nocCode, serviceAttribute.id, dataSource);
    const userFareStages = await getUserFareStages(operatorAttribute.uuid);

    const direction = isInbound ? directionAttribute.inboundDirection : directionAttribute.direction;
    // find journey patterns for direction (inbound or outbound)
    const journeyPatterns = service.journeyPatterns.filter((it) => it.direction === direction);

    // get an unordered list of stop points from journey patterns, then removing any duplicates on stopPointRef and sequence number
    const stops = journeyPatterns
        .flatMap((it) => it.orderedStopPoints)
        .filter(
            (stop, index, self) =>
                self.findIndex(
                    (other) => stop.stopPointRef === other.stopPointRef && stop.sequenceNumber === other.sequenceNumber,
                ) === index,
        );

    // building a sorted master stop list according to sequence numbers if they're there and valid
    const sortedStopList = validateSequenceNumbers(stops)
        ? stops.sort((stop, other) => stop.sequenceNumber - other.sequenceNumber).map((it) => it.stopPointRef)
        : sortingWithoutSequenceNumbers(journeyPatterns);

    const masterStopList = removeDuplicateAdjacentStops(sortedStopList);

    if (masterStopList.length === 0) {
        throw new Error(
            `No stops found for journey: nocCode ${nocCode}, lineName: ${lineName}, direction: ${directionAttribute.direction}`,
        );
    }

    // filling out stop information from DB
    const naptanInfo = await batchGetStopsByAtcoCode(
        masterStopList.filter((stop, index, self) => self.indexOf(stop) === index),
        ctx.req,
    );

    // removing any stops that aren't fully fleshed out
    const orderedStops = masterStopList
        .map((atco) => naptanInfo.find((s) => s.atcoCode === atco))
        .filter((stop: Stop | undefined): stop is Stop => stop !== undefined);

    return {
        props: {
            stops: orderedStops,
            userFareStages,
            service: {
                lineName,
                nocCode,
                operatorShortName: service.operatorShortName,
                serviceDescription: service.serviceDescription,
                lineId: service.lineId,
            },
            error:
                matchingAttribute && 'error' in matchingAttribute && matchingAttribute.error
                    ? matchingAttribute.error
                    : '',
            warning: (matchingAttribute && 'warning' in matchingAttribute && matchingAttribute.warning) ?? false,
            selectedFareStages:
                matchingAttribute && ('error' in matchingAttribute || 'warning' in matchingAttribute)
                    ? matchingAttribute.selectedFareStages
                    : [],
            csrfToken,
            dataSource,
        },
    };
};
