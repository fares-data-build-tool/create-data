import React, { ReactElement } from 'react';
import { convertDateFormat, getAndValidateNoc, sentenceCaseString } from '../../utils';
import {
    getPassengerTypeNameByIdAndNoc,
    getProductMatchingJsonLinkByProductId,
    getSalesOfferPackageByIdAndNoc,
    getTimeRestrictionByIdAndNoc,
} from '../../data/auroradb';
import { ProductDetailsElement, NextPageContextWithSession } from '../../interfaces';
import TwoThirdsLayout from '../../layout/Layout';
import isArray from 'lodash/isArray';
import { getTag } from './services';
import { getProductsMatchingJson } from '../../data/s3';

const title = 'Product Details - Create Fares Data Service';
const description = 'Product Details page of the Create Fares Data Service';

interface ProductDetailsProps {
    productName: string;
    endDate: string;
    startDate: string;
    productDetailsElements: ProductDetailsElement[];
}

const ProductDetails = ({
    productName,
    startDate,
    endDate,
    productDetailsElements,
}: ProductDetailsProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <h1 className="govuk-heading-l">{productName}</h1>
        <div id="contact-hint" className="govuk-hint">
            Product status: {getTag(startDate, endDate)}
        </div>
        {productDetailsElements.map((element) => {
            const content = isArray(element.content) ? element.content : [element.content];
            return (
                <dl className="govuk-summary-list">
                    <div className="govuk-summary-list__row" key={element.name}>
                        <dt className="govuk-summary-list__key">{element.name}</dt>
                        <dd className="govuk-summary-list__value">
                            {content.map((item) => (
                                <div key={item}>{item}</div>
                            ))}
                        </dd>
                    </div>
                </dl>
            );
        })}
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ProductDetailsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const productId = ctx.query?.productId;

    if (typeof productId !== 'string') {
        throw new Error(`Expected string type for productID, received: ${productId}`);
    }

    const matchingJsonLink = await getProductMatchingJsonLinkByProductId(noc, productId);
    const ticket = await getProductsMatchingJson(matchingJsonLink);

    const productDetailsElements: ProductDetailsElement[] = [];

    if ('serviceDescription' in ticket) {
        productDetailsElements.push({
            name: 'Service',
            content: `${ticket.lineName} - ${ticket.serviceDescription}`,
        });
    }

    if ('journeyDirection' in ticket && ticket.journeyDirection) {
        productDetailsElements.push({ name: 'Journey direction', content: ticket.journeyDirection });
    }

    const passengerTypeName = await getPassengerTypeNameByIdAndNoc(ticket.passengerType.id, noc);
    productDetailsElements.push({ name: 'Passenger type', content: passengerTypeName });

    const isSchoolTicket = 'termTime' in ticket && ticket.termTime;
    if (!isSchoolTicket) {
        const timeRestriction = ticket.timeRestriction
            ? (await getTimeRestrictionByIdAndNoc(ticket.timeRestriction.id, noc)).name
            : 'N/A';
        productDetailsElements.push({ name: 'Time restriction', content: timeRestriction });
    }

    if (isSchoolTicket) {
        productDetailsElements.push({ name: 'Only valid during term time', content: 'Yes' });
    }

    const product = ticket.products[0];
    if ('carnetDetails' in product && product.carnetDetails) {
        productDetailsElements.push({ name: 'Quantity in bundle', content: product.carnetDetails.quantity });
        productDetailsElements.push({
            name: 'Carnet expiry',
            content:
                product.carnetDetails.expiryUnit === 'no expiry'
                    ? 'No expiry'
                    : `${product.carnetDetails.expiryTime} ${product.carnetDetails.expiryUnit}(s)`,
        });
    }

    if ('returnPeriodValidity' in ticket) {
        productDetailsElements.push({
            name: 'Return ticket validity',
            content: `${ticket.returnPeriodValidity?.amount} ${ticket.returnPeriodValidity?.typeOfDuration}(s)`,
        });
    }

    if ('productDuration' in product) {
        productDetailsElements.push({ name: 'Period duration', content: product.productDuration });
    }

    if ('productValidity' in product && product.productValidity) {
        productDetailsElements.push({ name: 'Product expiry', content: product.productValidity });
    }

    productDetailsElements.push({
        name: 'Purchase methods',
        content: await Promise.all(
            product.salesOfferPackages.map(async (sop) => {
                const fullSop = await getSalesOfferPackageByIdAndNoc(sop.id, noc);
                return fullSop.name;
            }),
        ),
    });

    if (!ticket.ticketPeriod.startDate || !ticket.ticketPeriod.endDate) {
        throw new Error('startdate and enddate are expected but not found');
    }

    const startDate = convertDateFormat(ticket.ticketPeriod.startDate);
    const endDate = convertDateFormat(ticket.ticketPeriod.endDate);
    productDetailsElements.push({ name: 'Start date', content: startDate });
    productDetailsElements.push({ name: 'End date', content: endDate });

    const productName =
        'productName' in product
            ? product.productName
            : isSchoolTicket
            ? `${passengerTypeName} - ${sentenceCaseString(ticket.type)} (school)`
            : `${passengerTypeName} - ${sentenceCaseString(ticket.type)}`;

    console.log(productDetailsElements);

    return {
        props: {
            productName,
            startDate,
            endDate,
            productDetailsElements,
        },
    };
};

export default ProductDetails;
