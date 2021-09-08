import React, { ChangeEventHandler, ReactElement, useState } from 'react';
import { purchaseMethodsValuesMap } from '../constants/index';
import CsrfForm from '../components/CsrfForm';
import DeleteSOPButton from '../components/DeleteSOPButton';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
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
import { getAndValidateNoc, getCsrfToken, sentenceCaseString, chunk } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { removeAllWhiteSpace } from './api/apiUtils/validator';

const pageTitle = 'Select Sales Offer Package - Create Fares Data Service';
const pageDescription = 'Sales Offer Package selection page of the Create Fares Data Service';

export const defaultSalesOfferPackageOne: SalesOfferPackage = {
    name: 'Onboard (cash)',
    description: '',
    purchaseLocations: ['onBoard'],
    paymentMethods: ['cash'],
    ticketFormats: ['paperTicket'],
};

export const defaultSalesOfferPackageTwo: SalesOfferPackage = {
    name: 'Onboard (contactless)',
    description: '',
    purchaseLocations: ['onBoard'],
    paymentMethods: ['contactlessPaymentCard'],
    ticketFormats: ['paperTicket'],
};

export const defaultSalesOfferPackageThree: SalesOfferPackage = {
    name: 'Online (smart card)',
    description: '',
    purchaseLocations: ['online'],
    paymentMethods: ['directDebit', 'creditCard', 'debitCard'],
    ticketFormats: ['smartCard'],
};

export const defaultSalesOfferPackageFour: SalesOfferPackage = {
    name: 'Mobile App',
    description: '',
    purchaseLocations: ['mobileDevice'],
    paymentMethods: ['debitCard', 'creditCard', 'mobilePhone', 'directDebit'],
    ticketFormats: ['mobileApp'],
};

export const defaultSalesOfferPackages = [
    defaultSalesOfferPackageOne,
    defaultSalesOfferPackageTwo,
    defaultSalesOfferPackageThree,
    defaultSalesOfferPackageFour,
];

export interface SelectSalesOfferPackageProps {
    selected?: { [key: string]: SalesOfferPackage[] };
    products: ProductInfo[];
    purchaseMethodsList: SalesOfferPackage[];
    errors: ErrorInfo[];
    csrfToken: string;
}

export const formatSOPArray = (stringArray: string[]): string =>
    stringArray.map((string) => purchaseMethodsValuesMap[string] || sentenceCaseString(string)).join(', ');

const generateCheckbox = (
    purchaseMethodsList: SalesOfferPackage[],
    productName: string,
    csrfToken: string,
    selectedDefault: { [key: string]: SalesOfferPackage[] } | undefined,
    defaultPrice: string,
): ReactElement[] => {
    const pairs = chunk(purchaseMethodsList, 2);

    const [selected, setSelected] = useState(selectedDefault);

    return pairs.map((pair, pairIndex) => (
        <div className="govuk-grid-row" key={pairIndex}>
            {pair.map((offer, innerIndex) => {
                const index = 2 * pairIndex + innerIndex;
                const { name, description, purchaseLocations, paymentMethods, ticketFormats } = offer;

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
                    <div
                        className="govuk-checkboxes__item govuk-!-margin-bottom-6 govuk-grid-column-one-half sop-row"
                        key={`checkbox-item-${name}`}
                    >
                        <input
                            className="govuk-checkboxes__input"
                            id={`product-${productNameIds}-checkbox-${index}`}
                            name={`product-${productName}`}
                            type="checkbox"
                            value={JSON.stringify(offer)}
                            defaultChecked={!!selectedOffer}
                            onChange={updateSelected}
                        />
                        <label
                            className="govuk-label govuk-checkboxes__label"
                            htmlFor={`product-${productNameIds}-checkbox-${index}`}
                        >
                            <b>{name}</b> {description && description.length > 0 ? '-' : ''} {description}
                        </label>
                        <span className="govuk-hint govuk-!-margin-left-3" id="sales-offer-package-hint">
                            Purchase locations: {formatSOPArray(purchaseLocations)}
                        </span>
                        <span className="govuk-hint govuk-!-margin-left-3" id="sales-offer-package-hint">
                            Payment methods: {formatSOPArray(paymentMethods)}
                        </span>
                        <span className="govuk-hint govuk-!-margin-left-3" id="sales-offer-package-hint">
                            Ticket formats: {formatSOPArray(ticketFormats)}
                        </span>
                        {!!selectedOffer && defaultPrice && (
                            <div className="govuk-currency-input govuk-!-margin-left-3">
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
                                            name={`price-${productName}-${offer.name}`}
                                            data-non-numeric
                                            type="text"
                                            id={`price-${productNameIds}-${removeAllWhiteSpace(offer.name)}`}
                                            defaultValue={selectedOffer?.price || defaultPrice}
                                        />
                                    </FormElementWrapper>
                                </div>
                            </div>
                        )}
                        {offer.id ? <DeleteSOPButton sopId={offer.id} csrfToken={csrfToken} /> : ''}
                    </div>
                );
            })}
        </div>
    ));
};

