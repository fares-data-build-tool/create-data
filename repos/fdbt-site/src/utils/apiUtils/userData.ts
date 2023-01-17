import Cookies from 'cookies';
import { decode } from 'jsonwebtoken';
import { NextApiResponse } from 'next';
import { getAndValidateNoc, getUuidFromSession, unescapeAndDecodeCookie, isSchemeOperator } from './index';
import { ID_TOKEN_COOKIE, PRODUCTS_DATA_BUCKET_NAME } from '../../constants';
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
    POINT_TO_POINT_PRODUCT_ATTRIBUTE,
    PRODUCT_DATE_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    TERM_TIME_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    UNASSIGNED_INBOUND_STOPS_ATTRIBUTE,
    UNASSIGNED_STOPS_ATTRIBUTE,
    DIRECTION_ATTRIBUTE,
    TYPE_OF_CAP_ATTRIBUTE,
    PRICING_PER_DISTANCE_ATTRIBUTE,
    ADDITIONAL_PRICING_ATTRIBUTE,
    MULTI_TAPS_PRICING_ATTRIBUTE,
    CAPS_ATTRIBUTE,
    CAP_EXPIRY_ATTRIBUTE,
    CAP_START_ATTRIBUTE,
    CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE,
} from '../../constants/attributes';
import {
    batchGetStopsByAtcoCode,
    getPointToPointProductsByLineId,
    getProductById,
    insertProducts,
} from '../../data/auroradb';
import { getCsvZoneUploadData, getProductsMatchingJson, putStringInS3 } from '../../data/s3';
import {
    CognitoIdToken,
    MultiOperatorMultipleServicesTicket,
    MultiProduct,
    NextApiRequestWithSession,
    ProductWithSalesOfferPackages,
    TermTimeAttribute,
    TicketPeriod,
    TicketPeriodWithInput,
    Direction,
    TypeOfCap,
    DistancePricingData,
    AdditionalPricing,
    MultiTapPricing,
    CapDetails,
    ServiceListAttribute,
    OperatorAttribute,
} from '../../interfaces';
import { InboundMatchingInfo, MatchingInfo, MatchingWithErrors } from '../../interfaces/matchingInterface';
import {
    isFareType,
    isPassengerType,
    isPeriodExpiry,
    isSalesOfferPackages,
    isSalesOfferPackageWithErrors,
    isWithErrors,
    isTicketRepresentation,
} from '../../interfaces/typeGuards';
import logger from '../logger';
import { getSessionAttribute, getRequiredSessionAttribute } from '../sessions';
import { isFareZoneAttributeWithErrors } from '../../pages/csvZoneUpload';
import { isReturnPeriodValidityWithErrors } from '../../pages/returnValidity';
import { getFareZones } from './matching';
import moment from 'moment';
import {
    TicketWithIds,
    WithIds,
    TicketType,
    WithBaseIds,
    BasePeriodTicket,
    PeriodMultipleServicesTicket,
    SchemeOperatorMultiServiceTicket,
    BaseSchemeOperatorTicket,
    BaseTicket,
    GeoZoneTicket,
    PeriodExpiry,
    PeriodHybridTicket,
    PointToPointPeriodProduct,
    PointToPointPeriodTicket,
    PointToPointTicket,
    ReturnTicket,
    SalesOfferPackage,
    SchemeOperatorFlatFareTicket,
    SchemeOperatorGeoZoneTicket,
    SingleTicket,
    Stop,
    Ticket,
    AdditionalOperator,
    CapExpiry,
    CapStartInfo,
    ByProductsCapInfo,
    ByDistanceCapInfo,
    SelectedService,
    ByTapCapInfo,
    CappedTicket,
    ExpiryUnit,
    FlatFareMultipleServices,
    PriceByDistanceProductDetails,
} from '../../interfaces/matchingJsonTypes';

export const isTermTime = (req: NextApiRequestWithSession): boolean => {
    const termTimeAttribute = getSessionAttribute(req, TERM_TIME_ATTRIBUTE);
    return !!termTimeAttribute && (termTimeAttribute as TermTimeAttribute).termTime;
};

