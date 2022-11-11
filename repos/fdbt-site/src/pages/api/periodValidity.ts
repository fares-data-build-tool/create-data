import { NextApiResponse } from 'next';
import { updateSessionAttribute } from '../../utils/sessions';
import { PERIOD_EXPIRY_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getFareDayEnd } from '../../data/auroradb';
import { PeriodExpiry } from '../../interfaces/matchingJsonTypes';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const errors: ErrorInfo[] = [];
        if (req.body.periodValid) {
            const { periodValid } = req.body;
            let { productEndTime } = req.body;
            const endOfFareDay = await getFareDayEnd(getAndValidateNoc(req, res));

            if (periodValid === 'fareDayEnd') {
                if (!endOfFareDay) {
                    errors.push({
                        id: 'product-end-time',
                        errorMessage: 'No fare day end defined',
                        userInput: productEndTime,
                    });

                    updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, errors);
                    redirectTo(res, '/selectPeriodValidity');

                    return;
                } else {
                    productEndTime = endOfFareDay;
                }
            } else {
                productEndTime = '';
            }

            const periodExpiryAttributeValue: PeriodExpiry = {
                productValidity: periodValid,
                productEndTime: productEndTime || '',
            };

            updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, periodExpiryAttributeValue);

            redirectTo(res, '/ticketConfirmation');
        } else {
            errors.push({
                id: 'period-end-calendar',
                errorMessage: 'Choose an option regarding your period ticket validity',
            });
            updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, errors);
            redirectTo(res, '/periodValidity');
        }
    } catch (error) {
        const message = 'There was a problem selecting the period validity:';
        redirectToError(res, message, 'api.periodValidity', error);
    }
};
