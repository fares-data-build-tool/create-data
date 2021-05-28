import { NextApiResponse } from 'next';
import { getAndValidateNoc, isSchemeOperator, redirectTo, redirectToError } from './apiUtils/index';
import { getOperatorGroupsByNameAndNoc } from '../../data/auroradb';
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
        const { reuseGroupChoice, premadeOperatorGroup } = req.body;
        if (!reuseGroupChoice) {
            updateSessionAttribute(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, [
                { errorMessage: 'Choose one of the options below', id: 'conditional-form-group' },
            ]);
            redirectTo(res, '/reuseOperatorGroup');
            return;
        }

        if (reuseGroupChoice === 'No') {
            updateSessionAttribute(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, []);
            redirectTo(res, '/searchOperators');
            return;
        }

        if (!premadeOperatorGroup) {
            updateSessionAttribute(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, [
                { errorMessage: 'Choose a premade operator group from the options below', id: 'premadeOperatorGroup' },
            ]);
            redirectTo(res, '/reuseOperatorGroup');
            return;
        }

        const noc = getAndValidateNoc(req, res);
        const selectedOperators = (await getOperatorGroupsByNameAndNoc(premadeOperatorGroup, noc))[0].operators;
        updateSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE, { selectedOperators });
        updateSessionAttribute(req, REUSE_OPERATOR_GROUP_ATTRIBUTE, []);

        const { fareType } = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;

        if (isSchemeOperator(req, res) && fareType === 'flatFare') {
            redirectTo(res, '/multipleOperatorsServiceList');
            return;
        }
        const ticketRepresentation = (getSessionAttribute(
            req,
            TICKET_REPRESENTATION_ATTRIBUTE,
        ) as TicketRepresentationAttribute).name;
        redirectTo(
            res,
            ticketRepresentation === 'multipleServices' ? '/multipleOperatorsServiceList' : '/howManyProducts',
        );
        return;
    } catch (error) {
        const message = 'There was a problem with the user selecting their premade operator group:';
        redirectToError(res, message, 'api.reuseOperatorGroup', error);
    }
};