export const collectInfoForMatchingTickets = async (
    noc: string,
    lineId: string,
    outboundDirection: string,
    productId: string,
): Promise<{
    directionToFind: 'inbound' | 'outbound';
    tickets: TicketWithIds[];
    originalTicket: TicketWithIds;
}> => {
    const originalProduct = await getProductById(noc, productId);
    const originalTicket = await getProductsMatchingJson(originalProduct.matchingJsonLink);
    const directionToFind: 'inbound' | 'outbound' =
        (originalTicket as WithIds<SingleTicket>).journeyDirection === outboundDirection ? 'inbound' : 'outbound';

    const products = await getPointToPointProductsByLineId(noc, lineId);
    const matchingJsonLinks = products.map((product) => product.matchingJsonLink);
    const tickets = await Promise.all(
        matchingJsonLinks.map(async (link) => {
            return await getProductsMatchingJson(link);
        }),
    );

    return {
        directionToFind,
        tickets,
        originalTicket,
    };
};

export const getProductsAndSalesOfferPackages = <T extends { products: { salesOfferPackages: { id: number }[] }[] }>(
    salesOfferPackagesInfo: ProductWithSalesOfferPackages[],
    multipleProductAttribute: { products: (MultiProduct | PointToPointPeriodProduct)[] },
    periodExpiryAttributeInfo: PeriodExpiry | undefined,
): T['products'] =>
    salesOfferPackagesInfo.map((sopInfo) => {
        const matchedProduct = multipleProductAttribute.products.find(
            (product) => product.productName === sopInfo.productName,
        );

        if (!matchedProduct) {
            throw new Error('No products could be found that matched the sales offer packages');
        }

        const salesOfferPackages = sopInfo.salesOfferPackages.map((salesOfferPackage) => {
            if (!salesOfferPackage.id) {
                throw new Error('Got a sop without an ID: ' + salesOfferPackage.name);
            }

            return {
                id: salesOfferPackage.id,
                price: salesOfferPackage.price,
            };
        });
        // here
        return {
            pricingByDistance: 'pricingByDistance' in matchedProduct ? matchedProduct.pricingByDistance : undefined,
            productName: 'productName' in matchedProduct ? matchedProduct.productName : undefined,
            productPrice: 'productPrice' in matchedProduct ? matchedProduct.productPrice : undefined,
            productDuration: matchedProduct.productDuration
                ? `${matchedProduct.productDuration} ${matchedProduct.productDurationUnits}${
                      matchedProduct.productDuration === '1' ? '' : 's'
                  }`
                : undefined,
            productValidity: periodExpiryAttributeInfo?.productValidity,
            carnetDetails: 'carnetDetails' in matchedProduct ? matchedProduct.carnetDetails : undefined,
            salesOfferPackages: salesOfferPackages,
        } as T['products'][0];
    });

export const putUserDataInProductsBucket = async (
    data: WithIds<Ticket>,
    uuid: string,
    nocCode: string,
): Promise<string> => {
    const filePath = `${nocCode}/${data.type}/${uuid}_${Date.now()}.json`;

    await putStringInS3(PRODUCTS_DATA_BUCKET_NAME, filePath, JSON.stringify(data), 'application/json; charset=utf-8');

    return filePath;
};

export const putUserDataInProductsBucketWithFilePath = async (
    data: WithIds<Ticket>,
    filePath: string,
): Promise<string> => {
    await putStringInS3(PRODUCTS_DATA_BUCKET_NAME, filePath, JSON.stringify(data), 'application/json; charset=utf-8');

    return filePath;
};

const getTicketPeriod = (ticketPeriodWithInput: TicketPeriodWithInput): TicketPeriod => ({
    startDate: ticketPeriodWithInput.startDate,
    endDate: ticketPeriodWithInput.endDate,
});

