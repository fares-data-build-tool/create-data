import Cookies from 'cookies';
import { NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import isArray from 'lodash/isArray';
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
    MULTIPLE_PRODUCT_COOKIE,
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
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
    SalesOfferPackage,
} from '../../../interfaces';
import { PeriodExpiryWithErrors } from '../periodValidity';
import { MatchingInfo, MatchingWithErrors, InboundMatchingInfo } from '../../../interfaces/matchingInterface';
import { getSessionAttribute } from '../../../utils/sessions';
import { getFareZones } from './matching';
import { batchGetStopsByAtcoCode } from '../../../data/auroradb';
import { unescapeAndDecodeCookie, getUuidFromCookie, getNocFromIdToken } from '.';

export const generateSalesOfferPackages = (entry: string[]): SalesOfferPackage[] => {
    const salesOfferPackageList: SalesOfferPackage[] = [];

    entry.forEach(sop => {
        const parsedEntry = JSON.parse(sop);
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

export const getProductsAndSalesOfferPackages = (
    reqBody: {
        [key: string]: string;
    },
    multipleProductCookie: string,
): ProductDetails[] => {
    const productSOPList: ProductDetails[] = [];

    Object.entries(reqBody).forEach(entry => {
        const salesOfferPackageValue = !isArray(entry[1]) ? [entry[1]] : (entry[1] as string[]);
        const salesOfferPackageList = generateSalesOfferPackages(salesOfferPackageValue);
        const parsedMultipleCookie = JSON.parse(multipleProductCookie);
        const productDetail = parsedMultipleCookie.find((product: Product) => {
            return product.productName === entry[0];
        });

        const productDetailsItem = {
            productName: productDetail.productName,
            productPrice: productDetail.productPrice,
            productDuration: productDetail.productDuration || '',
            productValidity: productDetail.productValidity || '',
            salesOfferPackages: salesOfferPackageList,
        };

        productSOPList.push(productDetailsItem);
    });

    return productSOPList;
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
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    if (
        !fareTypeCookie ||
        !passengerTypeCookie ||
        !idToken ||
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo)
    ) {
        throw new Error('Could not create single ticket json. Necessary cookies and session objects not found.');
    }

    const fareTypeObject = JSON.parse(fareTypeCookie);
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);
    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = generateSalesOfferPackages(Object.values(requestBody));

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...(timeRestriction && { timeRestriction }),
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
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    if (
        !fareTypeCookie ||
        !passengerTypeCookie ||
        !idToken ||
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo)
    ) {
        throw new Error('Could not create return ticket json. Necessary cookies and session objects not found.');
    }
    const fareTypeObject = JSON.parse(fareTypeCookie);
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = generateSalesOfferPackages(Object.values(requestBody));

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...(timeRestriction && { timeRestriction }),
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

    const nocCode = getNocFromIdToken(req, res);

    const cookies = new Cookies(req, res);
    const periodTypeCookie = unescapeAndDecodeCookie(cookies, PERIOD_TYPE_COOKIE);
    const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const fareZoneCookie = unescapeAndDecodeCookie(cookies, CSV_ZONE_UPLOAD_COOKIE);
    const multipleProductCookie = unescapeAndDecodeCookie(cookies, MULTIPLE_PRODUCT_COOKIE);

    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    if (!nocCode || !periodTypeCookie || !passengerTypeCookie || !operatorCookie || !idToken || !fareZoneCookie) {
        throw new Error(
            'Could not create period geo zone ticket json. Necessary cookies and session objects not found.',
        );
    }
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const { periodTypeName } = JSON.parse(periodTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);
    const requestBody: { [key: string]: string } = req.body;

    const operatorObject = JSON.parse(operatorCookie);
    const { fareZoneName } = JSON.parse(fareZoneCookie);
    const atcoCodes: string[] = await getCsvZoneUploadData(uuid);
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    let productDetailsList: ProductDetails[];

    if (!multipleProductCookie) {
        if (!periodExpiryAttributeInfo || !isProductData(periodExpiryAttributeInfo)) {
            throw new Error(
                'Could not create period geo zone ticket json. Necessary cookies and session objects not found.',
            );
        }

        const { products } = periodExpiryAttributeInfo;

        const salesOfferPackages = generateSalesOfferPackages(Object.values(requestBody));

        productDetailsList = products.map(product => ({
            productName: product.productName,
            productPrice: product.productPrice,
            productDuration: isPeriodProductDetails(product) ? product.productDuration : '',
            productValidity: isPeriodProductDetails(product) ? product.productValidity : '',
            salesOfferPackages,
        }));
    } else {
        productDetailsList = getProductsAndSalesOfferPackages(requestBody, multipleProductCookie);
    }

    return {
        ...(timeRestriction && { timeRestriction }),
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

    const nocCode = getNocFromIdToken(req, res);

    const cookies = new Cookies(req, res);
    const periodTypeCookie = unescapeAndDecodeCookie(cookies, PERIOD_TYPE_COOKIE);
    const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const serviceListCookie = unescapeAndDecodeCookie(cookies, SERVICE_LIST_COOKIE);
    const multipleProductCookie = unescapeAndDecodeCookie(cookies, MULTIPLE_PRODUCT_COOKIE);

    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    if (!nocCode || !periodTypeCookie || !passengerTypeCookie || !operatorCookie || !idToken || !serviceListCookie) {
        throw new Error(
            'Could not create period multiple services ticket json. Necessary cookies and session objects not found.',
        );
    }

    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const { periodTypeName } = JSON.parse(periodTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const isMultiProducts = multipleProductCookie;

    const requestBody: { [key: string]: string } = req.body;

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

    let productDetailsList: ProductDetails[];

    if (!isMultiProducts) {
        if (!periodExpiryAttributeInfo || !isProductData(periodExpiryAttributeInfo)) {
            throw new Error(
                'Could not create period multiple services ticket json. Necessary cookies and session objects not found.',
            );
        }

        const { products } = periodExpiryAttributeInfo;

        const salesOfferPackages = generateSalesOfferPackages(Object.values(requestBody));

        productDetailsList = products.map(product => {
            return {
                productName: product.productName,
                productPrice: product.productPrice,
                productDuration: isPeriodProductDetails(product) ? product.productDuration : '',
                productValidity: isPeriodProductDetails(product) ? product.productValidity : '',
                salesOfferPackages,
            };
        });
    } else {
        productDetailsList = getProductsAndSalesOfferPackages(requestBody, multipleProductCookie);
    }

    return {
        ...(timeRestriction && { timeRestriction }),
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

    const nocCode = getNocFromIdToken(req, res);

    const cookies = new Cookies(req, res);
    const fareTypeCookie = unescapeAndDecodeCookie(cookies, FARE_TYPE_COOKIE);
    const passengerTypeCookie = unescapeAndDecodeCookie(cookies, PASSENGER_TYPE_COOKIE);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const serviceListCookie = unescapeAndDecodeCookie(cookies, SERVICE_LIST_COOKIE);

    const productDetailsAttributeInfo = getSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    if (
        !nocCode ||
        !fareTypeCookie ||
        !passengerTypeCookie ||
        !operatorCookie ||
        !idToken ||
        !serviceListCookie ||
        !productDetailsAttributeInfo ||
        !isProductData(productDetailsAttributeInfo)
    ) {
        throw new Error('Could not create flat fare ticket json. Necessary cookies and session objects not found.');
    }
    const fareTypeObject = JSON.parse(fareTypeCookie);
    const passengerTypeObject = JSON.parse(passengerTypeCookie);
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = generateSalesOfferPackages(Object.values(requestBody));
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

    const { products } = productDetailsAttributeInfo;

    const productDetailsList = products.map(product => ({
        productName: product.productName,
        productPrice: product.productPrice,
        salesOfferPackages,
    }));

    return {
        ...(timeRestriction && { timeRestriction }),
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
