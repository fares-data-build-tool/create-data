import { NextApiResponse } from 'next';
import { GROUP_PASSENGER_TYPE } from '../../constants';
import {
    FARE_TYPE_ATTRIBUTE,
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
} from '../../constants/attributes';
import { convertToFullPassengerType, getGroupPassengerTypeById, getPassengerTypeById } from '../../data/auroradb';
import { FareType, NextApiRequestWithSession } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError, getAndValidateNoc } from '../../utils/apiUtils/index';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const selectedPassengerType = Number(req.body.passengerTypeId);
        const nocCode = getAndValidateNoc(req, res);
        const errors = [{ errorMessage: 'Select a passenger type', id: 'individual-passengers' }];
        if (!req.body.passengerTypeId) {
            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, {
                errors,
            });
            redirectTo(res, '/selectPassengerType');
            return;
        }

        const dbIndividual = await getPassengerTypeById(selectedPassengerType, nocCode);
        const dbGroup = await getGroupPassengerTypeById(selectedPassengerType, nocCode);

        if (dbGroup) {
            const fullGroup = await convertToFullPassengerType(dbGroup, nocCode);
            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, {
                passengerType: GROUP_PASSENGER_TYPE,
                id: dbGroup.id,
            });
            updateSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE, fullGroup.groupPassengerType.companions);

            updateSessionAttribute(req, GROUP_SIZE_ATTRIBUTE, {
                maxGroupSize: dbGroup.groupPassengerType.maxGroupSize,
            });
        } else if (dbIndividual) {
            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, {
                ...dbIndividual.passengerType,
                id: dbIndividual.id,
            });
        } else {
            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, {
                errors,
            });
            redirectTo(res, '/selectPassengerType');
            return;
        }

        const { fareType } = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE) as FareType;

        const redirectLocation = fareType === 'schoolService' ? '/termTime' : '/selectTimeRestrictions';

        redirectTo(res, redirectLocation);
        return;
    } catch (error) {
        const message = 'There was a problem selecting the passenger type:';
        redirectToError(res, message, 'api.selectPassengerType', error);
    }
};