export const getBaseTicketAttributes = <T extends TicketType>(
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    ticketType: T,
): WithBaseIds<BaseTicket<T>> => {
    const cookies = new Cookies(req, res);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const nocCode = getAndValidateNoc(req, res);
    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const schoolFareTypeAttribute = getSessionAttribute(req, SCHOOL_FARE_TYPE_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const uuid = getUuidFromSession(req);
    const fullTimeRestriction = getSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE);
    const ticketPeriodAttribute = getRequiredSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE);

    if (
        !nocCode ||
        !isFareType(fareTypeAttribute) ||
        (isFareType(fareTypeAttribute) && fareTypeAttribute.fareType === 'schoolService' && !schoolFareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !uuid ||
        !('startDate' in ticketPeriodAttribute) ||
        !passengerTypeAttribute.id
    ) {
        logger.error('Invalid attributes', {
            fareTypeAttribute,
            passengerTypeAttribute,
            schoolFareTypeAttribute,
            idToken,
            uuid,
            ticketPeriodAttribute,
        });
        throw new Error(`Could not create ${ticketType} ticket json. BaseTicket attributes could not be found.`);
    }

    const { fareType } = fareTypeAttribute;
    const { email } = decode(idToken) as CognitoIdToken;

    return {
        nocCode,
        type: (fareType === 'schoolService' && schoolFareTypeAttribute?.schoolFareType
            ? schoolFareTypeAttribute?.schoolFareType
            : fareType) as T,
        passengerType: { id: passengerTypeAttribute.id },
        email,
        uuid,
        timeRestriction: fullTimeRestriction?.id ? { id: fullTimeRestriction.id } : undefined,
        ticketPeriod: getTicketPeriod(ticketPeriodAttribute),
    };
};

export const getBasePeriodTicketAttributes = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    ticketType: 'period' | 'multiOperator',
): WithIds<BasePeriodTicket> => {
    const operatorAttribute = getSessionAttribute(req, OPERATOR_ATTRIBUTE);
    const baseTicketAttributes = getBaseTicketAttributes(req, res, ticketType);
    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const multipleProductAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);

    if (
        !operatorAttribute?.name ||
        isSalesOfferPackages(salesOfferPackages) ||
        isSalesOfferPackageWithErrors(salesOfferPackages) ||
        !salesOfferPackages ||
        !multipleProductAttribute ||
        (periodExpiryAttributeInfo && !isPeriodExpiry(periodExpiryAttributeInfo))
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

    const productDetailsList = getProductsAndSalesOfferPackages<WithIds<BasePeriodTicket>>(
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

const getPointToPointProducts = (req: NextApiRequestWithSession): WithIds<PointToPointTicket>['products'] => {
    const carnetProductDetail = getSessionAttribute(req, CARNET_PRODUCT_DETAILS_ATTRIBUTE);
    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);

    if (!isSalesOfferPackages(salesOfferPackages)) {
        throw new Error('No Sales Offer Packages data found');
    }

    return [
        {
            ...carnetProductDetail,
            salesOfferPackages: salesOfferPackages.map((sop) => {
                if (!sop.id) {
                    throw new Error('Got a sop without an ID: ' + sop.name);
                }

                return { id: sop.id, price: sop.price };
            }),
        },
    ];
};

export const getSingleTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): WithIds<SingleTicket> => {
    const isMatchingInfo = (
        matchingAttributeInfo: MatchingInfo | MatchingWithErrors,
    ): matchingAttributeInfo is MatchingInfo => (matchingAttributeInfo as MatchingInfo)?.service !== null;

    const baseTicketAttributes = getBaseTicketAttributes(req, res, 'single');
    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const products = getPointToPointProducts(req);
    const singleUnassignedStops = getSessionAttribute(req, UNASSIGNED_STOPS_ATTRIBUTE);
    const directionAttribute = getSessionAttribute(req, DIRECTION_ATTRIBUTE);

    if (
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo) ||
        !singleUnassignedStops ||
        !directionAttribute ||
        'errors' in directionAttribute
    ) {
        throw new Error('Could not create single ticket json. Necessary cookies and session objects not found.');
    }

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...baseTicketAttributes,
        ...service,
        type: 'single',
        fareZones: getFareZones(userFareStages, matchingFareZones),
        unassignedStops: {
            singleUnassignedStops,
        },
        products,
        termTime: isTermTime(req),
        operatorName: service.operatorShortName,
        ...{ operatorShortName: undefined },
        journeyDirection: (directionAttribute as Direction).direction,
    };
};

