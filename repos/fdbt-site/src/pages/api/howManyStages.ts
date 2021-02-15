import { NextApiResponse } from 'next';
import { redirectToError, redirectTo } from './apiUtils/index';
import { NUMBER_OF_STAGES_ATTRIBUTE } from '../../constants/attributes';
import { updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (req.body.howManyStages) {
            switch (req.body.howManyStages) {
                case 'lessThan20':
                    redirectTo(res, '/chooseStages');
                    return;
                case 'moreThan20':
                    redirectTo(res, '/csvUpload');
                    return;
                default:
                    throw new Error('number of fare stages we expect was not received.');
            }
        } else {
            updateSessionAttribute(req, NUMBER_OF_STAGES_ATTRIBUTE, {
                errors: [
                    {
                        id: 'less-than-20-fare-stages',
                        errorMessage: 'Choose an option regarding how many fare stages you have',
                    },
                ],
            });
            redirectTo(res, '/howManyStages');
        }
    } catch (error) {
        const message = 'There was a problem selecting how many fares stages the triangle has:';
        redirectToError(res, message, 'api.howManyStages', error);
    }
};
