import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { NextApiResponse } from 'next';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import {
    EDIT_CARNET_PROPERTIES_ERROR,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
} from '../../constants/attributes';
import { redirectTo, redirectToError } from '../../utils/apiUtils';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import { isValidInputDuration, removeExcessWhiteSpace, checkIntegerIsValid } from '../../utils/apiUtils/validator';

export const validateDuration = (carnetDuration: string, carnetExpiryUnit: string, quantity: string): ErrorInfo[] => {
    const errors: ErrorInfo[] = [];
    const trimmedExpiry = removeExcessWhiteSpace(carnetDuration);
    const expiryError =
        carnetExpiryUnit === 'no expiry' ? '' : checkIntegerIsValid(trimmedExpiry, 'Carnet expiry amount', 1, 999);
    const trimmedQuantity = removeExcessWhiteSpace(quantity);
    const quantityError = checkIntegerIsValid(trimmedQuantity, 'Quantity in bundle', 2, 999);
    const carnetExpiryUnitsError =
        !carnetExpiryUnit || !isValidInputDuration(carnetExpiryUnit, true) ? 'Choose an option from the dropdown' : '';
    if (quantityError) {
        errors.push({ id: 'edit-carnet-quantity', errorMessage: quantityError });
    }
    if (expiryError) {
        errors.push({ id: 'edit-carnet-expiry-duration', errorMessage: expiryError });
    }
    if (carnetExpiryUnitsError) {
        errors.push({ id: 'edit-carnet-expiry-unit', errorMessage: carnetExpiryUnitsError });
    }
    return errors;
};
export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const ticket = getSessionAttribute(req, MATCHING_JSON_ATTRIBUTE);
        const matchingJsonMetaData = getSessionAttribute(req, MATCHING_JSON_META_DATA_ATTRIBUTE);
        if (!ticket || !matchingJsonMetaData) {
            throw new Error('Ticket information cannot be undefined');
        }

        const { carnetExpiryUnit, carnetExpiryDuration, carnetQuantity } = req.body;

        const errors: ErrorInfo[] = validateDuration(carnetExpiryDuration, carnetExpiryUnit, carnetQuantity);

        if (errors.length > 0) {
            updateSessionAttribute(req, EDIT_CARNET_PROPERTIES_ERROR, errors);
            redirectTo(res, '/editCarnetProperties');
            return;
        }

        const updatedTicket = {
            ...ticket,
            products: [
                {
                    ...ticket.products[0],
                    carnetDetails: {
                        expiryTime: carnetExpiryUnit === 'no expiry' ? '' : carnetExpiryDuration,
                        expiryUnit: carnetExpiryUnit,
                        quantity: carnetQuantity,
                    },
                },
            ],
        };

        await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
        updateSessionAttribute(req, EDIT_CARNET_PROPERTIES_ERROR, undefined);
        redirectTo(
            res,
            `/products/productDetails?productId=${matchingJsonMetaData.productId}${
                matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData.serviceId}` : ''
            }`,
        );
        return;
    } catch (error) {
        const message = 'There was a problem editing period duration:';
        redirectToError(res, message, 'api.editCarnetProperties', error);
    }
};