export const getReturnTicketJson = (req: NextApiRequestWithSession, res: NextApiResponse): WithIds<ReturnTicket> => {
    const isMatchingInfo = (
        matchingAttributeInfo: MatchingInfo | MatchingWithErrors,
    ): matchingAttributeInfo is MatchingInfo => (matchingAttributeInfo as MatchingInfo)?.service !== null;
    const isInboundMatchingInfo = (
        inboundMatchingAttributeInfo: InboundMatchingInfo | MatchingWithErrors,
    ): inboundMatchingAttributeInfo is InboundMatchingInfo =>
        (inboundMatchingAttributeInfo as InboundMatchingInfo)?.inboundUserFareStages !== null;

    const baseTicketAttributes = getBaseTicketAttributes(req, res, 'return');

    const matchingAttributeInfo = getSessionAttribute(req, MATCHING_ATTRIBUTE);
    const inboundMatchingAttributeInfo = getSessionAttribute(req, INBOUND_MATCHING_ATTRIBUTE);
    const returnPeriodValidity = getSessionAttribute(req, RETURN_VALIDITY_ATTRIBUTE);
    const products = getPointToPointProducts(req);
    const outboundUnassignedStops = getSessionAttribute(req, UNASSIGNED_STOPS_ATTRIBUTE);
    const inboundUnassignedStops = getSessionAttribute(req, UNASSIGNED_INBOUND_STOPS_ATTRIBUTE);

    if (
        !matchingAttributeInfo ||
        !isMatchingInfo(matchingAttributeInfo) ||
        isReturnPeriodValidityWithErrors(returnPeriodValidity) ||
        !outboundUnassignedStops ||
        !inboundUnassignedStops
    ) {
        logger.error('session objects', {
            matchingAttributeInfo,
            returnPeriodValidity,
            outboundUnassignedStops,
            inboundUnassignedStops,
        });
        throw new Error('Could not create return ticket json. Necessary cookies and session objects not found.');
    }

    const { service, userFareStages, matchingFareZones } = matchingAttributeInfo;

    return {
        ...baseTicketAttributes,
        ...service,
        type: 'return',
        outboundFareZones: getFareZones(userFareStages, matchingFareZones),
        inboundFareZones:
            inboundMatchingAttributeInfo && isInboundMatchingInfo(inboundMatchingAttributeInfo)
                ? getFareZones(
                      inboundMatchingAttributeInfo.inboundUserFareStages,
                      inboundMatchingAttributeInfo.inboundMatchingFareZones,
                  )
                : [],
        ...(returnPeriodValidity && { returnPeriodValidity }),
        unassignedStops: {
            outboundUnassignedStops,
            inboundUnassignedStops,
        },
        products,
        operatorName: service.operatorShortName,
        ...{ operatorShortName: undefined },
    };
};

export const getCappedTicketJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    ticketType: 'geoZone' | 'multipleServices',
): Promise<WithIds<CappedTicket>> => {
    let json;
    if (ticketType === 'geoZone') {
        json = await getCappedGeoZoneTicketJson(req, res);
    } else {
        json = getCappedMultipleServicesTicketJson(req, res);
    }

    let capData;
    let productName = '';

    const { typeOfCap } = getSessionAttribute(req, TYPE_OF_CAP_ATTRIBUTE) as TypeOfCap;

    switch (typeOfCap) {
        case 'byDistance':
            const distanceCap = getSessionAttribute(req, PRICING_PER_DISTANCE_ATTRIBUTE) as DistancePricingData;
            const additionalDiscount = getSessionAttribute(req, ADDITIONAL_PRICING_ATTRIBUTE) as
                | AdditionalPricing
                | undefined;
            const distanceCappedProductInfo: ByDistanceCapInfo = {
                capDetails: distanceCap,
                ...(!!additionalDiscount && additionalDiscount),
            };
            capData = { cappedProductInfo: distanceCappedProductInfo };
            productName = distanceCappedProductInfo.capDetails.productName;
            break;
        case 'byTaps':
            const tapCap = getSessionAttribute(req, MULTI_TAPS_PRICING_ATTRIBUTE) as MultiTapPricing;
            const capDetails = getSessionAttribute(req, CAPS_ATTRIBUTE) as CapDetails;
            const capExpiry = getSessionAttribute(req, CAP_EXPIRY_ATTRIBUTE) as CapExpiry;
            const capStart = getSessionAttribute(req, CAP_START_ATTRIBUTE) as CapStartInfo;
            const byTapCappedProductInfo: ByTapCapInfo = {
                tapDetails: tapCap.tapDetails,
                capDetails,
                capExpiry,
                capStart,
            };
            capData = {
                cappedProductInfo: byTapCappedProductInfo,
            };
            productName = capDetails.productName;
            break;
        case 'byProducts':
            const productGroupId = getSessionAttribute(req, CAPPED_PRODUCT_GROUP_ID_ATTRIBUTE) as string;
            const byProductsCapDetails = getSessionAttribute(req, CAPS_ATTRIBUTE) as CapDetails;
            const byProductsCapExpiry = getSessionAttribute(req, CAP_EXPIRY_ATTRIBUTE) as CapExpiry;
            const byProductsCapStart = getSessionAttribute(req, CAP_START_ATTRIBUTE) as CapStartInfo;
            const cappedProductInfo: ByProductsCapInfo = {
                productGroup: { id: Number(productGroupId) },
                capDetails: byProductsCapDetails,
                capExpiry: byProductsCapExpiry,
                capStart: byProductsCapStart,
            };
            capData = {
                cappedProductInfo,
                products: [{ productName: byProductsCapDetails.productName }],
            };
            productName = byProductsCapDetails.productName;
            break;
        default:
            throw new Error('Invalid type of cap.');
    }

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE) as SalesOfferPackage[];
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE) as PeriodExpiry;

    const products = getProductsAndSalesOfferPackages<WithIds<CappedTicket>>(
        [{ productName, salesOfferPackages }],
        { products: [{ productName, productDuration: '', productDurationUnits: ExpiryUnit.HOUR }] },
        periodExpiryAttributeInfo,
    );

    capData = { ...capData, products };

    return { ...json, ...capData } as WithIds<CappedTicket>;
};

export const getCappedGeoZoneTicketJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<{ zoneName: string; stops: Stop[]; operatorName: string } & WithBaseIds<BaseTicket<'capped'>>> => {
    const baseAttributes = getBaseTicketAttributes(req, res, 'capped');
    const fareZoneName = getSessionAttribute(req, FARE_ZONE_ATTRIBUTE);
    const operatorName = (getSessionAttribute(req, OPERATOR_ATTRIBUTE) as OperatorAttribute).name || '';

    if (!fareZoneName || isFareZoneAttributeWithErrors(fareZoneName)) {
        throw new Error('Could not create geo zone ticket json. Necessary cookies and session objects not found.');
    }

    const atcoCodes: string[] = await getCsvZoneUploadData(
        `fare-zone/${baseAttributes.nocCode}/${baseAttributes.uuid}.json`,
    );
    const zoneStops: Stop[] = await batchGetStopsByAtcoCode(atcoCodes);

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    return {
        ...baseAttributes,
        zoneName: fareZoneName,
        stops: zoneStops,
        operatorName,
    };
};

export const getGeoZoneTicketJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): Promise<WithIds<GeoZoneTicket>> => {
    const basePeriodTicketAttributes = getBasePeriodTicketAttributes(req, res, 'period');

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

    const operatorGroupId =
        basePeriodTicketAttributes.type === 'multiOperator' && multiOpAttribute && multiOpAttribute.id
            ? multiOpAttribute.id
            : undefined;

    if (zoneStops.length === 0) {
        throw new Error(`No stops found for atcoCodes: ${atcoCodes}`);
    }

    return {
        ...basePeriodTicketAttributes,
        zoneName: fareZoneName,
        stops: zoneStops,
        ...(additionalNocs && { additionalNocs }),
        ...(operatorGroupId && { operatorGroupId }),
    };
};

export const getCappedMultipleServicesTicketJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): { selectedServices: SelectedService[]; operatorName: string } & WithBaseIds<BaseTicket<'capped'>> => {
    const baseAttributes = getBaseTicketAttributes(req, res, 'capped');
    const operatorName = (getSessionAttribute(req, OPERATOR_ATTRIBUTE) as OperatorAttribute).name || '';
    const serviceListAttribute = getSessionAttribute(req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
    const { selectedServices } = serviceListAttribute;

    return {
        ...baseAttributes,
        selectedServices,
        operatorName,
    };
};

export const getMultipleServicesByDistanceTicketJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): WithIds<FlatFareMultipleServices> => {
    const operatorAttribute = getSessionAttribute(req, OPERATOR_ATTRIBUTE);
    const serviceListAttribute = getSessionAttribute(req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
    const { selectedServices } = serviceListAttribute;
    const pricingByDistance = getSessionAttribute(req, PRICING_PER_DISTANCE_ATTRIBUTE) as DistancePricingData;
    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE) as SalesOfferPackage[];
    const baseTicketAttributes = getBaseTicketAttributes(req, res, 'flatFare');

    if (
        !operatorAttribute ||
        !operatorAttribute.name ||
        !pricingByDistance ||
        !salesOfferPackages ||
        salesOfferPackages.length <= 0
    ) {
        logger.error('Attributes missing / incorrect', {
            operatorAttribute,
            pricingByDistance,
            salesOfferPackages,
        });
        throw new Error(`Could not create flat fare by distance ticket json. Necessary attributes could not be found.`);
    }

    const { name } = operatorAttribute;

    const data = [
        {
            salesOfferPackages,
            pricingByDistance,
        },
    ] as PriceByDistanceProductDetails[];

    return {
        operatorName: name,
        ...baseTicketAttributes,
        products: data,
        selectedServices,
        termTime: isTermTime(req),
    } as WithIds<FlatFareMultipleServices>;
};

