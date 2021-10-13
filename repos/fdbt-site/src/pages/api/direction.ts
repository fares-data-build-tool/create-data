import { NextApiResponse } from 'next';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { DIRECTION_ATTRIBUTE } from '../../constants/attributes';
import { updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const direction = req.body.direction;

        if (!direction) {
            const errors = [
                {
                    errorMessage: 'Choose a direction from the options',
                    id: 'select-direction',
                },
            ];

            updateSessionAttribute(req, DIRECTION_ATTRIBUTE, { errors });

            redirectTo(res, '/direction');
        } else {
            updateSessionAttribute(req, DIRECTION_ATTRIBUTE, { direction });

            redirectTo(res, '/inputMethod');
        }
    } catch (error) {
        const message = 'There was a problem selecting the direction:';
        redirectToError(res, message, 'api.direction', error);
    }
};
