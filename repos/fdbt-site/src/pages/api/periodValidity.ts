import { NextApiResponse } from 'next';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getFareDayEnd } from '../../data/auroradb';
import { PeriodExpiry, Ticket, WithIds } from '../../interfaces/matchingJsonTypes';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const errors: ErrorInfo[] = [];
        if (req.body.periodValid) {
            const { periodValid } = req.body;

            let productEndTime = '';
            const endOfFareDay = await getFareDayEnd(getAndValidateNoc(req, res));

            const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
            const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

            if (periodValid === 'fareDayEnd') {
                if (!endOfFareDay) {
                    errors.push({
                        id: 'product-end-time',
                        errorMessage: 'No fare day end defined',
                    });

                    updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, errors);
                    redirectTo(res, '/selectPeriodValidity');

                    return;
                } else {
                    productEndTime = endOfFareDay;
                }
            }

            // redirected from the product details page
            if (ticket && matchingJsonMetaData) {
                const product = ticket.products[0];
                const updatedProduct = { ...product, productValidity: periodValid, productEndTime: productEndTime };

                // edit mode
                const updatedTicket: WithIds<Ticket> = {
                    ...ticket,
                    products: [updatedProduct],
                };

                // put the now updated matching json into s3
                await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
                updateSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE, undefined);
                redirectTo(
                    res,
                    `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                        matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
                    }`,
                );
                return;
            }

            const periodExpiryAttributeValue: PeriodExpiry = {
                productValidity: periodValid,
                productEndTime: productEndTime,
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
