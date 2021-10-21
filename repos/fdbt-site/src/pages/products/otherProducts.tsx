import React, { ReactElement } from 'react';
import { MyFaresOtherFaresProduct, MyFaresOtherProduct, NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { myFaresEnabled } from '../../constants/featureFlag';
import { getAndValidateNoc, sentenceCaseString } from '../../utils';
import { getGroupPassengerTypeById, getOtherProductsByNoc, getPassengerTypeById } from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import { getTag } from '../products/services';

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
                        <div className="dft-flex dft-flex-justify-space-between">
                            <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Other products</h1>

                            <a href="/fareType" className="govuk-button" data-module="govuk-button">
                                Create new product
                            </a>
                        </div>

                        {otherProductsTable(otherProducts)}
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

const otherProductsTable = (otherProducts: MyFaresOtherFaresProduct[]): ReactElement => {
    return (
        <>
            <table className="govuk-table">
                <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                        <th scope="col" className="govuk-table__header">
                            Product description
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Type
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Duration
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Quantity
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Passenger type
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Start date
                        </th>
                        <th scope="col" className="govuk-table__header">
                            End date
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Product status
                        </th>
                    </tr>
                </thead>
                <tbody className="govuk-table__body">
                    {otherProducts.length > 0
                        ? otherProducts.map((product, index) => (
                              <tr className="govuk-table__row" key={`product-${index}`}>
                                  <td className="govuk-table__cell dft-table-wrap-anywhere dft-table-fixed-width">
                                      <a href={`/products/productDetails?productId=${product.id}`}>
                                          {product.productDescription}
                                      </a>
                                  </td>
                                  <td className="govuk-table__cell">{sentenceCaseString(product.type)}</td>
                                  <td className="govuk-table__cell">{product.duration}</td>
                                  <td className="govuk-table__cell">{product.quantity}</td>
                                  <td className="govuk-table__cell dft-table-wrap-anywhere dft-table-fixed-width">
                                      {sentenceCaseString(product.passengerType)}
                                  </td>
                                  <td className="govuk-table__cell">{product.startDate}</td>
                                  <td className="govuk-table__cell">{product.endDate}</td>
                                  <td className="govuk-table__cell">{getTag(product.startDate, product.endDate)}</td>
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
            {otherProducts.length === 0 ? (
                <span className="govuk-body">
                    <i>You currently have no multi-service products</i>
                </span>
            ) : null}
        </>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: OtherProductsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const otherProductsFromDb: MyFaresOtherProduct[] = await getOtherProductsByNoc(noc);
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
                                (await getPassengerTypeById(matchingJson.passengerType.id, noc))?.name ||
                                (await getGroupPassengerTypeById(matchingJson.passengerType.id, noc))?.name ||
                                '';
                            const startDate = product.startDate;
                            const endDate = product.endDate;
                            const id = product.id;
                            return {
                                productDescription,
                                type,
                                duration,
                                quantity,
                                passengerType,
                                startDate,
                                endDate,
                                id,
                                carnet: 'carnetDetails' in innerProduct && !!innerProduct.carnetDetails,
                            };
                        }),
                    );
                }
                return [];
            }),
        )
    ).flat();
    console.log(otherProducts);

    return { props: { otherProducts, myFaresEnabled } };
};

export default OtherProducts;
