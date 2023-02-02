import { NextApiResponse } from 'next';
import { updateSessionAttribute } from '../../utils/sessions';
import { CAP_EXPIRY_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getFareDayEnd, upsertCapExpiry } from '../../data/auroradb';
import { CapExpiry } from '../../interfaces/matchingJsonTypes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const errors: ErrorInfo[] = [];
        const { capValid } = req.body;
        const noc = getAndValidateNoc(req, res);
        if (capValid) {
            let productEndTime = '';
            const endOfFareDay = await getFareDayEnd(noc);

            if (capValid === 'fareDayEnd') {
                if (!endOfFareDay) {
                    errors.push({
                        id: 'product-end-time',
                        errorMessage: 'No fare day end defined',
                    });

                    updateSessionAttribute(req, CAP_EXPIRY_ATTRIBUTE, errors);
                    redirectTo(res, '/selectCapValidity');

                    return;
                } else {
                    productEndTime = endOfFareDay;
                }
            }

            const capExpiryAttributeValue: CapExpiry = {
                productValidity: capValid,
                productEndTime: productEndTime,
            };

            await upsertCapExpiry(noc, capExpiryAttributeValue);

            redirectTo(res, '/viewCaps');
            return;
        } else {
            errors.push({
                id: 'cap-end-calendar',
                errorMessage: 'Choose an option regarding your cap ticket validity',
            });
            updateSessionAttribute(req, CAP_EXPIRY_ATTRIBUTE, errors);
            redirectTo(res, '/selectCapValidity');
            return;
        }
    } catch (error) {
        const message = 'There was a problem selecting the cap validity:';
        redirectToError(res, message, 'api.capValidity', error);
    }
};