export const getMultipleServicesTicketJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): WithIds<PeriodMultipleServicesTicket> | WithIds<MultiOperatorMultipleServicesTicket> => {
    const serviceListAttribute = getSessionAttribute(req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
    const { selectedServices } = serviceListAttribute;
    const basePeriodTicketAttributes = getBasePeriodTicketAttributes(req, res, 'period');
    if (basePeriodTicketAttributes.type === 'multiOperator') {
        const additionalOperators = getSessionAttribute(
            req,
            MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
        ) as AdditionalOperator[];

        const multiOpAttribute = getSessionAttribute(req, MULTIPLE_OPERATOR_ATTRIBUTE);
        const operatorGroupId = multiOpAttribute && multiOpAttribute.id ? multiOpAttribute.id : undefined;

        return {
            ...basePeriodTicketAttributes,
            selectedServices,
            additionalOperators,
            termTime: isTermTime(req),
            ...(operatorGroupId && { operatorGroupId }),
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
): Promise<WithIds<PeriodHybridTicket>> => {
    const geoZone = await getGeoZoneTicketJson(req, res);
    const multipleServices = getMultipleServicesTicketJson(req, res);
    return { ...geoZone, ...multipleServices };
};

export const getPointToPointPeriodJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): WithIds<PointToPointPeriodTicket> => {
    const userDataJson = getReturnTicketJson(req, res);
    const pointToPointProduct = getSessionAttribute(req, POINT_TO_POINT_PRODUCT_ATTRIBUTE);
    if (!pointToPointProduct || isWithErrors(pointToPointProduct)) {
        throw new Error('Point to point period product could not be retrieved from session');
    }
    const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
    if (!isPeriodExpiry(periodExpiryAttributeInfo)) {
        throw new Error('Period expiry could not be retrieved from session');
    }

    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE) as SalesOfferPackage[];
    if (!salesOfferPackages || 'errors' in salesOfferPackages) {
        throw new Error(`Invalid sales offer packages: ${salesOfferPackages}`);
    }

    const products = getProductsAndSalesOfferPackages<WithIds<PointToPointPeriodTicket>>(
        [{ ...pointToPointProduct, salesOfferPackages }],
        { products: [pointToPointProduct] },
        periodExpiryAttributeInfo,
    );

    return {
        ...userDataJson,
        type: 'period',
        products: products,
    };
};

export const getSchemeOperatorTicketJson = (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
): WithBaseIds<BaseSchemeOperatorTicket> => {
    const cookies = new Cookies(req, res);
    const idToken = unescapeAndDecodeCookie(cookies, ID_TOKEN_COOKIE);

    const fareTypeAttribute = getSessionAttribute(req, FARE_TYPE_ATTRIBUTE);
    const passengerTypeAttribute = getSessionAttribute(req, PASSENGER_TYPE_ATTRIBUTE);
    const uuid = getUuidFromSession(req);
    const fullTimeRestriction = getSessionAttribute(req, FULL_TIME_RESTRICTIONS_ATTRIBUTE);
    const ticketPeriodAttribute = getRequiredSessionAttribute(req, PRODUCT_DATE_ATTRIBUTE);

    if (
        !isFareType(fareTypeAttribute) ||
        !isPassengerType(passengerTypeAttribute) ||
        !idToken ||
        !uuid ||
        !('startDate' in ticketPeriodAttribute) ||
        !passengerTypeAttribute.id
    ) {
        logger.error('Invalid attributes', {
            fareTypeAttribute,
            passengerTypeAttribute,
            idToken,
            uuid,
            ticketPeriodAttribute,
        });
        throw new Error('Could not create scheme operator ticket json. BaseTicket attributes could not be found.');
    }
    const { fareType } = fareTypeAttribute;
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    const { email } = decodedIdToken;
    const schemeOperatorName = decodedIdToken['custom:schemeOperator'];
    const schemeOperatorRegionCode = decodedIdToken['custom:schemeRegionCode'];

    return {
        schemeOperatorName,
        schemeOperatorRegionCode,
        type: fareType,
        passengerType: { id: passengerTypeAttribute.id },
        email,
        uuid,
        timeRestriction: fullTimeRestriction?.id ? { id: fullTimeRestriction.id } : undefined,
        ticketPeriod: getTicketPeriod(ticketPeriodAttribute),
    };
};

export const adjustSchemeOperatorJson = async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    matchingJson: WithBaseIds<BaseSchemeOperatorTicket>,
): Promise<
    | WithIds<SchemeOperatorFlatFareTicket>
    | WithIds<SchemeOperatorGeoZoneTicket>
    | WithIds<SchemeOperatorMultiServiceTicket>
