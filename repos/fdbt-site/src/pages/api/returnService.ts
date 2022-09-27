import { NextApiResponse } from 'next';
import { RETURN_SERVICE_ATTRIBUTE, TXC_SOURCE_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { updateSessionAttribute, getRequiredSessionAttribute } from '../../utils/sessions';
import { ReturnService, ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getServiceByIdAndDataSource } from '../../data/auroradb';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const serviceId = Number.parseInt(req.body.serviceId);

        if (!Number.isInteger(serviceId)) {
            const errors: ErrorInfo[] = [{ id: 'returnService', errorMessage: 'Choose a service from the options' }];
            updateSessionAttribute(req, RETURN_SERVICE_ATTRIBUTE, { errors });
            redirectTo(res, '/returnService');
            return;
        }

        const dataSource = getRequiredSessionAttribute(req, TXC_SOURCE_ATTRIBUTE).source;

        const service = await getServiceByIdAndDataSource(getAndValidateNoc(req, res), serviceId, dataSource);

        const returnService: ReturnService = {
            lineName: service.lineName,
            lineId: service.lineId,
            serviceDescription: service.serviceDescription,
            nocCode: '',
            operatorShortName: '',
            id: serviceId,
        };

        updateSessionAttribute(req, RETURN_SERVICE_ATTRIBUTE, returnService);

        redirectTo(res, '/direction');
        return;
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, 'api.service', error);
    }
};
