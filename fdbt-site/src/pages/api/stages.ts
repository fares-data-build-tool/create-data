import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionValid, isCookiesUUIDMatch } from './service/validator';
import { redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req) && isCookiesUUIDMatch(req)) {
        try {
            redirectTo(res, '/confirmation');
        } catch (error) {
            redirectToError(res);
        }
    } else {
        redirectToError(res);
    }
    res.end();
};
