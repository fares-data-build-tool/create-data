import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    MULTIPLE_PRODUCT_COOKIE,
    OPERATOR_COOKIE,
    CSV_ZONE_UPLOAD_COOKIE,
    SERVICE_LIST_COOKIE,
    PERIOD_TYPE_COOKIE,
    MATCHING_DATA_BUCKET_NAME,
} from '../../constants/index';
import { isSessionValid } from './service/validator';
import { redirectToError, setCookieOnResponseObject, getDomain, redirectTo, unescapeAndDecodeCookie } from './apiUtils';
import { Product } from '../multipleProductValidity';
import { getCsvZoneUploadData, putStringInS3 } from '../../data/s3';
import { batchGetStopsByAtcoCode, Stop } from '../../data/auroradb';
import { ServicesInfo } from '../../interfaces';

interface DecisionData {
    operatorName: string;
    type: string;
    nocCode: string;
    products: Product[];
    selectedServices?: ServicesInfo[];
    zoneName?: string;
    stops?: Stop[];
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

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }
        const cookies = new Cookies(req, res);
        const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
        const fareZoneCookie = unescapeAndDecodeCookie(cookies, CSV_ZONE_UPLOAD_COOKIE);
        const serviceListCookie = unescapeAndDecodeCookie(cookies, SERVICE_LIST_COOKIE);
        const periodTypeCookie = unescapeAndDecodeCookie(cookies, PERIOD_TYPE_COOKIE);
        const multipleProductCookie = unescapeAndDecodeCookie(cookies, MULTIPLE_PRODUCT_COOKIE);

        if (
            multipleProductCookie === '' ||
            periodTypeCookie === '' ||
            (operatorCookie === '' && (fareZoneCookie === '' || serviceListCookie === ''))
        ) {
            throw new Error('Necessary cookies not found for multiple product validity page');
        }

        const rawProducts: Product[] = JSON.parse(multipleProductCookie);
        const products: Product[] = rawProducts.map((rawProduct, i) => addErrorsIfInvalid(req, rawProduct, i));
        const newMultipleProductCookieValue = JSON.stringify(products);
        setCookieOnResponseObject(getDomain(req), MULTIPLE_PRODUCT_COOKIE, newMultipleProductCookieValue, req, res);

        if (products.some(el => el.productValidityError)) {
            redirectTo(res, '/multipleProductValidity');
            return;
        }

        let props = {};
        const { operator, uuid, nocCode } = JSON.parse(operatorCookie);
        const { periodTypeName } = JSON.parse(periodTypeCookie);

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
                    startDate: service[1],
                    serviceDescription: service[2],
                };
            });
            props = {
                selectedServices: formattedServiceInfo,
            };
        }

        const multipleProductPeriod: DecisionData = {
            operatorName: operator,
            type: periodTypeName,
            nocCode,
            products,
            ...props,
        };
        await putStringInS3(
            MATCHING_DATA_BUCKET_NAME,
            `${uuid}.json`,
            JSON.stringify(multipleProductPeriod),
            'application/json; charset=utf-8',
        );
        redirectTo(res, '/thankyou');
    } catch (error) {
        const message = 'There was a problem collecting the user defined products:';
        redirectToError(res, message, error);
    }
};
