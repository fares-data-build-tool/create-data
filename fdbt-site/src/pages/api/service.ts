import { NextApiResponse } from 'next';
import { getUuidFromSession, redirectToError, redirectTo } from './apiUtils/index';
import { FARE_TYPE_ATTRIBUTE, SERVICE_ATTRIBUTE } from '../../constants/attributes';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { isFareType } from '../../interfaces/typeGuards';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { service } = req.body;

        if (!service) {
            const errors: ErrorInfo[] = [{ id: 'service', errorMessage: 'Choose a service from the options' }];

            updateSessionAttribute(req, SERVICE_ATTRIBUTE, { errors });
            redirectTo(res, '/service');
            return;
        }

        const uuid = getUuidFromSession(req);

        if (!uuid) {
            throw new Error('No UUID found');
        }

        updateSessionAttribute(req, SERVICE_ATTRIBUTE, { service });

        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'return') {
            redirectTo(res, '/returnDirection');
            return;
        }

        redirectTo(res, '/singleDirection');
    } catch (error) {
        const message = 'There was a problem selecting the service:';
        redirectToError(res, message, 'api.service', error);
    }
};
