import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import {
    MULTI_OP_TXC_SOURCE_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession, MultiOperatorInfo, MultipleOperatorsAttribute } from '../../interfaces';
import { isMultiOperatorInfoWithErrors } from '../../interfaces/typeGuards';
import { SelectedServiceWithNocCode, SelectedServiceByNocCode } from 'fdbt-types/matchingJsonTypes';
import { object } from 'yup';

const errorId = 'checkbox-0';

export const getSelectedServicesAndNocCodeFromRequest = (requestBody: {
    [key: string]: string | string[];
}): MultiOperatorInfo[] => {
    let nocCode = '';
    const serviceDetails: SelectedServiceWithNocCode[] = [];
    const convertServiceDetails = (value: string, description: string | string[]): SelectedServiceWithNocCode => {
        let splitStrings = [];
        let serviceDescription: string;
        [nocCode, ...splitStrings] = value.split('#');
        if (isArray(description)) {
            [serviceDescription] = description;
        } else {
            serviceDescription = description;
        }
        return {
            nocCode,
            lineName: splitStrings[0],
            lineId: splitStrings[1],
            serviceCode: splitStrings[2],
            startDate: splitStrings[3],
            serviceDescription,
        };
    };

    Object.entries(requestBody).forEach((e) => {
        const value = convertServiceDetails(e[0], e[1]);
        serviceDetails.push(value);
    });
    const multiOperatorsService: SelectedServiceByNocCode[] = [];
    const getIndexOfMultiOperatorsService = (noc: string): number => {
        const index = multiOperatorsService.findIndex((serviceDetails) => Object.keys(serviceDetails).includes(noc));
        return index;
    };
    serviceDetails.forEach((service) => {
        const indexOfFound = getIndexOfMultiOperatorsService(service.nocCode);
        if (indexOfFound === -1) {
            multiOperatorsService.push({ [service.nocCode]: [service] });
        } else {
            multiOperatorsService[indexOfFound][service.nocCode].push(service);
        }
    });
    const newListOfMultiOperatorsData: MultiOperatorInfo[] = [];
    multiOperatorsService.forEach((obj) => {
        Object.entries(obj).forEach((v) => {
            newListOfMultiOperatorsData.push({ nocCode: v[0], services: v[1] });
        });
    });

    return newListOfMultiOperatorsData;
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

        const ListOfMultiOperatorsData = getSelectedServicesAndNocCodeFromRequest(requestBody);
        updateSessionAttribute(req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, ListOfMultiOperatorsData);
        updateSessionAttribute(req, MULTI_OP_TXC_SOURCE_ATTRIBUTE, undefined);
        redirectTo(res, '/multipleProducts');
        return;
    } catch (error) {
        const message =
            'There was a problem processing the selected services from the multipleOperatorsServicesList page:';
        redirectToError(res, message, 'api.multipleOperatorsServiceList', error);
    }
};