> => {
    const salesOfferPackages = getSessionAttribute(req, SALES_OFFER_PACKAGES_ATTRIBUTE);

    if (isSalesOfferPackageWithErrors(salesOfferPackages) || !salesOfferPackages) {
        throw new Error('Sales offer packages not found for scheme operator ticket matching json');
    }

    const ticketRepresentation = getSessionAttribute(req, TICKET_REPRESENTATION_ATTRIBUTE);
    const ticketType = isTicketRepresentation(ticketRepresentation) ? ticketRepresentation.name : undefined;

    if (matchingJson.type === 'flatFare' || ticketType === 'multipleServices') {
        const multipleProductsAttribute = getSessionAttribute(req, MULTIPLE_PRODUCT_ATTRIBUTE);

        if (
            !multipleProductsAttribute ||
            !salesOfferPackages ||
            isSalesOfferPackages(salesOfferPackages) ||
            isSalesOfferPackageWithErrors(salesOfferPackages)
        ) {
            throw new Error('Could not create flat fare ticket json. Necessary cookies and session objects not found.');
        }

        const periodExpiryAttributeInfo = getSessionAttribute(req, PERIOD_EXPIRY_ATTRIBUTE);
        if (periodExpiryAttributeInfo && !('productValidity' in periodExpiryAttributeInfo)) {
            logger.error('Period expiry contained errors', { periodExpiryAttributeInfo });
            throw new Error('Period expiry contained errors');
        }

        const productsAndSops = getProductsAndSalesOfferPackages<WithIds<SchemeOperatorMultiServiceTicket>>(
            salesOfferPackages,
            multipleProductsAttribute,
            periodExpiryAttributeInfo,
        );

        const additionalOperators = getSessionAttribute(
            req,
            MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
        ) as AdditionalOperator[];
        return {
            ...(matchingJson as WithIds<SchemeOperatorFlatFareTicket> | WithIds<SchemeOperatorMultiServiceTicket>),
            products: productsAndSops,
            additionalOperators,
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

    const productDetailsList = getProductsAndSalesOfferPackages<WithIds<SchemeOperatorGeoZoneTicket>>(
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

export const splitUserDataJsonByProducts = (userDataJson: TicketWithIds): TicketWithIds[] => {
    return userDataJson.products.map((product) => {
        return {
            ...userDataJson,
            products: [product],
        } as TicketWithIds;
    });
};

export const insertDataToProductsBucketAndProductsTable = async (
    userDataJson: TicketWithIds,
    nocCode: string,
    uuid: string,
    ctx: { req: NextApiRequestWithSession; res: NextApiResponse },
): Promise<string> => {
    const filePath = await putUserDataInProductsBucket(userDataJson, uuid, nocCode);

    if (!isSchemeOperator(ctx.req, ctx.res)) {
        const dateTime = moment().toDate();
        const { startDate, endDate } = userDataJson.ticketPeriod;
        const lineId = 'lineId' in userDataJson ? userDataJson.lineId : undefined;

        await insertProducts(nocCode, filePath, dateTime, userDataJson.type, lineId, startDate, endDate);
    }

    return filePath;
};
