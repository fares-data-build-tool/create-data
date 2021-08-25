import React, { ReactElement } from 'react';
import { FromDb } from 'shared/matchingJsonTypes';
import FormElementWrapper from 'src/components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import {
    FARE_TYPE_ATTRIBUTE,
    MULTIPLE_PRODUCT_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    SCHOOL_FARE_TYPE_ATTRIBUTE,
} from '../constants/attributes';
import { getSalesOfferPackagesByNocCode } from '../data/auroradb';
import {
    ErrorInfo,
    NextPageContextWithSession,
    ProductInfo,
    ProductWithSalesOfferPackages,
    SalesOfferPackage,
    SchoolFareTypeAttribute,
} from '../interfaces';
import { isFareType } from '../interfaces/typeGuards';
import { FullColumnLayout } from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken, sentenceCaseString } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { removeAllWhiteSpace } from './api/apiUtils/validator';
import { PurchaseMethodCardBody } from './viewPurchaseMethods';

const pageTitle = 'Select Purchase Methods - Create Fares Data Service';
const pageDescription = 'Select Purchase Methods page of the Create Fares Data Service';

export interface SelectSalesOfferPackageProps {
    pairings: ProductWithSalesOfferPackages[];
    products: ProductInfo[];
    salesOfferPackagesList: FromDb<SalesOfferPackage>[];
    errors: ErrorInfo[];
    csrfToken: string;
}

export const formatSOPArray = (stringArray: string[]): string =>
    stringArray.map((string) => sentenceCaseString(string)).join(', ');

const SelectPurchaseMethods = ({
    pairings,
    products,
    salesOfferPackagesList,
    csrfToken,
    errors,
}: SelectSalesOfferPackageProps): ReactElement => {
    return (
        <FullColumnLayout title={pageTitle} description={pageDescription}>
            <CsrfForm action="/api/selectPurchaseMethods" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="select-sales-offer-package-page-heading">
                        How are your tickets sold?
                    </h1>

                    <div className="govuk-warning-text">
                        <span className="govuk-warning-text__icon govuk-!-margin-top-1" aria-hidden="true">
                            !
                        </span>
                        <strong className="govuk-warning-text__text">
                            <span className="govuk-warning-text__assistive">Warning</span>
                            You can create new purchase methods in your{' '}
                            <a className="govuk-link" href="/viewPurchaseMethods">
                                operator settings.
                            </a>{' '}
                            <br />
                            Don&apos;t worry you can navigate back to this page when you are finished.
                        </strong>
                    </div>

                    {products.map((product) => (
                        <>
                            <h1 className="govuk-heading-m" id="select-sales-offer-package-page-heading">
                                How is '{product.productName}' sold?
                            </h1>
                            <div className="govuk-grid-row">
                                {salesOfferPackagesList.map((salesOfferPackage, index) => (
                                    <div
                                        key={salesOfferPackage.id}
                                        className="govuk-grid-column-one-third govuk-!-margin-bottom-5"
                                    >
                                        <div className="card">
                                            <div className="govuk-checkboxes">
                                                <div className="govuk-checkboxes__item card__checkbox">
                                                    <input
                                                        className="govuk-checkboxes__input"
                                                        id={`${product.productName}-${salesOfferPackage.name}-radio`}
                                                        name={`purchaseMethod-${product.productName}`}
                                                        type="checkbox"
                                                        value={salesOfferPackage.id}
                                                        aria-label={salesOfferPackage.name}
                                                    />
                                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                                    <label
                                                        className="govuk-label govuk-checkboxes__label"
                                                        htmlFor={`passenger-type-${index}`}
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    'card__body ' + salesOfferPackage.description.replace(/ /g, '-')
                                                }
                                            >
                                                <PurchaseMethodCardBody entity={salesOfferPackage} />
                                            </div>
                                            <div className="govuk-currency-input govuk-!-margin-left-3 govuk-!-margin-top-3">
                                                <div className="govuk-currency-input__inner">
                                                    <span className="govuk-currency-input__inner__unit">£</span>
                                                    <FormElementWrapper
                                                        errors={[]}
                                                        errorId={`multiple-product-price-${index}`}
                                                        errorClass="govuk-input--error"
                                                        hideText
                                                        addFormGroupError={false}
                                                    >
                                                        <input
                                                            className="govuk-input govuk-input--width-4 govuk-currency-input__inner__input"
                                                            name={`price-${product.productName}-${salesOfferPackage.name}`}
                                                            data-non-numeric
                                                            type="text"
                                                            id={`price-${product.productName}-${removeAllWhiteSpace(
                                                                salesOfferPackage.name,
                                                            )}`}
                                                            defaultValue={
                                                                salesOfferPackage?.price || product.productPrice
                                                            }
                                                        />
                                                    </FormElementWrapper>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ))}

                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                    <a
                        href="/viewPurchaseMethods"
                        role="button"
                        draggable="false"
                        className="govuk-button govuk-button--secondary create-new-sop-button"
                        data-module="govuk-button"
                        id="create-new-button"
                    >
                        Create new
                    </a>
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: SelectSalesOfferPackageProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nocCode = getAndValidateNoc(ctx);

    if (!nocCode) {
        throw new Error('Necessary nocCode from ID Token cookie not found to show selectSalesOfferPackageProps page');
    }

    const salesOfferPackagesList: FromDb<SalesOfferPackage>[] = nocCode
        ? await getSalesOfferPackagesByNocCode(nocCode)
        : [];

    const multipleProductAttribute = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);
    const schoolFareTypeAttribute = getSessionAttribute(ctx.req, SCHOOL_FARE_TYPE_ATTRIBUTE) as SchoolFareTypeAttribute;

    if (!isFareType(fareTypeAttribute)) {
        throw new Error(`Invalid fare type: ${fareTypeAttribute}`);
    }

    const fareType =
        fareTypeAttribute.fareType === 'schoolService' && schoolFareTypeAttribute
            ? schoolFareTypeAttribute.schoolFareType
            : fareTypeAttribute.fareType;

    const products =
        ['period', 'multiOperator', 'flatFare'].includes(fareType) && multipleProductAttribute
            ? multipleProductAttribute.products
            : [{ productName: 'product', productPrice: '' }];

    const sopAttribute = getSessionAttribute(ctx.req, SALES_OFFER_PACKAGES_ATTRIBUTE);

    const errors = (sopAttribute && 'errors' in sopAttribute && sopAttribute.errors) || [];

    const pairings: ProductWithSalesOfferPackages[] = [];

    console.log(products);
    return {
        props: {
            pairings,
            products,
            salesOfferPackagesList,
            errors,
            csrfToken,
        },
    };
};

export default SelectPurchaseMethods;
