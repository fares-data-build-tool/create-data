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
        const direction = directions.find((it) => ['outbound', 'clockwise'].includes(it));
        const inboundDirection = directions.find((it) => ['inbound', 'antiClockwise'].includes(it));

        if (isReturn && (!direction || !inboundDirection)) {
            const errors: ErrorInfo[] = [
                {
                    id: 'service',
                    errorMessage: `As your service only operates in a single direction, you cannot create a return product for this service`,
                    userInput: req.body.serviceId,
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
        return;
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, 'api.service', error);
    }
};
