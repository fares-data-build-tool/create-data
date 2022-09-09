import React, { ReactElement, useState } from 'react';
import { MyFaresOtherFaresProduct, NextPageContextWithSession } from '../../interfaces/index';
import { MyFaresOtherProduct } from 'fdbt-types/dbTypes';
import { BaseLayout } from '../../layout/Layout';
import { convertDateFormat, getAndValidateNoc, sentenceCaseString, getCsrfToken } from '../../utils';
import { getGroupPassengerTypeById, getOtherProductsByNoc, getPassengerTypeById } from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import { getTag } from '../products/services';
import DeleteConfirmationPopup from '../../components/DeleteConfirmationPopup';
import logger from '../../utils/logger';

const title = 'Other Products - Create Fares Data Service';
const description = 'View and access your other products in one place.';

interface OtherProductsProps {
    otherProducts: MyFaresOtherFaresProduct[];
    csrfToken: string;
}

const OtherProducts = ({ otherProducts, csrfToken }: OtherProductsProps): ReactElement => {
    const [popUpState, setPopUpState] = useState<{
        name: string;
        productId: number;
    }>();

    const deleteActionHandler = (productId: number, name: string): void => {
        setPopUpState({
            name,
            productId,
        });
    };

    return (
        <>
            <BaseLayout title={title} description={description} showNavigation>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="dft-flex dft-flex-justify-space-between">
                            <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Other products</h1>

                            <a href="/fareType" className="govuk-button" data-module="govuk-button">
                                Create new product
                            </a>
                        </div>

                        {otherProductsTable(otherProducts, deleteActionHandler)}

                        {popUpState && (
                            <DeleteConfirmationPopup
                                entityType=""
                                entityName={popUpState.name}
                                deleteUrl={buildDeleteUrl(popUpState.productId, csrfToken)}
                                cancelActionHandler={(): void => {
                                    setPopUpState(undefined);
                                }}
                                hintText="When you delete this product it will be removed from the system and will no longer be included in future exports."
                            />
                        )}
                    </div>
                </div>
            </BaseLayout>
        </>
    );
};

export const buildDeleteUrl = (idToDelete: number, csrfToken: string): string => {
    return `/api/deleteProduct?id=${idToDelete}&_csrf=${csrfToken}`;
};

const otherProductsTable = (
    otherProducts: MyFaresOtherFaresProduct[],
    deleteActionHandler: (productId: number, name: string) => void,
): React.ReactElement => {
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
                        <th scope="col" className="govuk-table__header" />
                    </tr>
                </thead>
                <tbody className="govuk-table__body">
                    {otherProducts.length > 0
                        ? otherProducts.map((product, index) => (
                              <tr className="govuk-table__row" key={`product-${index}`}>
                                  <td className="govuk-table__cell dft-table-wrap-anywhere">
                                      <a
                                          href={`/products/productDetails?productId=${product.id}`}
                                          id={`product-link-${index}`}
                                      >
                                          {product.productDescription}
                                      </a>
                                  </td>
                                  <td className="govuk-table__cell">{sentenceCaseString(product.type)}</td>
                                  <td className="govuk-table__cell">{product.duration}</td>
                                  <td className="govuk-table__cell dft-table-wrap-anywhere">
                                      {sentenceCaseString(product.passengerType)}
                                  </td>
                                  <td className="govuk-table__cell">{product.startDate}</td>
                                  <td className="govuk-table__cell">{product.endDate}</td>
                                  <td className="govuk-table__cell">
                                      {getTag(product.startDate, product.endDate, true)}
                                  </td>
                                  <td className="govuk-table__cell">
                                      <button
                                          className="govuk-link button-link"
                                          onClick={() => deleteActionHandler(product.id, product.productDescription)}
                                      >
                                          Delete
                                      </button>
                                  </td>
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

    if (process.env.STAGE !== 'test' && otherProductsFromDb.length > 50) {
        logger.info('User has more than 50 other products', {
            noc: noc,
            otherProductsCount: otherProductsFromDb.length,
        });
    }

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
                            const type = `${matchingJson.type}${matchingJson.carnet ? ' carnet' : ''}`;
                            const passengerType =
                                (await getPassengerTypeById(matchingJson.passengerType.id, noc))?.name ||
                                (await getGroupPassengerTypeById(matchingJson.passengerType.id, noc))?.name ||
                                '';
                            const { id } = product;

                            const startDate = matchingJson.ticketPeriod.startDate
                                ? convertDateFormat(matchingJson.ticketPeriod.startDate)
                                : '-';
                            const endDate = matchingJson.ticketPeriod.endDate
                                ? convertDateFormat(matchingJson.ticketPeriod.endDate)
                                : '-';
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

    return { props: { otherProducts, csrfToken: getCsrfToken(ctx) } };
};

export default OtherProducts;
