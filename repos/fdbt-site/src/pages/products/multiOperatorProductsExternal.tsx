import React, { ReactElement } from 'react';
import { MyFaresOtherFaresProduct, NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout } from '../../layout/Layout';
import { convertDateFormat, getAndValidateNoc, getCsrfToken, sentenceCaseString } from '../../utils';
import { getTag } from './services';
import { MyFaresOtherProduct } from '../../interfaces/dbTypes';
import {
    getMultiOperatorExternalProducts,
    getMultiOperatorExternalProductsByNoc,
    getOtherProductsByNoc,
} from '../../data/auroradb';

const title = 'Multi-operator products (external) - Create Fares Data Service';
const description = 'View and access your multi-operator products (external) in one place.';

interface MultiOperatorProductsProps {
    multiOperatorProducts: MyFaresOtherFaresProduct[];
    csrfToken: string;
}

const MultiOperatorProducts = ({ multiOperatorProducts, csrfToken }: MultiOperatorProductsProps) => {
    return (
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <h1 className="govuk-heading-xl">Multi-operator products</h1>
                    <p className="govuk-body-m ">
                        This is where operators can collaborate with other operators to define and export multi-operator
                        products
                    </p>
                </div>
                <div className="govuk-grid-column-one-third">
                    {/*TODO: add link to multiop external flow*/}
                    <button type="submit" className="govuk-button">
                        Create multi-operator product
                    </button>
                    {/*TODO: add link to exporter*/}
                    <button type="submit" className="govuk-button govuk-button--secondary">
                        Export multi-operator product
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
                                    Fares awaiting your input
                                </a>
                            </li>
                        </ul>
                        <div className="govuk-tabs__panel" id="fares-you-own">
                            <table className="govuk-table">
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
                                                          className="govuk-link govuk-body button-link"
                                                          // onClick={() =>
                                                          //     deleteActionHandler(
                                                          //         product.id,
                                                          //         product.productDescription,
                                                          //     )
                                                          // }
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
                                    <i>You currently do not own any multi-operator (external) products</i>
                                </span>
                            ) : null}
                        </div>
                        <div className="govuk-tabs__panel" id="fares-awaiting-your-input">
                            <p>I am a fare awaiting input</p>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = (
    ctx: NextPageContextWithSession,
): {
    props: MultiOperatorProductsProps;
} => {
    const noc = getAndValidateNoc(ctx);
    const multiOperatorProductsFromDb: MyFaresOtherProduct[] = await getMultiOperatorExternalProducts();

    const multiOperatorProducts: MyFaresOtherFaresProduct[] = [
        {
            id: 1,
            productDescription: 'Weekly Pass',
            type: 'multiOperator',
            duration: '7 days',
            passengerType: 'Adult',
            startDate: convertDateFormat('2023-02-01'),
            endDate: convertDateFormat('2026-02-01'),
        },
        {
            id: 2,
            productDescription: 'Monthly Pass',
            type: 'multiOperator',
            duration: '30 days',
            passengerType: 'Student',
            startDate: convertDateFormat('2023-02-01'),
            endDate: convertDateFormat('2024-02-01'),
        },
        {
            id: 3,
            productDescription: 'Annual Pass',
            type: 'multiOperator',
            duration: '365 days',
            passengerType: 'Senior',
            startDate: convertDateFormat('2023-02-01'),
            endDate: convertDateFormat('2026-02-01'),
        },
    ];
    return { props: { multiOperatorProducts, csrfToken: getCsrfToken(ctx) } };
};

export default MultiOperatorProducts;
