import { NextApiRequest, NextApiResponse } from 'next';
import { redirectTo, redirectToError, getUuidFromCookie } from './apiUtils';
import { UserData } from './csvUpload';
import { ServiceInfo } from '../matching';
import { NaptanInfo } from '../../data/dynamodb';
import { putStringInS3 } from '../../data/s3';
import { isCookiesUUIDMatch } from './service/validator';

interface MatchingData {
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    fareZones: {
        name: string;
        stops: NaptanInfo[];
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
}

interface MatchingFareZones {
    [key: string]: {
        name: string;
        stops: NaptanInfo[];
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
    serviceInfo: ServiceInfo,
    userData: UserData,
    matchingFareZones: MatchingFareZones,
): MatchingData => ({
    ...serviceInfo,
    fareZones: userData.fareStages
        .filter(userStage => matchingFareZones[userStage.stageName])
        .map(userStage => {
            const matchedZone = matchingFareZones[userStage.stageName];

            return {
                name: userStage.stageName,
                stops: matchedZone.stops.map((stop: NaptanInfo) => ({
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

        if (!req.body.serviceinfo || !req.body.userdata) {
            redirectTo(res, '/matching');
            return;
        }

        const serviceInfo: ServiceInfo = JSON.parse(req.body.serviceinfo);
        const userData: UserData = JSON.parse(req.body.userdata);

        delete req.body.serviceinfo;
        delete req.body.userdata;

        const matchingFareZones = getMatchingFareZonesFromForm(req);
        const matchingJson = getMatchingJson(serviceInfo, userData, matchingFareZones);

        const uuid = getUuidFromCookie(req);

        await putDataInS3(matchingJson, uuid);

        redirectTo(res, '/thankyou');
    } catch (error) {
        console.error(`There was a problem generating the matching JSON: ${error.stack}`);

        redirectToError(res);
    }
    res.end();
};
