import { NextApiResponse } from 'next';
import { isValid24hrTimeFormat, removeExcessWhiteSpace } from './apiUtils/validator';
import { redirectTo, redirectToError } from './apiUtils';
import { ErrorInfo, NextApiRequestWithSession, MultiProduct } from '../../interfaces';
import { MULTIPLE_PRODUCT_ATTRIBUTE } from '../../constants/attributes';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const multiProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);

        if (!multiProductAttribute) {
            throw new Error('Necessary attributes not found for multiple product validity API');
        }

        const rawProducts: MultiProduct[] = multiProductAttribute.products;
        const products: MultiProduct[] = rawProducts.map(
            (rawProduct, i): MultiProduct => {
                const productValidityId = `validity-option-${i}`;
                const productValidity = req.body[productValidityId] || '';
                const productEndTimeId = `validity-end-time-${i}`;
                const productEndTime = removeExcessWhiteSpace(req.body[productEndTimeId]) || '';
                return {
                    ...rawProduct,
                    productValidity,
                    productValidityId,
                    ...(productValidity === 'endOfServiceDay' && { productEndTime, productEndTimeId }),
                };
            },
        );

        const errors: ErrorInfo[] = [];
        products.forEach(product => {
            const index = product.productValidityId.split('-').pop();
            const endTimeId = `validity-end-time-${index}`;
            if (product.productValidity === '') {
                errors.push({ errorMessage: 'Select one of the three expiry options', id: product.productValidityId });
            } else if (product.productValidity === 'endOfServiceDay') {
                if (!product.productEndTime) {
                    errors.push({ errorMessage: 'Specify an end time for service day', id: endTimeId });
                } else if (!isValid24hrTimeFormat(product.productEndTime)) {
                    if (product.productEndTime === '2400') {
                        errors.push({ errorMessage: '2400 is not a valid input. Use 0000.', id: endTimeId });
                    } else {
                        errors.push({ errorMessage: 'Time must be in 2400 format', id: endTimeId });
                    }
                }
            }
        });

        if (errors.length > 0) {
            updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, {
                products,
                errors,
            });
            redirectTo(res, '/multipleProductValidity');
            return;
        }

        updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, {
            products,
        });
        redirectTo(res, '/ticketConfirmation');
    } catch (error) {
        const message = 'There was a problem collecting the user defined products:';
        redirectToError(res, message, 'api.multipleProductValidity', error);
    }
};
