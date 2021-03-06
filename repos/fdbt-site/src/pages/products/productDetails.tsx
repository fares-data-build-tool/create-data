import React, { ReactElement } from 'react';
import { convertDateFormat, getAndValidateNoc, sentenceCaseString } from '../../utils';
import {
    getBodsServiceByNocAndId,
    getPassengerTypeNameByIdAndNoc,
    getProductById,
    getSalesOfferPackageByIdAndNoc,
    getTimeRestrictionByIdAndNoc,
    getBodsServiceDirectionDescriptionsByNocAndServiceId,
} from '../../data/auroradb';
import { ProductDetailsElement, NextPageContextWithSession } from '../../interfaces';
import TwoThirdsLayout from '../../layout/Layout';
import { getTag } from './services';
import { getProductsMatchingJson } from '../../data/s3';
import BackButton from '../../components/BackButton';
import { updateSessionAttribute } from '../../utils/sessions';
import { MATCHING_JSON_ATTRIBUTE, MATCHING_JSON_META_DATA_ATTRIBUTE } from '../../../src/constants/attributes';

const title = 'Product Details - Create Fares Data Service';
const description = 'Product Details page of the Create Fares Data Service';

interface ProductDetailsProps {
    backHref: string;
    productName: string;
    endDate?: string;
    startDate: string;
    productDetailsElements: ProductDetailsElement[];
    requiresAttention: boolean;
}

const ProductDetails = ({
    backHref,
    productName,
    startDate,
    endDate,
    productDetailsElements,
    requiresAttention,
}: ProductDetailsProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <BackButton href={backHref} />
        <h1 className="govuk-heading-l" id="product-name">
            {productName}
        </h1>

        <div id="product-status" className="govuk-hint">
            Product status: {getTag(startDate, endDate, false)}
            {requiresAttention && (
                <strong className="govuk-tag govuk-tag--yellow govuk-!-margin-left-2">NEEDS ATTENTION</strong>
            )}
        </div>

        {productDetailsElements.map((element) => {
            return (
                <dl className="govuk-summary-list" key={element.name}>
                    <div className="govuk-summary-list__row" key={element.name}>
                        <dt className="govuk-summary-list__key">{element.name}</dt>

                        <dd className="govuk-summary-list__value">
                            {element.editLink !== undefined ? getEditableValue(element) : getReadValue(element)}
                        </dd>
                    </div>
                </dl>
            );
        })}
    </TwoThirdsLayout>
);

const getReadValue = (element: ProductDetailsElement) => {
    return element.content.map((item) => (
        <span key={item} id={element.id || undefined}>
            {item}
        </span>
    ));
};

