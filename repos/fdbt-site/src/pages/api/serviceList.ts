import { NextApiResponse } from 'next';
import Cookies from 'cookies';
import { isArray } from 'util';
import { redirectTo, redirectToError, unescapeAndDecodeCookie } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { SERVICE_LIST_ATTRIBUTE, FARE_TYPE_COOKIE } from '../../constants';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';

const errorId = 'service-list-error';

export interface ServiceListAttribute {
    selectedServices: string[];
}

export interface ServiceListAttributeWithErrors {
    errors: ErrorInfo[];
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const redirectUrl = '/serviceList';
    const selectAllText = 'Select All';

    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
        const fareTypeObject = JSON.parse(fareTypeCookie);

        if (!fareTypeObject || !fareTypeObject.fareType) {
            throw new Error('Failed to retrieve FARE_TYPE_COOKIE info for serviceList API');
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

        if (fareTypeObject.fareType === 'flatFare') {
            redirectTo(res, '/productDetails');
            return;
        }

        redirectTo(res, '/howManyProducts');
        return;
    } catch (error) {
        const message = 'There was a problem processing the selected services from the servicesList page:';
        redirectToError(res, message, 'api.serviceList', error);
    }
};
