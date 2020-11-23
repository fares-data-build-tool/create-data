import React, { ReactElement } from 'react';
import upperFirst from 'lodash/upperFirst';
import isArray from 'lodash/isArray';
import startCase from 'lodash/startCase';
import { NextPageContextWithSession, Product, Journey, ProductData, ReturnPeriodValidity } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ConfirmationTable, { ConfirmationElement } from '../components/ConfirmationTable';
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
} from '../constants';
import { isFareType } from '../interfaces/typeGuards';
import { Service } from './api/service';
import { MatchingInfo, MatchingFareZones, InboundMatchingInfo } from '../interfaces/matchingInterface';
import { ServiceListAttribute } from './api/serviceList';
import { NumberOfProductsAttribute } from './api/howManyProducts';
import { MultipleProductAttribute } from './api/multipleProductValidity';
import { getCsrfToken } from '../utils';
import { SchoolFareTypeAttribute } from './api/schoolFareType';

const title = 'Ticket Confirmation - Create Fares Data Service';
const description = 'Ticket Confirmation page of the Create Fares Data Service';

export type TicketConfirmationProps = {
    confirmationElements: ConfirmationElement[];
    csrfToken: string;
};

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

export const buildSingleTicketConfirmationElements = (ctx: NextPageContextWithSession): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];
    const { service } = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE) as Service;
    const matchedFareStages: MatchedFareStages[] = buildMatchedFareStages(
        (getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE) as MatchingInfo).matchingFareZones,
    );

    confirmationElements.push(
        {
            name: 'Service',
            content: service.split('#')[0],
            href: 'service',
        },
        {
            name: 'Fare Triangle',
            content: 'You submitted or created a fare triangle',
            href: 'inputMethod',
        },
    );
    matchedFareStages.forEach(fareStage => {
        confirmationElements.push({
            name: `Fare Stage - ${fareStage.fareStage}`,
            content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
            href: 'matching',
        });
    });

    return confirmationElements;
};

export const buildReturnTicketConfirmationElements = (ctx: NextPageContextWithSession): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];

    const { service } = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE) as Service;
    const { inboundJourney } = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE) as Journey;
    const { outboundJourney } = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE) as Journey;
    const validity = getSessionAttribute(ctx.req, RETURN_VALIDITY_ATTRIBUTE) as ReturnPeriodValidity;

    const circular = !outboundJourney && !inboundJourney;

    confirmationElements.push({
        name: 'Service',
        content: service.split('#')[0],
        href: 'service',
    });

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
                name: `Outbound Fare Stage - ${fareStage.fareStage}`,
                content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                href: 'outboundMatching',
            });
        });
        inboundMatchedFareStages.forEach(fareStage => {
            confirmationElements.push({
                name: `Inbound Fare Stage - ${fareStage.fareStage}`,
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
                name: `Fare Stage - ${fareStage.fareStage}`,
                content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                href: 'matching',
            });
        });
    }

    if (validity) {
        confirmationElements.push({
            name: 'Return Validity',
            content: `${validity.amount} ${validity.typeOfDuration}`,
            href: 'returnValidity',
        });
    }

    return confirmationElements;
};

export const buildPeriodOrMultiOpTicketConfirmationElements = (
    ctx: NextPageContextWithSession,
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];

    const serviceInformation = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
    const services = serviceInformation ? serviceInformation.selectedServices : [];
    const zone = services.length === 0;
    const numberOfProducts = Number(
        (getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE) as NumberOfProductsAttribute).numberOfProductsInput,
    );

    let products;
    if (!numberOfProducts || numberOfProducts === 1) {
        [products] = (getSessionAttribute(ctx.req, PERIOD_EXPIRY_ATTRIBUTE) as ProductData).products;
    } else {
        products = (getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE) as MultipleProductAttribute).products;
    }

    if (zone) {
        confirmationElements.push({
            name: 'Zone',
            content: 'You uploaded a Fare Zone CSV file',
            href: 'csvZoneUpload',
        });
    } else if (!zone) {
        confirmationElements.push({
            name: 'Services',
            content: `${services.map(service => service.split('#')[0]).join(', ')}`,
            href: 'serviceList',
        });
    }

    const addProduct = (product: Product): void => {
        const productDurationText = `Duration - ${
            product.productDurationUnits
                ? `${product.productDuration} ${product.productDurationUnits}${
                      product.productDuration === '1' ? '' : 's'
                  }`
                : `${product.productDuration}`
        }`;

        if (!product.productDuration || !product.productValidity) {
            throw new Error('User has no product duration and/or validity information.');
        }
        confirmationElements.push(
            {
                name: `Product - ${product.productName}`,
                content: `Price - £${product.productPrice}`,
                href: numberOfProducts > 1 ? 'multipleProducts' : 'productDetails',
            },
            {
                name: `Product - ${product.productName}`,
                content: productDurationText,
                href: numberOfProducts > 1 ? 'multipleProducts' : 'chooseValidity',
            },
            {
                name: `Product - ${product.productName}`,
                content: `Validity - ${startCase(product.productValidity)}${
                    product.serviceEndTime ? ` - ${product.serviceEndTime}` : ''
                }`,
                href: numberOfProducts > 1 ? 'multipleProductValidity' : 'periodValidity',
            },
        );
    };

    if (isArray(products)) {
        products.forEach(product => {
            addProduct(product);
        });
    } else if (!isArray(products)) {
        addProduct(products);
    }

    return confirmationElements;
};

export const buildFlatFareTicketConfirmationElements = (ctx: NextPageContextWithSession): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];

    const serviceInformation = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
    const services = serviceInformation ? serviceInformation.selectedServices : [];
    const productInfo = (getSessionAttribute(ctx.req, PRODUCT_DETAILS_ATTRIBUTE) as ProductData).products;
    const { productName, productPrice } = productInfo[0];

    confirmationElements.push(
        {
            name: 'Services',
            content: `${services.map(service => service.split('#')[0]).join(', ')}`,
            href: 'serviceList',
        },
        {
            name: `Product - ${productName}`,
            content: `Price - £${productPrice}`,
            href: 'productDetails',
        },
    );

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
