import { NextApiRequest, NextApiResponse } from 'next';
import { MULTIPLE_PRODUCT_ATTRIBUTE } from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';
import { redirectToError, redirectTo } from './apiUtils';
import { NextApiRequestWithSession } from '../../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';

export interface MultipleProductAttribute {
    products: Product[];
}

export interface Product {
    productName: string;
    productNameId?: string;
    productPrice: string;
    productPriceId?: string;
    productDuration: string;
    productDurationId?: string;
    productValidity?: string;
    productValidityError?: string;
}

export const addErrorsIfInvalid = (req: NextApiRequest, rawProduct: Product, index: number): Product => {
    let validity = req.body[`validity-row${index}`];
    let error = '';
    if (!validity) {
        validity = '';
        error = 'Select one of the two validity options';
        return {
            productName: rawProduct.productName,
            productNameId: rawProduct.productNameId,
            productPrice: rawProduct.productPrice,
            productPriceId: rawProduct.productPriceId,
            productDuration: rawProduct.productDuration,
            productDurationId: rawProduct.productDurationId,
            productValidity: validity,
            productValidityError: error,
        };
    }
    return {
        productName: rawProduct.productName,
        productPrice: rawProduct.productPrice,
        productDuration: rawProduct.productDuration,
        productValidity: validity,
    };
};

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }
        const multiProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);

        if (!multiProductAttribute) {
            throw new Error('Necessary cookies not found for multiple product validity API');
        }

        const rawProducts: Product[] = multiProductAttribute.products;
        const products: Product[] = rawProducts.map((rawProduct, i) => addErrorsIfInvalid(req, rawProduct, i));

        updateSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE, { products });

        if (products.some(el => el.productValidityError)) {
            redirectTo(res, '/multipleProductValidity');
            return;
        }

        redirectTo(res, '/selectSalesOfferPackage');
    } catch (error) {
        const message = 'There was a problem collecting the user defined products:';
        redirectToError(res, message, 'api.multipleProductValidity', error);
    }
};
