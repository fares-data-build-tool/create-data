import { NextApiResponse } from 'next';
import {
    FARE_TYPE_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
    DIRECTION_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { getSessionAttribute, updateSessionAttribute, getRequiredSessionAttribute } from '../../utils/sessions';
import { isFareType } from '../../interfaces/typeGuards';
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
        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (masterStopListEnabled && dataSource === 'bods') {
            const directions = service.journeyPatterns.reduce((set, pattern) => {
                set.add(pattern.direction);
                return set;
            }, new Set<string>());

            if (directions.size === 1) {
                updateSessionAttribute(req, DIRECTION_ATTRIBUTE, { direction: directions.values().next().value });
                redirectTo(res, '/inputMethod');
            } else {
                redirectTo(res, '/direction');
            }
        } else if (
            isFareType(fareTypeAttribute) &&
            (fareTypeAttribute.fareType === 'return' || fareTypeAttribute.fareType === 'period')
        ) {
            redirectTo(res, '/returnDirection');
        } else {
            redirectTo(res, '/singleDirection');
        }
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, 'api.service', error);
    }
};
