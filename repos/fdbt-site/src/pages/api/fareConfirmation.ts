import { NextApiResponse } from 'next';
import { redirectToError, redirectOnFareType, isSchemeOperator, redirectTo } from './apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (isSchemeOperator(req, res)) {
            redirectTo(res, '/csvZoneUpload');
            return;
        }

        redirectOnFareType(req, res);
    } catch (error) {
        const message = 'There was a problem redirecting the user from the fare confirmation page:';
        redirectToError(res, message, 'api.fareConfirmation', error);
    }
};
