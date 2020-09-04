import { NextApiResponse } from 'next';
import { getUuidFromCookie, redirectTo, redirectToError } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { PERIOD_TYPE_ATTRIBUTE } from '../../constants';
import { NextApiRequestWithSession } from '../../interfaces';
import { updateSessionAttribute } from '../../utils/sessions';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        if (req.body.periodType) {
            const { periodType } = req.body;
            const uuid = getUuidFromCookie(req, res);
            const periodTypeObject = { name: periodType, uuid };
            updateSessionAttribute(req, PERIOD_TYPE_ATTRIBUTE, periodTypeObject);

            switch (periodType) {
                case 'periodGeoZone':
                    redirectTo(res, '/csvZoneUpload');
                    return;
                case 'periodMultipleServices':
                    redirectTo(res, '/serviceList?selectAll=false');
                    return;
                case 'periodMultipleOperators':
                    return;
                default:
                    throw new Error('Type of period we expect was not received.');
            }
        } else {
            updateSessionAttribute(req, PERIOD_TYPE_ATTRIBUTE, {
                errors: [
                    { errorMessage: 'Choose an option regarding your period ticket type', id: 'period-type-error' },
                ],
            });
            redirectTo(res, '/periodType');
        }
    } catch (error) {
        const message = 'There was a problem selecting the type of period ticket:';
        redirectToError(res, message, 'api.periodType', error);
    }
};
