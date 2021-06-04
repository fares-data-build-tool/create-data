import React, { ReactElement } from 'react';
import upperFirst from 'lodash/upperFirst';
import isArray from 'lodash/isArray';
import {
    NextPageContextWithSession,
    Journey,
    ProductData,
    ReturnPeriodValidity,
    TicketRepresentationAttribute,
    MultiOperatorInfo,
    Product,
    ConfirmationElement,
    MultipleProductAttribute,
    MultiProduct,
    SchoolFareTypeAttribute,
    MultipleOperatorsAttribute,
    Service,
    ServiceListAttribute,
    TxcSourceAttribute,
    CarnetExpiryUnit,
} from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable from '../components/ConfirmationTable';
import { getSessionAttribute } from '../utils/sessions';
import {
    FARE_TYPE_ATTRIBUTE,
    SERVICE_ATTRIBUTE,
    JOURNEY_ATTRIBUTE,
    MATCHING_ATTRIBUTE,
    INBOUND_MATCHING_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    NUMBER_OF_PRODUCTS_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    RETURN_VALIDITY_ATTRIBUTE,
    PERIOD_EXPIRY_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
    TICKET_REPRESENTATION_ATTRIBUTE,
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    OPERATOR_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../constants/attributes';
import { isFareType, isPointToPointProductInfo } from '../interfaces/typeGuards';
import { MatchingInfo, MatchingFareZones, InboundMatchingInfo } from '../interfaces/matchingInterface';
import { getCsrfToken, sentenceCaseString } from '../utils';

const title = 'Ticket Confirmation - Create Fares Data Service';
const description = 'Ticket Confirmation page of the Create Fares Data Service';

export interface TicketConfirmationProps {
    confirmationElements: ConfirmationElement[];
    csrfToken: string;
}

export interface MatchedFareStages {
    fareStage: string;
    stops: string[];
}

export const buildMatchedFareStages = (matchingFareZones: MatchingFareZones): MatchedFareStages[] => {
    const matchedFareStages: MatchedFareStages[] = [];
    const entries = Object.entries(matchingFareZones);
    entries.forEach(entry => {
        if (entry[0] !== 'undefined') {
            const stopList = entry[1].stops;
            const stops: string[] = stopList.map(stop => stop.stopName);
            matchedFareStages.push({ fareStage: entry[1].name, stops });
        }
    });
    return matchedFareStages;
};

export const getPointToPointProductElements = (ctx: NextPageContextWithSession): ConfirmationElement[] => {
    const productInfo = getSessionAttribute(ctx.req, PRODUCT_DETAILS_ATTRIBUTE);

    if (isPointToPointProductInfo(productInfo)) {
        return [
            {
                name: `${productInfo.productName} - Carnet Quantity`,
                content: productInfo.carnetDetails.quantity,
                href: 'carnetProductDetails',
            },
            {
                name: `${productInfo.productName} - Carnet Expiry`,
                content:
                    productInfo.carnetDetails.expiryUnit === CarnetExpiryUnit.NO_EXPIRY
                        ? upperFirst(CarnetExpiryUnit.NO_EXPIRY)
                        : `${productInfo.carnetDetails.expiryTime} ${upperFirst(
                              productInfo.carnetDetails.expiryUnit,
                          )}s`,
                href: 'carnetProductDetails',
            },
        ];
    }

    return [];
};

export const buildSingleTicketConfirmationElements = (ctx: NextPageContextWithSession): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];
    const { service } = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE) as Service;
    const matchedFareStages: MatchedFareStages[] = buildMatchedFareStages(
        (getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE) as MatchingInfo).matchingFareZones,
    );
    const dataSource = (getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute).source;

    confirmationElements.push(
        {
            name: 'Service',
            content: `${service.split('#')[0]}`,
            href: 'service',
        },
        {
            name: 'TransXChange source',
            content: dataSource.toUpperCase(),
            href: 'service',
        },
        {
            name: 'Fare triangle',
            content: 'You submitted or created a fare triangle',
            href: 'inputMethod',
        },
    );
    matchedFareStages.forEach(fareStage => {
        confirmationElements.push({
            name: `Fare stage - ${fareStage.fareStage}`,
            content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
            href: 'matching',
        });
    });

    const productElements = getPointToPointProductElements(ctx);

    productElements.forEach(el => confirmationElements.push(el));

    return confirmationElements;
};

