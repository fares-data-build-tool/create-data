import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (!req.body) {
            res.writeHead(302, {
                Location: '/csvUpload',
            });
            res.end();
            return;
        }

    } catch (error) {
        res.writeHead(302, {
            Location: '/error',
        });
    }
    res.end();
};
