import { NextApiResponse } from 'next';
import { redirectToError, redirectTo } from './apiUtils/index';
import { TERM_TIME_ATTRIBUTE } from '../../constants/attributes';
import { updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (req.body.termTime) {
            const termTime = req.body.termTime === 'Yes';
            updateSessionAttribute(req, TERM_TIME_ATTRIBUTE, { termTime });
            redirectTo(res, '/schoolFareType');
        } else {
            updateSessionAttribute(req, TERM_TIME_ATTRIBUTE, {
                termTime: false,
                errors: [
                    {
                        id: 'term-time-yes',
                        errorMessage: 'Choose an option below',
                    },
                ],
            });
            redirectTo(res, '/termTime');
        }
    } catch (error) {
        const message = 'There was a problem selecting whether the school ticket is valid during term time:';
        redirectToError(res, message, 'api.termTime', error);
    }
};
