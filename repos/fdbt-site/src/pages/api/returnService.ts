import { NextApiResponse } from 'next';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    RETURN_SERVICE_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { updateSessionAttribute, getSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getServiceByIdAndDataSource } from '../../data/auroradb';
import { putUserDataInProductsBucketWithFilePath } from '../../../src/utils/apiUtils/userData';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const serviceId = Number.parseInt(req.body.serviceId);
        const selectedServiceId = Number.parseInt(req.body.selectedServiceId);

        if (!Number.isInteger(serviceId)) {
            const errors: ErrorInfo[] = [{ id: 'returnService', errorMessage: 'Choose a service from the options' }];
            updateSessionAttribute(req, RETURN_SERVICE_ATTRIBUTE, { errors });
            redirectTo(res, `/returnService?selectedServiceId=${selectedServiceId}`);
            return;
        }

        const service = await getServiceByIdAndDataSource(getAndValidateNoc(req, res), serviceId, 'bods');
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

        // edit mode
        if (!ticket || !matchingJsonMetaData) {
            const errors: ErrorInfo[] = [
                { id: 'returnService', errorMessage: 'You can add a service from product details page only' },
            ];
            updateSessionAttribute(req, RETURN_SERVICE_ATTRIBUTE, { errors });
            redirectTo(res, `/returnService?selectedServiceId=${selectedServiceId}`);
            return;
        }

        const updatedTicket = {
            ...ticket,
            additionalServices: [
                {
                    lineName: service.lineName,
                    lineId: service.lineId,
                    serviceDescription: service.serviceDescription,
                    id: serviceId,
                },
            ],
        };

        // put the now updated matching json into s3
        await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
        updateSessionAttribute(req, RETURN_SERVICE_ATTRIBUTE, undefined);

        redirectTo(
            res,
            `/products/productDetails?productId=${matchingJsonMetaData.productId}${
                matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
            }`,
        );
        return;
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, 'api.service', error);
    }
};
