import { NextApiRequest, NextApiResponse } from 'next';
import { redirectToError, redirectTo, isSessionValid, isCookiesUUIDMatch } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res) || !isCookiesUUIDMatch(req, res)) {
            redirectToError(res);
            return;
        }

        redirectTo(res, '/confirmation');
    } catch (error) {
        redirectToError(res);
    }
};