export const buildReturnTicketConfirmationElements = (ctx: NextPageContextWithSession): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];

    const { service } = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE) as Service;
    const { inboundJourney } = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE) as Journey;
    const { outboundJourney } = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE) as Journey;
    const validity = getSessionAttribute(ctx.req, RETURN_VALIDITY_ATTRIBUTE) as ReturnPeriodValidity;

    const circular = !outboundJourney && !inboundJourney;
    const dataSource = (getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute).source;

    confirmationElements.push(
        {
            name: 'Service',
            content: service.split('#')[0],
            href: 'service',
        },
        {
            name: 'TransXChange source',
            content: dataSource.toUpperCase(),
            href: 'service',
        },
    );

    if (!circular) {
        const outboundMatchingFareZones = (getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE) as MatchingInfo)
            .matchingFareZones;
        const { inboundMatchingFareZones } = getSessionAttribute(
            ctx.req,
            INBOUND_MATCHING_ATTRIBUTE,
        ) as InboundMatchingInfo;

        const outboundMatchedFareStages = buildMatchedFareStages(outboundMatchingFareZones);
        const inboundMatchedFareStages = buildMatchedFareStages(inboundMatchingFareZones);

        outboundMatchedFareStages.forEach(fareStage => {
            confirmationElements.push({
                name: `Outbound fare stage - ${fareStage.fareStage}`,
                content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                href: 'outboundMatching',
            });
        });
        inboundMatchedFareStages.forEach(fareStage => {
            confirmationElements.push({
                name: `Inbound fare stage - ${fareStage.fareStage}`,
                content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                href: 'inboundMatching',
            });
        });
    } else if (circular) {
        const nonCircularMatchedFareStages = buildMatchedFareStages(
            (getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE) as MatchingInfo).matchingFareZones,
        );

        nonCircularMatchedFareStages.forEach(fareStage => {
            confirmationElements.push({
                name: `Fare stage - ${fareStage.fareStage}`,
                content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                href: 'matching',
            });
        });
    }

    const productElements = getPointToPointProductElements(ctx);

    productElements.forEach(el => confirmationElements.push(el));

    if (validity) {
        confirmationElements.push({
            name: 'Return validity',
            content: `${validity.amount} ${validity.typeOfDuration}`,
            href: 'returnValidity',
        });
    }

    return confirmationElements;
};

const addProduct = (
    product: Product | MultiProduct,
    confirmationElements: ConfirmationElement[],
): ConfirmationElement[] => {
    confirmationElements.push({
        name: `${product.productName} - Price`,
        content: `£${product.productPrice}`,
        href: 'multipleProducts',
    });

    if (product.productDuration) {
        const productDurationText = `${
            product.productDurationUnits
                ? `${product.productDuration} ${product.productDurationUnits}${
                      product.productDuration === '1' ? '' : 's'
                  }`
                : `${product.productDuration}`
        }`;
        confirmationElements.push({
            name: `${product.productName} - Duration`,
            content: productDurationText,
            href: 'multipleProducts',
        });
    }

    if (product.productValidity) {
        confirmationElements.push({
            name: `${product.productName} - Validity`,
            content: `${sentenceCaseString(product.productValidity)}${
                product.productEndTime ? ` - ${product.productEndTime}` : ''
            }`,
            href: 'periodValidity',
        });
    }

    return confirmationElements;
};

export const buildPeriodOrMultiOpTicketConfirmationElements = (
    ctx: NextPageContextWithSession,
): ConfirmationElement[] => {
    let confirmationElements: ConfirmationElement[] = [];

    const ticketRepresentation = (getSessionAttribute(
        ctx.req,
        TICKET_REPRESENTATION_ATTRIBUTE,
    ) as TicketRepresentationAttribute).name;
    const serviceInformation = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
    const multiOpAttribute = getSessionAttribute(ctx.req, MULTIPLE_OPERATOR_ATTRIBUTE) as MultipleOperatorsAttribute;
    const multiOpServices = getSessionAttribute(ctx.req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE) as MultiOperatorInfo[];
    const numberOfProducts = getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE);

    const services = serviceInformation ? serviceInformation.selectedServices : [];
    const zone = ticketRepresentation === 'geoZone';

    const products =
        !numberOfProducts || numberOfProducts === 1
            ? (getSessionAttribute(ctx.req, PERIOD_EXPIRY_ATTRIBUTE) as ProductData).products[0]
            : (getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE) as MultipleProductAttribute).products;

    if (zone) {
        confirmationElements.push({
            name: 'Zone',
            content: 'You uploaded a fare zone CSV file',
            href: 'csvZoneUpload',
        });
    } else if (!zone) {
        const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
        const opName = operatorAttribute?.name ? `${operatorAttribute.name} ` : '';
        const dataSource = (getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute).source;
        confirmationElements.push(
            {
                name: `${opName}${opName ? 's' : 'S'}ervices`,
                content: `${services.map(service => service.lineName).join(', ')}`,
                href: 'serviceList',
            },
            {
                name: 'TransXChange source',
                content: dataSource.toUpperCase(),
                href: 'serviceList',
            },
        );
    }

    if (multiOpAttribute) {
        const additionalOperators = multiOpAttribute.selectedOperators;
        confirmationElements.push({
            name: 'Additional operators',
            content: `${additionalOperators.map(operator => operator.name).join(', ')}`,
            href: 'searchOperators',
        });

        if (!zone && multiOpServices) {
            multiOpServices.forEach(serviceInfo => {
                confirmationElements.push({
                    name: `${
                        additionalOperators.find(operator => operator.nocCode === serviceInfo.nocCode)?.name
                    } Services`,
                    content: `${serviceInfo.services.map(service => service.lineName).join(', ')}`,
                    href: 'searchOperators',
                });
            });
        }
    }

    if (isArray(products)) {
        products.forEach(product => {
            confirmationElements = addProduct(product, confirmationElements);
        });
    } else if (!isArray(products)) {
        confirmationElements = addProduct(products, confirmationElements);
    }

    return confirmationElements;
};

