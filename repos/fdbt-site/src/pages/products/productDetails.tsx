import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAndValidateNoc } from '../../utils';
import {
    getPassengerTypeNameByNocAndId,
    getProductMatchingJsonLinkByProductId,
    getPurchaseMethodsNameByNocAndId,
    getTimeRestrictionNameByNocAndId,
} from '../../data/auroradb';
import { NextPageContextWithSession } from '../../interfaces';
import TwoThirdsLayout from '../../layout/Layout';
import { getProductsMatchingJson } from 'src/data/s3';
import { TicketWithIds } from 'shared/matchingJsonTypes';

const title = 'Product Details - Create Fares Data Service';
const description = 'Product Details page of the Create Fares Data Service';

interface ProductDetailsProps {
    ticket: TicketWithIds;
}

const ProductDetails = ({ ticket }: ProductDetailsProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <h1 className="govuk-heading-l">Product Name Here</h1>
        <div id="contact-hint" className="govuk-hint">
            Product status: <strong className="govuk-tag govuk-tag--blue">Pending</strong>
        </div>
        {/* {confirmationElements.map((element) => {
        const content = isArray(element.content) ? element.content : [element.content];
        return (
            <React.Fragment key={header}>
                <dl className="govuk-summary-list">
                    <div className="govuk-summary-list__row" key={element.name}>
                        <dt className="govuk-summary-list__key">{element.name}</dt>
                        <dd className="govuk-summary-list__value">
                            {content.map((item) => (
                                <div key={item}>{item}</div>
                            ))}
                        </dd>
                        <dd className="govuk-summary-list__actions">
                            {element.href !== '' ? (
                                <a className="govuk-link" href={element.href}>
                                    change<span className="govuk-visually-hidden">{element.name}</span>
                                </a>
                            ) : null}
                        </dd>
                    </div>
                </dl>
            </React.Fragment>
        );
    });} */}
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
    const passengerType = getPassengerTypeNameByNocAndId(noc, ticket.passengerType.id.toString());
    // const timeRestriction = getTimeRestrictionNameByNocAndId(noc, ticket.timeRestriction.id.toString());
    // const purchaseMethods = getPurchaseMethodsNameByNocAndId(
    //     noc,
    //     ticket.products[0].salesOfferPackages[0].id.toString(),
    // );
    console.log(passengerType);
    // console.log(timeRestriction);
    // console.log(purchaseMethods);

    return {
        props: { ticket },
    };
};

export default ProductDetails;
