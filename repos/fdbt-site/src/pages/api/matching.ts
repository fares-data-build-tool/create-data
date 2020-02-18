import { NextApiRequest, NextApiResponse } from 'next';
import { redirectToError } from './apiUtils';

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        console.log(req.body);
    } catch (error) {
        redirectToError(res);
    }
};
