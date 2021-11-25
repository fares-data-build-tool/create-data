import { NextApiResponse } from 'next';
import { FARE_TYPE_ATTRIBUTE, SERVICE_ATTRIBUTE, TXC_SOURCE_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { updateSessionAttribute, getRequiredSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getServiceByIdAndDataSource } from '../../data/auroradb';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const serviceId = Number.parseInt(req.body.serviceId);

        if (!Number.isInteger(serviceId)) {
            const errors: ErrorInfo[] = [{ id: 'service', errorMessage: 'Choose a service from the options' }];
            updateSessionAttribute(req, SERVICE_ATTRIBUTE, { errors });
            redirectTo(res, '/service');
            return;
        }

        const dataSource = getRequiredSessionAttribute(req, TXC_SOURCE_ATTRIBUTE).source;
        const fareTypeAttribute = getRequiredSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
        const isReturn = 'fareType' in fareTypeAttribute && ['period', 'return'].includes(fareTypeAttribute.fareType);

        const service = await getServiceByIdAndDataSource(getAndValidateNoc(req, res), serviceId, dataSource);
        const directions = Array.from(
            service.journeyPatterns.reduce((set, pattern) => {
                set.add(pattern.direction);
                return set;
            }, new Set<string>()),
        );

        if (directions.length === 1 && isReturn) {
            const errors: ErrorInfo[] = [
                {
                    id: 'service',
                    errorMessage: 'The chosen a service only has one direction and can`t be used for a return',
                },
            ];
            updateSessionAttribute(req, SERVICE_ATTRIBUTE, { errors });
            redirectTo(res, '/service');
        }

        updateSessionAttribute(req, SERVICE_ATTRIBUTE, {
            service: `${service.lineName}#${service.startDate}`,
            id: serviceId,
        });

        redirectTo(res, '/direction');
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, 'api.service', error);
    }
};
