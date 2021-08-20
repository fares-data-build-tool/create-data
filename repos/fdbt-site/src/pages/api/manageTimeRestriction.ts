import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import { getTimeRestrictionByNameAndNoc, insertTimeRestriction } from '../../data/auroradb';
import { removeAllWhiteSpace, removeExcessWhiteSpace, isValid24hrTimeFormat } from './apiUtils/validator';
import { NextApiRequestWithSession, ErrorInfo, FullTimeRestriction, TimeBand } from '../../interfaces';
import { redirectToError, redirectTo, getAndValidateNoc } from './apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';
import { GS_TIME_RESTRICTION_ATTRIBUTE } from '../../constants/attributes';
import { TimeRestrictionDay } from 'shared/matchingJsonTypes';

export const collectInputsFromRequest = (
    req: NextApiRequestWithSession,
    timeRestrictionDays: TimeRestrictionDay[],
): FullTimeRestriction[] => {
    const fullTimeRestrictions: FullTimeRestriction[] = timeRestrictionDays.map((day) => {
        const startTimeInputs = req.body[`startTime${day}`];
        const endTimeInputs = req.body[`endTime${day}`];
        if (isArray(startTimeInputs) && isArray(endTimeInputs)) {
            const timeBands = startTimeInputs.map((startTime, index) => ({
                startTime: removeAllWhiteSpace(startTime),
                endTime: removeAllWhiteSpace(endTimeInputs[index]),
            }));

            return {
                day,
                timeBands,
            };
        } else {
            return {
                day,
                timeBands: [
                    {
                        startTime: removeAllWhiteSpace(startTimeInputs),
                        endTime: removeAllWhiteSpace(endTimeInputs),
                    },
                ],
            };
        }
    });
    return fullTimeRestrictions;
};

export const collectErrors = (refinedName: string, fullTimeRestrictions: FullTimeRestriction[]): ErrorInfo[] => {
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

            if (timeBand.endTime && !isValid24hrTimeFormat(timeBand.endTime)) {
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
        });
    });

    return errors;
};

export const removeDuplicateAndEmptyTimebands = (fullTimeRestrictions: FullTimeRestriction[]): FullTimeRestriction[] =>
    fullTimeRestrictions.map((fullTimeRestriction) => {
        const timeBands: TimeBand[] = fullTimeRestriction.timeBands.reduce((unique, o) => {
            if (!unique.some((obj) => obj.startTime === o.startTime && obj.endTime === o.endTime)) {
                unique.push(o);
            }
            return unique;
        }, [] as TimeBand[]);

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
        const inputs = collectInputsFromRequest(req, timeRestrictionDaysArray);
        const sanitisedInputs = removeDuplicateAndEmptyTimebands(inputs);
        const errors = collectErrors(refinedName, sanitisedInputs);

        if (errors.length === 0) {
            const noc = getAndValidateNoc(req, res);

            const results = await getTimeRestrictionByNameAndNoc(refinedName, noc);

            if (results.length > 0) {
                errors.push({
                    errorMessage: `You already have a time restriction named ${refinedName}. Choose another name.`,
                    id: 'time-restriction-name',
                    userInput: refinedName,
                });
            } else {
                await insertTimeRestriction(noc, sanitisedInputs, refinedName);
            }
        }

        if (errors.length > 0) {
            updateSessionAttribute(req, GS_TIME_RESTRICTION_ATTRIBUTE, {
                inputs: {
                    id: 0,
                    name: refinedName,
                    contents: sanitisedInputs,
                },
                errors,
            });

            redirectTo(res, '/manageTimeRestriction');
            return;
        }

        updateSessionAttribute(req, GS_TIME_RESTRICTION_ATTRIBUTE, undefined);
        redirectTo(res, `/viewTimeRestrictions`);
        return;
    } catch (error) {
        const message = 'There was a problem with the user creating their time restriction:';
        redirectToError(res, message, 'api.manageTimeRestriction', error);
    }
};
