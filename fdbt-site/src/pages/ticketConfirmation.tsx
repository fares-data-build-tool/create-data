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
} from '../constants';
import {
    isFareTypeAttributeWithErrors,
    isSingleTicketProps,
    isReturnTicketProps,
    isPeriodTicketProps,
    isFlatFareTicketProps,
} from '../interfaces/typeGuards';
import { Service } from './api/service';
import { MatchingInfo, MatchingFareZones, InboundMatchingInfo } from '../interfaces/matchingInterface';
import { ServiceListAttribute } from './api/serviceList';
import { NumberOfProductsAttribute } from './api/howManyProducts';
import { MultipleProductAttribute } from './api/multipleProductValidity';
import { getCsrfToken } from '../utils';

const title = 'Ticket Confirmation - Create Fares Data Service';
const description = 'Ticket Confirmation page of the Create Fares Data Service';

export type TicketConfirmationProps = {
    fareTypeProps: SingleTicketProps | ReturnTicketProps | PeriodTicketProps | FlatFareTicketProps;
    csrfToken: string;
};

export interface SingleTicketProps {
    service: string;
    journeyDirection: string;
    matchedFareStages: MatchedFareStages[];
}

export interface MatchedFareStages {
    fareStage: string;
    stops: string[];
}

export interface ReturnTicketProps {
    service: string;
    circular: boolean;
    inboundMatchedFareStages: MatchedFareStages[];
    outboundMatchedFareStages: MatchedFareStages[];
    nonCircularMatchedFareStages: MatchedFareStages[];
    validity?: ReturnPeriodValidity;
}
export interface PeriodTicketProps {
    services: string[];
    zone: boolean;
    numberOfProducts: number;
    products: Product[] | Product;
}
export interface FlatFareTicketProps {
    services: string[];
    productName: string;
    productPrice: string;
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

export const buildFareTypeProps = (
    fareType: string,
    ctx: NextPageContextWithSession,
): SingleTicketProps | ReturnTicketProps | PeriodTicketProps | FlatFareTicketProps => {
    if (fareType === 'single') {
        const { service } = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE) as Service;
        const journeyDirection = (getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE) as Journey).directionJourneyPattern;
        if (!journeyDirection) {
            throw new Error('User has no journey direction information.');
        }
        const matchedFareStages: MatchedFareStages[] = buildMatchedFareStages(
            (getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE) as MatchingInfo).matchingFareZones,
        );
        return {
            service,
            journeyDirection,
            matchedFareStages,
        };
    }
    if (fareType === 'return') {
        const { service } = getSessionAttribute(ctx.req, SERVICE_ATTRIBUTE) as Service;
        const { inboundJourney } = getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE) as Journey;
        const outBoundJourney = (getSessionAttribute(ctx.req, JOURNEY_ATTRIBUTE) as Journey).outboundJourney;
        const circular = !(!outBoundJourney && !inboundJourney);
        const validity = getSessionAttribute(ctx.req, RETURN_VALIDITY_ATTRIBUTE) as ReturnPeriodValidity;
        if (circular) {
            const outboundMatchingFareZones = (getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE) as MatchingInfo)
                .matchingFareZones;
            const outboundMatchedFareStages = buildMatchedFareStages(outboundMatchingFareZones);
            const { inboundMatchingFareZones } = getSessionAttribute(
                ctx.req,
                INBOUND_MATCHING_ATTRIBUTE,
            ) as InboundMatchingInfo;
            const inboundMatchedFareStages = buildMatchedFareStages(inboundMatchingFareZones);
            if (validity) {
                return {
                    service,
                    circular,
                    inboundMatchedFareStages,
                    outboundMatchedFareStages,
                    nonCircularMatchedFareStages: [],
                    validity,
                };
            }
            return {
                service,
                circular,
                inboundMatchedFareStages,
                outboundMatchedFareStages,
                nonCircularMatchedFareStages: [],
            };
        }

        const matchedFareStages: MatchedFareStages[] = buildMatchedFareStages(
            (getSessionAttribute(ctx.req, MATCHING_ATTRIBUTE) as MatchingInfo).matchingFareZones,
        );

        if (validity) {
            return {
                service,
                circular,
                inboundMatchedFareStages: [],
                outboundMatchedFareStages: [],
                nonCircularMatchedFareStages: matchedFareStages,
                validity,
            };
        }
        return {
            service,
            circular,
            inboundMatchedFareStages: [],
            outboundMatchedFareStages: [],
            nonCircularMatchedFareStages: matchedFareStages,
        };
    }
    if (fareType === 'period' || fareType === 'multiOperator') {
        const serviceInformation = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
        const services = serviceInformation ? serviceInformation.selectedServices : [];
        const zone = services.length === 0;
        const numberOfProducts = Number(
            (getSessionAttribute(ctx.req, NUMBER_OF_PRODUCTS_ATTRIBUTE) as NumberOfProductsAttribute)
                .numberOfProductsInput,
        );
        let products;
        if (!numberOfProducts || numberOfProducts === 1) {
            [products] = (getSessionAttribute(ctx.req, PERIOD_EXPIRY_ATTRIBUTE) as ProductData).products;
        } else {
            products = (getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE) as MultipleProductAttribute).products;
        }
        return {
            services,
            zone,
            numberOfProducts,
            products,
        };
    }
    if (fareType === 'flatFare') {
        const serviceInformation = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE) as ServiceListAttribute;
        const services = serviceInformation ? serviceInformation.selectedServices : [];
        const productInfo = (getSessionAttribute(ctx.req, PRODUCT_DETAILS_ATTRIBUTE) as ProductData).products;
        const { productName, productPrice } = productInfo[0];
        return {
            services,
            productName,
            productPrice,
        };
    }
    throw new Error('User has unrecognised fare type.');
};

