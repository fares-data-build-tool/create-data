import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { redirectTo, redirectToError } from './apiUtils';

export default (_req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        redirectTo(res, '/priceEntry');
    } catch (error) {
        const message = 'There was a problem entering stage names:';
        redirectToError(res, message, 'api.stageNamesConfirmation', error);
    }
};
