import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, isSchemeOperator } from './apiUtils';
import { TICKET_REPRESENTATION_ATTRIBUTE } from '../../constants/attributes';
import { NextApiRequestWithSession, TicketRepresentationAttribute } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (req.body.ticketType) {
            const { ticketType } = req.body;
            const ticketTypeObject: TicketRepresentationAttribute = { name: ticketType };
            const isScheme = isSchemeOperator(req, res);

            updateSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE, ticketTypeObject);

            switch (ticketType) {
                case 'geoZone':
                case 'hybrid':
                    redirectTo(res, '/csvZoneUpload');
                    return;
                case 'multipleServices':
                    redirectTo(res, isScheme ? '/reuseOperatorGroup' : '/serviceList?selectAll=false');
                    return;
                case 'pointToPointPeriod':
                    redirectTo(res, '/service');
                    return;
                default:
                    throw new Error('Did not receive an expected ticket type.');
            }
        } else {
            updateSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE, {
                errors: [{ errorMessage: 'Choose a type of ticket representation', id: 'geo-zone' }],
            });
            redirectTo(res, '/ticketRepresentation');
        }
    } catch (error) {
        const message = 'There was a problem selecting the type of ticket:';
        redirectToError(res, message, 'api.ticketRepresentation', error);
    }
};
