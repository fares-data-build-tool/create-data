import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    MULTIPLE_PRODUCT_COOKIE,
    OPERATOR_COOKIE,
    CSV_ZONE_UPLOAD_COOKIE,
    SERVICE_LIST_COOKIE,
    PERIOD_TYPE_COOKIE,
    PASSENGER_TYPE_COOKIE,
} from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';
import {
    redirectToError,
    setCookieOnResponseObject,
    redirectTo,
    unescapeAndDecodeCookie,
    getAndValidateNoc,
} from './apiUtils';
import { Product } from '../multipleProductValidity';

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

export default (req: NextApiRequest, res: NextApiResponse): void => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('session is invalid.');
        }
        const cookies = new Cookies(req, res);
        const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
        const fareZoneCookie = unescapeAndDecodeCookie(cookies, CSV_ZONE_UPLOAD_COOKIE);
        const serviceListCookie = unescapeAndDecodeCookie(cookies, SERVICE_LIST_COOKIE);
        const periodTypeCookie = unescapeAndDecodeCookie(cookies, PERIOD_TYPE_COOKIE);
        const multipleProductCookie = unescapeAndDecodeCookie(cookies, MULTIPLE_PRODUCT_COOKIE);
        const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
        const nocCode = getAndValidateNoc(req, res);

        if (
            !nocCode ||
            multipleProductCookie === '' ||
            periodTypeCookie === '' ||
            passengerTypeCookie === '' ||
            (operatorCookie === '' && (fareZoneCookie === '' || serviceListCookie === ''))
        ) {
            throw new Error('Necessary cookies not found for multiple product validity API');
        }

        const rawProducts: Product[] = JSON.parse(multipleProductCookie);
        const products: Product[] = rawProducts.map((rawProduct, i) => addErrorsIfInvalid(req, rawProduct, i));
        const newMultipleProductCookieValue = JSON.stringify(products);
        setCookieOnResponseObject(MULTIPLE_PRODUCT_COOKIE, newMultipleProductCookieValue, req, res);

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
