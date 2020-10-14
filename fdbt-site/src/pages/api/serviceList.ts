import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import { redirectTo, redirectToError } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { SERVICE_LIST_ATTRIBUTE, FARE_TYPE_ATTRIBUTE } from '../../constants';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { isFareType } from '../../interfaces/typeGuards';
import { NextApiRequestWithSession, ErrorInfo } from '../../interfaces';

const errorId = 'checkbox-0';

export interface ServiceListAttribute {
    selectedServices: string[];
}

export interface ServiceListAttributeWithErrors {
    errors: ErrorInfo[];
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const redirectUrl = '/serviceList';
    const selectAllText = 'Select All Services';

    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (isFareType(fareTypeAttribute) && !fareTypeAttribute.fareType) {
            throw new Error('Failed to retrieve fare type attribute info for serviceList API');
        }

        const refererUrl = req?.headers?.referer;
        const queryString = refererUrl?.substring(refererUrl?.indexOf('?') + 1);
        const { selectAll } = req.body;

        const isSelected = selectAll === selectAllText;

        if (selectAll && queryString) {
            redirectTo(res, `${redirectUrl}?selectAll=${isSelected}`);
            return;
        }

        if ((!req.body || Object.keys(req.body).length === 0) && !selectAll) {
            updateSessionAttribute(req, SERVICE_LIST_ATTRIBUTE, {
                errors: [{ id: errorId, errorMessage: 'Choose at least one service from the options' }],
            });
            redirectTo(res, `${redirectUrl}?selectAll=false`);
            return;
        }

        const selectedServices: string[] = [];

        const requestBody: { [key: string]: string | string[] } = req.body;

        Object.entries(requestBody).forEach(entry => {
            const lineNameServiceCodeStartDate = entry[0];
            const description = entry[1];
            let serviceDescription: string;
            if (isArray(description)) {
                [serviceDescription] = description;
            } else {
                serviceDescription = description;
            }
            const data = `${lineNameServiceCodeStartDate}#${serviceDescription}`;
            selectedServices.push(data);
        });

        updateSessionAttribute(req, SERVICE_LIST_ATTRIBUTE, { selectedServices });

        if (isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'flatFare') {
            redirectTo(res, '/productDetails');
            return;
        }
        if (isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'multiOperator') {
            redirectTo(res, '/searchOperators');
            return;
        }

        redirectTo(res, '/howManyProducts');
        return;
    } catch (error) {
        const message = 'There was a problem processing the selected services from the servicesList page:';
        redirectToError(res, message, 'api.serviceList', error);
    }
};
