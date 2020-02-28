import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionValid, isCookiesUUIDMatch } from './service/validator';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (isSessionValid(req, res) && isCookiesUUIDMatch(req, res)) {
        res.status(200).json({ Valid: true });
    } else {
        res.status(401).json({ Valid: false });
    }
};
