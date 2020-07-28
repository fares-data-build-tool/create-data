import Cookies from 'cookies';
import { NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import { getCsvZoneUploadData, putStringInS3 } from '../../../data/s3';
import {
    OPERATOR_COOKIE,
    FARE_TYPE_COOKIE,
    ID_TOKEN_COOKIE,
    PASSENGER_TYPE_COOKIE,
    MATCHING_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    CSV_ZONE_UPLOAD_COOKIE,
    SERVICE_LIST_COOKIE,
    PRODUCT_DETAILS_ATTRIBUTE,
    PERIOD_TYPE_COOKIE,
    MATCHING_DATA_BUCKET_NAME,
} from '../../../constants';
import {
    CognitoIdToken,
    NextApiRequestWithSession,
    SingleTicket,
    ReturnTicket,
    PeriodGeoZoneTicket,
    PeriodMultipleServicesTicket,
    FlatFareTicket,
    Stop,
    SelectedService,
    ProductData,
    ProductInfo,
    ProductDetails,
    Product,
    FlatFareProductDetails,
    SalesOfferPackage,
} from '../../../interfaces';
import { PeriodExpiryWithErrors } from '../periodValidity';
import { MatchingInfo, MatchingWithErrors, InboundMatchingInfo } from '../../../interfaces/matchingInterface';
import { getSessionAttribute } from '../../../utils/sessions';
import { getFareZones } from './matching';
import { batchGetStopsByAtcoCode } from '../../../data/auroradb';
import { unescapeAndDecodeCookie, getUuidFromCookie, getNocFromIdToken } from '.';

export const getSalesOfferPackagesFromRequestBody = (reqBody: { [key: string]: string }): SalesOfferPackage[] => {
    const salesOfferPackageList: SalesOfferPackage[] = [];
    Object.values(reqBody).forEach(entry => {
        const parsedEntry = JSON.parse(entry);
        const formattedPackageObject = {
            name: parsedEntry.name,
            description: parsedEntry.description,
            purchaseLocations: parsedEntry.purchaseLocations,
            paymentMethods: parsedEntry.paymentMethods,
            ticketFormats: parsedEntry.ticketFormats,
        };
        salesOfferPackageList.push(formattedPackageObject);
    });
    return salesOfferPackageList;
};

export const putUserDataInS3 = async (
    data: SingleTicket | ReturnTicket | PeriodGeoZoneTicket | PeriodMultipleServicesTicket | FlatFareTicket,
    uuid: string,
): Promise<void> => {
    await putStringInS3(
        MATCHING_DATA_BUCKET_NAME,
        `${data.nocCode}/${data.type}/${uuid}_${Date.now()}.json`,
        JSON.stringify(data),
        'application/json; charset=utf-8',
    );
};

export const getSingleTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): SingleTicket => {
    const isMatchingInfo = (
        matchingAttributeInfo: MatchingInfo | MatchingWithErrors,
    ): matchingAttributeInfo is MatchingInfo => (matchingAttributeInfo as MatchingInfo)?.service !== null;

    const cookies = new Cookies(req, res);

    const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
    const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);

    if (!fareTypeCookie || !passengerTypeCookie || !idToken) {
        throw new Error('Necessary session object or cookie not found to create user data json');
    }
    const fareTypeObject = JSON.parse(fareTypeCookie);
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = getSalesOfferPackagesFromRequestBody(requestBody);

    if (!matchingAttributeInfo || !isMatchingInfo(matchingAttributeInfo)) {
        throw new Error('Required session object does not exist to create single ticket json');
    }

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...service,
        type: fareTypeObject.fareType,
        ...passengerTypeObject,
        fareZones: getFareZones(userFareStages, matchingFareZones),
        email: decodedIdToken.email,
        uuid,
        products: [{ salesOfferPackages }],
    };
};

