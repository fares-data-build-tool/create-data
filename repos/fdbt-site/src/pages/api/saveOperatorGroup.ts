import { NextApiResponse } from 'next';
import { getAndValidateNoc, redirectToError, redirectTo, isSchemeOperator } from './apiUtils/index';
import {
    NextApiRequestWithSession,
    MultipleOperatorsAttribute,
    TicketRepresentationAttribute,
    FareType,
} from '../../interfaces';
import { updateSessionAttribute, getSessionAttribute } from '../../utils/sessions';
import {
    SAVE_OPERATOR_GROUP_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
} from '../../constants/attributes';
import { getOperatorGroupsByNameAndNoc, insertOperatorGroup } from '../../data/auroradb';
import { removeExcessWhiteSpace } from './apiUtils/validator';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { saveGroup } = req.body;
        if (!saveGroup) {
            updateSessionAttribute(req, SAVE_OPERATOR_GROUP_ATTRIBUTE, [
                { errorMessage: 'Choose one of the options below', id: 'save-operator-group-yes' },
            ]);
            redirectTo(res, '/saveOperatorGroup');
            return;
        }
        if (saveGroup === 'yes') {
            const { groupName } = req.body;
            const refinedGroupName = removeExcessWhiteSpace(groupName);
            if (!refinedGroupName) {
                updateSessionAttribute(req, SAVE_OPERATOR_GROUP_ATTRIBUTE, [
                    { errorMessage: 'Provide a name for the operator group', id: 'operator-group-name-input' },
                ]);
                redirectTo(res, '/saveOperatorGroup');
                return;
            }
            const noc = getAndValidateNoc(req, res);
            const results = await getOperatorGroupsByNameAndNoc(refinedGroupName, noc);
            const nameIsNotUnique = results.length >= 1;
            if (nameIsNotUnique) {
                updateSessionAttribute(req, SAVE_OPERATOR_GROUP_ATTRIBUTE, [
                    {
                        errorMessage: `A saved operator group with name ${refinedGroupName} already exists, provide a unique name`,
                        id: 'operator-group-name-input',
                        userInput: refinedGroupName,
                    },
                ]);
                redirectTo(res, '/saveOperatorGroup');
                return;
            }
            const operators = (getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE) as MultipleOperatorsAttribute)
                .selectedOperators;
            await insertOperatorGroup(noc, operators, refinedGroupName);
        }
        updateSessionAttribute(req, SAVE_OPERATOR_GROUP_ATTRIBUTE, []);

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
    } catch (error) {
        const message = 'There was a problem saving the operator group:';
        redirectToError(res, message, 'api.saveOperatorGroup', error);
    }
};
