import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    setCookieOnResponseObject,
    redirectToError,
    redirectTo,
    redirectOnFareType,
    unescapeAndDecodeCookie,
} from './apiUtils/index';
import { PASSENGER_TYPE_COOKIE, FARE_TYPE_COOKIE, PASSENGER_TYPES_WITH_GROUP } from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);

        if (fareTypeCookie === '') {
            throw new Error('Necessary fare type cookie not found for passenger type page');
        }

        const passengerTypeValues = PASSENGER_TYPES_WITH_GROUP.map(type => type.passengerTypeValue);

        if (req.body.passengerType && passengerTypeValues.includes(req.body.passengerType)) {
            const { passengerType } = req.body;

            const cookieValue = JSON.stringify({
                passengerType,
            });

            setCookieOnResponseObject(PASSENGER_TYPE_COOKIE, cookieValue, req, res);

            if (passengerType === 'anyone') {
                redirectOnFareType(req, res);
                return;
            }

            if (passengerType === 'group') {
                redirectTo(res, '/groupSize');
                return;
            }

            redirectTo(res, '/definePassengerType');
            return;
        }

        const passengerTypeCookieValue = JSON.stringify({
            errorMessage: 'Choose a passenger type from the options',
        });
        setCookieOnResponseObject(PASSENGER_TYPE_COOKIE, passengerTypeCookieValue, req, res);
        redirectTo(res, '/passengerType');
    } catch (error) {
        const message = 'There was a problem selecting the passenger type:';
        redirectToError(res, message, 'api.passengerType', error);
    }
};
