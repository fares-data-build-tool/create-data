import React, { ReactElement } from 'react';
import OtherProductsTable from '../../components/OtherProductsTable';
import { MyFaresOtherFaresProduct, MyFaresOtherProduct, NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { myFaresEnabled } from '../../constants/featureFlag';
import { getAndValidateNoc } from '../../utils';
import { getOtherProductsByNoc, getPassengerTypeById } from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';

const title = 'Other Products - Create Fares Data Service';
const description = 'View and access your other products in one place.';

interface OtherProductsProps {
    otherProducts: MyFaresOtherFaresProduct[];
    myFaresEnabled: boolean;
}

const OtherProducts = ({ otherProducts, myFaresEnabled }: OtherProductsProps): ReactElement => {
    return (
        <>
            <BaseLayout title={title} description={description} showNavigation myFaresEnabled={myFaresEnabled}>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Other products</h1>
                        </div>
                        <OtherProductsTable otherProducts={otherProducts} />
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: OtherProductsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const otherProductsFromDb: MyFaresOtherProduct[] = await getOtherProductsByNoc(noc);
    console.log(otherProductsFromDb);
    const otherProducts: MyFaresOtherFaresProduct[] = (
        await Promise.all(
            otherProductsFromDb.map(async (product) => {
                const matchingJson = await getProductsMatchingJson(product.matchingJsonLink);
                if ('products' in matchingJson) {
                    return Promise.all(
                        matchingJson.products?.map(async (innerProduct) => {
                            const productDescription = 'productName' in innerProduct ? innerProduct.productName : '';
                            const duration =
                                'productDuration' in innerProduct ? innerProduct.productDuration : '1 trip';
                            const quantity =
                                ('carnetDetails' in innerProduct ? innerProduct.carnetDetails?.quantity : '1') || '1';
                            const type = matchingJson.type;
                            const passengerType =
                                (await getPassengerTypeById(matchingJson.passengerType.id, noc))?.passengerType
                                    .passengerType || '';
                            const startDate = matchingJson.ticketPeriod.startDate || '';
                            const endDate = matchingJson.ticketPeriod.endDate || '';
                            return {
                                productDescription,
                                type,
                                duration,
                                quantity,
                                passengerType,
                                startDate,
                                endDate,
                                carnet: 'carnetDetails' in innerProduct,
                            };
                        }),
                    );
                }
                return [];
            }),
        )
    ).flat();

    return { props: { otherProducts, myFaresEnabled } };
};

export default OtherProducts;