export const buildTicketConfirmationElements = (
    fareTypeProps: SingleTicketProps | ReturnTicketProps | PeriodTicketProps | FlatFareTicketProps,
): ConfirmationElement[] => {
    const confirmationElements: ConfirmationElement[] = [];
    if (isSingleTicketProps(fareTypeProps)) {
        confirmationElements.push(
            {
                name: 'Service',
                content: fareTypeProps.service.split('#')[0],
                href: 'service',
            },
            {
                name: 'Fare Triangle',
                content: 'You submitted or created a fare triangle',
                href: 'inputMethod',
            },
        );
        fareTypeProps.matchedFareStages.forEach(fareStage => {
            confirmationElements.push({
                name: `Fare Stage - ${fareStage.fareStage}`,
                content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                href: 'matching',
            });
        });
    }
    if (isReturnTicketProps(fareTypeProps)) {
        confirmationElements.push({
            name: 'Service',
            content: fareTypeProps.service.split('#')[0],
            href: 'service',
        });
        if (fareTypeProps.circular) {
            fareTypeProps.outboundMatchedFareStages.forEach(fareStage => {
                confirmationElements.push({
                    name: `Outbound Fare Stage - ${fareStage.fareStage}`,
                    content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                    href: 'outboundMatching',
                });
            });
            fareTypeProps.inboundMatchedFareStages.forEach(fareStage => {
                confirmationElements.push({
                    name: `Inbound Fare Stage - ${fareStage.fareStage}`,
                    content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                    href: 'inboundMatching',
                });
            });
        } else {
            fareTypeProps.nonCircularMatchedFareStages.forEach(fareStage => {
                confirmationElements.push({
                    name: `Fare Stage - ${fareStage.fareStage}`,
                    content: `Stops - ${fareStage.stops.map(stop => upperFirst(stop)).join(', ')}`,
                    href: 'matching',
                });
            });
        }

        if (fareTypeProps.validity) {
            confirmationElements.push({
                name: 'Return Validity',
                content: `${fareTypeProps.validity.amount} ${fareTypeProps.validity.typeOfDuration}`,
                href: 'returnValidity',
            });
        }
    }
    if (isPeriodTicketProps(fareTypeProps)) {
        if (fareTypeProps.zone) {
            confirmationElements.push({
                name: 'Zone',
                content: 'You uploaded a Fare Zone CSV file',
                href: 'csvZoneUpload',
            });
        } else {
            confirmationElements.push({
                name: 'Services',
                content: `${fareTypeProps.services.map(service => service.split('#')[0]).join(', ')}`,
                href: 'serviceList',
            });
        }
        if (isArray(fareTypeProps.products)) {
            fareTypeProps.products.forEach(product => {
                if (!product.productDuration || !product.productValidity) {
                    throw new Error('User has no product duration and/or validity information.');
                }
                confirmationElements.push(
                    {
                        name: `Product - ${product.productName}`,
                        content: `Price - £${product.productPrice}`,
                        href: fareTypeProps.numberOfProducts > 1 ? 'multipleProducts' : 'productDetails',
                    },
                    {
                        name: `Product - ${product.productName}`,
                        content: `Duration - ${product.productDuration} ${
                            product.productDuration === '1' ? 'day' : 'days'
                        }`,
                        href: fareTypeProps.numberOfProducts > 1 ? 'multipleProducts' : 'chooseValidity',
                    },
                    {
                        name: `Product - ${product.productName}`,
                        content: `Validity - ${startCase(product.productValidity)}`,
                        href: fareTypeProps.numberOfProducts > 1 ? 'multipleProductValidity' : 'periodValidity',
                    },
                );
            });
        } else {
            confirmationElements.push(
                {
                    name: `Product - ${fareTypeProps.products.productName}`,
                    content: `Price - £${fareTypeProps.products.productPrice}`,
                    href: fareTypeProps.numberOfProducts > 1 ? 'multipleProducts' : 'productDetails',
                },
                {
                    name: `Product - ${fareTypeProps.products.productName}`,
                    content: `Duration - ${fareTypeProps.products.productDuration}`,
                    href: fareTypeProps.numberOfProducts > 1 ? 'multipleProducts' : 'chooseValidity',
                },
                {
                    name: `Product - ${fareTypeProps.products.productName}`,
                    content: `Validity - ${startCase(fareTypeProps.products.productValidity)}`,
                    href: fareTypeProps.numberOfProducts > 1 ? 'multipleProductValidity' : 'periodValidity',
                },
            );
        }
    }
    if (isFlatFareTicketProps(fareTypeProps)) {
        confirmationElements.push(
            {
                name: 'Services',
                content: `${fareTypeProps.services.map(service => service.split('#')[0]).join(', ')}`,
                href: 'serviceList',
            },
            {
                name: `Product - ${fareTypeProps.productName}`,
                content: `Price - £${fareTypeProps.productPrice}`,
                href: 'productDetails',
            },
        );
    }
    return confirmationElements;
};

const TicketConfirmation = ({ csrfToken, fareTypeProps }: TicketConfirmationProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/ticketConfirmation" method="post" csrfToken={csrfToken}>
            <>
                <h1 className="govuk-heading-l">Check your answers before sending your sales information</h1>
                <ConfirmationTable
                    header="Sales Information"
                    confirmationElements={buildTicketConfirmationElements(fareTypeProps)}
                />
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: TicketConfirmationProps } => {
    const csrfToken = getCsrfToken(ctx);
    const fareTypeInfo = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    if (!fareTypeInfo || isFareTypeAttributeWithErrors(fareTypeInfo)) {
        throw new Error('User has reached confirmation page with incorrect fareType information.');
    }

    const fareTypeProps = buildFareTypeProps(fareTypeInfo.fareType, ctx);

    return {
        props: {
            fareTypeProps,
            csrfToken,
        },
    };
};

export default TicketConfirmation;
