import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import { FULL_TIME_RESTRICTIONS_ATTRIBUTE, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../../constants/attributes';
import { getTimeRestrictionByNameAndNoc } from '../../data/auroradb';
import { NextApiRequestWithSession, TimeRestriction, TimeRestrictionsDefinitionWithErrors } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';
import { getAndValidateNoc, redirectTo, redirectToError } from './apiUtils/index';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { timeRestrictionChoice, validDays, timeRestriction } = req.body;
        if (timeRestrictionChoice === 'Premade') {
            if (!timeRestriction) {
                const timeRestrictionsDefinitionWithErrors: TimeRestrictionsDefinitionWithErrors = {
                    validDays: [],
                    timeRestrictionChoice,
                    errors: [{ errorMessage: 'Choose one of the premade time restrictions', id: 'time-restriction' }],
                };
                updateSessionAttribute(
                    req,
                    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
                    timeRestrictionsDefinitionWithErrors,
                );
                redirectTo(res, '/defineTimeRestrictions');
                return;
            }
            const noc = getAndValidateNoc(req, res);
            if (!noc) {
                throw new Error('Could not find users NOC code.');
            }
            const results = await getTimeRestrictionByNameAndNoc(timeRestriction, noc);

            if (results.length > 1 || results.length === 0) {
                throw new Error(
                    `${results.length} results found - ${
                        results.length > 0
                            ? 'Multiple premade time restrictions with same name'
                            : `No premade time restrictions saved under ${timeRestriction}`
                    }`,
                );
            }

            updateSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, {
                fullTimeRestrictions: results[0].contents,
                errors: [],
            });
            redirectTo(res, '/fareConfirmation');
            return;
        }

        const timeRestrictionsDefinition: TimeRestriction = {
            validDays: [],
        };

        if (!timeRestrictionChoice) {
            const timeRestrictionsDefinitionWithErrors: TimeRestrictionsDefinitionWithErrors = {
                validDays,
                timeRestrictionChoice,
                errors: [{ errorMessage: 'Choose one of the options below', id: 'valid-days-required' }],
            };
            updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, timeRestrictionsDefinitionWithErrors);
            redirectTo(res, '/defineTimeRestrictions');
            return;
        }

        if (timeRestrictionChoice === 'Yes') {
            if (!validDays || validDays.length === 0) {
                const timeRestrictionsDefinitionWithErrors: TimeRestrictionsDefinitionWithErrors = {
                    validDays,
                    timeRestrictionChoice,
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
        }

        updateSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, { fullTimeRestrictions: [], errors: [] });
        updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, timeRestrictionsDefinition);
        redirectTo(res, '/fareConfirmation');
        return;
    } catch (error) {
        const message = 'There was a problem in the defineTimeRestrictions API.';
        redirectToError(res, message, 'api.defineTimeRestrictions', error);
    }
};
