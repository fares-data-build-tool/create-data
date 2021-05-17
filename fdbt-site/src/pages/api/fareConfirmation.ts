import { NextApiResponse } from 'next';
import { redirectToError, redirectOnFareType, isSchemeOperator, redirectTo } from './apiUtils';
import { NextApiRequestWithSession, FareType, TicketRepresentationAttribute } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { FARE_TYPE_ATTRIBUTE, TICKET_REPRESENTATION_ATTRIBUTE } from '../../constants/attributes';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { fareType } = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;
        if (isSchemeOperator(req, res)) {
            if (fareType === 'period') {
                const ticketTypeObject: TicketRepresentationAttribute = { name: 'geoZone' };
                updateSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE, ticketTypeObject);
                redirectTo(res, '/csvZoneUpload');
                return;
            }
            redirectTo(res, '/reuseOperatorGroup');
            return;
        }

        redirectOnFareType(req, res);
    } catch (error) {
        const message = 'There was a problem redirecting the user from the fare confirmation page:';
        redirectToError(res, message, 'api.fareConfirmation', error);
    }
};