export const buildFlatFareTicketConfirmationElements = (ctx: NextPageContextWithSession): ConfirmationElement[] => {
    let confirmationElements: ConfirmationElement[] = [];

    const serviceInformation = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
    const services = serviceInformation ? serviceInformation.selectedServices : [];
    if (services.length === 0) {
        const multiOpServicesAttribute = getSessionAttribute(
            ctx.req,
            MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
        ) as MultiOperatorInfo[];
        multiOpServicesAttribute.forEach(additionalOperator => {
            additionalOperator.services.forEach(service => {
                services.push(service);
            });
        });
    }
    const { products } = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE) as MultipleProductAttribute;
    const dataSource = (getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute).source;

    confirmationElements.push(
        {
            name: 'Services',
            content: `${services.map(service => service.lineName).join(', ')}`,
            href: 'serviceList',
        },
        {
            name: 'TransXChange source',
            content: dataSource.toUpperCase(),
            href: 'serviceList',
        },
    );

    products.forEach(product => {
        confirmationElements = addProduct(product, confirmationElements);
    });

    return confirmationElements;
};

export const buildSchoolTicketConfirmationElements = (ctx: NextPageContextWithSession): ConfirmationElement[] => {
    const schoolFareTypeAttribute = getSessionAttribute(ctx.req, SCHOOL_FARE_TYPE_ATTRIBUTE) as SchoolFareTypeAttribute;
    let confirmationElements: ConfirmationElement[];

    if (schoolFareTypeAttribute) {
        switch (schoolFareTypeAttribute.schoolFareType) {
            case 'single':
                confirmationElements = buildSingleTicketConfirmationElements(ctx);
                return confirmationElements;
            case 'period':
                confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
                return confirmationElements;
            case 'flatFare':
                confirmationElements = buildFlatFareTicketConfirmationElements(ctx);
                return confirmationElements;
            default:
                throw new Error('Did not receive an expected schoolFareType.');
        }
    } else {
        throw new Error('Could not extract schoolFareType from the schoolFareTypeAttribute.');
    }
};

export const buildTicketConfirmationElements = (
    fareType: string,
    ctx: NextPageContextWithSession,
): ConfirmationElement[] => {
    let confirmationElements: ConfirmationElement[];

    switch (fareType) {
        case 'single':
            confirmationElements = buildSingleTicketConfirmationElements(ctx);
            break;
        case 'return':
            confirmationElements = buildReturnTicketConfirmationElements(ctx);
            break;
        case 'period':
            confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
            break;
        case 'flatFare':
            confirmationElements = buildFlatFareTicketConfirmationElements(ctx);
            break;
        case 'multiOperator':
            confirmationElements = buildPeriodOrMultiOpTicketConfirmationElements(ctx);
            break;
        case 'schoolService':
            confirmationElements = buildSchoolTicketConfirmationElements(ctx);
            break;
        default:
            throw new Error('Did not receive an expected fareType.');
    }

    return confirmationElements;
};

const TicketConfirmation = ({ csrfToken, confirmationElements }: TicketConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/ticketConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your answers before sending your sales information</h1>
                <ConfirmationTable header="Sales Information" confirmationElements={confirmationElements} />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: TicketConfirmationProps } => {
    const csrfToken = getCsrfToken(ctx);
    const fareTypeInfo = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);

    if (!isFareType(fareTypeInfo)) {
        throw new Error('Did not receive an expected fareType.');
    }

    return {
        props: {
            confirmationElements: buildTicketConfirmationElements(fareTypeInfo.fareType, ctx),
            csrfToken,
        },
    };
};

export default TicketConfirmation;
