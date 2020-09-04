import Cookies from 'cookies';
import { NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import isArray from 'lodash/isArray';
import { getCsvZoneUploadData, putStringInS3 } from '../../../data/s3';
import {
    FARE_TYPE_ATTRIBUTE,
    ID_TOKEN_COOKIE,
    INBOUND_MATCHING_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    OPERATOR_COOKIE,
    PASSENGER_TYPE_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    PERIOD_TYPE_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    MATCHING_DATA_BUCKET_NAME,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
} from '../../../constants';
import {
    CognitoIdToken,
    FlatFareTicket,
    NextApiRequestWithSession,
    PeriodGeoZoneTicket,
    PeriodMultipleServicesTicket,
    Product,
    ProductData,
    ProductDetails,
    ProductInfo,
    ReturnTicket,
    SalesOfferPackage,
    SelectedService,
    SingleTicket,
    Stop,
} from '../../../interfaces';
import { PeriodExpiryWithErrors } from '../periodValidity';
import { InboundMatchingInfo, MatchingInfo, MatchingWithErrors } from '../../../interfaces/matchingInterface';
import { getSessionAttribute } from '../../../utils/sessions';
import { getFareZones } from './matching';
import { batchGetStopsByAtcoCode } from '../../../data/auroradb';
import { isFareType, isPassengerType, isPeriodType } from '../../../interfaces/typeGuards';
import { unescapeAndDecodeCookie, getUuidFromCookie, getAndValidateNoc } from '.';
import { isFareZoneAttributeWithErrors } from '../../csvZoneUpload';
import { isServiceListAttributeWithErrors } from '../../serviceList';
import { MultipleProductAttribute } from '../multipleProductValidity';

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
    multipleProductAttribute: MultipleProductAttribute,
): ProductDetails[] => {
    const productSOPList: ProductDetails[] = [];

    Object.entries(reqBody).forEach(entry => {
        const salesOfferPackageValue = !isArray(entry[1]) ? [entry[1]] : (entry[1] as string[]);
        const salesOfferPackageList = generateSalesOfferPackages(salesOfferPackageValue);
        const { products } = multipleProductAttribute;
        const productDetail = products.find((product: Product) => {
            return product.productName === entry[0];
        });

        if (productDetail) {
            const productDetailsItem = {
                productName: productDetail.productName,
                productPrice: productDetail.productPrice,
                productDuration: productDetail.productDuration || '',
                productValidity: productDetail.productValidity || '',
                salesOfferPackages: salesOfferPackageList,
            };

            productSOPList.push(productDetailsItem);
        }
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
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo)
    ) {
        throw new Error('Could not create single ticket json. Necessary cookies and session objects not found.');
    }

    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);
    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = generateSalesOfferPackages(Object.values(requestBody));

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...(timeRestriction && { timeRestriction }),
        ...service,
        type: fareTypeAttribute.fareType,
        ...passengerTypeAttribute,
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
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const inboundMatchingAttributeInfo = getSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo)
    ) {
        throw new Error('Could not create return ticket json. Necessary cookies and session objects not found.');
    }
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = generateSalesOfferPackages(Object.values(requestBody));

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...(timeRestriction && { timeRestriction }),
        ...service,
        type: fareTypeAttribute.fareType,
        ...passengerTypeAttribute,
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

    const nocCode = getAndValidateNoc(req, res);

    const cookies = new Cookies(req, res);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);
    const fareZoneAttribute = getSessionAttribute(req, FARE_ZONE_ATTRIBUTE);

    const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const periodTypeAttribute = getSessionAttribute(req, PERIOD_TYPE_ATTRIBUTE);

    if (
        !nocCode ||
        !isPassengerType(passengerTypeAttribute) ||
        !isPeriodType(periodTypeAttribute) ||
        !operatorCookie ||
        !idToken ||
        !fareZoneAttribute ||
        isFareZoneAttributeWithErrors(fareZoneAttribute)
    ) {
        throw new Error(
            'Could not create period geo zone ticket json. Necessary cookies and session objects not found.',
        );
    }
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);
    const requestBody: { [key: string]: string } = req.body;

    const operatorObject = JSON.parse(operatorCookie);
    const atcoCodes: string[] = await getCsvZoneUploadData(uuid);
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    let productDetailsList: ProductDetails[];

    if (!multipleProductAttribute) {
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
        productDetailsList = getProductsAndSalesOfferPackages(requestBody, multipleProductAttribute);
    }

    return {
        ...(timeRestriction && { timeRestriction }),
        nocCode,
        type: periodTypeAttribute.name,
        ...passengerTypeAttribute,
        email: decodedIdToken.email,
        uuid,
        operatorName: operatorObject?.operator?.operatorPublicName,
        zoneName: fareZoneAttribute.fareZoneName,
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

    const nocCode = getAndValidateNoc(req, res);

    const cookies = new Cookies(req, res);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const serviceListAttribute = getSessionAttribute(req, SERVICE_LIST_ATTRIBUTE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const periodTypeAttribute = getSessionAttribute(req, PERIOD_TYPE_ATTRIBUTE);

    if (
        !nocCode ||
        !isPassengerType(passengerTypeAttribute) ||
        !isPeriodType(periodTypeAttribute) ||
        !operatorCookie ||
        !idToken ||
        !serviceListAttribute ||
        isServiceListAttributeWithErrors(serviceListAttribute)
    ) {
        throw new Error(
            'Could not create period multiple services ticket json. Necessary cookies and session objects not found.',
        );
    }

    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;

    const operatorObject = JSON.parse(operatorCookie);
    const { selectedServices } = serviceListAttribute;
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

    if (!multipleProductAttribute) {
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
        productDetailsList = getProductsAndSalesOfferPackages(requestBody, multipleProductAttribute);
    }

    return {
        ...(timeRestriction && { timeRestriction }),
        nocCode,
        type: periodTypeAttribute.name,
        ...passengerTypeAttribute,
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

    const nocCode = getAndValidateNoc(req, res);

    const cookies = new Cookies(req, res);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const serviceListAttribute = getSessionAttribute(req, SERVICE_LIST_ATTRIBUTE);
    const productDetailsAttributeInfo = getSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !nocCode ||
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !operatorCookie ||
        !idToken ||
        !serviceListAttribute ||
        isServiceListAttributeWithErrors(serviceListAttribute) ||
        !productDetailsAttributeInfo ||
        !isProductData(productDetailsAttributeInfo)
    ) {
        throw new Error('Could not create flat fare ticket json. Necessary cookies and session objects not found.');
    }

    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

    const requestBody: { [key: string]: string } = req.body;
    const salesOfferPackages = generateSalesOfferPackages(Object.values(requestBody));
    const operatorObject = JSON.parse(operatorCookie);
    const { selectedServices } = serviceListAttribute;
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
        type: fareTypeAttribute.fareType,
        ...passengerTypeAttribute,
        email: decodedIdToken.email,
        uuid,
        operatorName: operatorObject?.operator?.operatorPublicName,
        products: productDetailsList,
        selectedServices: formattedServiceInfo,
    };
};
