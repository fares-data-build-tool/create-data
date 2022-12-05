import { ErrorInfo, NextApiRequestWithSession } from '../../interfaces';
import { NextApiResponse } from 'next';
import { getSessionAttribute, updateSessionAttribute } from '../../../src/utils/sessions';
import {
    EDIT_PERIOD_DURATION_ERROR,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
} from '../../../src/constants/attributes';
import { redirectTo, redirectToError } from '../../../src/utils/apiUtils';
import { putUserDataInProductsBucketWithFilePath } from '../../utils/apiUtils/userData';
import {
    checkDurationIsValid,
    isValidInputDuration,
    removeExcessWhiteSpace,
} from '../../../src/utils/apiUtils/validator';

const validateDuration = (productDuration: string, productDurationUnit: string): ErrorInfo[] => {
    const trimmedDuration = removeExcessWhiteSpace(productDuration);
    const errors: ErrorInfo[] = [];
    const productDurationError = checkDurationIsValid(trimmedDuration);
    const productDurationUnitError = !isValidInputDuration(productDurationUnit, false)
        ? 'Choose an option from the dropdown'
        : '';

    if (productDurationError) {
        errors.push({ id: 'product-duration', errorMessage: productDurationError });
    }
    if (productDurationUnitError) {
        errors.push({ id: 'product-duration-unit', errorMessage: productDurationUnitError });
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
        const productDurationValue = req.body.periodDurationInput;
        const productDurationUnit = req.body.periodDurationUnitsInput;

        const errors: ErrorInfo[] = validateDuration(productDurationValue, productDurationUnit);

        if (errors.length > 0) {
            updateSessionAttribute(req, EDIT_PERIOD_DURATION_ERROR, errors);
            redirectTo(res, '/editPeriodDuration');
            return;
        }

        const updatedTicket = {
            ...ticket,
            products: [
                {
                    ...ticket.products[0],
                    productDuration: `${productDurationValue} ${productDurationUnit}${
                        productDurationValue > 1 ? 's' : ''
                    }`,
                },
            ],
        };

        await putUserDataInProductsBucketWithFilePath(updatedTicket, matchingJsonMetaData.matchingJsonLink);
        updateSessionAttribute(req, EDIT_PERIOD_DURATION_ERROR, undefined);
        redirectTo(
            res,
            `/products/productDetails?productId=${matchingJsonMetaData.productId}${
                matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData.serviceId}` : ''
            }`,
        );
        return;
    } catch (error) {
        const message = 'There was a problem editing period duration:';
        redirectToError(res, message, 'api.editPeriodDuration', error);
    }
};
