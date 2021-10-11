import { NextApiResponse } from 'next';
import {
    FARE_TYPE_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
    DIRECTION_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { updateSessionAttribute, getRequiredSessionAttribute } from '../../utils/sessions';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { masterStopListEnabled } from '../../constants/featureFlag';
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

        const service = await getServiceByIdAndDataSource(getAndValidateNoc(req, res), serviceId, dataSource);

        updateSessionAttribute(req, SERVICE_ATTRIBUTE, {
            service: `${service.lineName}#${service.startDate}`,
            id: serviceId,
        });
        const fareTypeAttribute = getRequiredSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
        const isReturn = 'fareType' in fareTypeAttribute && ['period', 'return'].includes(fareTypeAttribute.fareType);

        if (masterStopListEnabled && dataSource === 'bods') {
            const directions = Array.from(
                service.journeyPatterns.reduce((set, pattern) => {
                    set.add(pattern.direction);
                    return set;
                }, new Set<string>()),
            );

            if (directions.length === 1) {
                updateSessionAttribute(req, DIRECTION_ATTRIBUTE, { direction: directions[0] });
                redirectTo(res, '/inputMethod');
            } else {
                if (isReturn) {
                    const direction = directions.find((it) => ['outbound', 'clockwise'].includes(it));
                    const inboundDirection = directions.find((it) => ['inbound', 'antiClockwise'].includes(it));

                    if (directions.length !== 2 || !direction || !inboundDirection) {
                        throw new Error(`expected an inbound and outbound directions but got ${directions}`);
                    }

                    updateSessionAttribute(req, DIRECTION_ATTRIBUTE, { direction, inboundDirection });
                }

                redirectTo(res, '/direction');
            }
        } else if (isReturn) {
            redirectTo(res, '/returnDirection');
        } else {
            redirectTo(res, '/singleDirection');
        }
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, 'api.service', error);
    }
};
