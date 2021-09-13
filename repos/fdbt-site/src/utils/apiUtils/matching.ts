import { NextApiRequest } from 'next';
import isArray from 'lodash/isArray';
import { Stop, UserFareStages } from '../../interfaces';
import { MatchingFareZones, MatchingFareZonesData } from '../../interfaces/matchingInterface';

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

    bodyValues.forEach((stopSelection: string) => {
        const stageName = stopSelection[0];

        if (isArray(stopSelection) && stageName === 'notApplicable') {
            unassignedStops.push(JSON.parse(stopSelection[1]));
        } else if (!isArray(stopSelection)) {
            const item = JSON.parse(stopSelection);
            if ('naptanCode' in item) {
                unassignedStops.push(item);
            }
        } else if (stageName && typeof stageName === 'string' && isArray(stopSelection)) {
            const stop = JSON.parse(stopSelection[1]);

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
