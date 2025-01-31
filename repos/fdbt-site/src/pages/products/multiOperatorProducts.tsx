import React, { ReactElement, useState } from 'react';
import { MyFaresOtherFaresProduct, NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { convertDateFormat, getAndValidateNoc, sentenceCaseString, getCsrfToken } from '../../utils';
import { getGroupPassengerTypeById, getOtherProductsByNoc, getPassengerTypeById } from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import { getTag } from './services';
import DeleteConfirmationPopup from '../../components/DeleteConfirmationPopup';
import logger from '../../utils/logger';
import { MyFaresOtherProduct } from '../../interfaces/dbTypes';

const title = 'Multi-operator products (internal) - Create Fares Data Service';
const description = 'View and access your multi-operator products (internal) in one place.';

interface MultiOperatorProductsProps {
    multiOperatorProducts: MyFaresOtherFaresProduct[];
    csrfToken: string;
}

const buildCopyUrl = (productId: string, csrfToken: string) => {
    return `/api/copyProduct?id=${productId}&_csrf=${csrfToken}`;
};

const MultiOperatorProducts = ({ multiOperatorProducts, csrfToken }: MultiOperatorProductsProps): ReactElement => {
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
                            <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">
                                Multi-operator products (internal)
                            </h1>

                            <a href="/fareType" className="govuk-button" data-module="govuk-button">
                                Create new product
                            </a>
                        </div>

                        {MultiOperatorProductsTable(multiOperatorProducts, deleteActionHandler, csrfToken)}

                        {popUpState && (
                            <DeleteConfirmationPopup
                                entityName={popUpState.name}
                                deleteUrl={buildDeleteUrl(popUpState.productId, csrfToken)}
                                cancelActionHandler={(): void => {
                                    setPopUpState(undefined);
                                }}
                                hintText="When you delete this product it will be removed from the system and will no longer be included in future exports."
                                isOpen={!!popUpState.productId}
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

const MultiOperatorProductsTable = (
    multiOperatorProducts: MyFaresOtherFaresProduct[],
    deleteActionHandler: (productId: number, name: string) => void,
    csrfToken: string,
): React.ReactElement => {
    return (
        <div>
            <table className="govuk-table" data-card-count={multiOperatorProducts.length}>
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
                        <th scope="col" className="govuk-table__header">
                            <span className="govuk-visually-hidden">Copy</span>
                        </th>
                        <th scope="col" className="govuk-table__header">
                            <span className="govuk-visually-hidden">Delete</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="govuk-table__body">
                    {multiOperatorProducts.length > 0
                        ? multiOperatorProducts.map((product, index) => (
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
                                      <form>
                                          <button
                                              className="govuk-link govuk-body button-link"
                                              formAction={buildCopyUrl(product.id.toString(), csrfToken)}
                                              formMethod="post"
                                              type="submit"
                                              id="copy-product-button"
                                          >
                                              Copy
                                          </button>
                                      </form>
                                  </td>
                                  <td className="govuk-table__cell">
                                      <button
                                          className="govuk-link govuk-body button-link"
                                          onClick={() => deleteActionHandler(product.id, product.productDescription)}
                                          id={`delete-${index}`}
                                      >
                                          Delete
                                      </button>
                                  </td>
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
            {multiOperatorProducts.length === 0 ? (
                <span className="govuk-body">
                    <i>You currently have no multi-operator products (internal)</i>
                </span>
            ) : null}
        </div>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: MultiOperatorProductsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const multiOperatorProductsFromDb: MyFaresOtherProduct[] = await getOtherProductsByNoc(noc);

    if (process.env.STAGE !== 'test' && multiOperatorProductsFromDb.length > 50) {
        logger.info('User has more than 50 other products', {
            noc: noc,
            MultiOperatorProductsCount: multiOperatorProductsFromDb.length,
        });
    }

    const otherProducts: MyFaresOtherFaresProduct[] = (
        await Promise.all(
            multiOperatorProductsFromDb.map(async (product) => {
                const matchingJson = await getProductsMatchingJson(product.matchingJsonLink);
                return Promise.all(
                    matchingJson.products?.map(async (innerProduct) => {
                        const productDescription = 'productName' in innerProduct ? innerProduct.productName : '';
                        const duration = 'productDuration' in innerProduct ? innerProduct.productDuration : '1 trip';
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
                            passengerType,
                            startDate,
                            endDate,
                            id,
                        };
                    }),
                );
            }),
        )
    ).flat();

    const multiOperatorProducts = otherProducts.filter((product) => product.type === 'multiOperator');
    return { props: { multiOperatorProducts, csrfToken: getCsrfToken(ctx) } };
};

export default MultiOperatorProducts;
