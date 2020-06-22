import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    redirectTo,
    redirectToError,
    getUuidFromCookie,
    setCookieOnResponseObject,
    unescapeAndDecodeCookie,
} from './apiUtils';
import { BasicService, PassengerDetails } from '../../interfaces';
import { Stop } from '../../data/auroradb';
import { getOutboundMatchingFareStages, putStringInS3, UserFareStages } from '../../data/s3';
import { isCookiesUUIDMatch, isSessionValid } from './service/validator';
import { MATCHING_DATA_BUCKET_NAME, MATCHING_COOKIE, PASSENGER_TYPE_COOKIE } from '../../constants';
import getFareZones from './apiUtils/matching';
import { Price } from '../../interfaces/matchingInterface';

interface FareZones {
    name: string;
    stops: Stop[];
    prices: {
        price: string;
        fareZones: string[];
    }[];
}

interface MatchingData {
    type: string;
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    inboundFareZones: FareZones[];
    outboundFareZones: FareZones[];
}

interface MatchingFareZones {
    [key: string]: {
        name: string;
        stops: Stop[];
        prices: Price[];
    };
}

export const putMatchingDataInS3 = async (data: MatchingData, uuid: string): Promise<void> => {
    await putStringInS3(
        MATCHING_DATA_BUCKET_NAME,
        `${uuid}.json`,
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
                    prices: [zone.price],
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
    inboundFareZones: MatchingFareZones,
    outboundFareZones: MatchingFareZones,
    passengerTypeObject: PassengerDetails,
): MatchingData => ({
    ...service,
    type: 'return',
    inboundFareZones: getFareZones(userFareStages, inboundFareZones),
    outboundFareZones: getFareZones(userFareStages, outboundFareZones),
    ...passengerTypeObject,
});

const isFareStageUnassigned = (userFareStages: UserFareStages, matchingFareZones: MatchingFareZones): boolean =>
    userFareStages.fareStages.some(stage => !matchingFareZones[stage.stageName]);

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        if (!isCookiesUUIDMatch(req, res)) {
            throw new Error('Cookie UUIDs do not match');
        }

        if (!req.body.service || !req.body.userfarestages) {
            throw new Error('No service or userfarestages info found');
        }

        const service: BasicService = JSON.parse(req.body.service);
        const userFareStages: UserFareStages = JSON.parse(req.body.userfarestages);

        const inboundFareZones = getMatchingFareZonesFromForm(req);

        if (isFareStageUnassigned(userFareStages, inboundFareZones) && inboundFareZones !== {}) {
            setCookieOnResponseObject(MATCHING_COOKIE, JSON.stringify({ inbound: { error: true } }), req, res);
            redirectTo(res, '/inboundMatching');
            return;
        }

        // Deleting these keys from the object in order to faciliate looping through the fare stage values in the body
        delete req.body.service;
        delete req.body.userfarestages;

        const uuid = getUuidFromCookie(req, res);

        // get the outbound matching fare zones for outbound
        const outboundFareZones = await getOutboundMatchingFareStages(uuid);

        if (!outboundFareZones) {
            throw new Error('no outbound fare stages retrieved');
        }

        const cookies = new Cookies(req, res);
        const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
        const passengerTypeObject = JSON.parse(passengerTypeCookie);

        const matchingJson = getMatchingJson(
            service,
            userFareStages,
            inboundFareZones,
            outboundFareZones,
            passengerTypeObject,
        );

        await putMatchingDataInS3(matchingJson, uuid);

        setCookieOnResponseObject(MATCHING_COOKIE, JSON.stringify({ inbound: { error: false } }), req, res);
        redirectTo(res, '/thankyou');
    } catch (error) {
        const message = 'There was a problem generating the matching JSON.';
        redirectToError(res, message, error);
    }
};
