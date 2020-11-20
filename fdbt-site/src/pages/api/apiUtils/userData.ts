import Cookies from 'cookies';
import { NextApiResponse } from 'next';
import { decode } from 'jsonwebtoken';
import isArray from 'lodash/isArray';
import {
    TermTimeAttribute,
    ProductWithSalesOfferPackages,
    CognitoIdToken,
    FlatFareTicket,
    NextApiRequestWithSession,
    GeoZoneTicket,
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
    BaseTicket,
    BasePeriodTicket,
    MultiOperatorMultipleServicesTicket,
    MultiOperatorInfo,
    SchemeOperatorTicket,
    Ticket,
    isSchemeOperatorTicket,
} from '../../../interfaces/index';
import {
    TERM_TIME_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    ID_TOKEN_COOKIE,
    INBOUND_MATCHING_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    OPERATOR_COOKIE,
    PASSENGER_TYPE_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    MATCHING_DATA_BUCKET_NAME,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
} from '../../../constants/index';

import {
    isProductWithSalesOfferPackages,
    isSalesOfferPackageWithErrors,
    isSalesOfferPackages,
    isFareType,
    isPassengerType,
    isTicketPeriodAttribute,
} from '../../../interfaces/typeGuards';

import { getCsvZoneUploadData, putStringInS3 } from '../../../data/s3';

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

export const isTermTime = (req: NextApiRequestWithSession): boolean => {
    const termTimeAttribute = getSessionAttribute(req, TERM_TIME_ATTRIBUTE);
    return !!termTimeAttribute && (termTimeAttribute as TermTimeAttribute).termTime;
};

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
            productDuration: matchedProduct.productDuration
                ? `${matchedProduct.productDuration} ${matchedProduct.productDurationUnits}${
                      matchedProduct.productDuration === '1' ? '' : 's'
                  }`
                : '',
            productValidity: matchedProduct.productValidity || '',
            salesOfferPackages: sopInfo.salesOfferPackages,
        };
        productSOPList.push(productDetailsItem);
    });

    return productSOPList;
};

export const putUserDataInS3 = async (data: Ticket, uuid: string): Promise<void> => {
    const filePath = isSchemeOperatorTicket(data)
        ? `schemeOperator/${data.schemeOperatorRegionCode}/${uuid}_${Date.now()}.json`
        : `${data.nocCode}/${data.type}/${uuid}_${Date.now()}.json`;
    await putStringInS3(MATCHING_DATA_BUCKET_NAME, filePath, JSON.stringify(data), 'application/json; charset=utf-8');
};

export const getBaseTicketAttributes = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    ticketType: string,
): BaseTicket => {
    const cookies = new Cookies(req, res);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const nocCode = getAndValidateNoc(req, res);
    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const uuid = getUuidFromCookie(req, res);
    const fullTimeRestriction = getSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE);
    const ticketPeriodAttribute = getSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE);

    if (
        !nocCode ||
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !uuid ||
        !isTicketPeriodAttribute(ticketPeriodAttribute)
    ) {
        throw new Error(`Could not create ${ticketType} ticket json. BaseTicket attributes could not be found.`);
    }

    const { fareType } = fareTypeAttribute;
    const { email } = decode(idToken) as CognitoIdToken;

    return {
        nocCode,
        type: fareType,
        ...passengerTypeAttribute,
        email,
        uuid,
        timeRestriction:
            fullTimeRestriction && fullTimeRestriction.fullTimeRestrictions.length > 0
                ? fullTimeRestriction.fullTimeRestrictions
                : [],
        ticketPeriod: ticketPeriodAttribute,
    };
};

const isPeriodProductDetails = (product: Product): product is ProductDetails =>
    (product as ProductDetails)?.productDuration !== undefined &&
    (product as ProductDetails)?.productValidity !== undefined;

export const getBasePeriodTicketAttributes = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    ticketType: string,
): BasePeriodTicket => {
    const isProductData = (
        periodExpiryAttributeInfo: ProductData | PeriodExpiryWithErrors,
    ): periodExpiryAttributeInfo is ProductData => (periodExpiryAttributeInfo as ProductData)?.products !== null;

    const cookies = new Cookies(req, res);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);

    const baseTicketAttributes: BaseTicket = getBaseTicketAttributes(req, res, ticketType);

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);

    if (!operatorCookie || isSalesOfferPackageWithErrors(salesOfferPackages) || !salesOfferPackages) {
        throw new Error(`Could not create ${ticketType} ticket json. BasePeriodTicket attributes could not be found.`);
    }

    const { operator } = JSON.parse(operatorCookie);

    let productDetailsList: ProductDetails[];

    if (!multipleProductAttribute) {
        if (!periodExpiryAttributeInfo || !isProductData(periodExpiryAttributeInfo)) {
            throw new Error('Could not create geo zone ticket json. Period expiry attribute data problem.');
        }

        const { products } = periodExpiryAttributeInfo;

        if (isProductWithSalesOfferPackages(salesOfferPackages)) {
            throw new Error('Could not create geo zone ticket json. Sales offer package info incorrect type.');
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
            throw new Error('Could not create geo zone ticket json. Product Sales offer package info incorrect type.');
        }
        productDetailsList = getProductsAndSalesOfferPackages(salesOfferPackages, multipleProductAttribute);
    }

    return {
        ...baseTicketAttributes,
        operatorName: operator?.operatorPublicName,
        products: productDetailsList,
    };
};

