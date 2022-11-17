import React, { ChangeEventHandler, ReactElement, useState } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import {
    FARE_TYPE_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
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
    SchoolFareTypeAttribute,
} from '../interfaces';
import { isFareType } from '../interfaces/typeGuards';
import { FullColumnLayout } from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken, sentenceCaseString } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { removeAllWhiteSpace } from '../utils/apiUtils/validator';
import { PurchaseMethodCardBody } from './viewPurchaseMethods';
import { SalesOfferPackage, FromDb } from '../interfaces/matchingJsonTypes';

const pageTitle = 'Select Purchase Methods - Create Fares Data Service';
const pageDescription = 'Purchase Methods selection page of the Create Fares Data Service';

export interface PurchaseMethodsProps {
    selected?: { [key: string]: SalesOfferPackage[] };
    products: ProductInfo[];
    purchaseMethodsList: FromDb<SalesOfferPackage>[];
    errors: ErrorInfo[];
    csrfToken: string;
}

export const formatSOPArray = (stringArray: string[]): string =>
    stringArray.map((string) => sentenceCaseString(string)).join(', ');

const generateCheckbox = (
    purchaseMethodsList: FromDb<SalesOfferPackage>[],
    productName: string,
    selectedDefault: { [key: string]: SalesOfferPackage[] } | undefined,
    defaultPrice: string,
    errors: ErrorInfo[],
): ReactElement => {
    const [selected, setSelected] = useState(selectedDefault);

    return (
        <div className="card-row">
            {purchaseMethodsList.map((offer, index) => {
                const { name } = offer;

                const productNameIds = removeAllWhiteSpace(productName);

                const selectedOffer =
                    selected && selected[productName]?.find((selectedEntry) => selectedEntry.name === offer.name);

                const updateSelected: ChangeEventHandler = () => {
                    const newSelected: { [key: string]: SalesOfferPackage[] } = { ...selected } || {};
                    const sops = newSelected[productName] || [];
                    newSelected[productName] = sops.find((sop) => sop.name === offer.name)
                        ? sops.filter((it) => it.name !== offer.name)
                        : [...sops, offer];
                    setSelected(newSelected);
                };

                return (
                    <div className="card" key={`checkbox-item-${name}`}>
                        <div className="card__body card_align">
                            <div className="govuk-checkboxes__item card__selector">
                                <input
                                    className="govuk-checkboxes__input"
                                    id={`product-${productNameIds}-checkbox-${index}`}
                                    name={`product-${productName}`}
                                    type="checkbox"
                                    value={JSON.stringify(offer)}
                                    defaultChecked={!!selectedOffer}
                                    onChange={updateSelected}
                                />
                                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                <label
                                    className="govuk-label govuk-checkboxes__label"
                                    htmlFor={`product-${productNameIds}-checkbox-${index}`}
                                />
                            </div>

                            <PurchaseMethodCardBody entity={offer} />
                            {!!selectedOffer && defaultPrice && (
                                <div className="govuk-currency-input card_align">
                                    <div className="govuk-currency-input__inner">
                                        <span className="govuk-currency-input__inner__unit">£</span>
                                        <FormElementWrapper
                                            errors={errors}
                                            errorId={`price-${productNameIds}-${index}`}
                                            errorClass="govuk-input--error"
                                            hideText
                                            addFormGroupError={false}
                                        >
                                            <input
                                                className="govuk-input govuk-input--width-4 govuk-currency-input__inner__input"
                                                name={`price-${productName}-${offer.id}`}
                                                data-non-numeric
                                                type="text"
                                                id={`price-${removeAllWhiteSpace(productName)}-${index}`}
                                                defaultValue={selectedOffer?.price || defaultPrice}
                                            />
                                        </FormElementWrapper>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const createSalesOffer = (
    purchaseMethodsList: FromDb<SalesOfferPackage>[],
    products: ProductInfo[],
    selected: { [key: string]: SalesOfferPackage[] } | undefined,
    errors: ErrorInfo[],
): ReactElement[] =>
    products.map(({ productName, productPrice }) => (
        <div className="sop-option" key={productName}>
            <FormGroupWrapper
                errorIds={[`product-${removeAllWhiteSpace(productName)}-checkbox-0`]}
                errors={errors}
                hideErrorBar={false}
            >
                <fieldset className="govuk-fieldset">
                    <h1 className="govuk-heading-m govuk-!-font-weight-regular govuk-!-padding-top-6 govuk-!-padding-bottom-2">
                        How is <span className="govuk-!-font-weight-bold">{productName}</span> sold?
                    </h1>
                    <FormElementWrapper
                        errors={errors}
                        errorId={`product-${removeAllWhiteSpace(productName)}-checkbox-0`}
                        errorClass=""
                    >
                        {purchaseMethodsList.length === 0 ? (
                            <>
                                <span className="govuk-body">
                                    <i>You currently have no saved purchase methods</i>
                                </span>
                            </>
                        ) : (
                            <div className="govuk-checkboxes">
                                {generateCheckbox(purchaseMethodsList, productName, selected, productPrice, errors)}
                            </div>
                        )}
                    </FormElementWrapper>
                </fieldset>
            </FormGroupWrapper>
        </div>
    ));

const SelectPurchaseMethods = ({
    selected,
    products,
    purchaseMethodsList,
    csrfToken,
    errors,
}: PurchaseMethodsProps): ReactElement => {
    return (
        <FullColumnLayout title={pageTitle} description={pageDescription}>
            <CsrfForm action="/api/selectSalesOfferPackage" method="post" csrfToken={csrfToken}>
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
                    {createSalesOffer(purchaseMethodsList, products, selected, errors)}
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                    <a
                        href={'/viewPurchaseMethods'}
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

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: PurchaseMethodsProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nocCode = getAndValidateNoc(ctx);

    if (!nocCode) {
        throw new Error('Necessary nocCode from ID Token cookie not found to show selectPurchaseMethods page');
    }

    const purchaseMethodsList: SalesOfferPackage[] = await getSalesOfferPackagesByNocCode(nocCode);
    const ticket = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE);
    const matchingJsonMetaData = getSessionAttribute(ctx.req, MATCHING_JSON_META_DATA_ATTRIBUTE);

    const sopAttribute = getSessionAttribute(ctx.req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const errors = (sopAttribute && 'errors' in sopAttribute && sopAttribute.errors) || [];

    if (ticket && matchingJsonMetaData) {
        const product = ticket.products[0];
        const productInfo: ProductInfo = {
            productName: 'productName' in product ? product.productName : 'product',
            productPrice: product.salesOfferPackages[0].price || '',
        };

        return {
            props: {
                products: [productInfo],
                purchaseMethodsList: purchaseMethodsList as FromDb<SalesOfferPackage>[],
                errors,
                csrfToken,
            },
        };
    }

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

    const selected: { [key: string]: SalesOfferPackage[] } | undefined =
        sopAttribute &&
        ('errors' in sopAttribute
            ? sopAttribute.selected
            : sopAttribute
                  .map(
                      (
                          product: SalesOfferPackage | ProductWithSalesOfferPackages,
                      ): [string, SalesOfferPackage[] | ProductWithSalesOfferPackages[]] =>
                          'salesOfferPackages' in product
                              ? [product.productName, product.salesOfferPackages]
                              : ['product', sopAttribute as ProductWithSalesOfferPackages[]],
                  )
                  .reduce((result, item) => ({ ...result, [item[0]]: item[1] }), {}));

    return {
        props: {
            ...(selected && { selected: selected }),
            products,
            purchaseMethodsList: purchaseMethodsList as FromDb<SalesOfferPackage>[],
            errors,
            csrfToken,
        },
    };
};

export default SelectPurchaseMethods;
