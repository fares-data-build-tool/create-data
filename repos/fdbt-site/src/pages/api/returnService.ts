import { NextApiResponse } from 'next';
import { RETURN_SERVICE_ATTRIBUTE, TXC_SOURCE_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { updateSessionAttribute, getRequiredSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getServiceByIdAndDataSource } from '../../data/auroradb';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const serviceId = Number.parseInt(req.body.serviceId);

        if (!Number.isInteger(serviceId)) {
            const errors: ErrorInfo[] = [{ id: 'service', errorMessage: 'Choose a service from the options' }];
            updateSessionAttribute(req, RETURN_SERVICE_ATTRIBUTE, { errors });
            redirectTo(res, '/returnService');
            return;
        }

        const dataSource = getRequiredSessionAttribute(req, TXC_SOURCE_ATTRIBUTE).source;

        const service = await getServiceByIdAndDataSource(getAndValidateNoc(req, res), serviceId, dataSource);

        updateSessionAttribute(req, RETURN_SERVICE_ATTRIBUTE, {
            service: `${service.lineName}#${service.startDate}`,
            id: serviceId,
        });

        redirectTo(res, '/direction');
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, 'api.service', error);
    }
};
