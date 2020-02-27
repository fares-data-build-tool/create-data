import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionValid, isCookiesUUIDMatch } from './service/validator';
import { redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req, res) && isCookiesUUIDMatch(req, res)) {
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
