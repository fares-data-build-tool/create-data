import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import { DbTimeBand, TimeRestrictionDay } from 'fdbt-types/matchingJsonTypes';
import { GS_TIME_RESTRICTION_ATTRIBUTE } from '../../constants/attributes';
import {
    getTimeRestrictionByNameAndNoc,
    insertTimeRestriction,
    updateTimeRestriction,
    getFareDayEnd,
} from '../../data/auroradb';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils';
import { isValid24hrTimeFormat, removeAllWhiteSpace, removeExcessWhiteSpace } from '../../utils/apiUtils/validator';
import { toArray } from '../../utils';
import { DbTimeRestriction } from 'fdbt-types/dbTypes';

export const collectInputsFromRequest = (
    req: NextApiRequestWithSession,
    timeRestrictionDays: TimeRestrictionDay[],
): DbTimeRestriction[] =>
    timeRestrictionDays.map((day) => {
        const startTimeInputs = toArray(req.body[`startTime${day}`]);
        const endTimeInputs = toArray(req.body[`endTime${day}`]);
        const fareDayEnd = !!req.body[`fareDayEnd${day}`];

        const timeBands = startTimeInputs.map((startTime, index) => ({
            startTime: removeAllWhiteSpace(startTime),
            endTime:
                fareDayEnd && index === startTimeInputs.length - 1
                    ? { fareDayEnd: true }
                    : removeAllWhiteSpace(endTimeInputs[index]),
        }));

        return {
            day,
            timeBands,
        };
    });

export const collectErrors = (
    refinedName: string,
    fullTimeRestrictions: DbTimeRestriction[],
    fareDayEnd: string | undefined,
): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];

    if (!refinedName) {
        errors.push({
            errorMessage: `Time restriction name is required.`,
            id: 'time-restriction-name',
            userInput: refinedName,
        });
    }

    if (!fullTimeRestrictions.length) {
        errors.push({ errorMessage: `You must select at least one day.`, id: 'time-restriction-days' });
    }

    fullTimeRestrictions.forEach((fullTimeRestriction) => {
        fullTimeRestriction.timeBands.forEach((timeBand, index) => {
            if (timeBand.startTime && !isValid24hrTimeFormat(timeBand.startTime)) {
                if (timeBand.startTime === '2400') {
                    errors.push({
                        errorMessage: '2400 is not a valid fullTimeRestriction. Use 0000.',
                        id: `start-time-${fullTimeRestriction.day}-${index}`,
                        userInput: timeBand.startTime,
                    });
                } else {
                    errors.push({
                        errorMessage: 'Time must be in 24hr format.',
                        id: `start-time-${fullTimeRestriction.day}-${index}`,
                        userInput: timeBand.startTime,
                    });
                }
            }

            if (typeof timeBand.endTime === 'string' && timeBand.endTime && !isValid24hrTimeFormat(timeBand.endTime)) {
                if (timeBand.endTime === '2400') {
                    errors.push({
                        errorMessage: '2400 is not a valid input. Use 0000.',
                        id: `end-time-${fullTimeRestriction.day}-${index}`,
                        userInput: timeBand.endTime,
                    });
                } else {
                    errors.push({
                        errorMessage: 'Time must be in 24hr format.',
                        id: `end-time-${fullTimeRestriction.day}-${index}`,
                        userInput: timeBand.endTime,
                    });
                }
            }

            if (
                isValid24hrTimeFormat(timeBand.startTime) &&
                typeof timeBand.endTime === 'string' &&
                isValid24hrTimeFormat(timeBand.endTime) &&
                timeBand.startTime === timeBand.endTime
            ) {
                errors.push({
                    errorMessage: 'Start time and end time cannot be the same.',
                    id: `start-time-${fullTimeRestriction.day}-${index}`,
                    userInput: timeBand.startTime,
                });
            }

            if (timeBand.endTime && !timeBand.startTime) {
                errors.push({
                    errorMessage: 'Start time is required if end time is provided.',
                    id: `start-time-${fullTimeRestriction.day}-${index}`,
                    userInput: '',
                });
            }

            if (typeof timeBand.endTime === 'object' && !fareDayEnd) {
                errors.push({
                    errorMessage: 'You do not have a fare day end time defined.',
                    id: `end-time-${fullTimeRestriction.day}-${index}`,
                });
            }
        });
    });

    return errors;
};

export const removeDuplicateAndEmptyTimebands = (fullTimeRestrictions: DbTimeRestriction[]): DbTimeRestriction[] =>
    fullTimeRestrictions.map((fullTimeRestriction) => {
        const timeBands: DbTimeBand[] = fullTimeRestriction.timeBands.reduce((unique, o) => {
            if (!unique.some((obj) => obj.startTime === o.startTime && obj.endTime === o.endTime)) {
                unique.push(o);
            }
            return unique;
        }, [] as DbTimeBand[]);

        const filteredTimeBands = timeBands.filter((timeBand) => timeBand.startTime || timeBand.endTime);

        return {
            day: fullTimeRestriction.day,
            timeBands: filteredTimeBands,
        };
    });

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { timeRestrictionName, timeRestrictionDays } = req.body;

        const refinedName = removeExcessWhiteSpace(timeRestrictionName || '');

        const timeRestrictionDaysArray = timeRestrictionDays
            ? isArray(timeRestrictionDays)
                ? timeRestrictionDays
                : [timeRestrictionDays]
            : [];
        const id = req.body.id && Number(req.body.id);
        const inputs = collectInputsFromRequest(req, timeRestrictionDaysArray);
        const sanitisedInputs = removeDuplicateAndEmptyTimebands(inputs);
        const noc = getAndValidateNoc(req, res);
        const errors = collectErrors(refinedName, sanitisedInputs, await getFareDayEnd(noc));

        if (errors.length === 0) {
            const results = await getTimeRestrictionByNameAndNoc(refinedName, noc);

            if (results.some((restriction) => restriction.id !== id)) {
                errors.push({
                    errorMessage: `You already have a time restriction named ${refinedName}. Choose another name.`,
                    id: 'time-restriction-name',
                    userInput: refinedName,
                });
            }
        }

        if (errors.length > 0) {
            updateSessionAttribute(req, GS_TIME_RESTRICTION_ATTRIBUTE, {
                inputs: {
                    id: id,
                    name: refinedName,
                    contents: sanitisedInputs,
                },
                errors,
            });

            redirectTo(res, `/manageTimeRestriction${id ? `?id=${id}` : ''}`);
        } else {
            await (id
                ? updateTimeRestriction(id, noc, sanitisedInputs, refinedName)
                : insertTimeRestriction(noc, sanitisedInputs, refinedName));
            updateSessionAttribute(req, GS_TIME_RESTRICTION_ATTRIBUTE, undefined);
            redirectTo(res, `/viewTimeRestrictions`);
        }
    } catch (error) {
        const message = 'There was a problem with the user creating their time restriction:';
        redirectToError(res, message, 'api.manageTimeRestriction', error);
    }
};
