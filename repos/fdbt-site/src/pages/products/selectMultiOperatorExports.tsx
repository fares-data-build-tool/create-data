import React, { ReactElement, useState } from 'react';
import BackButton from '../../components/BackButton';
import CsrfForm from '../../components/CsrfForm';
import { getMultiOperatorExternalProductsByNoc } from '../../data/auroradb';
import { getProductsMatchingJson } from '../../data/s3';
import { ErrorInfo, NextPageContextWithSession } from '../../interfaces';
import { BaseLayout } from '../../layout/Layout';
import { convertDateFormat, getAndValidateNoc, getCsrfToken } from '../../utils';
import { getActiveOrPendingProducts } from '../../utils/apiUtils/export';
import { getAllExports } from '../api/getExportProgress';
import { GetServerSidePropsResult } from 'next';
import { MultiOperatorProductExternal } from './multiOperatorProductsExternal';
import ErrorSummary from '../../components/ErrorSummary';

const title = 'Select Multi-Operator Exports';
const description = 'Export selected multi-operator products into NeTEx.';

interface SelectMultiOperatorExportsProps {
    csrf: string;
    productsToDisplay: Omit<MultiOperatorProductExternal, 'passengerType'>[];
}

const SelectMultiOperatorExports = ({ productsToDisplay, csrf }: SelectMultiOperatorExportsProps): ReactElement => {
    const [productsSelected, setProductsSelected] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<ErrorInfo[]>([]);
    const handleSubmit = () => {
        setIsSubmitting(true);
    };

    const updateSelectedProducts = (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
        if (!e.target.checked) {
            setProductsSelected(productsSelected.filter((product) => product !== productId));
        } else {
            setProductsSelected([...productsSelected, productId]);
        }
    };

    return (
        <BaseLayout title={title} description={description}>
            <ErrorSummary errors={errors} />
            <BackButton href="/products/multiOperatorProductsExternal" />
            <CsrfForm onSubmit={handleSubmit} csrfToken={csrf} method={'post'} action={'/api/selectExports'}>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">
                        <h1 className="govuk-heading-xl">Export your selected multi-operator products</h1>
                        <p className="govuk-body-m govuk-!-margin-bottom-5">
                            This page will export all of the products you select. Incomplete products, expired products,
                            or products for expired services will not be included in the list below.
                        </p>
                    </div>
                    <div className="govuk-grid-column-one-third">
                        <button
                            type="submit"
                            id="export-selected-products"
                            className={`govuk-button`}
                            disabled={isSubmitting}
                            onClick={(e) => {
                                if (productsToDisplay.length === 0) {
                                    e.preventDefault();
                                    setErrors([
                                        {
                                            id: 'export-selected-products',
                                            errorMessage: 'You have no multi-operator products to export.',
                                        },
                                    ]);
                                    return;
                                }

                                if (productsSelected.length === 0) {
                                    e.preventDefault();
                                    setErrors([
                                        {
                                            id: 'export-selected-products',
                                            errorMessage: 'Select at least one product to export.',
                                        },
                                    ]);
                                    return;
                                }
                            }}
                        >
                            Export selected products
                        </button>
                        <button
                            id="select-all"
                            className={`govuk-button govuk-button--secondary${
                                productsToDisplay.length === 0 ? ' govuk-visually-hidden' : ''
                            }`}
                            data-module="govuk-button"
                            onClick={(e) => {
                                e.preventDefault();
                                const productsAreAllSelected = productsSelected.length === productsToDisplay.length;

                                if (productsAreAllSelected) {
                                    setProductsSelected([]);
                                } else {
                                    setProductsSelected(productsToDisplay.map((product) => product.id));
                                }
                            }}
                        >
                            {productsSelected.length === productsToDisplay.length ? 'Unselect all' : 'Select all'}
                        </button>
                    </div>
                </div>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <strong id="products-selected" className="govuk-tag govuk-tag--blue govuk-!-margin-bottom-4">
                            {productsSelected.length} / {productsToDisplay.length} selected
                        </strong>
                        <div className="govuk-summary-card govuk-!-padding-4">
                            {productsToDisplay.length === 0 ? (
                                <p className="govuk-body-m govuk-!-margin-top-5">
                                    <em>You currently have no products that can be exported.</em>
                                </p>
                            ) : (
                                <div className="govuk-checkboxes">
                                    {productsToDisplay.map((product, index) => {
                                        const checkboxTitles = `${product.productDescription} | ${product.startDate}`;
                                        return (
                                            <div className="govuk-checkboxes__item" key={`checkbox-item-${product.id}`}>
                                                <input
                                                    className="govuk-checkboxes__input"
                                                    id={`checkbox-${index}`}
                                                    name="productsToExport"
                                                    type="checkbox"
                                                    value={product.id}
                                                    defaultChecked={
                                                        !!productsSelected.find(
                                                            (productSelected) => productSelected === product.id,
                                                        )
                                                    }
                                                    onChange={(e) => updateSelectedProducts(e, product.id)}
                                                />
                                                <label
                                                    className="govuk-label govuk-checkboxes__label"
                                                    htmlFor={`checkbox-${index}`}
                                                >
                                                    {checkboxTitles}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <input type="hidden" name="isMultiOperatorExternal" value="true" />
            </CsrfForm>
        </BaseLayout>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<GetServerSidePropsResult<SelectMultiOperatorExportsProps>> => {
    const noc = getAndValidateNoc(ctx);
    const exports = await getAllExports(noc);

    const isExportInProgress =
        !!exports && exports.some((exportDetails) => !exportDetails.signedUrl && !exportDetails.exportFailed);

    if (isExportInProgress) {
        return {
            redirect: {
                destination: '/products/multiOperatorProductsExternal',
                permanent: false,
            },
        };
    }

    const products = await getMultiOperatorExternalProductsByNoc(noc);
    const activeOrPendingProducts = getActiveOrPendingProducts(products);

    const productsToDisplay: Omit<MultiOperatorProductExternal, 'passengerType'>[] = [];

    for (const product of activeOrPendingProducts) {
        const matchingJson = await getProductsMatchingJson(product.matchingJsonLink);

        const startDate = matchingJson.ticketPeriod.startDate
            ? convertDateFormat(matchingJson.ticketPeriod.startDate)
            : '-';
        const endDate = matchingJson.ticketPeriod.endDate ? convertDateFormat(matchingJson.ticketPeriod.endDate) : '-';

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
            };

            productsToDisplay.push(productData);
        }
    }

    return {
        props: {
            csrf: getCsrfToken(ctx),
            productsToDisplay,
        },
    };
};

export default SelectMultiOperatorExports;
