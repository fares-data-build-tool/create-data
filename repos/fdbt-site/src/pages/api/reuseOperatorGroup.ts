import { NextApiResponse } from 'next';
import { getAndValidateNoc, isSchemeOperator, redirectTo, redirectToError } from '../../utils/apiUtils/index';
import { getOperatorGroupByNocAndId } from '../../data/auroradb';
import {
    FARE_TYPE_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    REUSE_OPERATOR_GROUP_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
} from '../../constants/attributes';
import { NextApiRequestWithSession, TicketRepresentationAttribute, FareType } from '../../interfaces';
import { updateSessionAttribute, getSessionAttribute } from '../../utils/sessions';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const selectedOperatorGroup = Number(req.body.operatorGroupId);
        const noc = getAndValidateNoc(req, res);

        if (!selectedOperatorGroup) {
            updateSessionAttribute(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, [
                { errorMessage: 'Choose an operator group from the options below', id: 'operatorGroup' },
            ]);
            redirectTo(res, '/reuseOperatorGroup');
            return;
        }

        const multipleOperators = await getOperatorGroupByNocAndId(selectedOperatorGroup, noc);

        if (multipleOperators) {
            updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, {
                selectedOperators: multipleOperators.operators,
                id: multipleOperators.id,
            });
            updateSessionAttribute(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, []);
        }

        const { fareType } = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;

        if (isSchemeOperator(req, res) && fareType === 'flatFare') {
            redirectTo(res, '/multipleOperatorsServiceList');
            return;
        }
        const ticketRepresentation = (
            getSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE) as TicketRepresentationAttribute
        ).name;
        redirectTo(
            res,
            ticketRepresentation === 'multipleServices' ? '/multipleOperatorsServiceList' : '/multipleProducts',
        );
        return;
    } catch (error) {
        const message = 'There was a problem with the user selecting their premade operator group:';
        redirectToError(res, message, 'api.reuseOperatorGroup', error);
    }
};
