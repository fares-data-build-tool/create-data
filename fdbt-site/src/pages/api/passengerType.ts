import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    setCookieOnResponseObject,
    redirectToError,
    redirectTo,
    redirectOnFareType,
    unescapeAndDecodeCookie,
} from './apiUtils/index';
import { PASSENGER_TYPE_COOKIE, FARE_TYPE_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);

        if (fareTypeCookie === '') {
            throw new Error('Necessary fare type cookie not found for passenger type page');
        }

        if (req.body.passengerType) {
            const { passengerType } = req.body;

            const cookieValue = JSON.stringify({
                passengerType,
            });

            setCookieOnResponseObject(PASSENGER_TYPE_COOKIE, cookieValue, req, res);

            if (passengerType === 'anyone') {
                redirectOnFareType(req, res);
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
        redirectToError(res, message, error);
    }
};
