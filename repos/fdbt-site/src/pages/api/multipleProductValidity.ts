import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    MULTIPLE_PRODUCT_COOKIE,
    OPERATOR_COOKIE,
    CSV_ZONE_UPLOAD_COOKIE,
    SERVICE_LIST_COOKIE,
    PERIOD_TYPE_COOKIE,
    MATCHING_DATA_BUCKET_NAME,
    PASSENGER_TYPE_COOKIE,
} from '../../constants/index';
import { isSessionValid } from './apiUtils/validator';
import {
    redirectToError,
    setCookieOnResponseObject,
    redirectTo,
    unescapeAndDecodeCookie,
    getNocFromIdToken,
    getAttributeFromIdToken,
} from './apiUtils';
import { Product } from '../multipleProductValidity';
import { getCsvZoneUploadData, putStringInS3 } from '../../data/s3';
import { batchGetStopsByAtcoCode, Stop } from '../../data/auroradb';
import { ServicesInfo } from '../../interfaces';

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

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
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
        const nocCode = getNocFromIdToken(req, res);

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

        let props = {};
        const { operator, uuid } = JSON.parse(operatorCookie);
        const { periodTypeName } = JSON.parse(periodTypeCookie);
        const passengerTypeObject = JSON.parse(passengerTypeCookie);

        if (fareZoneCookie) {
            const { fareZoneName } = JSON.parse(fareZoneCookie);
            const atcoCodes: string[] = await getCsvZoneUploadData(uuid);
            const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

            if (zoneStops.length === 0) {
                throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
            }

            props = {
                zoneName: fareZoneName,
                stops: zoneStops,
            };
        }

        if (serviceListCookie) {
            const { selectedServices } = JSON.parse(serviceListCookie);
            const formattedServiceInfo: ServicesInfo[] = selectedServices.map((selectedService: string) => {
                const service = selectedService.split('#');
                return {
                    lineName: service[0],
                    serviceCode: service[1],
                    startDate: service[2],
                    serviceDescription: service[3],
                };
            });
            props = {
                selectedServices: formattedServiceInfo,
            };
        }

        const email = getAttributeFromIdToken(req, res, 'email');

        if (!email) {
            throw new Error('Could not extract the user email address from their ID token');
        }

        const multipleProductPeriod = {
            operatorName: operator.operatorPublicName,
            type: periodTypeName,
            nocCode,
            email,
            uuid,
            products,
            ...passengerTypeObject,
            ...props,
        };
        await putStringInS3(
            MATCHING_DATA_BUCKET_NAME,
            `${nocCode}/${periodTypeName}/${uuid}_${Date.now()}.json`,
            JSON.stringify(multipleProductPeriod),
            'application/json; charset=utf-8',
        );
        redirectTo(res, '/thankyou');
    } catch (error) {
        const message = 'There was a problem collecting the user defined products:';
        redirectToError(res, message, 'api.multipleProductValidity', error);
    }
};
