import { NextApiResponse } from 'next';
import { updateSessionAttribute } from '../../utils/sessions';
import { PERIOD_EXPIRY_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from './apiUtils';
import { ErrorInfo, NextApiRequestWithSession, PeriodExpiry } from '../../interfaces';
import { getFareDayEnd } from '../../data/auroradb';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const errors: ErrorInfo[] = [];

        if (req.body.periodValid) {
            const { periodValid } = req.body;
            let { productEndTime } = req.body;
            let endOfFareDay = await getFareDayEnd(getAndValidateNoc(req, res));
            console.log(endOfFareDay);
            console.log('aaron42');
            if (periodValid === 'endOfServiceDay') {
                if (!endOfFareDay) {
                    errors.push({
                        id: 'product-end-time',
                        errorMessage: 'No fare day end defined.',
                        userInput: productEndTime,
                    });

                    updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, errors);
                    redirectTo(res, '/periodValidity');

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
            console.log(periodExpiryAttributeValue);
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
