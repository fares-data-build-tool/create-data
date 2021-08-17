import { NextApiResponse } from 'next';
import { GROUP_PASSENGER_TYPE } from '../../constants';
import {
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    GROUP_SIZE_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
} from '../../constants/attributes';
import { convertToFullPassengerType, getGroupPassengerTypeById, getPassengerTypeById } from '../../data/auroradb';
import { NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';
import { redirectTo, redirectToError, getAndValidateNoc } from './apiUtils/index';
import { getPassengerTypeRedirectLocation } from './definePassengerType';

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

        const databaseCheck = await getPassengerTypeById(selectedPassengerType, nocCode);
        const groupDataBaseCheck = await getGroupPassengerTypeById(selectedPassengerType, nocCode);

        if (!databaseCheck && !groupDataBaseCheck) {
            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, {
                errors,
            });
            redirectTo(res, '/selectPassengerType');
            return;
        }
        if (groupDataBaseCheck) {
            const fullGroup = await convertToFullPassengerType(groupDataBaseCheck, nocCode);
            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, { passengerType: GROUP_PASSENGER_TYPE });
            updateSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE, fullGroup.groupPassengerType.companions);

            updateSessionAttribute(req, GROUP_SIZE_ATTRIBUTE, {
                maxGroupSize: groupDataBaseCheck.groupPassengerType.maxGroupSize,
            });
        } else {
            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, databaseCheck?.passengerType);
        }

        redirectTo(res, getPassengerTypeRedirectLocation(req));
        return;
    } catch (error) {
        const message = 'There was a problem selecting the passenger type:';
        redirectToError(res, message, 'api.selectPassengerType', error);
    }
};
