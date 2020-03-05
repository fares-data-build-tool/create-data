import { NextApiRequest, NextApiResponse } from 'next';
import { redirectToError, redirectTo } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!req.body.howManyStages) {
            redirectTo(res, '/howManyStages');
            return;
        }
        switch (req.body.howManyStages) {
            case 'lessThan20':
                redirectTo(res, '/chooseStages');
                break;
            case 'moreThan20':
                redirectTo(res, '/csvUpload');
                break;
            default:
                throw new Error('Number of fare stages was not found.');
        }
    } catch (error) {
        redirectToError(res);
    }
};