export const getReturnTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): ReturnTicket => {
    const isMatchingInfo = (
        matchingAttributeInfo: MatchingInfo | MatchingWithErrors,
    ): matchingAttributeInfo is MatchingInfo => (matchingAttributeInfo as MatchingInfo)?.service !== null;
    const isInboundMatchingInfo = (
        inboundMatchingAttributeInfo: InboundMatchingInfo | MatchingWithErrors,
    ): inboundMatchingAttributeInfo is InboundMatchingInfo =>
        (inboundMatchingAttributeInfo as InboundMatchingInfo)?.inboundUserFareStages !== null;

    const cookies = new Cookies(req, res);

    const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
    const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const inboundMatchingAttributeInfo = getSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE);

    if (!fareTypeCookie || !passengerTypeCookie || !idToken) {
        throw new Error('Necessary session object or cookie not found to create user data json');
    }
    const fareTypeObject = JSON.parse(fareTypeCookie);
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = getSalesOfferPackagesFromRequestBody(requestBody);

    if (!matchingAttributeInfo || !isMatchingInfo(matchingAttributeInfo)) {
        throw new Error('Required session object does not exist to create return ticket json');
    }

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...service,
        type: fareTypeObject.fareType,
        ...passengerTypeObject,
        outboundFareZones: getFareZones(userFareStages, matchingFareZones),
        inboundFareZones:
            inboundMatchingAttributeInfo && isInboundMatchingInfo(inboundMatchingAttributeInfo)
                ? getFareZones(
                      inboundMatchingAttributeInfo.inboundUserFareStages,
                      inboundMatchingAttributeInfo.inboundMatchingFareZones,
                  )
                : [],
        email: decodedIdToken.email,
        uuid,
        products: [{ salesOfferPackages }],
    };
};

const isPeriodProductDetails = (product: Product): product is ProductDetails =>
    (product as ProductDetails)?.productDuration !== undefined &&
    (product as ProductDetails)?.productValidity !== undefined;

export const getPeriodGeoZoneTicketJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<PeriodGeoZoneTicket> => {
    const isProductData = (
        periodExpiryAttributeInfo: ProductData | PeriodExpiryWithErrors,
    ): periodExpiryAttributeInfo is ProductData => (periodExpiryAttributeInfo as ProductData)?.products !== null;

    const cookies = new Cookies(req, res);

    const nocCode = getNocFromIdToken(req, res);
    const periodTypeCookie = unescapeAndDecodeCookie(cookies, PERIOD_TYPE_COOKIE);
    const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const fareZoneCookie = unescapeAndDecodeCookie(cookies, CSV_ZONE_UPLOAD_COOKIE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);

    if (!nocCode || !periodTypeCookie || !passengerTypeCookie || !operatorCookie || !idToken || !fareZoneCookie) {
        throw new Error('Necessary session object or cookie not found to create user data json');
    }
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const { periodTypeName } = JSON.parse(periodTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);
    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = getSalesOfferPackagesFromRequestBody(requestBody);
    const operatorObject = JSON.parse(operatorCookie);
    const { fareZoneName } = JSON.parse(fareZoneCookie);
    const atcoCodes: string[] = await getCsvZoneUploadData(uuid);
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    if (!periodExpiryAttributeInfo || !isProductData(periodExpiryAttributeInfo)) {
        throw new Error('Required session object does not exist to create period ticket json');
    }

    const { products } = periodExpiryAttributeInfo;

    const productDetailsList: ProductDetails[] = products.map(product => ({
        productName: product.productName,
        productPrice: product.productPrice,
        productDuration: isPeriodProductDetails(product) ? product.productDuration : '',
        productValidity: isPeriodProductDetails(product) ? product.productValidity : '',
        salesOfferPackages,
    }));

    return {
        nocCode,
        type: periodTypeName,
        ...passengerTypeObject,
        email: decodedIdToken.email,
        uuid,
        operatorName: operatorObject?.operator?.operatorPublicName,
        zoneName: fareZoneName,
        products: productDetailsList,
        stops: zoneStops,
    };
};

export const getPeriodMultipleServicesTicketJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): PeriodMultipleServicesTicket => {
    const isProductData = (
        periodExpiryAttributeInfo: ProductData | PeriodExpiryWithErrors,
    ): periodExpiryAttributeInfo is ProductData => (periodExpiryAttributeInfo as ProductData)?.products !== null;
    const cookies = new Cookies(req, res);

    const nocCode = getNocFromIdToken(req, res);
    const periodTypeCookie = unescapeAndDecodeCookie(cookies, PERIOD_TYPE_COOKIE);
    const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const serviceListCookie = unescapeAndDecodeCookie(cookies, SERVICE_LIST_COOKIE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);

    if (!nocCode || !periodTypeCookie || !passengerTypeCookie || !operatorCookie || !idToken || !serviceListCookie) {
        throw new Error('Necessary session object or cookie not found to create user data json');
    }
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const { periodTypeName } = JSON.parse(periodTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = getSalesOfferPackagesFromRequestBody(requestBody);
    const operatorObject = JSON.parse(operatorCookie);
    const { selectedServices } = JSON.parse(serviceListCookie);
    const formattedServiceInfo: SelectedService[] = selectedServices.map((selectedService: string) => {
        const service = selectedService.split('#');
        return {
            lineName: service[0],
            serviceCode: service[1],
            startDate: service[2],
            serviceDescription: service[3],
        };
    });

    if (!periodExpiryAttributeInfo || !isProductData(periodExpiryAttributeInfo)) {
        throw new Error('Required session object does not exist to create period multi service ticket json');
    }

    const { products } = periodExpiryAttributeInfo;

    const productDetailsList: ProductDetails[] = products.map(product => ({
        productName: product.productName,
        productPrice: product.productPrice,
        productDuration: isPeriodProductDetails(product) ? product.productDuration : '',
        productValidity: isPeriodProductDetails(product) ? product.productValidity : '',
        salesOfferPackages,
    }));

    return {
        nocCode,
        type: periodTypeName,
        ...passengerTypeObject,
        email: decodedIdToken.email,
        uuid,
        operatorName: operatorObject?.operator?.operatorPublicName,
        products: productDetailsList,
        selectedServices: formattedServiceInfo,
    };
};

export const getFlatFareTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): FlatFareTicket => {
    const isProductData = (
        productDetailsAttributeInfo: ProductData | ProductInfo,
    ): productDetailsAttributeInfo is ProductData => (productDetailsAttributeInfo as ProductData)?.products !== null;
    const cookies = new Cookies(req, res);

    const nocCode = getNocFromIdToken(req, res);
    const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
    const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const serviceListCookie = unescapeAndDecodeCookie(cookies, SERVICE_LIST_COOKIE);
    const productDetailsAttributeInfo = getSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE);

    if (!nocCode || !fareTypeCookie || !passengerTypeCookie || !operatorCookie || !idToken || !serviceListCookie) {
        throw new Error('Necessary session object or cookie not found to create user data json');
    }
    const fareTypeObject = JSON.parse(fareTypeCookie);
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = getSalesOfferPackagesFromRequestBody(requestBody);
    const operatorObject = JSON.parse(operatorCookie);
    const { selectedServices } = JSON.parse(serviceListCookie);
    const formattedServiceInfo: SelectedService[] = selectedServices.map((selectedService: string) => {
        const service = selectedService.split('#');
        return {
            lineName: service[0],
            serviceCode: service[1],
            startDate: service[2],
            serviceDescription: service[3],
        };
    });

    if (!productDetailsAttributeInfo || !isProductData(productDetailsAttributeInfo)) {
        throw new Error('Required session object does not exist to create flat fare ticket json');
    }

    const { products } = productDetailsAttributeInfo;

    const productDetailsList: FlatFareProductDetails[] = products.map(product => ({
        productName: product.productName,
        productPrice: product.productPrice,
        salesOfferPackages,
    }));

    return {
        nocCode,
        type: fareTypeObject.fareType,
        ...passengerTypeObject,
        email: decodedIdToken.email,
        uuid,
        operatorName: operatorObject?.operator?.operatorPublicName,
        products: productDetailsList,
        selectedServices: formattedServiceInfo,
    };
};
