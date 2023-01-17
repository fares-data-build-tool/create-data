import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import { NextApiRequestWithSession } from '../../interfaces/index';
import { getFareTypeFromFromAttributes, redirectTo, redirectToError } from '../../utils/apiUtils';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
} from '../../constants/attributes';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { putUserDataInProductsBucketWithFilePath } from '../../../src/utils/apiUtils/userData';
import { SelectedService } from '../../interfaces/matchingJsonTypes';

const errorId = 'checkbox-0';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    const redirectUrl = '/serviceList';
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

        if ((!req.body || Object.keys(req.body).length === 0) && !selectAll) {
            updateSessionAttribute(req, SERVICE_LIST_ATTRIBUTE, {
                errors: [{ id: errorId, errorMessage: 'Choose at least one service from the options' }],
            });
            redirectTo(res, `${redirectUrl}?selectAll=false`);
            return;
        }

        const selectedServices: SelectedService[] = [];

        const requestBody: { [key: string]: string | string[] } = req.body;

        Object.entries(requestBody).forEach((entry) => {
            const lineNameLineIdServiceCodeStartDate = entry[0];
            const description = entry[1];
            let serviceDescription: string;
            if (isArray(description)) {
                [serviceDescription] = description;
            } else {
                serviceDescription = description;
            }
            const splitData = lineNameLineIdServiceCodeStartDate.split('#');
            selectedServices.push({
                lineName: splitData[0],
                lineId: splitData[1],
                serviceCode: splitData[2],
                startDate: splitData[3],
                serviceDescription,
            });
        });

        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        // edit mode
        if (ticket && matchingJsonMetaData && 'selectedServices' in ticket) {
            const updatedTicket = {
                ...ticket,
                selectedServices,
            };

            // put the now updated matching json into s3
            await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
            updateSessionAttribute(req, SERVICE_LIST_ATTRIBUTE, undefined);
            redirectTo(
                res,
                `/products/productDetails?productId=${matchingJsonMetaData.productId}${
                    matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
                }`,
            );
            return;
        }

        const fareType = getFareTypeFromFromAttributes(req);

        updateSessionAttribute(req, SERVICE_LIST_ATTRIBUTE, { selectedServices });

        if (fareType === 'multiOperator') {
            redirectTo(res, '/reuseOperatorGroup');
            return;
        }

        if (fareType === 'capped') {
            redirectTo(res, '/typeOfCap');
            return;
        }
        if (fareType === 'flatFare') {
            redirectTo(res, '/defineCapPricingPerDistance');
            return;
        }
        redirectTo(res, '/multipleProducts');
        return;
    } catch (error) {
        const message = 'There was a problem processing the selected services from the servicesList page:';
        redirectToError(res, message, 'api.serviceList', error);
    }
};
