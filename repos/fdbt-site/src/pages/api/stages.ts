import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionValid, isCookiesUUIDMatch } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req) && isCookiesUUIDMatch(req)) {
        try {
            res.writeHead(302, {
                Location: '/confirmation',
            });
        } catch (error) {
            res.writeHead(302, {
                Location: '/_error',
            });
        }
    } else {
        res.writeHead(302, {
            Location: '/_error',
        });
    }
    res.end();
};
