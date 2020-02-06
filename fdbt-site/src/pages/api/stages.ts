import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionValid, isCookiesUUIDMatch } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (isSessionValid(req) && isCookiesUUIDMatch(req)) {
        try {
            res.writeHead(302, {
                Location: '/confirmation',
            });
        } catch (error) {
            res.writeHead(302, {
                Location: '/error',
            });
        }
    } else {
        res.writeHead(302, {
            Location: '/error',
        });
    }
    res.end();
};
