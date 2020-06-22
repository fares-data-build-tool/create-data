import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import {
    redirectTo,
    redirectToError,
    setCookieOnResponseObject,
    unescapeAndDecodeCookie,
    getNocFromIdToken,
} from './apiUtils';
import { isSessionValid } from './service/validator';
import { ProductInfo, ServicesInfo, PassengerDetails } from '../../interfaces';
import {
    PRODUCT_DETAILS_COOKIE,
    FARE_TYPE_COOKIE,
    OPERATOR_COOKIE,
    SERVICE_LIST_COOKIE,
    MATCHING_DATA_BUCKET_NAME,
    PASSENGER_TYPE_COOKIE,
} from '../../constants';
import { removeExcessWhiteSpace, checkPriceIsValid, checkProductNameIsValid } from './service/inputValidator';
import { putStringInS3 } from '../../data/s3';
import { DecisionData } from './periodValidity';

export const checkIfInputInvalid = (productDetailsNameInput: string, productDetailsPriceInput: string): ProductInfo => {
    let productNameError = '';
    let productPriceError = '';

    const cleanedNameInput = removeExcessWhiteSpace(productDetailsNameInput);
    const cleanedPriceInput = removeExcessWhiteSpace(productDetailsPriceInput);

    productNameError = checkProductNameIsValid(cleanedNameInput);

    productPriceError = checkPriceIsValid(cleanedPriceInput);

    return {
        productName: cleanedNameInput,
        productPrice: cleanedPriceInput,
        productNameError,
        productPriceError,
    };
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        if (!isSessionValid(req, res)) {
            throw new Error('Session is invalid.');
        }

        const cookies = new Cookies(req, res);
        const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
        const { fareType } = JSON.parse(fareTypeCookie);

        if (!fareType || (fareType !== 'period' && fareType !== 'flatFare')) {
            throw new Error('Failed to retrieve FARE_TYPE_COOKIE info for productDetails API');
        }

        const { productDetailsNameInput, productDetailsPriceInput } = req.body;

        const productDetails = checkIfInputInvalid(productDetailsNameInput, productDetailsPriceInput);

        if (productDetails.productNameError !== '' || productDetails.productPriceError !== '') {
            const invalidInputs = JSON.stringify(productDetails);

            setCookieOnResponseObject(PRODUCT_DETAILS_COOKIE, invalidInputs, req, res);
            redirectTo(res, '/productDetails');
            return;
        }

        if (fareType === 'period') {
            const validInputs = JSON.stringify(productDetails);
            setCookieOnResponseObject(PRODUCT_DETAILS_COOKIE, validInputs, req, res);
            redirectTo(res, '/chooseValidity');
        } else if (fareType === 'flatFare') {
            const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
            const serviceListCookie = unescapeAndDecodeCookie(cookies, SERVICE_LIST_COOKIE);
            const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
            const nocCode = getNocFromIdToken(req, res);

            if (!serviceListCookie || !passengerTypeCookie || !nocCode) {
                throw new Error('Necessary cookies not found for productDetails API');
            }

            const { operator, uuid } = JSON.parse(operatorCookie);
            const { selectedServices } = JSON.parse(serviceListCookie);
            const passengerTypeObject: PassengerDetails = JSON.parse(passengerTypeCookie);
            const formattedServiceInfo: ServicesInfo[] = selectedServices.map((selectedService: string) => {
                const service = selectedService.split('#');
                return {
                    lineName: service[0],
                    startDate: service[1],
                    serviceDescription: service[2],
                };
            });

            const flatFareProduct: DecisionData = {
                operatorName: operator.operatorPublicName,
                nocCode,
                type: fareType,
                products: [{ productName: productDetails.productName, productPrice: productDetails.productPrice }],
                selectedServices: formattedServiceInfo,
                ...passengerTypeObject,
            };

            await putStringInS3(
                MATCHING_DATA_BUCKET_NAME,
                `${uuid}.json`,
                JSON.stringify(flatFareProduct),
                'application/json; charset=utf-8',
            );

            redirectTo(res, '/thankyou');
            return;
        }
    } catch (error) {
        const message = 'There was a problem processing the product details.';
        redirectToError(res, message, error);
    }
};
