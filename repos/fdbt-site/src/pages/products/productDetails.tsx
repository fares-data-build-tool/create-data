import React, { ReactElement } from 'react';
import { getAndValidateNoc, sentenceCaseString } from '../../utils';
import {
    convertDateFormat,
    getPassengerTypeNameByIdAndNoc,
    getProductMatchingJsonLinkByProductId,
    getTimeRestrictionByIdAndNoc,
} from '../../data/auroradb';
import { ProductDetailsElement, NextPageContextWithSession } from '../../interfaces';
import TwoThirdsLayout from '../../layout/Layout';
import { getProductsMatchingJson } from 'src/data/s3';
import isArray from 'lodash/isArray';
import { getTag } from './services';
import { getFullTicketFromTicketWithIds } from 'src/utils/globalSettings';

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
            Product status: <strong className="govuk-table__cell">{getTag(startDate, endDate)}</strong>
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
    const ticketWithIds = await getProductsMatchingJson(matchingJsonLink);
    const ticket = await getFullTicketFromTicketWithIds(ticketWithIds, noc);

    const timeRestriction = ticketWithIds.timeRestriction
        ? (await getTimeRestrictionByIdAndNoc(ticketWithIds.timeRestriction.id, noc)).name
        : 'N/A';

    const productDetailsElements: ProductDetailsElement[] = [];

    if ('serviceDescription' in ticket) {
        productDetailsElements.push({ name: 'Service', content: ticket.serviceDescription });
    }

    const passengerTypeName = await getPassengerTypeNameByIdAndNoc(ticketWithIds.passengerType.id, noc);
    productDetailsElements.push({ name: 'Passenger type', content: passengerTypeName });
    productDetailsElements.push({ name: 'Time restriction', content: timeRestriction });

    if ('termTime' in ticket) {
        productDetailsElements.push({ name: 'Only valid during term time', content: ticket.termTime ? 'Yes' : 'No' });
    }

    const product = ticket.products[0];
    if ('carnetDetails' in product && product.carnetDetails) {
        productDetailsElements.push({ name: 'Quantity in bundle', content: product.carnetDetails.quantity });
        productDetailsElements.push({
            name: 'Carnet expiry',
            content: `${product.carnetDetails.expiryTime} ${product.carnetDetails.expiryUnit}(s)`,
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
        content: product.salesOfferPackages.map((sop) => sop.name),
    });

    if (!ticket.ticketPeriod.startDate || !ticket.ticketPeriod.endDate) {
        throw new Error('startdate and enddate are expected but not found');
    }

    const startDate = ticket.ticketPeriod.startDate;
    const endDate = ticket.ticketPeriod.endDate;
    productDetailsElements.push({ name: 'Start date', content: convertDateFormat(startDate) });
    productDetailsElements.push({ name: 'End date', content: convertDateFormat(endDate) });

    console.log(productDetailsElements);

    const productName =
        'productName' in product
            ? product.productName
            : `${sentenceCaseString(passengerTypeName)} - ${sentenceCaseString(ticket.type)}`;

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
