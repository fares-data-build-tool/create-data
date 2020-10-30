import { NextApiResponse } from 'next';
import { COOKIES_POLICY_COOKIE, COOKIE_PREFERENCES_COOKIE, oneYearInSeconds } from '../../constants';
import { NextApiRequestWithSession, CookiePolicy } from '../../interfaces';
import { redirectTo, redirectToError, setCookieOnResponseObject } from './apiUtils';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { tracking } = req.body;

        if (!tracking) {
            redirectTo(res, '/cookies');
            return;
        }

        const cookiePolicy: CookiePolicy = { essential: true, usage: tracking === 'on' || false };

        setCookieOnResponseObject(COOKIE_PREFERENCES_COOKIE, 'true', req, res, oneYearInSeconds, false);
        setCookieOnResponseObject(
            COOKIES_POLICY_COOKIE,
            JSON.stringify(cookiePolicy),
            req,
            res,
            oneYearInSeconds,
            false,
        );

        redirectTo(res, '/cookies?settingsSaved=true');
    } catch (error) {
        const message = 'There was a problem saving cookie preferences.';
        redirectToError(res, message, 'api.cookies', error);
    }
};
