import { NextApiRequest, NextApiResponse } from 'next';
import { redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!req.body.inputMethod) {
            redirectTo(res, '/inputMethod');
            return;
        }

        switch (req.body.inputMethod) {
            case 'csv':
                redirectTo(res, '/csvUpload');
                return;
            case 'manual':
                redirectTo(res, '/howManyStages');
                break;
            case 'interactiveMap':
                // redirect to map page
                break;
            default:
                throw new Error('Input method we expect was not found.');
        }
    } catch (error) {
        redirectToError(res);
        throw error;
    }
};
