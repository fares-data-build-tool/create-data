import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!req.body.inputMethod) {
            res.writeHead(302, {
                Location: '/inputMethod',
            });
            res.end();
            return;
        }

        switch (req.body.inputMethod) {
            case 'csv':
                res.writeHead(302, {
                    Location: '/csvUpload',
                });
                break;
            case 'manual':
                // redirect to manual page
                break;
            case 'interactiveMap':
                // redirect to map page
                break;
            default:
                throw new Error('Input method we expect was not found.');
        }
    } catch (error) {
        res.writeHead(302, {
            Location: '/_error',
        });
    }
    res.end();
};
