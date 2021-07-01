import Cookies from 'cookies';
import { decode } from 'jsonwebtoken';
import { NextApiResponse } from 'next';
import {
    isWithErrors,
    isFareType,
    isPassengerType,
    isPeriodExpiry,
    isSalesOfferPackages,
    isSalesOfferPackageWithErrors,
    isTicketPeriodAttributeWithInput,
} from '../../../interfaces/typeGuards';
import { getAndValidateNoc, getUuidFromSession, unescapeAndDecodeCookie } from '.';

import { ID_TOKEN_COOKIE, MATCHING_DATA_BUCKET_NAME } from '../../../constants';
import {
    CARNET_PRODUCT_DETAILS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
    FARE_ZONE_ATTRIBUTE,
    FULL_TIME_RESTRICTIONS_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    PASSENGER_TYPE_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    TERM_TIME_ATTRIBUTE,
    POINT_TO_POINT_PRODUCT_ATTRIBUTE,
} from '../../../constants/attributes';
import { batchGetStopsByAtcoCode } from '../../../data/auroradb';
import { getCsvZoneUploadData, putStringInS3 } from '../../../data/s3';
import {
    BasePeriodTicket,
    BaseProduct,
    BaseTicket,
    CognitoIdToken,
    FlatFareTicket,
    GeoZoneTicket,
    isSchemeOperatorTicket,
    MultiOperatorInfo,
    MultiOperatorMultipleServicesTicket,
    MultipleProductAttribute,
    NextApiRequestWithSession,
    PeriodExpiry,
    PeriodHybridTicket,
    PeriodMultipleServicesTicket,
    PointToPointProductInfoWithSOP,
    ProductDetails,
    ProductWithSalesOfferPackages,
    ReturnTicket,
    SchemeOperatorFlatFareTicket,
    SchemeOperatorGeoZoneTicket,
    SchemeOperatorTicket,
    SingleTicket,
    Stop,
    TermTimeAttribute,
    Ticket,
    TicketPeriod,
    TicketPeriodWithInput,
    PointToPointPeriodTicket,
} from '../../../interfaces';
import { InboundMatchingInfo, MatchingInfo, MatchingWithErrors } from '../../../interfaces/matchingInterface';

import logger from '../../../utils/logger';
import { getSessionAttribute } from '../../../utils/sessions';
import { isFareZoneAttributeWithErrors } from '../../csvZoneUpload';
import { isReturnPeriodValidityWithErrors } from '../../returnValidity';
import { isServiceListAttributeWithErrors } from '../../serviceList';
import { getFareZones } from './matching';

export const isTermTime = (req: NextApiRequestWithSession): boolean => {
    const termTimeAttribute = getSessionAttribute(req, TERM_TIME_ATTRIBUTE);
    return !!termTimeAttribute && (termTimeAttribute as TermTimeAttribute).termTime;
};

export const getProductsAndSalesOfferPackages = (
    salesOfferPackagesInfo: ProductWithSalesOfferPackages[],
    multipleProductAttribute: MultipleProductAttribute,
    periodExpiryAttributeInfo: PeriodExpiry | undefined,
): ProductDetails[] => {
    const productSOPList: ProductDetails[] = [];

    salesOfferPackagesInfo.forEach((sopInfo) => {
        const matchedProduct = multipleProductAttribute.products.find(
            (product) => product.productName === sopInfo.productName,
        );
        if (!matchedProduct) {
            throw new Error('No products could be found that matched the sales offer packages');
        }
        const productDetailsItem: ProductDetails = {
            productName: matchedProduct.productName,
            productPrice: matchedProduct.productPrice,
            productDuration: matchedProduct.productDuration
                ? `${matchedProduct.productDuration} ${matchedProduct.productDurationUnits}${
                      matchedProduct.productDuration === '1' ? '' : 's'
                  }`
                : undefined,
            productValidity: periodExpiryAttributeInfo?.productValidity,
            productEndTime: periodExpiryAttributeInfo?.productEndTime,
            carnetDetails: matchedProduct.carnetDetails,
            salesOfferPackages: sopInfo.salesOfferPackages,
        };
        productSOPList.push(productDetailsItem);
    });

    return productSOPList;
};

