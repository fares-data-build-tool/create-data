import { NextApiRequest, NextApiResponse } from 'next';
import { getDomain, setCookieOnResponseObject, redirectToError, redirectTo, getUuidFromCookie } from './apiUtils/index';
import { FARETYPE_COOKIE } from '../../constants/index';

import { isSessionValid } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        if (req.body.fareType) {
            const cookieValue = JSON.stringify({
                errorMessage: '',
                uuid: getUuidFromCookie(req, res),
                fareType: req.body.fareType,
            });

            setCookieOnResponseObject(getDomain(req), FARETYPE_COOKIE, cookieValue, req, res);

            switch (req.body.fareType) {
                case 'period':
                    redirectTo(res, '/periodType');
                    return;
                case 'single':
                    redirectTo(res, '/service');
                    return;
                case 'return':
                    redirectTo(res, '/service');
                    return;
                case 'flatFare':
                    redirectTo(res, '/serviceList');
                    return;
                default:
                    throw new Error('Fare Type we expect was not received.');
            }
        } else {
            const cookieValue = JSON.stringify({
                errorMessage: 'Choose a fare type from the options',
                uuid: getUuidFromCookie(req, res),
            });
            setCookieOnResponseObject(getDomain(req), FARETYPE_COOKIE, cookieValue, req, res);
            redirectTo(res, '/fareType');
        }
    } catch (error) {
        const message = 'There was a problem selecting the fare type:';
        redirectToError(res, message, error);
    }
};
