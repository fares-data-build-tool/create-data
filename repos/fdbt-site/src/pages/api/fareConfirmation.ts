import { NextApiResponse } from 'next';
import { redirectToError, redirectOnFareType, isSchemeOperator, redirectTo } from '../../utils/apiUtils';
import { NextApiRequestWithSession, FareType } from '../../interfaces';
import { getSessionAttribute } from '../../utils/sessions';
import { FARE_TYPE_ATTRIBUTE } from '../../constants/attributes';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { fareType } = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;
        if (isSchemeOperator(req, res) && fareType !== 'period') {
            redirectTo(res, '/reuseOperatorGroup');
            return;
        }

        redirectOnFareType(req, res);
    } catch (error) {
        const message = 'There was a problem redirecting the user from the fare confirmation page:';
        redirectToError(res, message, 'api.fareConfirmation', error);
    }
};
