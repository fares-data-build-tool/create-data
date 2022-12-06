import { NextApiResponse } from 'next';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import {
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    CAP_EXPIRY_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectToError, redirectTo, getAndValidateNoc } from '../../utils/apiUtils';
import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { getFareDayEnd } from '../../data/auroradb';
import { CapExpiry, Ticket, WithIds } from '../../interfaces/matchingJsonTypes';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const errors: ErrorInfo[] = [];
        if (req.body.capValid) {
            const { capValid } = req.body;

            let productEndTime = '';
            const endOfFareDay = await getFareDayEnd(getAndValidateNoc(req, res));

            const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
            const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);

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

            // redirected from the product details page
            if (ticket && matchingJsonMetaData) {
                const product = ticket.products[0];
                const updatedProduct = { ...product, productValidity: capValid, productEndTime: productEndTime };

                // edit mode
                const updatedTicket: WithIds<Ticket> = {
                    ...ticket,
                    products: [updatedProduct],
                };

                // put the now updated matching json into s3
                await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
                updateSessionAttribute(req, CAP_EXPIRY_ATTRIBUTE, undefined);
                redirectTo(
                    res,
                    `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                        matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
                    }`,
                );
                return;
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
