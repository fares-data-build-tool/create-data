import { NextApiResponse } from 'next';
import { updateSessionAttribute } from '../../utils/sessions';
import { CAP_EXPIRY_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getFareDayEnd } from '../../data/auroradb';
import { CapExpiry } from '../../interfaces/matchingJsonTypes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const errors: ErrorInfo[] = [];
        const { capValid } = req.body;
        if (capValid) {
            let productEndTime = '';
            const endOfFareDay = await getFareDayEnd(getAndValidateNoc(req, res));

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

            updateSessionAttribute(req, CAP_EXPIRY_ATTRIBUTE, capExpiryAttributeValue);

            // redirect to next page, once work is completed
            // and add test to make sure data is stored in session
            updateSessionAttribute(req, CAP_EXPIRY_ATTRIBUTE, [{ errorMessage: 'Next page to be made soon!', id: '' }]);
            redirectTo(res, '/selectCapValidity');

            redirectTo(res, '/ticketConfirmation');
        } else {
            errors.push({
                id: 'cap-end-calendar',
                errorMessage: 'Choose an option regarding your cap ticket validity',
            });
            updateSessionAttribute(req, CAP_EXPIRY_ATTRIBUTE, errors);
            redirectTo(res, '/selectCapValidity');
        }
    } catch (error) {
        const message = 'There was a problem selecting the cap validity:';
        redirectToError(res, message, 'api.capValidity', error);
    }
};
