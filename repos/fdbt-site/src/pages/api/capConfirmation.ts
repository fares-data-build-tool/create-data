import { NextApiResponse } from 'next';
import { redirectToError, redirectTo } from '../../utils/apiUtils';

export default (res: NextApiResponse): void => {
    try {
        redirectTo(res, '/selectPurchaseMethods');
        return;
    } catch (error) {
        const message = 'There was a problem redirecting the user from the fare confirmation page:';
        redirectToError(res, message, 'api.fareConfirmation', error);
    }
};
