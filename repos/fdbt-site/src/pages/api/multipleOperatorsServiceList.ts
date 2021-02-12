import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import { MULTIPLE_OPERATOR_ATTRIBUTE, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE } from '../../constants/attributes';
import { redirectTo, redirectToError } from './apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession, MultiOperatorInfo, MultipleOperatorsAttribute } from '../../interfaces';
import { isMultiOperatorInfoWithErrors } from '../../interfaces/typeGuards';

const errorId = 'checkbox-0';

export const getSelectedServicesAndNocCodeFromRequest = (requestBody: {
    [key: string]: string | string[];
}): { selectedServices: string[]; nocCode: string } => {
    let nocCode = '';
    const selectedServices: string[] = [];
    Object.entries(requestBody).forEach(entry => {
        const nocCodeLineNameServiceCodeStartDate = entry[0];
        const description = entry[1];
        let serviceDescription: string;
        if (isArray(description)) {
            [serviceDescription] = description;
        } else {
            serviceDescription = description;
        }
        [nocCode] = nocCodeLineNameServiceCodeStartDate.split('#');
        const splitStrings = nocCodeLineNameServiceCodeStartDate.split('#');
        delete splitStrings[0];
        const lineNameServiceCodeStartDate = splitStrings.join('#').substring(1);
        const servicesData = `${lineNameServiceCodeStartDate}#${serviceDescription}`;
        selectedServices.push(servicesData);
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
        if (newListOfMultiOperatorsData.length !== numberOfOperators) {
            redirectTo(res, '/multipleOperatorsServiceList');
            return;
        }

        redirectTo(res, '/howManyProducts');
        return;
    } catch (error) {
        const message =
            'There was a problem processing the selected services from the multipleOperatorsServicesList page:';
        redirectToError(res, message, 'api.multipleOperatorsServiceList', error);
    }
};
