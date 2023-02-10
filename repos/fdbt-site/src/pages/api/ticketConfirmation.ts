import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { FARE_TYPE_ATTRIBUTE } from 'src/constants/attributes';
import { getSessionAttribute } from 'src/utils/sessions';
import { isFareType } from 'src/interfaces/typeGuards';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
        if (!isFareType(fareTypeAttribute)) {
            throw new Error('Incorrect fare type session attributes found.');
        }
        if (
            fareTypeAttribute.fareType === 'single' ||
            fareTypeAttribute.fareType === 'return' ||
            fareTypeAttribute.fareType === 'flatFare'
        ) {
            redirectTo(res, '/selectCaps');
            return;
        }
        redirectTo(res, '/selectPurchaseMethods');
        return;
    } catch (error) {
        const message = 'There was a problem in the ticket confirmation API:';
        redirectToError(res, message, 'api.ticketConfirmation', error);
    }
};
