import { NextApiRequest } from 'next';
import { Stop, UserFareStages, RawJourneyPattern, StopPoint, NextPageContextWithSession } from '../../interfaces';
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

export const getMatchingFareZonesAndUnassignedStopsFromForm = (
    req: NextApiRequest,
): { matchingFareZones: MatchingFareZones; unassignedStops: Stop[] } => {
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

    return { matchingFareZones, unassignedStops };
};

export const isFareStageUnassigned = (userFareStages: UserFareStages, matchingFareZones: MatchingFareZones): boolean =>
    userFareStages.fareStages.some((stage) => !matchingFareZones[stage.stageName]);

export const sortingWithoutSequenceNumbers = (journeyPatterns: RawJourneyPattern[]): string[] => {
    const graph = journeyPatterns.flatMap((journeyPattern) =>
        journeyPattern.orderedStopPoints.flatMap<[string, string]>((stop, index, arr) =>
            arr[index - 1] ? [[arr[index - 1].stopPointRef, stop.stopPointRef]] : [],
        ),
    );

    console.log(graph);

    return toposort(graph);
};

const validateSequenceNumbers = (stops: StopPoint[]): stops is (StopPoint & { sequenceNumber: number })[] => {
    const sequenceToStop = new Map<number, StopPoint>();
    return (
        !stops.some((stop) => {
            if (!stop.sequenceNumber) {
                return true;
            }
            const stopA = sequenceToStop.get(stop.sequenceNumber);
            sequenceToStop.set(stop.sequenceNumber, stop);
            return stopA && stop.stopPointRef !== stopA.stopPointRef;
        }) &&
        !stops.some((stop, index) => stops.findIndex((stopA) => stop.stopPointRef === stopA.stopPointRef) === index)
    );
};

export const getMatchingProps = async (
    ctx: NextPageContextWithSession,
    matchingAttribute: MatchingWithErrors | object | undefined,
): Promise<{ props: MatchingProps }> => {
    const serviceAttribute = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE);
    const directionAttribute = getRequiredSessionAttribute(ctx.req, DIRECTION_ATTRIBUTE);
    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const nocCode = getAndValidateNoc(ctx);
    const csrfToken = getCsrfToken(ctx);

    if (!operatorAttribute?.uuid || !isService(serviceAttribute) || !('direction' in directionAttribute) || !nocCode) {
        logger.info('missing attributes', {});
        throw new Error('Necessary attributes not found to show matching page');
    }

    const lineName = serviceAttribute.service.split('#')[0];
    const dataSource = getRequiredSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE).source;
    const service = await getServiceByIdAndDataSource(nocCode, serviceAttribute.id, dataSource);
    const userFareStages = await getUserFareStages(operatorAttribute.uuid);

    const journeyPatterns = service.journeyPatterns.filter((it) => it.direction === directionAttribute.direction);
    const stops = journeyPatterns
        .flatMap((it) => it.orderedStopPoints)
        .filter((stop, index, self) => self.indexOf(stop) === index);

    const masterStopList = (
        validateSequenceNumbers(stops)
            ? stops.sort((stop) => stop.sequenceNumber).map((it) => it.stopPointRef)
            : sortingWithoutSequenceNumbers(journeyPatterns)
    ).filter((stop, index, self) => self.indexOf(stop) === index);

    if (masterStopList.length === 0) {
        throw new Error(
            `No stops found for journey: nocCode ${nocCode}, lineName: ${lineName}, direction: ${directionAttribute.direction}`,
        );
    }

    const naptanInfo = await batchGetStopsByAtcoCode(masterStopList);
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
        },
    };
};