export const putUserDataInS3 = async (data: Ticket, uuid: string): Promise<void> => {
    const s3Data = { ...data };
    const filePath = `${s3Data.nocCode}/${s3Data.type}/${uuid}_${Date.now()}.json`;

    if (isSchemeOperatorTicket(s3Data)) {
        delete s3Data.nocCode;
    }

    await putStringInS3(MATCHING_DATA_BUCKET_NAME, filePath, JSON.stringify(s3Data), 'application/json; charset=utf-8');
};

const getTicketPeriod = (ticketPeriodWithInput: TicketPeriodWithInput): TicketPeriod => ({
    startDate: ticketPeriodWithInput.startDate,
    endDate: ticketPeriodWithInput.endDate,
});

export const getBaseTicketAttributes = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    ticketType: string,
): BaseTicket => {
    const cookies = new Cookies(req, res);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const nocCode = getAndValidateNoc(req, res);
    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const schoolFareTypeAttribute = getSessionAttribute(req, SCHOOL_FARE_TYPE_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const uuid = getUuidFromSession(req);
    const fullTimeRestriction = getSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE);
    const ticketPeriodAttribute = getSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE);

    if (
        !nocCode ||
        !isFareType(fareTypeAttribute) ||
        (isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'schoolService' && !schoolFareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !uuid ||
        !isTicketPeriodAttributeWithInput(ticketPeriodAttribute)
    ) {
        throw new Error(`Could not create ${ticketType} ticket json. BaseTicket attributes could not be found.`);
    }

    const { fareType } = fareTypeAttribute;
    const { email } = decode(idToken) as CognitoIdToken;

    return {
        nocCode,
        type:
            fareType === 'schoolService' && schoolFareTypeAttribute?.schoolFareType
                ? schoolFareTypeAttribute?.schoolFareType
                : fareType,
        ...passengerTypeAttribute,
        email,
        uuid,
        timeRestriction:
            fullTimeRestriction && fullTimeRestriction.fullTimeRestrictions.length > 0
                ? fullTimeRestriction.fullTimeRestrictions
                : [],
        ticketPeriod: getTicketPeriod(ticketPeriodAttribute),
    };
};

export const getBasePeriodTicketAttributes = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    ticketType: string,
): BasePeriodTicket => {
    const operatorAttribute = getSessionAttribute(req, OPERATOR_ATTRIBUTE);

    const baseTicketAttributes: BaseTicket = getBaseTicketAttributes(req, res, ticketType);

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);

    if (
        !operatorAttribute?.name ||
        isSalesOfferPackages(salesOfferPackages) ||
        isSalesOfferPackageWithErrors(salesOfferPackages) ||
        !salesOfferPackages ||
        !multipleProductAttribute ||
        !periodExpiryAttributeInfo ||
        !isPeriodExpiry(periodExpiryAttributeInfo)
    ) {
        logger.error('Attributes missing / incorrect', {
            operatorAttribute,
            salesOfferPackages,
            multipleProductAttribute,
            periodExpiryAttributeInfo,
        });
        throw new Error(`Could not create ${ticketType} ticket json. Necessary attributes could not be found.`);
    }

    const { name } = operatorAttribute;

    const productDetailsList: ProductDetails[] = getProductsAndSalesOfferPackages(
        salesOfferPackages,
        multipleProductAttribute,
        periodExpiryAttributeInfo,
    );

    return {
        ...baseTicketAttributes,
        operatorName: name,
        products: productDetailsList,
    };
};

const getPointToPointProducts = (req: NextApiRequestWithSession): PointToPointProductInfoWithSOP[] | BaseProduct[] => {
    const carnetProductDetail = getSessionAttribute(req, CARNET_PRODUCT_DETAILS_ATTRIBUTE);
    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);

    if (!isSalesOfferPackages(salesOfferPackages)) {
        throw new Error('No Sales Offer Packages data found');
    }

    return [
        {
            ...carnetProductDetail,
            salesOfferPackages,
        },
    ];
};

export const getSingleTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): SingleTicket => {
    const isMatchingInfo = (
        matchingAttributeInfo: MatchingInfo | MatchingWithErrors,
    ): matchingAttributeInfo is MatchingInfo => (matchingAttributeInfo as MatchingInfo)?.service !== null;

    const baseTicketAttributes: BaseTicket = getBaseTicketAttributes(req, res, 'single');
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const products = getPointToPointProducts(req);

    if (!matchingAttributeInfo || !isMatchingInfo(matchingAttributeInfo)) {
        throw new Error('Could not create single ticket json. Necessary cookies and session objects not found.');
    }

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...baseTicketAttributes,
        ...service,
        fareZones: getFareZones(userFareStages, matchingFareZones),
        products,
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

    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const inboundMatchingAttributeInfo = getSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE);
    const returnPeriodValidity = getSessionAttribute(req, RETURN_VALIDITY_ATTRIBUTE);
    const products = getPointToPointProducts(req);

    if (
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo) ||
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
        products,
    };
};