export const getSingleTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): SingleTicket => {
    const isMatchingInfo = (
        matchingAttributeInfo: MatchingInfo | MatchingWithErrors,
    ): matchingAttributeInfo is MatchingInfo => (matchingAttributeInfo as MatchingInfo)?.service !== null;

    const baseTicketAttributes: BaseTicket = getBaseTicketAttributes(req, res, 'single');

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);

    if (!matchingAttributeInfo || !isMatchingInfo(matchingAttributeInfo) || !isSalesOfferPackages(salesOfferPackages)) {
        throw new Error('Could not create single ticket json. Necessary cookies and session objects not found.');
    }

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...baseTicketAttributes,
        ...service,
        fareZones: getFareZones(userFareStages, matchingFareZones),
        products: [{ salesOfferPackages }],
        termTime: isTermTime(req),
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

    const baseTicketAttributes: BaseTicket = getBaseTicketAttributes(req, res, 'return');

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const inboundMatchingAttributeInfo = getSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE);
    const returnPeriodValidity = getSessionAttribute(req, RETURN_VALIDITY_ATTRIBUTE);

    if (
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo) ||
        !isSalesOfferPackages(salesOfferPackages) ||
        isReturnPeriodValidityWithErrors(returnPeriodValidity)
    ) {
        throw new Error('Could not create return ticket json. Necessary cookies and session objects not found.');
    }

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...baseTicketAttributes,
        ...service,
        outboundFareZones: getFareZones(userFareStages, matchingFareZones),
        inboundFareZones:
            inboundMatchingAttributeInfo && isInboundMatchingInfo(inboundMatchingAttributeInfo)
                ? getFareZones(
                      inboundMatchingAttributeInfo.inboundUserFareStages,
                      inboundMatchingAttributeInfo.inboundMatchingFareZones,
                  )
                : [],
        ...(returnPeriodValidity && { returnPeriodValidity }),
        products: [{ salesOfferPackages }],
    };
};

export const getGeoZoneTicketJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<GeoZoneTicket> => {
    const basePeriodTicketAttributes: BasePeriodTicket = getBasePeriodTicketAttributes(req, res, 'geo zone');

    const fareZoneAttribute = getSessionAttribute(req, FARE_ZONE_ATTRIBUTE);
    const multiOpAttribute = getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE);

    if (!fareZoneAttribute || isFareZoneAttributeWithErrors(fareZoneAttribute)) {
        throw new Error('Could not create geo zone ticket json. Necessary cookies and session objects not found.');
    }

    const atcoCodes: string[] = await getCsvZoneUploadData(basePeriodTicketAttributes.uuid);
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

    const additionalNocs =
        basePeriodTicketAttributes.type === 'multiOperator' && multiOpAttribute
            ? multiOpAttribute.selectedOperators.map(operator => operator.nocCode)
            : undefined;

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    return {
        ...basePeriodTicketAttributes,
        zoneName: fareZoneAttribute.fareZoneName,
        stops: zoneStops,
        ...(additionalNocs && { additionalNocs }),
    };
};

export const getMultipleServicesTicketJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): PeriodMultipleServicesTicket | MultiOperatorMultipleServicesTicket => {
    const basePeriodTicketAttributes: BasePeriodTicket = getBasePeriodTicketAttributes(req, res, 'multiple services');

    const serviceListAttribute = getSessionAttribute(req, SERVICE_LIST_ATTRIBUTE);

    if (!serviceListAttribute || isServiceListAttributeWithErrors(serviceListAttribute)) {
        throw new Error(
            'Could not create period multiple services ticket json. Necessary cookies and session objects not found.',
        );
    }

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

    if (basePeriodTicketAttributes.type === 'multiOperator') {
        const multipleOperatorsServices = getSessionAttribute(
            req,
            MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
        ) as MultiOperatorInfo[];
        const additionalOperatorsInfo = {
            additionalOperators: multipleOperatorsServices.map(operator => ({
                nocCode: operator.nocCode,
                selectedServices: operator.services.map((selectedService: string) => {
                    const service = selectedService.split('#');
                    return {
                        lineName: service[0],
                        serviceCode: service[1],
                        startDate: service[2],
                        serviceDescription: service[3],
                    };
                }),
            })),
        };
        return {
            ...basePeriodTicketAttributes,
            selectedServices: formattedServiceInfo,
            additionalOperators: additionalOperatorsInfo.additionalOperators,
            termTime: isTermTime(req),
        };
    }

    return {
        ...basePeriodTicketAttributes,
        selectedServices: formattedServiceInfo,
        termTime: isTermTime(req),
    };
};

