import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAndValidateNoc } from '../../utils';
import {
    getPassengerTypeNameByIdAndNoc,
    getProductMatchingJsonLinkByProductId,
    getSalesOfferPackageByIdAndNoc,
    getTimeRestrictionByIdAndNoc,
} from '../../data/auroradb';
import { ConfirmationElement, NextPageContextWithSession } from '../../interfaces';
import TwoThirdsLayout from '../../layout/Layout';
import { getProductsMatchingJson } from 'src/data/s3';
import { TicketWithIds } from 'shared/matchingJsonTypes';
import salesOfferPackages from '../api/salesOfferPackages';
import service from '../api/service';
import isArray from 'lodash/isArray';

const title = 'Product Details - Create Fares Data Service';
const description = 'Product Details page of the Create Fares Data Service';

interface ProductDetailsProps {
    ticket: TicketWithIds;
    passengerType: string;
    timeRestriction: string;
    formattedPurchaseMethods: string;
    confirmationElements: ConfirmationElement[];
}

const ProductDetails = ({
    ticket,
    passengerType,
    timeRestriction,
    formattedPurchaseMethods,
    confirmationElements,
}: ProductDetailsProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <h1 className="govuk-heading-l">Product Name Here</h1>
        <div id="contact-hint" className="govuk-hint">
            Product status: <strong className="govuk-tag govuk-tag--blue">Pending</strong>
        </div>
        {confirmationElements.map((element) => {
            const content = isArray(element.content) ? element.content : [element.content]; //changed back from element.content as string[];
            return (
                <React.Fragment key={passengerType}>
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
                </React.Fragment>
            );
        })}
    </TwoThirdsLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: ProductDetailsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const productId = ctx.query?.productId;

    if (typeof productId !== 'string') {
        throw new Error(`Product ID is set as ${productId}`);
    }

    const matchingJsonLink = await getProductMatchingJsonLinkByProductId(noc, productId);
    const ticket = await getProductsMatchingJson(matchingJsonLink);

    const passengerType = await getPassengerTypeNameByIdAndNoc(ticket.passengerType.id, noc);
    const timeRestriction = ticket.timeRestriction
        ? (await getTimeRestrictionByIdAndNoc(ticket.timeRestriction.id, noc)).name
        : 'N/A';

    const purchaseMethods = await Promise.all(
        ticket.products[0].salesOfferPackages.map(async (salesOfferPackage) => {
            const sop = await getSalesOfferPackageByIdAndNoc(salesOfferPackage.id, noc);
            return sop.name;
        }),
    );
    const formattedPurchaseMethods = purchaseMethods.join(', ');

    const confirmationElements: ConfirmationElement[] = [];

    if (ticket.products[0].productName) {
        confirmationElements.push({ name: 'Product name', content: ticket.products[0].productName });
    }
    if ('serviceDescription' in ticket) {
        confirmationElements.push({ name: 'Service', content: ticket.serviceDescription });
    }

    confirmationElements.push({ name: 'Passenger type', content: passengerType });
    confirmationElements.push({ name: 'Time restriction', content: timeRestriction });

    if ('termTime' in ticket) {
        confirmationElements.push({ name: 'Only valid during term time', content: 'Yes' }); //ticket.termTime is a boolean
    }

    // if ('carnetDetails' in ticket.products[0]){
    //     confirmationElements.push({ name: 'Quantity in bundle', content: ticket.products[0].carnetDetails.quantity });
    //     confirmationElements.push({ name: 'Carnet expiry', content: `${ticket.products[0].carnetDetails.expiryTime} ${ticket.products[0].carnetDetails.expiryUnit}(s)` });
    // }

    if ('returnPeriodValidity' in ticket) {
        confirmationElements.push({
            name: 'Return ticket validity',
            content: `${ticket.returnPeriodValidity?.amount} ${ticket.returnPeriodValidity?.typeOfDuration}(s)`,
        });
    }

    // if ('productDuration' in ticket.products[0]){
    //     confirmationElements.push({ name: 'Period duration', content: ticket.products[0].productDuration});
    //     confirmationElements.push({ name: 'Period duration', content: ticket.products[0].productDuration });
    // }

    confirmationElements.push({ name: 'Product expiry', content: timeRestriction });
    confirmationElements.push({ name: 'Purchase methods', content: formattedPurchaseMethods });

    if (ticket.ticketPeriod.startDate) {
        confirmationElements.push({ name: 'Start date', content: ticket.ticketPeriod.startDate });
    }
    if (ticket.ticketPeriod.endDate) {
        confirmationElements.push({ name: 'End date', content: ticket.ticketPeriod.endDate });
    }

    console.log('AARON-LOG');
    console.log(ticket);

    return {
        props: { ticket, passengerType, timeRestriction, formattedPurchaseMethods, confirmationElements },
    };
};

export default ProductDetails;
