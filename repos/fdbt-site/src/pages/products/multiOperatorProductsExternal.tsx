import React, { ReactElement, useState } from 'react';
import { ErrorInfo, NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { convertDateFormat, getAndValidateNoc, getCsrfToken, sentenceCaseString } from '../../utils';
import { getProductStatusTag } from './services';
import { MyFaresOtherProduct } from '../../interfaces/dbTypes';
import { getGroupPassengerTypeById, getMultiOperatorExternalProducts, getPassengerTypeById } from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import DeleteConfirmationPopup from '../../components/DeleteConfirmationPopup';
import CsrfForm from '../../components/CsrfForm';
import InformationSummary from '../../components/InformationSummary';
import ErrorSummary from '../../components/ErrorSummary';
import useSWR from 'swr';
import { Export } from '../api/getExportProgress';

const title = 'Multi-operator products - Create Fares Data Service';
const description = 'View and access your multi-operator products in one place.';

const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

export type MultiOperatorProductExternal = {
    id: number;
    incomplete: boolean;
    productDescription: string;
    duration: string;
    startDate: string;
    endDate: string;
    passengerType: string;
};

export interface MultiOperatorProductsProps {
    ownedProducts: MultiOperatorProductExternal[];
    sharedProducts: MultiOperatorProductExternal[];
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
    const [errors, setErrors] = useState<ErrorInfo[]>([]);

    const deleteActionHandler = (productId: number, name: string): void => {
        setPopUpState({
            name,
            productId,
        });
    };

    const exportButtonActionHandler = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        isExportInProgress: boolean,
        buttonId: 'select-exports' | 'export-all',
    ): void => {
        if (isExportInProgress) {
            e.preventDefault();
            setErrors([
                {
                    id: buttonId,
                    errorMessage:
                        'A new export cannot be started until the current export has finished. Please wait and try again later.',
                },
            ]);
        }
    };

    const { data } = useSWR('/api/getExportProgress', fetcher, { refreshInterval: 3000, refreshWhenHidden: true });

    const exports: Export[] | undefined = data?.exports;

    const isExportInProgress: boolean =
        !!exports && exports.some((exportDetails) => !exportDetails.signedUrl && !exportDetails.exportFailed);

    return (
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <ErrorSummary errors={errors} />
                {isExportInProgress && <InformationSummary informationText={'Export in progress.'} />}
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-xl">Multi-operator products</h1>

                    <p className="govuk-body-m ">
                        This is where operators can collaborate with other operators to define and export your active
                        multi-operator products.
                    </p>
                </div>
                <div className="govuk-grid-column-one-third">
                    <CsrfForm action="/api/fareType" method="post" csrfToken={csrfToken}>
                        <input type="hidden" name="fareType" value="multiOperatorExt" />
                        <button type="submit" className="govuk-button">
                            Create new product
                        </button>
                    </CsrfForm>
                    <CsrfForm action="/api/exportMultiOperatorExternal" method="post" csrfToken={csrfToken}>
                        <button
                            id={'export-all'}
                            className="govuk-button govuk-button--secondary"
                            onClick={(e) => exportButtonActionHandler(e, isExportInProgress, 'export-all')}
                        >
                            Export all products
                        </button>
                    </CsrfForm>
                    <a href="/products/selectMultiOperatorExports">
                        <button
                            id={'select-exports'}
                            className="govuk-button govuk-button--secondary"
                            onClick={(e) => exportButtonActionHandler(e, isExportInProgress, 'select-exports')}
                        >
                            Select products to export
                        </button>
                    </a>
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
    multiOperatorProducts: MultiOperatorProductExternal[],
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
                                      {getProductStatusTag(
                                          product.incomplete,
                                          product.startDate,
                                          product.endDate,
                                          true,
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
    const multiOperatorProductsFromDb: MyFaresOtherProduct[] = await getMultiOperatorExternalProducts(yourNoc);

    const ownedProducts: MultiOperatorProductExternal[] = [];
    const sharedProducts: MultiOperatorProductExternal[] = [];

    for (const product of multiOperatorProductsFromDb) {
        const matchingJson = await getProductsMatchingJson(product.matchingJsonLink);
        const additionalOperators = 'additionalOperators' in matchingJson ? matchingJson.additionalOperators : [];
        const additionalNocs = 'additionalNocs' in matchingJson ? matchingJson.additionalNocs : [];
        const isFareZoneType = 'zoneName' in matchingJson;
        const secondaryOperatorNocs = isFareZoneType ? additionalNocs : additionalOperators.map((op) => op.nocCode);
        const isSharedProduct = secondaryOperatorNocs.includes(yourNoc);

        if (product.nocCode === yourNoc || isSharedProduct) {
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
                    incomplete: product.incomplete,
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