export const getGeoZoneTicketJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<GeoZoneTicket> => {
    const basePeriodTicketAttributes: BasePeriodTicket = getBasePeriodTicketAttributes(req, res, 'geo zone');

    const fareZoneName = getSessionAttribute(req, FARE_ZONE_ATTRIBUTE);
    const multiOpAttribute = getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE);

    if (!fareZoneName || isFareZoneAttributeWithErrors(fareZoneName)) {
        throw new Error('Could not create geo zone ticket json. Necessary cookies and session objects not found.');
    }

    const atcoCodes: string[] = await getCsvZoneUploadData(
        `fare-zone/${basePeriodTicketAttributes.nocCode}/${basePeriodTicketAttributes.uuid}.json`,
    );
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

    const additionalNocs =
        basePeriodTicketAttributes.type === 'multiOperator' && multiOpAttribute
            ? multiOpAttribute.selectedOperators.map((operator) => operator.nocCode)
            : undefined;

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    return {
        ...basePeriodTicketAttributes,
        zoneName: fareZoneName,
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

    if (basePeriodTicketAttributes.type === 'multiOperator') {
        const multipleOperatorsServices = getSessionAttribute(
            req,
            MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
        ) as MultiOperatorInfo[];
        const additionalOperatorsInfo = {
            additionalOperators: multipleOperatorsServices.map((operator) => ({
                nocCode: operator.nocCode,
                selectedServices: operator.services,
            })),
        };
        return {
            ...basePeriodTicketAttributes,
            selectedServices,
            additionalOperators: additionalOperatorsInfo.additionalOperators,
            termTime: isTermTime(req),
        };
    }

    return {
        ...basePeriodTicketAttributes,
        selectedServices,
        termTime: isTermTime(req),
    };
};

export const getHybridTicketJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<PeriodHybridTicket> => {
    const geoZone = await getGeoZoneTicketJson(req, res);
    const multipleServices = getMultipleServicesTicketJson(req, res);
    return { ...geoZone, ...multipleServices };
};

export const getFlatFareTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): FlatFareTicket => {
    const operatorAttribute = getSessionAttribute(req, OPERATOR_ATTRIBUTE);

    const baseTicketAttributes: BaseTicket = getBaseTicketAttributes(req, res, 'flat fare');

    const productWithSalesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const serviceListAttribute = getSessionAttribute(req, SERVICE_LIST_ATTRIBUTE);
    const multipleProductsAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);

    if (
        !operatorAttribute ||
        !serviceListAttribute ||
        isServiceListAttributeWithErrors(serviceListAttribute) ||
        !multipleProductsAttribute ||
        !productWithSalesOfferPackages ||
        isSalesOfferPackages(productWithSalesOfferPackages) ||
        isSalesOfferPackageWithErrors(productWithSalesOfferPackages)
    ) {
        throw new Error('Could not create flat fare ticket json. Necessary cookies and session objects not found.');
    }

    const { selectedServices } = serviceListAttribute;

    const productsAndSops = getProductsAndSalesOfferPackages(
        productWithSalesOfferPackages,
        multipleProductsAttribute,
        undefined,
    );

    return {
        ...baseTicketAttributes,
        operatorName: operatorAttribute?.name || '',
        products: productsAndSops,
        selectedServices,
        termTime: isTermTime(req),
    };
};

export const getPointToPointPeriodJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): PointToPointPeriodTicket => {
    const userDataJson = getReturnTicketJson(req, res);
    const pointToPointProduct = getSessionAttribute(req, POINT_TO_POINT_PRODUCT_ATTRIBUTE);
    if (!pointToPointProduct || isWithErrors(pointToPointProduct)) {
        throw new Error('Point to point period product could not be retrieved from session');
    }
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
    if (!isPeriodExpiry(periodExpiryAttributeInfo)) {
        throw new Error('Period expiry could not be retrieved from session');
    }
    return {
        ...userDataJson,
        pointToPointProduct,
        periodExpiry: {
            productValidity: periodExpiryAttributeInfo.productValidity,
            productEndTime: periodExpiryAttributeInfo.productEndTime,
        },
    };
};

export const getSchemeOperatorTicketJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): SchemeOperatorTicket => {
    const cookies = new Cookies(req, res);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const uuid = getUuidFromSession(req);
    const fullTimeRestriction = getSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE);
    const ticketPeriodAttribute = getSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE);

    if (
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !uuid ||
        !isTicketPeriodAttributeWithInput(ticketPeriodAttribute)
    ) {
        throw new Error('Could not create scheme operator ticket json. BaseTicket attributes could not be found.');
    }
    const { fareType } = fareTypeAttribute;
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const { email } = decodedIdToken;
    const schemeOperatorName = decodedIdToken['custom:schemeOperator'];
    const schemeOperatorRegionCode = decodedIdToken['custom:schemeRegionCode'];
    const noc = getAndValidateNoc(req, res);

    return {
        schemeOperatorName,
        schemeOperatorRegionCode,
        nocCode: noc,
        type: fareType,
        ...passengerTypeAttribute,
        email,
        uuid,
        timeRestriction:
            fullTimeRestriction && fullTimeRestriction.fullTimeRestrictions.length > 0
                ? fullTimeRestriction.fullTimeRestrictions
                : [],
        ticketPeriod: getTicketPeriod(ticketPeriodAttribute),
    };
};

export const adjustSchemeOperatorJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    matchingJson: SchemeOperatorTicket,
): Promise<SchemeOperatorFlatFareTicket | SchemeOperatorGeoZoneTicket> => {
    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);

    if (isSalesOfferPackageWithErrors(salesOfferPackages) || !salesOfferPackages) {
        throw new Error('Sales offer packages not found for scheme operator ticket matching json');
    }

    if (matchingJson.type === 'flatFare') {
        const multipleProductsAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);

        if (
            !multipleProductsAttribute ||
            !salesOfferPackages ||
            isSalesOfferPackages(salesOfferPackages) ||
            isSalesOfferPackageWithErrors(salesOfferPackages)
        ) {
            throw new Error('Could not create flat fare ticket json. Necessary cookies and session objects not found.');
        }

        const productsAndSops = getProductsAndSalesOfferPackages(
            salesOfferPackages,
            multipleProductsAttribute,
            undefined,
        );
        const multipleOperatorsServices = getSessionAttribute(
            req,
            MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
        ) as MultiOperatorInfo[];
        const additionalOperatorsInfo = {
            additionalOperators: multipleOperatorsServices.map((operator) => ({
                nocCode: operator.nocCode,
                selectedServices: operator.services,
            })),
        };
        return {
            ...matchingJson,
            products: productsAndSops,
            additionalOperators: additionalOperatorsInfo.additionalOperators,
        };
    }
    const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
    const multiOpAttribute = getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE);
    const fareZoneName = getSessionAttribute(req, FARE_ZONE_ATTRIBUTE);

    if (!fareZoneName || isFareZoneAttributeWithErrors(fareZoneName) || !multiOpAttribute) {
        throw new Error(
            'Fare zone name or multi operator attribute not found for scheme operator ticket matching json',
        );
    }

    if (
        !isPeriodExpiry(periodExpiryAttributeInfo) ||
        isSalesOfferPackages(salesOfferPackages) ||
        !multipleProductAttribute
    ) {
        logger.error('invalid values', { periodExpiryAttributeInfo, salesOfferPackages, multipleProductAttribute });
        throw new Error('Could not create ticket json. Required values not found.');
    }

    const productDetailsList = getProductsAndSalesOfferPackages(
        salesOfferPackages,
        multipleProductAttribute,
        periodExpiryAttributeInfo,
    );

    const nocCode = getAndValidateNoc(req, res);
    const atcoCodes: string[] = await getCsvZoneUploadData(`fare-zone/${nocCode}/${matchingJson.uuid}.json`);
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);
    const additionalNocs = multiOpAttribute.selectedOperators.map((operator) => operator.nocCode);

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }
    return {
        ...matchingJson,
        products: productDetailsList,
        zoneName: fareZoneName,
        stops: zoneStops,
        additionalNocs,
    };
};
