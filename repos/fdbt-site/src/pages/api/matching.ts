import { NextApiRequest, NextApiResponse } from 'next';
import { redirectTo, redirectToError, getUuidFromCookie } from './apiUtils';
import { UserFareStages } from './csvUpload';
import { BasicService } from '../matching';
import { Stop } from '../../data/dynamodb';
import { putStringInS3 } from '../../data/s3';
import { isCookiesUUIDMatch } from './service/validator';

interface MatchingData {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    fareZones: {
        name: string;
        stops: Stop[];
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
}

interface MatchingFareZones {
    [key: string]: {
        name: string;
        stops: Stop[];
    };
}

export const putDataInS3 = async (data: MatchingData, uuid: string): Promise<void> => {
    if (!process.env.MATCHING_DATA_BUCKET_NAME) {
        throw new Error('Bucket name environment variable not set.');
    }

    await putStringInS3(
        process.env.MATCHING_DATA_BUCKET_NAME,
        `${uuid}_${data.lineName}_${data.nocCode}.json`,
        JSON.stringify(data),
        'application/json; charset=utf-8',
    );
};

const getMatchingFareZonesFromForm = (req: NextApiRequest): MatchingFareZones => {
    const matchingFareZones: MatchingFareZones = {};
    const bodyValues: string[] = Object.values(req.body);

    bodyValues.forEach((zoneString: string) => {
        if (zoneString && typeof zoneString === 'string') {
            const zone = JSON.parse(zoneString);

            if (matchingFareZones[zone.stage]) {
                matchingFareZones[zone.stage].stops.push(zone.stop);
            } else {
                matchingFareZones[zone.stage] = {
                    name: zone.stage,
                    stops: [zone.stop],
                };
            }
        }
    });

    if (Object.keys(matchingFareZones).length === 0) {
        throw new Error('No Stops allocated to fare stages');
    }

    return matchingFareZones;
};

const getMatchingJson = (
    service: BasicService,
    userFareStages: UserFareStages,
    matchingFareZones: MatchingFareZones,
): MatchingData => ({
    ...service,
    fareZones: userFareStages.fareStages
        .filter(userStage => matchingFareZones[userStage.stageName])
        .map(userStage => {
            const matchedZone = matchingFareZones[userStage.stageName];

            return {
                name: userStage.stageName,
                stops: matchedZone.stops.map((stop: Stop) => ({
                    ...stop,
                    qualifierName: '',
                })),
                prices: userStage.prices,
            };
        }),
});

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!isCookiesUUIDMatch(req)) {
            throw new Error('Cookie UUIDs do not match');
        }

        if (!req.body.service || !req.body.userfarestages) {
            throw new Error('No service or userfarestages info found');
        }

        const serviceData: BasicService = JSON.parse(req.body.service);
        const userFareStages: UserFareStages = JSON.parse(req.body.userfarestages);

        // Deleting these keys from the object in order to faciliate looping through the fare stage values in the body
        delete req.body.service;
        delete req.body.userfarestages;

        const matchingFareZones = getMatchingFareZonesFromForm(req);
        const matchingJson = getMatchingJson(serviceData, userFareStages, matchingFareZones);

        const uuid = getUuidFromCookie(req);

        await putDataInS3(matchingJson, uuid);

        redirectTo(res, '/thankyou');
    } catch (error) {
        console.error(`There was a problem generating the matching JSON: ${error.stack}`);
        redirectToError(res);
    }
    res.end();
};
