import { NextApiResponse } from 'next';
import {
    GROUP_PASSENGER_INFO_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    SAVED_PASSENGER_GROUPS_ATTRIBUTE,
} from '../../constants/attributes';
import { GROUP_PASSENGER_TYPE, GROUP_REUSE_PASSENGER_TYPE, PASSENGER_TYPES_WITH_GROUP } from '../../constants/index';
import { getPassengerTypeByNameAndNocCode } from '../../data/auroradb';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { getAndValidateNoc, redirectTo, redirectToError } from './apiUtils/index';
import { getPassengerTypeRedirectLocation } from './definePassengerType';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const passengerTypeValues = PASSENGER_TYPES_WITH_GROUP.map(type => type.passengerTypeValue);

        if (req.body.passengerType && passengerTypeValues.includes(req.body.passengerType)) {
            const { passengerType } = req.body;

            if (passengerType === GROUP_REUSE_PASSENGER_TYPE) {
                const savedGroups = getSessionAttribute(req, SAVED_PASSENGER_GROUPS_ATTRIBUTE);
                if (!savedGroups) {
                    throw new Error("Didn't have any saved groups but they should have been loaded on render");
                }

                const { reuseGroup } = req.body;
                const reusedGroup = savedGroups.find(group => group.name === reuseGroup);
                if (!reusedGroup || !reuseGroup) {
                    const errors = [
                        { errorMessage: 'Select a group to reuse', id: `passenger-type-${GROUP_PASSENGER_TYPE}` },
                    ];
                    updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, {
                        errors,
                    });
                    redirectTo(res, '/passengerType');
                    return;
                }

                updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, { passengerType: GROUP_PASSENGER_TYPE });
                updateSessionAttribute(req, GROUP_PASSENGER_INFO_ATTRIBUTE, reusedGroup.companions);
                redirectTo(res, '/defineTimeRestrictions');
                return;
            }

            updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, { passengerType });

            if (passengerType === GROUP_PASSENGER_TYPE) {
                redirectTo(res, '/groupSize');
                return;
            }

            const noc = getAndValidateNoc(req, res);
            const storedPassengerType = await getPassengerTypeByNameAndNocCode(noc, passengerType, false);
            if (storedPassengerType) {
                updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, storedPassengerType);
                redirectTo(res, getPassengerTypeRedirectLocation(req, passengerType));
                return;
            }

            if (passengerType === 'anyone') {
                redirectTo(res, '/defineTimeRestrictions');
                return;
            }

            redirectTo(res, '/definePassengerType');
            return;
        }

        const errors: ErrorInfo[] = [
            {
                id: `passenger-type-${GROUP_PASSENGER_TYPE}`,
                errorMessage: 'Choose a passenger type from the options',
            },
        ];

        updateSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE, {
            errors,
        });

        redirectTo(res, '/passengerType');
    } catch (error) {
        const message = 'There was a problem selecting the passenger type:';
        redirectToError(res, message, 'api.passengerType', error);
    }
};
