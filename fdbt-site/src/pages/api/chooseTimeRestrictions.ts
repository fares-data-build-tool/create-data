import { NextApiResponse } from 'next';
import { isSessionValid, removeAllWhiteSpace } from './apiUtils/validator';
import { NextApiRequestWithSession, TimeRestriction, ErrorInfo, FullTimeRestriction } from '../../interfaces';
import { redirectToError, redirectTo } from './apiUtils';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, FULL_TIME_RESTRICTIONS_ATTRIBUTE } from '../../constants';

export const isValidTime = (time: string): boolean => RegExp('^([2][0-3]|[0-1][0-9])[0-5][0-9]$').test(time);

export const collectInputsFromRequest = (
    req: NextApiRequestWithSession,
    chosenDays: string[],
): FullTimeRestriction[] => {
    return chosenDays.map(day => {
        const startTime = removeAllWhiteSpace(req.body[`startTime${day}`]);
        const endTime = removeAllWhiteSpace(req.body[`endTime${day}`]);
        return {
            day,
            startTime,
            endTime,
        };
    });
};

export const collectErrors = (userInputs: FullTimeRestriction[]): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];
    userInputs.forEach(input => {
        if (input.startTime && !isValidTime(input.startTime)) {
            if (input.startTime === '2400') {
                errors.push({
                    errorMessage: '2400 is not a valid input. Use 0000.',
                    id: `start-time-${input.day}`,
                    userInput: input.startTime,
                });
            } else {
                errors.push({
                    errorMessage: 'Time must be in 2400 format',
                    id: `start-time-${input.day}`,
                    userInput: input.startTime,
                });
            }
        }

        if (input.endTime && !isValidTime(input.endTime)) {
            if (input.endTime === '2400') {
                errors.push({
                    errorMessage: '2400 is not a valid input. Use 0000.',
                    id: `end-time-${input.day}`,
                    userInput: input.endTime,
                });
            } else {
                errors.push({
                    errorMessage: 'Time must be in 2400 format',
                    id: `end-time-${input.day}`,
                    userInput: input.endTime,
                });
            }
        }
    });
    return errors;
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }
        const chosenDays = (getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE) as TimeRestriction)
            .validDays;

        const inputs = collectInputsFromRequest(req, chosenDays);

        const errors: ErrorInfo[] = collectErrors(inputs);

        updateSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE, { fullTimeRestrictions: inputs, errors });

        if (errors.length > 0) {
            redirectTo(res, '/chooseTimeRestrictions');
            return;
        }

        redirectTo(res, '/fareConfirmation');
    } catch (error) {
        const message = 'There was a problem with the user selecting their time restriction times:';
        redirectToError(res, message, 'api.chooseTimeRestrictions', error);
    }
};
