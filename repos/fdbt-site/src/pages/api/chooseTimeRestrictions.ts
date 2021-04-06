import isArray from 'lodash/isArray';
import { NextApiResponse } from 'next';
import { getTimeRestrictionByNameAndNoc, insertTimeRestriction } from '../../data/auroradb';
import { removeAllWhiteSpace, removeExcessWhiteSpace } from './apiUtils/validator';
import { NextApiRequestWithSession, TimeRestriction, ErrorInfo, FullTimeRestriction, TimeBand } from '../../interfaces';
import { redirectToError, redirectTo, getAndValidateNoc } from './apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, FULL_TIME_RESTRICTIONS_ATTRIBUTE } from '../../constants/attributes';

export const isValid24hrTimeFormat = (time: string): boolean => RegExp('^([2][0-3]|[0-1][0-9])[0-5][0-9]$').test(time);

export const collectInputsFromRequest = (
    req: NextApiRequestWithSession,
    chosenDays: string[],
): FullTimeRestriction[] => {
    const timeRestrictions: FullTimeRestriction[] = [];
    chosenDays.forEach(day => {
        const startTimeInputs = req.body[`startTime${day}`];
        const endTimeInputs = req.body[`endTime${day}`];
        if (isArray(startTimeInputs) && isArray(endTimeInputs)) {
            const timeBands = startTimeInputs.map((startTime, index) => {
                return {
                    startTime: removeAllWhiteSpace(startTime),
                    endTime: removeAllWhiteSpace(endTimeInputs[index]),
                };
            });
            timeRestrictions.push({
                day,
                timeBands,
            });
        } else {
            timeRestrictions.push({
                day,
                timeBands: [
                    {
                        startTime: removeAllWhiteSpace(startTimeInputs),
                        endTime: removeAllWhiteSpace(endTimeInputs),
                    },
                ],
            });
        }
    });
    return timeRestrictions;
};

export const collectErrors = (userInputs: FullTimeRestriction[]): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];
    userInputs.forEach(input => {
        input.timeBands.forEach((timeBand, index) => {
            if (timeBand.startTime && !isValid24hrTimeFormat(timeBand.startTime)) {
                if (timeBand.startTime === '2400') {
                    errors.push({
                        errorMessage: '2400 is not a valid input. Use 0000.',
                        id: `start-time-${input.day}-${index}`,
                        userInput: timeBand.startTime,
                    });
                } else {
                    errors.push({
                        errorMessage: 'Time must be in 24hr format',
                        id: `start-time-${input.day}-${index}`,
                        userInput: timeBand.startTime,
                    });
                }
            }

            if (timeBand.endTime && !isValid24hrTimeFormat(timeBand.endTime)) {
                if (timeBand.endTime === '2400') {
                    errors.push({
                        errorMessage: '2400 is not a valid input. Use 0000.',
                        id: `end-time-${input.day}-${index}`,
                        userInput: timeBand.endTime,
                    });
                } else {
                    errors.push({
                        errorMessage: 'Time must be in 24hr format',
                        id: `end-time-${input.day}-${index}`,
                        userInput: timeBand.endTime,
                    });
                }
            }

            if (
                isValid24hrTimeFormat(timeBand.startTime) &&
                isValid24hrTimeFormat(timeBand.endTime) &&
                timeBand.startTime === timeBand.endTime
            ) {
                errors.push(
                    {
                        errorMessage: 'Start time and end time cannot be the same',
                        id: `start-time-${input.day}-${index}`,
                        userInput: timeBand.startTime,
                    },
                    {
                        errorMessage: 'Start time and end time cannot be the same',
                        id: `end-time-${input.day}-${index}`,
                        userInput: timeBand.endTime,
                    },
                );
            }

            if (timeBand.endTime && !timeBand.startTime) {
                errors.push({
                    errorMessage: 'Start time is required if end time is provided',
                    id: `start-time-${input.day}-${index}`,
                    userInput: '',
                });
            }
        });
    });
    return errors;
};

export const removeDuplicateAndEmptyTimebands = (inputs: FullTimeRestriction[]): FullTimeRestriction[] => {
    const cleansedInputs = inputs.map(input => {
        return {
            ...input,
            timeBands: input.timeBands.reduce((unique, o) => {
                if (!unique.some(obj => obj.startTime === o.startTime && obj.endTime === o.endTime)) {
                    unique.push(o);
                }
                return unique;
            }, [] as TimeBand[]),
        };
    });

    return cleansedInputs.map(cleansedInput => {
        const timeBands: TimeBand[] = [];
        cleansedInput.timeBands.forEach(timeBand => {
            if (timeBand.startTime || timeBand.endTime) {
                timeBands.push(timeBand);
            }
        });
        return {
            day: cleansedInput.day,
            timeBands,
        };
    });
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { timeRestrictionName } = req.body;
        const refinedName = removeExcessWhiteSpace(timeRestrictionName || '');
        const chosenDays = (getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE) as TimeRestriction)
            .validDays;

        const inputs = collectInputsFromRequest(req, chosenDays);
        const sanitisedInputs = removeDuplicateAndEmptyTimebands(inputs);
        const errors: ErrorInfo[] = collectErrors(sanitisedInputs);
        let createdANewTimeRestriction = false;
        if (errors.length === 0 && refinedName) {
            const noc = getAndValidateNoc(req, res);

            const results = await getTimeRestrictionByNameAndNoc(refinedName, noc);

            if (results.length > 0) {
                errors.push({
                    errorMessage: `You already have a time restriction named ${refinedName}. Choose another name.`,
                    id: 'time-restrictions-name',
                    userInput: refinedName,
                });
            } else {
                insertTimeRestriction(noc, sanitisedInputs, refinedName);
                createdANewTimeRestriction = true;
            }
        }

        updateSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, {
            fullTimeRestrictions: sanitisedInputs,
            errors,
        });

        if (errors.length > 0) {
            redirectTo(res, '/chooseTimeRestrictions');
            return;
        }

        redirectTo(
            res,
            `/fareConfirmation${createdANewTimeRestriction ? `?createdTimeRestriction=${refinedName}` : ''}`,
        );
        return;
    } catch (error) {
        const message = 'There was a problem with the user selecting their time restriction times:';
        redirectToError(res, message, 'api.chooseTimeRestrictions', error);
    }
};
