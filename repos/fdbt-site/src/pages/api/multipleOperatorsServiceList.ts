import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import {
    MULTI_OP_TXC_SOURCE_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectTo, redirectToError } from './apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import {
    NextApiRequestWithSession,
    MultiOperatorInfo,
    MultipleOperatorsAttribute,
    SelectedService,
} from '../../interfaces';
import { isMultiOperatorInfoWithErrors } from '../../interfaces/typeGuards';

const errorId = 'checkbox-0';

export const getSelectedServicesAndNocCodeFromRequest = (requestBody: {
    [key: string]: string | string[];
}): { selectedServices: SelectedService[]; nocCode: string } => {
    let nocCode = '';
    const selectedServices: SelectedService[] = [];
    Object.entries(requestBody).forEach(entry => {
        const nocCodeLineNameLineIdServiceCodeStartDate = entry[0];
        const description = entry[1];
        let serviceDescription: string;
        if (isArray(description)) {
            [serviceDescription] = description;
        } else {
            serviceDescription = description;
        }
        let splitStrings = [];
        [nocCode, ...splitStrings] = nocCodeLineNameLineIdServiceCodeStartDate.split('#');
        selectedServices.push({
            lineName: splitStrings[0],
            lineId: splitStrings[1],
            serviceCode: splitStrings[2],
            startDate: splitStrings[3],
            serviceDescription,
        });
    });
    return {
        selectedServices,
        nocCode,
    };
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const redirectUrl = '/multipleOperatorsServiceList';
    const selectAllText = 'Select All Services';

    try {
        const refererUrl = req?.headers?.referer;
        const queryString = refererUrl?.substring(refererUrl?.indexOf('?') + 1);
        const { selectAll } = req.body;

        const isSelected = selectAll === selectAllText;

        if (selectAll && queryString) {
            redirectTo(res, `${redirectUrl}?selectAll=${isSelected}`);
            return;
        }
        const multiOpDataOnSession = getSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE);
        let multiOpDataToReAddToSession: MultiOperatorInfo[] = [];
        if (isMultiOperatorInfoWithErrors(multiOpDataOnSession)) {
            multiOpDataToReAddToSession = multiOpDataOnSession.multiOperatorInfo;
        } else if (multiOpDataOnSession) {
            multiOpDataToReAddToSession = multiOpDataOnSession;
        }
        if ((!req.body || Object.keys(req.body).length === 0) && !selectAll) {
            updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, {
                multiOperatorInfo: multiOpDataToReAddToSession,
                errors: [{ id: errorId, errorMessage: 'Choose at least one service from the options' }],
            });
            redirectTo(res, `${redirectUrl}?selectAll=false`);
            return;
        }

        updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, multiOpDataToReAddToSession);

        const requestBody: { [key: string]: string | string[] } = req.body;

        const { selectedServices, nocCode } = getSelectedServicesAndNocCodeFromRequest(requestBody);

        if (nocCode === '') {
            throw new Error('Could not find NOC code from request');
        }

        const newListOfMultiOperatorsData: MultiOperatorInfo[] = [];
        const multiOperatorData: MultiOperatorInfo = {
            nocCode,
            services: selectedServices,
        };
        newListOfMultiOperatorsData.push(multiOperatorData);
        multiOpDataToReAddToSession.forEach(operatorData => newListOfMultiOperatorsData.push(operatorData));
        updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, newListOfMultiOperatorsData);
        const numberOfOperators = (getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE) as MultipleOperatorsAttribute)
            .selectedOperators.length;
        // below update to session attribute is to reset it for the next operator in the list
        updateSessionAttribute(req, MULTI_OP_TXC_SOURCE_ATTRIBUTE, undefined);
        if (newListOfMultiOperatorsData.length !== numberOfOperators) {
            redirectTo(res, '/multipleOperatorsServiceList');
            return;
        }
        redirectTo(res, '/multipleProducts');
        return;
    } catch (error) {
        const message =
            'There was a problem processing the selected services from the multipleOperatorsServicesList page:';
        redirectToError(res, message, 'api.multipleOperatorsServiceList', error);
    }
};
