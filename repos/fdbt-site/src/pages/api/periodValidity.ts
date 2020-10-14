import { NextApiResponse } from 'next';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { PRODUCT_DETAILS_ATTRIBUTE, PERIOD_EXPIRY_ATTRIBUTE, DAYS_VALID_ATTRIBUTE } from '../../constants';
import { redirectToError, redirectTo } from './apiUtils';
import { isSessionValid } from './apiUtils/validator';
import { NextApiRequestWithSession, ProductData } from '../../interfaces';
import { isProductInfo } from '../productDetails';

export interface PeriodExpiryWithErrors {
    errorMessage: string;
}

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }

        if (req.body.periodValid) {
            const { periodValid } = req.body;

            const daysValidInfo = getSessionAttribute(req, DAYS_VALID_ATTRIBUTE);
            const productDetailsAttribute = getSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE);

            if (!isProductInfo(productDetailsAttribute) || !daysValidInfo) {
                throw new Error('Necessary session data not found for period validity API');
            }

            const { productName, productPrice } = productDetailsAttribute;
            const { daysValid } = daysValidInfo;

            const periodExpiryAttributeValue: ProductData = {
                products: [
                    {
                        productName,
                        productPrice,
                        productDuration: daysValid,
                        productValidity: periodValid,
                    },
                ],
            };

            updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, periodExpiryAttributeValue);

            redirectTo(res, '/ticketConfirmation');
        } else {
            const periodExpiryAttributeError: PeriodExpiryWithErrors = {
                errorMessage: 'Choose an option regarding your period ticket validity',
            };
            updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, periodExpiryAttributeError);
            redirectTo(res, '/periodValidity');
        }
    } catch (error) {
        const message = 'There was a problem selecting the period validity:';
        redirectToError(res, message, 'api.periodValidity', error);
    }
};
