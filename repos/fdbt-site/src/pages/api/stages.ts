import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionValid, isCookiesUUIDMatch } from './service/validator';
import { redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res) || !isCookiesUUIDMatch(req, res)) {
            redirectToError(res);
            return;
        }

        redirectTo(res, '/confirmation');
    } catch (error) {
        redirectToError(res);
        throw error;
    }
};
