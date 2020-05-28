import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    redirectTo,
    redirectToError,
    getUuidFromCookie,
    setCookieOnResponseObject,
    getDomain,
    unescapeAndDecodeCookie,
} from './apiUtils';
import { BasicService, PassengerDetails } from '../../interfaces';
import { Stop } from '../../data/auroradb';
import { putStringInS3, UserFareStages } from '../../data/s3';
import { isCookiesUUIDMatch, isSessionValid } from './service/validator';
import { MATCHING_DATA_BUCKET_NAME, MATCHING_COOKIE, FARE_TYPE_COOKIE, PASSENGER_TYPE_COOKIE } from '../../constants';
import getFareZones from './apiUtils/matching';
import { Price } from '../../interfaces/matchingInterface';

interface MatchingBaseData {
    type: string;
    lineName: string;
    nocCode: string;
    operatorShortName: string;
    serviceDescription: string;
}

interface MatchingData extends MatchingBaseData {
    fareZones: {
        name: string;
        stops: Stop[];
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
}

interface MatchingReturnData extends MatchingBaseData {
    outboundFareZones: {
        name: string;
        stops: Stop[];
        prices: {
            price: string;
            fareZones: string[];
        }[];
    }[];
    inboundFareZones: [];
}

interface MatchingFareZones {
    [key: string]: {
        name: string;
        stops: Stop[];
        prices: Price[];
    };
}
export const putMatchingDataInS3 = async (data: MatchingData | MatchingReturnData, uuid: string): Promise<void> => {
    await putStringInS3(
        MATCHING_DATA_BUCKET_NAME,
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
    matchingFareZones: MatchingFareZones,
    fareType: string,
    passengerTypeObject: PassengerDetails,
): MatchingData | MatchingReturnData => {
    if (fareType === 'return') {
        return {
            ...service,
            type: 'return',
            outboundFareZones: getFareZones(userFareStages, matchingFareZones),
            inboundFareZones: [],
            ...passengerTypeObject,
        };
    }

    return {
        ...service,
        type: 'pointToPoint',
        fareZones: getFareZones(userFareStages, matchingFareZones),
        ...passengerTypeObject,
    };
};

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

        const matchingFareZones = getMatchingFareZonesFromForm(req);

        if (isFareStageUnassigned(userFareStages, matchingFareZones) && matchingFareZones !== {}) {
            const error = { error: true };
            setCookieOnResponseObject(getDomain(req), MATCHING_COOKIE, JSON.stringify({ error }), req, res);
            redirectTo(res, '/matching');
            return;
        }

        // Deleting these keys from the object in order to faciliate looping through the fare stage values in the body
        delete req.body.service;
        delete req.body.userfarestages;

        const uuid = getUuidFromCookie(req, res);

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
        const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
        const fareTypeObject = JSON.parse(fareTypeCookie);
        const passengerTypeObject = JSON.parse(passengerTypeCookie);

        const matchingJson = getMatchingJson(
            service,
            userFareStages,
            matchingFareZones,
            fareTypeObject.fareType,
            passengerTypeObject,
        );

        setCookieOnResponseObject(getDomain(req), MATCHING_COOKIE, JSON.stringify({ error: false }), req, res);
        await putMatchingDataInS3(matchingJson, uuid);

        redirectTo(res, '/thankyou');
    } catch (error) {
        const message = 'There was a problem generating the matching JSON:';
        redirectToError(res, message, error);
    }
};
