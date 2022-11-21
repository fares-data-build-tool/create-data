import startCase from 'lodash/startCase';
import moment from 'moment';
import React, { ReactElement, useState } from 'react';
import BackButton from '../../components/BackButton';
import CsrfForm from '../../components/CsrfForm';
import {
    getAllProductsByNoc,
    getBodsServicesByNocAndLineId,
    getPassengerTypeNameByIdAndNoc,
} from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import { NextPageContextWithSession, ProductToExport, ServiceToDisplay } from '../../interfaces';
import { BaseLayout } from '../../layout/Layout';
import { getAndValidateNoc, getCsrfToken } from '../../utils';
import { getNonExpiredProducts, filterOutProductsWithNoActiveServices } from '../api/exports';

const title = 'Select Exports';
const description = 'Export selected products into NeTEx.';

interface SelectExportsProps {
    csrf: string;
    productsToDisplay: ProductToExport[];
    servicesToDisplay: ServiceToDisplay[];
}

interface FormattedOtherProducts {
    periodProducts: ProductToExport[];
    flatFareProducts: ProductToExport[];
    multiOperatorProducts: ProductToExport[];
    schoolServiceProducts: ProductToExport[];
}

export const formatOtherProducts = (otherProducts: ProductToExport[]): FormattedOtherProducts => {
    const formatted: FormattedOtherProducts = {
        periodProducts: [],
        flatFareProducts: [],
        multiOperatorProducts: [],
        schoolServiceProducts: [],
    };

    otherProducts.forEach((product) => {
        switch (product.fareType) {
            case 'period':
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                product.schoolTicket
                    ? formatted.schoolServiceProducts.push(product)
                    : formatted.periodProducts.push(product);
                break;
            case 'flatFare':
                formatted.flatFareProducts.push(product);
                break;
            case 'multiOperator':
                formatted.multiOperatorProducts.push(product);
                break;
            default:
                break;
        }
    });

    return formatted;
};

const buildOtherProductSection = (
    indexCounter: number,
    productsSelected: number[],
    setProductsSelected: React.Dispatch<React.SetStateAction<number[]>>,
    otherProducts: ProductToExport[],
) => {
    return (
        <>
            {otherProducts.map((product) => {
                indexCounter += 1;
                const productsIndex = indexCounter;

                return (
                    <div
                        className="govuk-checkboxes__item govuk-checkboxes--small govuk-!-margin-top-2 govuk-!-margin-left-4"
                        key={`checkbox-product-${productsIndex}`}
                    >
                        <input
                            className="govuk-checkboxes__input"
                            id={`checkbox-${productsIndex}`}
                            name="productsToExport"
                            type="checkbox"
                            value={product.id}
                            checked={!!productsSelected.find((productSelected) => productSelected === productsIndex)}
                            onClick={() => {
                                if (productsSelected.find((productSelected) => productSelected === productsIndex)) {
                                    const newSelected = [...productsSelected].filter(
                                        (valueSelected) => valueSelected !== productsIndex,
                                    );
                                    setProductsSelected(newSelected);
                                } else {
                                    setProductsSelected([...productsSelected, productsIndex]);
                                }
                            }}
                            // This onChange is here because of how we're using the 'checked' prop
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            onChange={() => {}}
                        />
                        <label
                            id={`product-${productsIndex}`}
                            className="govuk-label govuk-checkboxes__label"
                            // eslint-disable-next-line jsx-a11y/aria-role
                            role="input"
                            htmlFor={`checkbox-${productsIndex}`}
                        >
                            {`${product.productName}${
                                product.direction ? ` | ${startCase(product.direction)}` : ''
                            } | ${product.startDate}`}
                        </label>
                    </div>
                );
            })}
        </>
    );
};

