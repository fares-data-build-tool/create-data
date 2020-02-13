import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log(req.body);
    } catch (error) {
        res.writeHead(302, {
            Location: '/error',
        });
    }
};
