import React, { ReactElement, useState } from 'react';
import { MyFaresPointToPointProduct, MyFaresService, NextPageContextWithSession } from '../../interfaces/index';
import { MyFaresProduct } from '../../../shared/dbTypes';
import { BaseLayout } from '../../layout/Layout';
import {
    getBodsServiceByNocAndId,
    getPassengerTypeNameByIdAndNoc,
    getPointToPointProductsByLineId,
    getTimeRestrictionByIdAndNoc,
} from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import { convertDateFormat, getAndValidateNoc, getCsrfToken } from '../../utils';
import moment from 'moment';
import { isArray } from 'lodash';
import { getTag } from './services';
import BackButton from '../../components/BackButton';
import DeleteConfirmationPopup from '../../components/DeleteConfirmationPopup';
import { buildDeleteUrl } from './otherProducts';
import ErrorSummary from '../../components/ErrorSummary';

const title = 'Point To Point Products - Create Fares Data Service';
const description = 'View and access your point to point products in one place.';

interface PointToPointProductsProps {
    service: MyFaresService;
    products: MyFaresPointToPointProduct[];
    productNeedsAttention: boolean;
    csrfToken: string;
}

const findIdForError = (products: MyFaresPointToPointProduct[]): string => {
    const firstProductNeedingAttention = products.find((product) => product.requiresAttention);
    return `product-${firstProductNeedingAttention?.id}`;
};

const PointToPointProducts = ({
    products,
    service,
    productNeedsAttention,
    csrfToken,
}: PointToPointProductsProps): ReactElement => {
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
            <BaseLayout title={title} description={description}>
                <BackButton href="/products/services" />
                {productNeedsAttention ? (
                    <ErrorSummary
                        errors={[
                            {
                                errorMessage:
                                    'Your service has been updated in BODS. Stops have been added and/or removed since the creation of your product(s). These products will need updating to reflect these changes.',
                                id: findIdForError(products),
                            },
                        ]}
                    />
                ) : null}
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <h1 className="govuk-heading-l govuk-!-margin-bottom-4" id="service-name">
                            {service.lineName} - {service.origin} to {service.destination}
                        </h1>
                        <h1 className="govuk-heading-s govuk-!-margin-bottom-8" id="service-status">
                            Service status: {getTag(service.startDate, service.endDate, false)}
                        </h1>
                        <h1 className="govuk-heading-l govuk-!-margin-bottom-4">Products</h1>
                        {PointToPointProductsTable(products, service, deleteActionHandler)}

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

const PointToPointProductsTable = (
    products: MyFaresPointToPointProduct[],
    service: MyFaresService,
    deleteActionHandler: (productId: number, name: string) => void,
): ReactElement => {
    return (
        <>
            <table className="govuk-table">
                <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                        <th scope="col" className="govuk-table__header">
                            Product description
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Time restriction
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
                    {products.length > 0
                        ? products.map((product, index) => (
                              <tr key={index} className="govuk-table__row">
                                  <td className="govuk-table__cell dft-table-wrap-anywhere dft-table-fixed-width-cell">
                                      <a
                                          href={`/products/productDetails?productId=${product.id}&serviceId=${service.id}`}
                                          id={`product-${product.id}`}
                                      >
                                          {product.productDescription}
                                      </a>
                                  </td>
                                  <td className="govuk-table__cell dft-table-wrap-anywhere dft-table-fixed-width-cell">
                                      {product.validity}
                                  </td>
                                  <td className="govuk-table__cell">{product.startDate}</td>
                                  <td className="govuk-table__cell">{product.endDate ?? '-'}</td>
                                  <td className="govuk-table__cell">
                                      {getTag(product.startDate, product.endDate, true)}
                                      {product.requiresAttention ? (
                                          <strong className="govuk-tag govuk-tag--yellow dft-table-tag">
                                              NEEDS ATTENTION
                                          </strong>
                                      ) : null}
                                  </td>
                                  <td className="govuk-table__cell">
                                      <button
                                          className="govuk-link govuk-body delete-link"
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
            {products.length === 0 ? (
                <span className="govuk-body">
                    <i>You currently have no products against this service</i>
                </span>
            ) : null}
        </>
    );
};

export const filterProductsNotToDisplay = (service: MyFaresService, products: MyFaresProduct[]): MyFaresProduct[] => {
    const serviceStartDate = moment.utc(service.startDate, 'DD/MM/YYYY').valueOf();
    const serviceEndDate = service.endDate ? moment.utc(service.endDate, 'DD/MM/YYYY').valueOf() : undefined;
    return products.filter((product) => {
        const productStartDate = moment.utc(product.startDate, 'DD/MM/YYYY').valueOf();
        const productEndDate = product.endDate && moment.utc(product.endDate, 'DD/MM/YYYY').valueOf();
        return (
            (!productEndDate || productEndDate >= serviceStartDate) &&
            (!serviceEndDate || productStartDate <= serviceEndDate)
        );
    });
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: PointToPointProductsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const serviceId = ctx.query?.serviceId;

    if (!serviceId || isArray(serviceId)) {
        throw new Error('Unable to find line name to show products for.');
    }

    const service = await getBodsServiceByNocAndId(noc, serviceId);
    const products = await getPointToPointProductsByLineId(noc, service.lineId);
    const productsToDisplay = filterProductsNotToDisplay(service, products);

    const formattedProducts = await Promise.all(
        productsToDisplay.map(async (product) => {
            const matchingJson = await getProductsMatchingJson(product.matchingJsonLink);

            const passengerTypeName = await getPassengerTypeNameByIdAndNoc(matchingJson.passengerType.id, noc);

            const productDescription =
                'products' in matchingJson && 'productName' in matchingJson.products[0]
                    ? matchingJson.products[0].productName
                    : `${passengerTypeName} - ${matchingJson.type} ${
                          'termTime' in matchingJson && matchingJson.termTime ? '(school)' : ''
                      }`;

            let timeRestriction = 'No restrictions';

            if (matchingJson.timeRestriction) {
                const timeRestrictionFromDb = await getTimeRestrictionByIdAndNoc(matchingJson.timeRestriction.id, noc);

                timeRestriction = timeRestrictionFromDb.name;
            }

            const startDate = convertDateFormat(matchingJson.ticketPeriod.startDate);
            const endDate = matchingJson.ticketPeriod.endDate && convertDateFormat(matchingJson.ticketPeriod.endDate);

            return {
                productDescription,
                startDate,
                validity: timeRestriction,
                id: product.id,
                ...(endDate && { endDate }),
                requiresAttention: product.servicesRequiringAttention?.includes(serviceId) ?? false,
            };
        }),
    );

    const productNeedsAttention = formattedProducts.some((product) => product.requiresAttention);

    return {
        props: {
            products: formattedProducts,
            service: { ...service, endDate: service.endDate || '' },
            productNeedsAttention,
            csrfToken: getCsrfToken(ctx),
        },
    };
};

export default PointToPointProducts;