const SelectExports = ({ productsToDisplay, servicesToDisplay, csrf }: SelectExportsProps): ReactElement => {
    const [detailsAllOpen, setAllDetails] = useState(false);
    const [productsSelected, setProductsSelected] = useState<number[]>([]);
    let indexCounter = 0;

    const otherProducts = productsToDisplay.filter((product) => !product.serviceLineId);
    const formattedProducts = formatOtherProducts(otherProducts);

    return (
        <>
            <BaseLayout title={title} description={description}>
                <BackButton href="/products/exports" />
                <CsrfForm csrfToken={csrf} method={'post'} action={'/api/selectExports'}>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            <div className="dft-flex dft-flex-justify-space-between">
                                <h1 className="govuk-heading-xl">Export your selected products</h1>{' '}
                                <div className="align-middle">
                                    <button
                                        type="submit"
                                        className={`govuk-button${
                                            productsToDisplay.length === 0 ? ' govuk-visually-hidden' : ''
                                        }`}
                                    >
                                        Export selected products
                                    </button>
                                </div>
                            </div>

                            <div className="govuk-grid-row">
                                <div className="dft-flex dft-flex-justify-space-between">
                                    <div className="govuk-grid-column-two-thirds">
                                        <p className="govuk-body-m govuk-!-margin-bottom-5">
                                            This page will export all of the products you select. Expired products, or
                                            products for expired services, will not be included in the list below.
                                        </p>
                                    </div>
                                    <button
                                        id="select-all"
                                        className={`govuk-button govuk-button--secondary${
                                            productsToDisplay.length === 0 ? ' govuk-visually-hidden' : ''
                                        }`}
                                        data-module="govuk-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const productsAreAllSelected =
                                                productsSelected.length === productsToDisplay.length;

                                            if (productsAreAllSelected) {
                                                setProductsSelected([]);
                                            } else {
                                                setProductsSelected([]);
                                                const arrayOfIndexs = [];
                                                for (let i = 1; i <= productsToDisplay.length; i++) {
                                                    arrayOfIndexs.push(i);
                                                }
                                                setProductsSelected(arrayOfIndexs);
                                            }
                                        }}
                                    >
                                        {productsSelected.length === productsToDisplay.length
                                            ? 'Unselect all'
                                            : 'Select all'}
                                    </button>
                                </div>
                            </div>

                            {productsToDisplay.length === 0 ? (
                                <p className="govuk-body-m govuk-!-margin-top-5">
                                    <em>You currently have no products that can be exported.</em>
                                </p>
                            ) : (
                                <div>
                                    <strong
                                        id="products-selected"
                                        className="govuk-tag govuk-tag--blue govuk-!-margin-bottom-4"
                                    >
                                        {productsSelected.length} / {productsToDisplay.length} selected
                                    </strong>

                                    <div className="govuk-tabs" data-module="govuk-tabs">
                                        <h2 className="govuk-tabs__title">Products</h2>
                                        <ul className="govuk-tabs__list">
                                            <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
                                                <a className="govuk-tabs__tab" href="#services">
                                                    Services
                                                </a>
                                            </li>
                                            <li className="govuk-tabs__list-item">
                                                <a className="govuk-tabs__tab" href="#period-products">
                                                    Period products
                                                </a>
                                            </li>
                                            <li className="govuk-tabs__list-item">
                                                <a className="govuk-tabs__tab" href="#flat-fare-products">
                                                    Flat fare products
                                                </a>
                                            </li>
                                            <li className="govuk-tabs__list-item">
                                                <a className="govuk-tabs__tab" href="#multi-operator-products">
                                                    Multi operator products
                                                </a>
                                            </li>
                                            <li className="govuk-tabs__list-item">
                                                <a className="govuk-tabs__tab" href="#school-service-products">
                                                    Academic products
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="govuk-tabs__panel" id="services">
                                            <h2 className="govuk-heading-m govuk-!-margin-bottom-6">Services</h2>
                                            {servicesToDisplay.length > 0 ? (
                                                <>
                                                    <button
                                                        id="open-all-services"
                                                        className="govuk-button govuk-button--secondary"
                                                        data-module="govuk-button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setAllDetails(detailsAllOpen ? false : true);
                                                        }}
                                                    >
                                                        {detailsAllOpen ? 'Close all' : 'Open all'}
                                                    </button>

                                                    {servicesToDisplay.map((service) => {
                                                        const productsForService = productsToDisplay.filter(
                                                            (product) => product.serviceLineId === service.lineId,
                                                        );
                                                        return (
                                                            <details
                                                                className="govuk-details margin-bottom-export"
                                                                data-module="govuk-details"
                                                                open={detailsAllOpen}
                                                                key={service.lineId}
                                                            >
                                                                <summary className="govuk-details__summary">
                                                                    <span className="govuk-details__summary-text">
                                                                        {service.lineName} - {service.origin} to{' '}
                                                                        {service.destination}
                                                                    </span>
                                                                </summary>
                                                                {productsForService.map((product) => {
                                                                    indexCounter += 1;
                                                                    const productsIndex = indexCounter;

                                                                    return (
                                                                        <div
                                                                            className="govuk-checkboxes__item govuk-checkboxes--small govuk-!-margin-top-2 govuk-!-margin-left-4"
                                                                            key={`checkbox-product-${productsIndex}`}
                                                                        >
                                                                            <input
                                                                                className="govuk-checkboxes__input"
                                                                                id={`checkbox-${productsIndex}`}
                                                                                name="productsToExport"
                                                                                type="checkbox"
                                                                                value={product.id}
                                                                                checked={
                                                                                    !!productsSelected.find(
                                                                                        (productSelected) =>
                                                                                            productSelected ===
                                                                                            productsIndex,
                                                                                    )
                                                                                }
                                                                                onClick={() => {
                                                                                    if (
                                                                                        productsSelected.find(
                                                                                            (productSelected) =>
                                                                                                productSelected ===
                                                                                                productsIndex,
                                                                                        )
                                                                                    ) {
                                                                                        const newSelected = [
                                                                                            ...productsSelected,
                                                                                        ].filter(
                                                                                            (valueSelected) =>
                                                                                                valueSelected !==
                                                                                                productsIndex,
                                                                                        );
                                                                                        setProductsSelected(
                                                                                            newSelected,
                                                                                        );
                                                                                    } else {
                                                                                        setProductsSelected([
                                                                                            ...productsSelected,
                                                                                            productsIndex,
                                                                                        ]);
                                                                                    }
                                                                                }}
                                                                                // This onChange is here because of how we're using the 'checked' prop
                                                                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                                                onChange={() => {}}
                                                                            />
                                                                            <label
                                                                                id={`product-${productsIndex}`}
                                                                                className="govuk-label govuk-checkboxes__label"
                                                                                // eslint-disable-next-line jsx-a11y/aria-role
                                                                                role="input"
                                                                                htmlFor={`checkbox-${productsIndex}`}
                                                                            >
                                                                                {`${product.productName}${
                                                                                    product.direction
                                                                                        ? ` | ${startCase(
                                                                                              product.direction,
                                                                                          )}`
                                                                                        : ''
                                                                                } | ${product.startDate}`}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </details>
                                                        );
                                                    })}
                                                </>
                                            ) : (
                                                <p className="govuk-body-m govuk-!-margin-top-5">
                                                    <em>
                                                        You currently have no single or return products that can be
                                                        exported.
                                                    </em>
                                                </p>
                                            )}
                                        </div>
                                        <div
                                            className="govuk-tabs__panel govuk-tabs__panel--hidden"
                                            id="period-products"
                                        >
                                            {otherProducts.length > 0 ? (
                                                <div>
                                                    <h2 className="govuk-heading-m govuk-!-margin-bottom-6">
                                                        Period products
                                                    </h2>
                                                    {formattedProducts.periodProducts.length > 0 ? (
                                                        buildOtherProductSection(
                                                            indexCounter,
                                                            productsSelected,
                                                            setProductsSelected,
                                                            formattedProducts.periodProducts,
                                                        )
                                                    ) : (
                                                        <p className="govuk-body-m govuk-!-margin-top-5">
                                                            <em>
                                                                You currently have no period products that can be
                                                                exported.
                                                            </em>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div
                                            className="govuk-tabs__panel govuk-tabs__panel--hidden"
                                            id="flat-fare-products"
                                        >
                                            {otherProducts.length > 0 ? (
                                                <div>
                                                    <h2 className="govuk-heading-m govuk-!-margin-bottom-6">
                                                        Flat fare products
                                                    </h2>

                                                    {formattedProducts.flatFareProducts.length > 0 ? (
                                                        buildOtherProductSection(
                                                            indexCounter + formattedProducts.periodProducts.length,
                                                            productsSelected,
                                                            setProductsSelected,
                                                            formattedProducts.flatFareProducts,
                                                        )
                                                    ) : (
                                                        <p className="govuk-body-m govuk-!-margin-top-5">
                                                            <em>
                                                                You currently have no flat fare products that can be
                                                                exported.
                                                            </em>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div
                                            className="govuk-tabs__panel govuk-tabs__panel--hidden"
                                            id="multi-operator-products"
                                        >
                                            {otherProducts.length > 0 ? (
                                                <div>
                                                    <h2 className="govuk-heading-m govuk-!-margin-bottom-6">
                                                        Multioperator products
                                                    </h2>

                                                    {formattedProducts.multiOperatorProducts.length > 0 ? (
                                                        buildOtherProductSection(
                                                            indexCounter +
                                                                formattedProducts.flatFareProducts.length +
                                                                formattedProducts.periodProducts.length,
                                                            productsSelected,
                                                            setProductsSelected,
                                                            formattedProducts.multiOperatorProducts,
                                                        )
                                                    ) : (
                                                        <p className="govuk-body-m govuk-!-margin-top-5">
                                                            <em>
                                                                You currently have no multioperator products that can be
                                                                exported.
                                                            </em>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div
                                            className="govuk-tabs__panel govuk-tabs__panel--hidden"
                                            id="school-service-products"
                                        >
                                            {otherProducts.length > 0 ? (
                                                <div>
                                                    <h2 className="govuk-heading-m govuk-!-margin-bottom-6">
                                                        Academic term/year products
                                                    </h2>
                                                    {formattedProducts.schoolServiceProducts.length > 0 ? (
                                                        buildOtherProductSection(
                                                            indexCounter +
                                                                formattedProducts.multiOperatorProducts.length +
                                                                formattedProducts.flatFareProducts.length +
                                                                formattedProducts.periodProducts.length,
                                                            productsSelected,
                                                            setProductsSelected,
                                                            formattedProducts.schoolServiceProducts,
                                                        )
                                                    ) : (
                                                        <p className="govuk-body-m govuk-!-margin-top-5">
                                                            <em>
                                                                You currently have no academic term/year products that
                                                                can be exported.
                                                            </em>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CsrfForm>
            </BaseLayout>
        </>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: SelectExportsProps }> => {
    const noc = getAndValidateNoc(ctx);
    const products = await getAllProductsByNoc(noc);
    const nonExpiredProducts = getNonExpiredProducts(products);
    const nonExpiredProductsWithActiveServices = await filterOutProductsWithNoActiveServices(noc, nonExpiredProducts);

    const productsToDisplay: ProductToExport[] = await Promise.all(
        nonExpiredProductsWithActiveServices.map(async (nonExpiredProduct) => {
            const s3Data = await getProductsMatchingJson(nonExpiredProduct.matchingJsonLink);
            const product = s3Data.products[0];
            const carnet = 'carnetDetails' in product;

            return {
                id: nonExpiredProduct.id,
                productName:
                    'productName' in product
                        ? product.productName
                        : `${await getPassengerTypeNameByIdAndNoc(s3Data.passengerType.id, noc)} - ${startCase(
                              s3Data.type,
                          )}`,
                startDate: nonExpiredProduct.startDate,
                endDate: nonExpiredProduct.endDate || '',
                serviceLineId: 'lineId' in s3Data ? s3Data.lineId : null,
                direction: 'journeyDirection' in s3Data ? s3Data.journeyDirection : null,
                carnet,
                fareType: s3Data.type === 'schoolService' ? 'period' : s3Data.type,
                schoolTicket: 'termTime' in s3Data && !!s3Data.termTime,
            };
        }),
    );

    const servicesLineIds = productsToDisplay
        .map((product) => {
            return product.serviceLineId || '';
        })
        .filter((lineId) => lineId);

    const uniqueServiceLineIds = Array.from(new Set(servicesLineIds));

    const allServicesWithMatchingLineIds = (
        await Promise.all(
            uniqueServiceLineIds.map(async (lineId) => {
                return await getBodsServicesByNocAndLineId(noc, lineId);
            }),
        )
    ).flat();

    const servicesToDisplay: (ServiceToDisplay | undefined)[] = (
        await Promise.all(
            allServicesWithMatchingLineIds.map(async (service) => {
                const productsWithSameLineId = productsToDisplay.filter(
                    (product) => !!product.serviceLineId && product.serviceLineId === service.lineId,
                );

                const matchingProducts = productsWithSameLineId.filter((product) => {
                    const momentProductStartDate = moment(product.startDate, 'DD/MM/YYYY').valueOf();
                    const momentProductEndDate = product.endDate && moment(product.endDate, 'DD/MM/YYYY').valueOf();
                    const momentServiceStartDate = moment(service.startDate, 'DD/MM/YYYY').valueOf();
                    const momentServiceEndDate = service.endDate
                        ? moment(service.endDate, 'DD/MM/YYYY').valueOf()
                        : undefined;

                    const productMatchesService =
                        (!momentProductEndDate || momentProductEndDate >= momentServiceStartDate) &&
                        (!momentServiceEndDate || momentServiceEndDate >= momentProductStartDate);

                    return productMatchesService;
                });

                if (matchingProducts.length > 0) {
                    return {
                        lineId: service.lineId,
                        origin: service.origin,
                        destination: service.destination,
                        lineName: service.lineName,
                    };
                } else {
                    return undefined;
                }
            }),
        )
    );

    const filteredServices = servicesToDisplay.filter(service => !!service) as ServiceToDisplay[];

    return {
        props: {
            csrf: getCsrfToken(ctx),
            productsToDisplay,
            servicesToDisplay: filteredServices,
        },
    };
};

export default SelectExports;