const createSalesOffer = (
    purchaseMethodsList: SalesOfferPackage[],
    products: ProductInfo[],
    csrfToken: string,
    selected: { [key: string]: SalesOfferPackage[] } | undefined,
    errors: ErrorInfo[],
): ReactElement[] =>
    products.map(({ productName, productPrice }) => (
        <div className="sop-option" key={productName}>
            <FormGroupWrapper
                errorIds={[`product-${[removeAllWhiteSpace(productName)]}-checkbox-0`]}
                errors={errors}
                hideErrorBar={false}
            >
                <fieldset className="govuk-fieldset">
                    <h1 className="govuk-heading-m govuk-!-font-weight-regular govuk-!-padding-top-6 govuk-!-padding-bottom-2">
                        How is <span className="govuk-!-font-weight-bold">{productName}</span> sold?
                    </h1>
                    <FormElementWrapper
                        errors={errors}
                        errorId={`${removeAllWhiteSpace(productName)}-checkbox-0`}
                        errorClass=""
                    >
                        <div className="govuk-checkboxes">
                            {generateCheckbox(purchaseMethodsList, productName, csrfToken, selected, productPrice)}
                            <input type="hidden" name={`product-${productName}`} />
                        </div>
                    </FormElementWrapper>
                </fieldset>
            </FormGroupWrapper>
        </div>
    ));

const SelectSalesOfferPackage = ({
    selected,
    products,
    purchaseMethodsList,
    csrfToken,
    errors,
}: SelectSalesOfferPackageProps): ReactElement => {
    return (
        <FullColumnLayout title={pageTitle} description={pageDescription}>
            <CsrfForm action="/api/selectSalesOfferPackage" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="select-sales-offer-package-page-heading">
                        How are your tickets sold?
                    </h1>
                    <div>
                        <p className="govuk-body">We need to know the following information:</p>
                        <ol className="govuk-list govuk-list--number">
                            <li>Where a ticket can be bought</li>
                            <li>What payment method it can be bought with</li>
                            <li>What format the ticket is provided to the passenger in</li>
                        </ol>
                        <p className="govuk-body">
                            You can choose from the options below or{' '}
                            <a href="/salesOfferPackages" className="govuk-link">
                                create a new one
                            </a>{' '}
                            for these products.
                        </p>
                    </div>
                    {createSalesOffer(purchaseMethodsList, products, csrfToken, selected, errors)}
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                    <a
                        href="/salesOfferPackages"
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
        throw new Error('Necessary nocCode from ID Token cookie not found to show selectSalesOfferPackage page');
    }

    const purchaseMethodsList: SalesOfferPackage[] = nocCode ? await getSalesOfferPackagesByNocCode(nocCode) : [];
    purchaseMethodsList.unshift(...defaultSalesOfferPackages);

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
                              : ['product', sopAttribute],
                  )
                  .reduce((result, item) => ({ ...result, [item[0]]: item[1] }), {}));

    return {
        props: {
            ...(selected && { selected }),
            products,
            purchaseMethodsList,
            errors,
            csrfToken,
        },
    };
};

export default SelectSalesOfferPackage;