const getEditableValue = (element: ProductDetailsElement) => {
    return (
        <div className="dft-flex dft-flex-justify-space-between">
            {element.content.map((item) => {
                return (
                    <span key={item} id={element.id || undefined}>
                        {item}
                    </span>
                );
            })}

            <a href={element.editLink}>Edit</a>
        </div>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ProductDetailsProps }> => {
    const noc = getAndValidateNoc(ctx);

    const serviceId = ctx.query?.serviceId;

    const productId = ctx.query?.productId;

    if (typeof productId !== 'string') {
        throw new Error(`Expected string type for productID, received: ${productId}`);
    }

    const { matchingJsonLink, servicesRequiringAttention } = await getProductById(noc, productId);

    const ticket = await getProductsMatchingJson(matchingJsonLink);

    // store the ticket in the session so that it can be retrieved
    // on the /csvUpload page.
    updateSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE, ticket);

    const productDetailsElements: ProductDetailsElement[] = [];

    if ('type' in ticket) {
        productDetailsElements.push({
            name: 'Fare type',
            id: 'fare-type',
            content: [`${sentenceCaseString(ticket.type)}${ticket.carnet ? ' (carnet)' : ''}`],
        });
    }

    if ('selectedServices' in ticket) {
        productDetailsElements.push({
            name: 'additionalNocs' in ticket || 'additionalOperators' in ticket ? `${noc} Services` : 'Services',
            content: [
                (
                    await Promise.all(
                        ticket.selectedServices.map((service) => {
                            return service.lineName;
                        }),
                    )
                ).join(', '),
            ],
        });
    }

    let backHref = '/products/otherProducts';

    let requiresAttention = false;

    if (serviceId) {
        if (typeof serviceId !== 'string') {
            throw new Error(`Expected string type for serviceId, received: ${serviceId}`);
        }

        updateSessionAttribute(ctx.req, MATCHING_JSON_META_DATA_ATTRIBUTE, { productId, serviceId, matchingJsonLink });

        const pointToPointService = await getBodsServiceByNocAndId(noc, serviceId);

        productDetailsElements.push({
            name: 'Service',
            content: [
                `${pointToPointService.lineName} - ${pointToPointService.origin} to ${pointToPointService.destination}`,
            ],
        });

        backHref = `/products/pointToPointProducts?serviceId=${serviceId}`;

        requiresAttention = servicesRequiringAttention?.includes(serviceId) ?? false;

        if ('journeyDirection' in ticket && ticket.journeyDirection) {
            const { inboundDirectionDescription, outboundDirectionDescription } =
                await getBodsServiceDirectionDescriptionsByNocAndServiceId(noc, serviceId);

            productDetailsElements.push({
                name: 'Journey direction',
                content: [
                    `${sentenceCaseString(ticket.journeyDirection)} - ${
                        ticket.journeyDirection === 'inbound' || ticket.journeyDirection === 'clockwise'
                            ? inboundDirectionDescription
                            : outboundDirectionDescription
                    }`,
                ],
            });
        }
    }

    if ('zoneName' in ticket) {
        productDetailsElements.push({ name: 'Zone', content: [ticket.zoneName] });
    }

    const passengerTypeName = await getPassengerTypeNameByIdAndNoc(ticket.passengerType.id, noc);

    productDetailsElements.push({ name: 'Passenger type', content: [passengerTypeName] });

    const isSchoolTicket = 'termTime' in ticket && ticket.termTime;

    if (!isSchoolTicket) {
        const timeRestriction = ticket.timeRestriction
            ? (await getTimeRestrictionByIdAndNoc(ticket.timeRestriction.id, noc)).name
            : 'N/A';

        productDetailsElements.push({ name: 'Time restriction', content: [timeRestriction] });
    } else {
        productDetailsElements.push({ name: 'Only valid during term time', content: ['Yes'] });
    }

    // check to see if we have a point to point product
    if ('lineId' in ticket) {
        productDetailsElements.push({
            name: 'Fare triangle',
            content: ['You created a fare triangle'],
            editLink: '/csvUpload',
        });
    }

    if ('additionalNocs' in ticket) {
        if ('schemeOperatorName' in ticket) {
            productDetailsElements.push({
                name: `Multi Operator Group`,
                content: [ticket.additionalNocs.join(', ')],
            });
        } else {
            productDetailsElements.push({
                name: `Multi Operator Group`,
                content: [`${noc}, ${ticket.additionalNocs.join(', ')}`],
            });
        }
    }

    if ('additionalOperators' in ticket) {
        ticket.additionalOperators.forEach((additionalOperator) => {
            productDetailsElements.push({
                name: `${additionalOperator.nocCode} Services`,
                content: [
                    additionalOperator.selectedServices.map((selectedService) => selectedService.lineName).join(', '),
                ],
            });
        });
    }

    const product = ticket.products[0];

    if ('carnetDetails' in product && product.carnetDetails) {
        productDetailsElements.push({ name: 'Quantity in bundle', content: [product.carnetDetails.quantity] });

        productDetailsElements.push({
            name: 'Carnet expiry',
            content: [
                product.carnetDetails.expiryUnit === 'no expiry'
                    ? 'No expiry'
                    : `${product.carnetDetails.expiryTime} ${product.carnetDetails.expiryUnit}(s)`,
            ],
        });
    }

    if ('returnPeriodValidity' in ticket && ticket.returnPeriodValidity) {
        productDetailsElements.push({
            name: 'Return ticket validity',
            content: [`${ticket.returnPeriodValidity.amount} ${ticket.returnPeriodValidity.typeOfDuration}(s)`],
        });
    }

    if ('productDuration' in product) {
        productDetailsElements.push({ name: 'Period duration', content: [product.productDuration] });
    }

    if ('productValidity' in product && product.productValidity) {
        productDetailsElements.push({ name: 'Product expiry', content: [sentenceCaseString(product.productValidity)] });
    }

    productDetailsElements.push({
        name: 'Purchase methods',
        content: await Promise.all(
            product.salesOfferPackages.map(async (sop) => {
                const fullSop = await getSalesOfferPackageByIdAndNoc(sop.id, noc);

                let content = fullSop.name;

                if (sop.price) {
                    content = `${fullSop.name} - ??${sop.price}`;
                }

                return content;
            }),
        ),
    });

    const startDate = convertDateFormat(ticket.ticketPeriod.startDate);

    const endDate = ticket.ticketPeriod.endDate ? convertDateFormat(ticket.ticketPeriod.endDate) : undefined;

    productDetailsElements.push({ name: 'Start date', content: [startDate] });

    productDetailsElements.push({ name: 'End date', content: [endDate ?? '-'] });

    const productName =
        'productName' in product
            ? product.productName
            : isSchoolTicket
            ? `${passengerTypeName} - ${sentenceCaseString(ticket.type)} (school)`
            : `${passengerTypeName} - ${sentenceCaseString(ticket.type)}`;

    return {
        props: {
            backHref,
            productName,
            startDate,
            ...(endDate && { endDate }),
            productDetailsElements,
            requiresAttention,
        },
    };
};

export default ProductDetails;
