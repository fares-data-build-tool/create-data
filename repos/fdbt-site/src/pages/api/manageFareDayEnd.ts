import { NextApiResponse } from 'next';
import { redirectTo, redirectToError, getAndValidateNoc } from './apiUtils';
import { updateSessionAttribute } from '../../utils/sessions';
import { NextApiRequestWithSession } from '../../interfaces';
import { GS_FARE_DAY_END_ATTRIBUTE } from '../../constants/attributes';
import { removeExcessWhiteSpace, isValid24hrTimeFormat } from './apiUtils/validator';
import { upsertFareDayEnd } from '../../data/auroradb';
import { fareDayEndInputId } from '../manageFareDayEnd';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const fareDayEnd = removeExcessWhiteSpace(req.body.fareDayEnd);

        if (isValid24hrTimeFormat(fareDayEnd)) {
            const noc = getAndValidateNoc(req, res);
            await upsertFareDayEnd(noc, fareDayEnd);

            updateSessionAttribute(req, GS_FARE_DAY_END_ATTRIBUTE, { saved: true });
        } else {
            updateSessionAttribute(req, GS_FARE_DAY_END_ATTRIBUTE, {
                input: fareDayEnd,
                errors: [{ id: fareDayEndInputId, errorMessage: 'Time must be in 24hr format' }],
            });
        }

        redirectTo(res, `/manageFareDayEnd`);
    } catch (err) {
        const message = 'There was a problem in the manage fare day end API.';
        redirectToError(res, message, 'api.manageFareDayEnd', err);
    }
};
