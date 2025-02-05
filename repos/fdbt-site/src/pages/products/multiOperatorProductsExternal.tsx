import React, { ReactElement, useState } from 'react';
import { NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import {
    checkIfMultiOperatorProductIsIncomplete,
    convertDateFormat,
    getAndValidateNoc,
    getCsrfToken,
    sentenceCaseString,
} from '../../utils';
import { getTag } from './services';
import { MyFaresOtherProduct } from '../../interfaces/dbTypes';
import { getGroupPassengerTypeById, getMultiOperatorExternalProducts, getPassengerTypeById } from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import DeleteConfirmationPopup from '../../components/DeleteConfirmationPopup';
import CsrfForm from '../../components/CsrfForm';

const title = 'Multi-operator products - Create Fares Data Service';
const description = 'View and access your multi-operator products in one place.';

export type MultiOperatorProduct = {
    id: number;
    isIncomplete: boolean;
    productDescription: string;
    duration: string;
    startDate: string;
    endDate: string;
    passengerType: string;
};

export interface MultiOperatorProductsProps {
    ownedProducts: MultiOperatorProduct[];
    sharedProducts: MultiOperatorProduct[];
    csrfToken: string;
}

const buildDeleteUrl = (idToDelete: number, csrfToken: string): string => {
    return `/api/deleteProduct?id=${idToDelete}&_csrf=${csrfToken}`;
};

const MultiOperatorProducts = ({
    ownedProducts,
    sharedProducts,
    csrfToken,
}: MultiOperatorProductsProps): ReactElement => {
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
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-xl">Multi-operator products</h1>
                    <p className="govuk-body-m ">
                        This is where operators can collaborate with other operators to define and export multi-operator
                        products.
                    </p>
                </div>
                <div className="govuk-grid-column-one-third">
                    <CsrfForm action="/api/fareType" method="post" csrfToken={csrfToken}>
                        <input type="hidden" name="fareType" value="multiOperatorExt" />
                        <button type="submit" className="govuk-button">
                            Create new product
                        </button>
                    </CsrfForm>
                    {/*TODO: add link to exporter*/}
                    <button type="submit" className="govuk-button govuk-button--secondary">
                        Export all products
                    </button>
                </div>
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-full">
                    <div className="govuk-tabs" data-module="govuk-tabs">
                        <h2 className="govuk-tabs__title">Multi-operator products</h2>
                        <ul className="govuk-tabs__list">
                            <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
                                <a className="govuk-tabs__tab" href="#fares-you-own">
                                    Fares you own
                                </a>
                            </li>
                            <li className="govuk-tabs__list-item">
                                <a className="govuk-tabs__tab" href="#fares-awaiting-your-input">
                                    Fares shared with you
                                </a>
                            </li>
                        </ul>
                        <div className="govuk-tabs__panel" id="fares-you-own">
                            {MultiOperatorProductsTable(
                                ownedProducts,
                                'You currently have no multi-operator products',
                                deleteActionHandler,
                            )}
                        </div>
                        <div className="govuk-tabs__panel" id="fares-awaiting-your-input">
                            {MultiOperatorProductsTable(
                                sharedProducts,
                                'There are no multi-operator products shared with you',
                            )}
                        </div>
                    </div>

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
    );
};

const MultiOperatorProductsTable = (
    multiOperatorProducts: MultiOperatorProduct[],
    noProductsMessage: string,
    deleteActionHandler?: (productId: number, name: string) => void,
): React.ReactElement => {
    return (
        <>
            <table className="govuk-table" data-card-count={multiOperatorProducts.length}>
                <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                        <th scope="col" className="govuk-table__header">
                            Product description
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
                        {deleteActionHandler ? (
                            <th scope="col" className="govuk-table__header">
                                Action
                            </th>
                        ) : null}
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
                                  <td className="govuk-table__cell">{product.duration}</td>
                                  <td className="govuk-table__cell dft-table-wrap-anywhere">
                                      {sentenceCaseString(product.passengerType)}
                                  </td>
                                  <td className="govuk-table__cell">{product.startDate}</td>
                                  <td className="govuk-table__cell">{product.endDate}</td>
                                  <td className="govuk-table__cell">
                                      {product.isIncomplete ? (
                                          <strong className="govuk-tag govuk-tag--yellow dft-table-tag">
                                              Incomplete
                                          </strong>
                                      ) : (
                                          getTag(product.startDate, product.endDate, true)
                                      )}
                                  </td>
                                  {deleteActionHandler ? (
                                      <td className="govuk-table__cell">
                                          <button
                                              className="govuk-link govuk-body button-link"
                                              onClick={() =>
                                                  deleteActionHandler(product.id, product.productDescription)
                                              }
                                              id={`delete-${index}`}
                                          >
                                              Delete
                                          </button>
                                      </td>
                                  ) : null}
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
            {multiOperatorProducts.length === 0 ? (
                <span className="govuk-body">
                    <i>{noProductsMessage}</i>
                </span>
            ) : null}
        </>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: MultiOperatorProductsProps }> => {
    const yourNoc = getAndValidateNoc(ctx);
    const multiOperatorProductsFromDb: MyFaresOtherProduct[] = await getMultiOperatorExternalProducts();

    const ownedProducts: MultiOperatorProduct[] = [];
    const sharedProducts: MultiOperatorProduct[] = [];

    for (const product of multiOperatorProductsFromDb) {
        const matchingJson = await getProductsMatchingJson(product.matchingJsonLink);

        const additionalOperators = 'additionalOperators' in matchingJson ? matchingJson.additionalOperators : [];
        const additionalNocs = 'additionalNocs' in matchingJson ? matchingJson.additionalNocs : [];
        const isFareZoneType = 'zoneName' in matchingJson;

        const secondaryOperatorsNocs = isFareZoneType ? additionalNocs : additionalOperators.map((op) => op.nocCode);
        const isSharedProduct = secondaryOperatorsNocs.includes(yourNoc);

        if (product.nocCode === yourNoc || isSharedProduct) {
            let isIncomplete = false;

            for (const noc of secondaryOperatorsNocs) {
                isIncomplete = await checkIfMultiOperatorProductIsIncomplete(product.matchingJsonLink, noc);

                if (isIncomplete) {
                    break;
                }
            }

            const startDate = matchingJson.ticketPeriod.startDate
                ? convertDateFormat(matchingJson.ticketPeriod.startDate)
                : '-';
            const endDate = matchingJson.ticketPeriod.endDate
                ? convertDateFormat(matchingJson.ticketPeriod.endDate)
                : '-';

            const passengerType =
                (await getPassengerTypeById(matchingJson.passengerType.id, product.nocCode))?.name ||
                (await getGroupPassengerTypeById(matchingJson.passengerType.id, product.nocCode))?.name ||
                '';

            for (const innerProduct of matchingJson.products) {
                const productDescription = 'productName' in innerProduct ? innerProduct.productName : '';
                const duration = 'productDuration' in innerProduct ? innerProduct.productDuration : '1 trip';

                const productData = {
                    id: product.id,
                    isIncomplete,
                    productDescription,
                    duration,
                    startDate,
                    endDate,
                    passengerType,
                };

                if (product.nocCode === yourNoc) {
                    ownedProducts.push(productData);
                } else if (isSharedProduct) {
                    sharedProducts.push(productData);
                }
            }
        }
    }

    return { props: { ownedProducts, sharedProducts, csrfToken: getCsrfToken(ctx) } };
};

export default MultiOperatorProducts;
