import { NextApiResponse } from 'next';
import { updateSessionAttribute } from '../../utils/sessions';
import { CAP_START_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo } from '../../utils/apiUtils';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { CapStartInfo } from '../../../src/interfaces/matchingJsonTypes';

export const isADayOfTheWeek = (input: string | undefined): boolean => {
    const daysOfWeek: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return !!input && daysOfWeek.includes(input);
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const errors: ErrorInfo[] = [];
        const { capStart, startDay } = req.body;
        if (capStart === 'fixedWeekdays' || capStart === 'rollingDays') {
            if (capStart === 'fixedWeekdays') {
                if (!isADayOfTheWeek(startDay)) {
                    errors.push({
                        id: 'start',
                        errorMessage: 'Select a start day',
                    });

                    updateSessionAttribute(req, CAP_START_ATTRIBUTE, errors);
                    redirectTo(res, '/defineCapStart');

                    return;
                }
            }

            const capStartAttributeValue: CapStartInfo = {
                type: capStart,
                startDay: capStart === 'rollingDays' ? undefined : startDay,
            };

            updateSessionAttribute(req, CAP_START_ATTRIBUTE, capStartAttributeValue);

            // redirect to next page, once work is completed
            // and add test to make sure data is stored in session
            updateSessionAttribute(req, CAP_START_ATTRIBUTE, [{ errorMessage: 'Next page to be made soon!', id: '' }]);
            redirectTo(res, '/defineCapStart');
            return;
        } else {
            errors.push({
                id: 'fixed-weekdays',
                errorMessage: 'Choose an option regarding your cap ticket start',
            });
            updateSessionAttribute(req, CAP_START_ATTRIBUTE, errors);
            redirectTo(res, '/defineCapStart');
            return;
        }
    } catch (error) {
        const message = 'There was a problem selecting the cap start:';
        redirectToError(res, message, 'api.defineCapStart', error);
    }
};
