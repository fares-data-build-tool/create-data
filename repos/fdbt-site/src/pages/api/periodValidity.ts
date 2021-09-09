import { NextApiResponse } from 'next';
import { updateSessionAttribute } from '../../utils/sessions';
import { PERIOD_EXPIRY_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from './apiUtils';
import { ErrorInfo, NextApiRequestWithSession, PeriodExpiry } from '../../interfaces';
import { getFareDayEnd } from '../../data/auroradb';
import { isValid24hrTimeFormat } from './apiUtils/validator';
import { globalSettingsEnabled } from '../../constants/featureFlag';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const errors: ErrorInfo[] = [];
        if (req.body.periodValid) {
            const { periodValid } = req.body;
            let { productEndTime } = req.body;
            const endOfFareDay = await getFareDayEnd(getAndValidateNoc(req, res));

            if (periodValid === 'endOfServiceDay') {
                if (globalSettingsEnabled) {
                    if (!endOfFareDay) {
                        errors.push({
                            id: 'product-end-time',
                            errorMessage: 'No fare day end defined.',
                            userInput: productEndTime,
                        });

                        updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, errors);
                        redirectTo(res, '/globalSettingsPeriodValidity');

                        return;
                    } else {
                        productEndTime = endOfFareDay;
                    }
                } else {
                    if (productEndTime === '') {
                        errors.push({ id: 'product-end-time', errorMessage: 'Specify an end time for service day' });
                    } else if (!isValid24hrTimeFormat(productEndTime)) {
                        if (productEndTime === '2400') {
                            errors.push({
                                id: 'product-end-time',
                                errorMessage: '2400 is not a valid input. Use 0000.',
                                userInput: productEndTime,
                            });
                        } else {
                            errors.push({
                                id: 'product-end-time',
                                errorMessage: 'Time must be in 2400 format',
                                userInput: productEndTime,
                            });
                        }
                    }

                    if (errors.length > 0) {
                        updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, errors);
                        redirectTo(res, '/periodValidity');
                        return;
                    }
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
