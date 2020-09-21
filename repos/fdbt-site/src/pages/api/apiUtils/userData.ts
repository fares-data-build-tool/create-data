import Cookies from 'cookies';
import { NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import isArray from 'lodash/isArray';
import {
    isProductWithSalesOfferPackages,
    isSalesOfferPackageWithErrors,
    isSalesOfferPackages,
    isFareType,
    isPassengerType,
    isPeriodType,
} from '../../../interfaces/typeGuards';
import {
    ProductWithSalesOfferPackages,
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
    SelectedService,
    SingleTicket,
    Stop,
    SalesOfferPackage,
} from '../../../interfaces/index';

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
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
} from '../../../constants';

import { PeriodExpiryWithErrors } from '../periodValidity';
import { InboundMatchingInfo, MatchingInfo, MatchingWithErrors } from '../../../interfaces/matchingInterface';
import { getSessionAttribute } from '../../../utils/sessions';
import { getFareZones } from './matching';
import { batchGetStopsByAtcoCode } from '../../../data/auroradb';
import { unescapeAndDecodeCookie, getUuidFromCookie, getAndValidateNoc } from '.';
import { isFareZoneAttributeWithErrors } from '../../csvZoneUpload';
import { isServiceListAttributeWithErrors } from '../../serviceList';
import { MultipleProductAttribute } from '../multipleProductValidity';
import { isReturnPeriodValidityWithErrors } from '../../returnValidity';

export const generateSalesOfferPackages = (entry: string[]): SalesOfferPackage[] => {
    const salesOfferPackageList: SalesOfferPackage[] = [];

    entry
        .filter(item => item)
        .forEach(sop => {
            let sopToProcess = sop;

            if (isArray(sop)) {
                [sopToProcess] = sop;
            }
            const parsedEntry = JSON.parse(sopToProcess);
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
    salesOfferPackagesInfo: ProductWithSalesOfferPackages[],
    multipleProductAttribute: MultipleProductAttribute,
): ProductDetails[] => {
    const productSOPList: ProductDetails[] = [];

    salesOfferPackagesInfo.forEach(sopInfo => {
        const matchedProduct: Product | undefined = multipleProductAttribute.products.find(
            product => product.productName === sopInfo.productName,
        );
        if (!matchedProduct) {
            throw new Error('No products could be found that matched the sales offer packages');
        }
        const productDetailsItem: ProductDetails = {
            productName: sopInfo.productName,
            productPrice: matchedProduct.productPrice,
            productDuration: matchedProduct.productDuration || '',
            productValidity: matchedProduct.productValidity || '',
            salesOfferPackages: sopInfo.salesOfferPackages,
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
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);

    if (
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo) ||
        !isSalesOfferPackages(salesOfferPackages)
    ) {
        throw new Error('Could not create single ticket json. Necessary cookies and session objects not found.');
    }

    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

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

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const inboundMatchingAttributeInfo = getSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE);
    const timeRestriction = getSessionAttribute(req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const returnPeriodValidity = getSessionAttribute(req, RETURN_VALIDITY_ATTRIBUTE);

    if (
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo) ||
        !isSalesOfferPackages(salesOfferPackages) ||
        isReturnPeriodValidityWithErrors(returnPeriodValidity)
    ) {
        throw new Error('Could not create return ticket json. Necessary cookies and session objects not found.');
    }
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

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
        ...(returnPeriodValidity && { returnPeriodValidity }),
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
    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
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
        isFareZoneAttributeWithErrors(fareZoneAttribute) ||
        isSalesOfferPackageWithErrors(salesOfferPackages) ||
        !salesOfferPackages
    ) {
        throw new Error(
            'Could not create period geo zone ticket json. Necessary cookies and session objects not found.',
        );
    }
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);
    const operatorObject = JSON.parse(operatorCookie);
    const atcoCodes: string[] = await getCsvZoneUploadData(uuid);
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    let productDetailsList: ProductDetails[];

    if (!multipleProductAttribute) {
        if (!periodExpiryAttributeInfo || !isProductData(periodExpiryAttributeInfo)) {
            throw new Error('Could not create period geo zone ticket json. Period expiry attribute data problem.');
        }

        const { products } = periodExpiryAttributeInfo;

        if (isProductWithSalesOfferPackages(salesOfferPackages)) {
            throw new Error('Could not create period geo zone ticket json. Sales offer package info incorrect type.');
        }

        productDetailsList = products.map(product => ({
            productName: product.productName,
            productPrice: product.productPrice,
            productDuration: isPeriodProductDetails(product) ? product.productDuration : '',
            productValidity: isPeriodProductDetails(product) ? product.productValidity : '',
            salesOfferPackages,
        }));
    } else {
        if (isSalesOfferPackages(salesOfferPackages)) {
            throw new Error(
                'Could not create period geo zone ticket json. Product Sales offer package info incorrect type.',
            );
        }
        productDetailsList = getProductsAndSalesOfferPackages(salesOfferPackages, multipleProductAttribute);
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

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
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
        isServiceListAttributeWithErrors(serviceListAttribute) ||
        isSalesOfferPackageWithErrors(salesOfferPackages) ||
        !salesOfferPackages
    ) {
        throw new Error(
            'Could not create period multiple services ticket json. Necessary cookies and session objects not found.',
        );
    }

    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);
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
                'Could not create period multiple services ticket json. Period expiry attribute data problem.',
            );
        }

        const { products } = periodExpiryAttributeInfo;

        if (isProductWithSalesOfferPackages(salesOfferPackages)) {
            throw new Error(
                'Could not create period multiple services ticket json. Sales offer package info incorrect type.',
            );
        }

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
        if (isSalesOfferPackages(salesOfferPackages)) {
            throw new Error(
                'Could not create period multiple services ticket json. Product Sales offer package info incorrect type.',
            );
        }
        productDetailsList = getProductsAndSalesOfferPackages(salesOfferPackages, multipleProductAttribute);
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

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
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
        !isProductData(productDetailsAttributeInfo) ||
        !isSalesOfferPackages(salesOfferPackages)
    ) {
        throw new Error('Could not create flat fare ticket json. Necessary cookies and session objects not found.');
    }

    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const uuid = getUuidFromCookie(req, res);

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
