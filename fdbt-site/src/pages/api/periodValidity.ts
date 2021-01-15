import { NextApiResponse } from 'next';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { PRODUCT_DETAILS_ATTRIBUTE, PERIOD_EXPIRY_ATTRIBUTE, DURATION_VALID_ATTRIBUTE } from '../../constants';
import { redirectToError, redirectTo } from './apiUtils';
import { isSessionValid, isValid24hrTimeFormat } from './apiUtils/validator';
import { ErrorInfo, NextApiRequestWithSession, ProductData } from '../../interfaces';
import { isProductInfo } from '../productDetails';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const errors: ErrorInfo[] = [];

        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        if (req.body.periodValid) {
            const { periodValid, productEndTime } = req.body;

            const daysValidInfo = getSessionAttribute(req, DURATION_VALID_ATTRIBUTE);
            const productDetailsAttribute = getSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE);

            if (periodValid === 'endOfServiceDay') {
                if (productEndTime === '') {
                    errors.push({ id: 'product-end-time', errorMessage: 'Specify an end time for service day' });
                } else if (!isValid24hrTimeFormat(productEndTime)) {
                    if (productEndTime === '2400') {
                        errors.push({
                            id: 'product-end-time',
                            errorMessage: '2400 is not a valid input. Use 0000.',
                        });
                    } else {
                        errors.push({ id: 'product-end-time', errorMessage: 'Time must be in 2400 format' });
                    }
                }

                if (errors.length > 0) {
                    updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, { products: [], errors });
                    redirectTo(res, '/periodValidity');
                    return;
                }
            }

            if (!isProductInfo(productDetailsAttribute) || !daysValidInfo) {
                throw new Error('Necessary session data not found for period validity API');
            }

            const { productName, productPrice } = productDetailsAttribute;
            const timePeriodValid = `${daysValidInfo.amount} ${daysValidInfo.duration}${
                daysValidInfo.amount === '1' ? '' : 's'
            }`;

            const periodExpiryAttributeValue: ProductData = {
                products: [
                    {
                        productName,
                        productPrice,
                        productDuration: timePeriodValid,
                        productValidity: periodValid,
                        productEndTime: productEndTime || '',
                    },
                ],
            };

            updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, periodExpiryAttributeValue);

            redirectTo(res, '/ticketConfirmation');
        } else {
            errors.push({
                id: 'period-end-calendar',
                errorMessage: 'Choose an option regarding your period ticket validity',
            });
            updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, { products: [], errors });
            redirectTo(res, '/periodValidity');
        }
    } catch (error) {
        const message = 'There was a problem selecting the period validity:';
        redirectToError(res, message, 'api.periodValidity', error);
    }
};
