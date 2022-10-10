import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import {
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
} from '../../constants/attributes';
import { getTimeRestrictionByNameAndNoc, getFareDayEnd } from '../../data/auroradb';
import { NextApiRequestWithSession, TimeRestriction, TimeRestrictionsDefinitionWithErrors } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils/index';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { timeRestrictionChoice, validDays, timeRestriction } = req.body;
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

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

                redirectTo(res, '/selectTimeRestrictions');

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

            const fareDayEnd = await getFareDayEnd(noc);

            const dbTimeRestriction = results[0];
            const timeRestrictions = dbTimeRestriction.contents.map((timeRestriction) => ({
                ...timeRestriction,
                timeBands: timeRestriction.timeBands.map((timeBand) => {
                    let endTime: string;
                    if (typeof timeBand.endTime === 'string') {
                        endTime = timeBand.endTime;
                    } else {
                        if (!fareDayEnd) {
                            throw new Error('No fare day end set for time restriction');
                        }

                        endTime = fareDayEnd;
                    }

                    return {
                        ...timeBand,
                        endTime: endTime,
                    };
                }),
            }));

            // if in edit mode
            if (ticket && matchingJsonMetaData) {
                const updatedTicket = {
                    ...ticket,
                    timeRestriction: { id: dbTimeRestriction.id },
                };

                await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);

                updateSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, undefined);

                updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, undefined);

                redirectTo(
                    res,
                    `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                        matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
                    }`,
                );
                return;
            }

            updateSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, {
                fullTimeRestrictions: timeRestrictions,
                errors: [],
                id: dbTimeRestriction.id,
            });

            updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, undefined);

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

            redirectTo(res, '/selectTimeRestrictions');

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

        // if in edit mode
        if (ticket && matchingJsonMetaData) {
            const updatedTicket = {
                ...ticket,
                timeRestriction: undefined,
            };

            await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
            updateSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, undefined);

            redirectTo(
                res,
                `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                    matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
                }`,
            );
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