export const getFlatFareTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): FlatFareTicket => {
    const isProductData = (
        productDetailsAttributeInfo: ProductData | ProductInfo,
    ): productDetailsAttributeInfo is ProductData => (productDetailsAttributeInfo as ProductData)?.products !== null;

    const cookies = new Cookies(req, res);
    const operatorCookie = unescapeAndDecodeCookie(cookies, OPERATOR_COOKIE);

    const baseTicketAttributes: BaseTicket = getBaseTicketAttributes(req, res, 'flat fare');

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const serviceListAttribute = getSessionAttribute(req, SERVICE_LIST_ATTRIBUTE);
    const productDetailsAttributeInfo = getSessionAttribute(req, PRODUCT_DETAILS_ATTRIBUTE);

    if (
        !operatorCookie ||
        !serviceListAttribute ||
        isServiceListAttributeWithErrors(serviceListAttribute) ||
        !productDetailsAttributeInfo ||
        !isProductData(productDetailsAttributeInfo) ||
        !isSalesOfferPackages(salesOfferPackages)
    ) {
        throw new Error('Could not create flat fare ticket json. Necessary cookies and session objects not found.');
    }

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
        ...baseTicketAttributes,
        operatorName: operatorObject?.operator?.operatorPublicName,
        products: productDetailsList,
        selectedServices: formattedServiceInfo,
        termTime: isTermTime(req),
    };
};

export const getSchemeOperatorTicketJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<SchemeOperatorTicket> => {
    const isProductData = (
        periodExpiryAttributeInfo: ProductData | PeriodExpiryWithErrors,
    ): periodExpiryAttributeInfo is ProductData => (periodExpiryAttributeInfo as ProductData)?.products !== null;

    const cookies = new Cookies(req, res);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const uuid = getUuidFromCookie(req, res);
    const fullTimeRestriction = getSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE);
    const ticketPeriodAttribute = getSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE);
    const fareZoneAttribute = getSessionAttribute(req, FARE_ZONE_ATTRIBUTE);
    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
    const multiOpAttribute = getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE);

    if (
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !uuid ||
        !isTicketPeriodAttribute(ticketPeriodAttribute) ||
        isSalesOfferPackageWithErrors(salesOfferPackages) ||
        !salesOfferPackages ||
        !fareZoneAttribute ||
        isFareZoneAttributeWithErrors(fareZoneAttribute) ||
        !multiOpAttribute
    ) {
        throw new Error('Could not create scheme operator ticket json. BaseTicket attributes could not be found.');
    }

    let productDetailsList: ProductDetails[];

    if (!multipleProductAttribute) {
        if (!periodExpiryAttributeInfo || !isProductData(periodExpiryAttributeInfo)) {
            throw new Error('Could not create geo zone ticket json. Period expiry attribute data problem.');
        }

        const { products } = periodExpiryAttributeInfo;

        if (isProductWithSalesOfferPackages(salesOfferPackages)) {
            throw new Error('Could not create geo zone ticket json. Sales offer package info incorrect type.');
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
            throw new Error('Could not create geo zone ticket json. Product Sales offer package info incorrect type.');
        }
        productDetailsList = getProductsAndSalesOfferPackages(salesOfferPackages, multipleProductAttribute);
    }

    const atcoCodes: string[] = await getCsvZoneUploadData(uuid);
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    const additionalNocs = multiOpAttribute.selectedOperators.map(operator => operator.nocCode);

    const { fareType } = fareTypeAttribute;

    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const { email } = decodedIdToken;
    const schemeOperatorName = decodedIdToken['custom:schemeOperator'];
    const schemeOperatorRegionCode = decodedIdToken['custom:schemeRegionCode'];

    return {
        schemeOperatorName,
        schemeOperatorRegionCode,
        type: fareType,
        ...passengerTypeAttribute,
        email,
        uuid,
        timeRestriction:
            fullTimeRestriction && fullTimeRestriction.fullTimeRestrictions.length > 0
                ? fullTimeRestriction.fullTimeRestrictions
                : [],
        ticketPeriod: ticketPeriodAttribute,
        products: productDetailsList,
        zoneName: fareZoneAttribute.fareZoneName,
        stops: zoneStops,
        additionalNocs,
    };
};
