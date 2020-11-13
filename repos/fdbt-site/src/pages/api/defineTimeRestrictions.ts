/* eslint-disable no-else-return */
import { NextApiResponse } from 'next';
import isArray from 'lodash/isArray';
import { redirectToError, redirectTo } from './apiUtils/index';
import {
    FARE_TYPE_ATTRIBUTE,
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
} from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';
import { ErrorInfo, NextApiRequestWithSession, TimeRestriction } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

interface TimeRestrictionsDefinition extends TimeRestriction {
    validDaysSelected?: string;
}

export interface TimeRestrictionsDefinitionWithErrors extends TimeRestrictionsDefinition {
    errors: ErrorInfo[];
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);

        if (!fareTypeAttribute) {
            throw new Error('Failed to retrieve the fareType attribute for the defineTimeRestrictions API');
        }

        const { validDaysSelected, validDays } = req.body;

        const timeRestrictionsDefinition: TimeRestriction = {
            validDays: [],
        };

        if (!validDaysSelected) {
            const timeRestrictionsDefinitionWithErrors: TimeRestrictionsDefinitionWithErrors = {
                validDays,
                validDaysSelected,
                errors: [{ errorMessage: 'Choose one of the options below', id: 'valid-days-required' }],
            };
            updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, timeRestrictionsDefinitionWithErrors);
            redirectTo(res, '/defineTimeRestrictions');
            return;
        }

        if (validDaysSelected === 'Yes') {
            if (!validDays || validDays.length === 0) {
                const timeRestrictionsDefinitionWithErrors: TimeRestrictionsDefinitionWithErrors = {
                    validDays,
                    validDaysSelected,
                    errors: [{ errorMessage: 'Select at least one day', id: 'monday' }],
                };
                updateSessionAttribute(
                    req,
                    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
                    timeRestrictionsDefinitionWithErrors,
                );
                redirectTo(res, '/defineTimeRestrictions');
                return;
            }
            if (isArray(validDays)) {
                timeRestrictionsDefinition.validDays = timeRestrictionsDefinition.validDays.concat(validDays);
            } else {
                timeRestrictionsDefinition.validDays.push(validDays);
            }
            updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, timeRestrictionsDefinition);
            redirectTo(res, '/chooseTimeRestrictions');
            return;
        } else {
            updateSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, { fullTimeRestrictions: [], errors: [] });
        }
        updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, timeRestrictionsDefinition);
        redirectTo(res, '/fareConfirmation');
        return;
    } catch (error) {
        const message = 'There was a problem in the defineTimeRestrictions API.';
        redirectToError(res, message, 'api.defineTimeRestrictions', error);
    }
};
