import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getAndValidateNoc } from '../../utils';
import { getPassengerTypeNameByNocAndId, getProductMatchingJsonLinkByProductId } from '../../data/auroradb';
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
    // const timeRestriction;
    // const purchaseMethods;
    console.log(passengerType);

    return {
        props: { ticket },
    };
};

export default ProductDetails;
