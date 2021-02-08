import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import { getFareTypeFromFromAttributes, redirectTo, redirectToError } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { SERVICE_LIST_ATTRIBUTE } from '../../constants';
import { updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession } from '../../interfaces';

const errorId = 'checkbox-0';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    const redirectUrl = '/serviceList';
    const selectAllText = 'Select All Services';

    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const fareType = getFareTypeFromFromAttributes(req);

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

        if (fareType === 'flatFare') {
            redirectTo(res, '/productDetails');
            return;
        }
        if (fareType === 'multiOperator') {
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
