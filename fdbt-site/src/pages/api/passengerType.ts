import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    getDomain,
    setCookieOnResponseObject,
    redirectToError,
    redirectTo,
    getUuidFromCookie,
    redirectOnFareType,
    unescapeAndDecodeCookie,
} from './apiUtils/index';
import { PASSENGER_TYPE_COOKIE, FARETYPE_COOKIE } from '../../constants/index';
import { isSessionValid } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARETYPE_COOKIE);

        if (fareTypeCookie === '') {
            throw new Error('Necessary fare type cookie not found for passenger type page');
        }

        const { fareType } = JSON.parse(fareTypeCookie);

        if (req.body.passengerType) {
            const { passengerType } = req.body;

            const cookieValue = JSON.stringify({
                errorMessage: '',
                uuid: getUuidFromCookie(req, res),
                passengerType,
            });

            setCookieOnResponseObject(getDomain(req), PASSENGER_TYPE_COOKIE, cookieValue, req, res);

            if (passengerType === 'Any') {
                redirectOnFareType(fareType, res);
                return;
            }
            redirectTo(res, '/definePassengerType');
            return;
        }

        const passengerTypeCookieValue = JSON.stringify({
            errorMessage: 'Choose a passenger type from the options',
            uuid: getUuidFromCookie(req, res),
        });
        setCookieOnResponseObject(getDomain(req), PASSENGER_TYPE_COOKIE, passengerTypeCookieValue, req, res);
        redirectTo(res, '/passengerType');
    } catch (error) {
        const message = 'There was a problem selecting the passenger type:';
        redirectToError(res, message, error);
    }
};
