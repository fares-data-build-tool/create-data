import React, { ReactElement } from 'react';
import { isSalesOfferPackageWithErrors, isFareType } from '../interfaces/typeGuards';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import { FullColumnLayout } from '../layout/Layout';
import {
    MULTIPLE_PRODUCT_ATTRIBUTE,
    SALES_OFFER_PACKAGES_ATTRIBUTE,
    PRODUCT_DETAILS_ATTRIBUTE,
    FARE_TYPE_ATTRIBUTE,
} from '../constants';
import { getSalesOfferPackagesByNocCode } from '../data/auroradb';
import { SalesOfferPackage, CustomAppProps, ErrorInfo, NextPageContextWithSession, ProductInfo } from '../interfaces';
import { getAndValidateNoc } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { Product } from './api/multipleProductValidity';
import { isProductInfo, isProductData } from './productDetails';
import { removeAllWhiteSpace } from './api/apiUtils/validator';

const pageTitle = 'Select Sales Offer Package - Fares Data Build Tool';
const pageDescription = 'Sales Offer Package selection page of the Fares Data Build Tool';

export const defaultSalesOfferPackageOne: SalesOfferPackage = {
    name: 'Onboard (cash)',
    description: 'Purchasable on board the bus, with cash, as a paper ticket.',
    purchaseLocations: ['onBoard'],
    paymentMethods: ['cash'],
    ticketFormats: ['paperTicket'],
};

export const defaultSalesOfferPackageTwo: SalesOfferPackage = {
    name: 'Onboard (contactless)',
    description: 'Purchasable on board the bus, with a contactless card or device, as a paper ticket.',
    purchaseLocations: ['onBoard'],
    paymentMethods: ['contactlessPaymentCard'],
    ticketFormats: ['paperTicket'],
};

export const defaultSalesOfferPackageThree: SalesOfferPackage = {
    name: 'Online (smart card)',
    description:
        'Purchasable online, with a debit/credit card or direct debit transaction, on a smart card or similar.',
    purchaseLocations: ['online'],
    paymentMethods: ['directDebit', 'creditCard', 'debitCard'],
    ticketFormats: ['smartCard'],
};

export const defaultSalesOfferPackageFour: SalesOfferPackage = {
    name: 'Mobile App',
    description:
        'Purchasable on a mobile device application, with a debit/credit card or direct debit transaction, stored on the mobile application.',
    purchaseLocations: ['mobileDevice'],
    paymentMethods: ['debitCard', 'creditCard', 'mobilePhone', 'directDebit'],
    ticketFormats: ['mobileApp'],
};

export interface SelectSalesOfferPackageProps {
    selected?: { [key: string]: string[] };
    productNamesList: string[];
    salesOfferPackagesList: SalesOfferPackage[];
    errors: ErrorInfo[];
}

const generateCheckbox = (
    salesOfferPackagesList: SalesOfferPackage[],
    productName: string,
    selected?: { [key: string]: string[] },
): ReactElement[] => {
    return salesOfferPackagesList.map((offer, index) => {
        const { name, description } = offer;
        let checkboxTitles = `${name} - ${description}`;

        if (checkboxTitles.length > 200) {
            checkboxTitles = `${checkboxTitles.substr(0, checkboxTitles.length - 10)}...`;
        }

        const productNameIds = removeAllWhiteSpace(productName);

        let isSelectedOffer = false;

        if (selected) {
            Object.entries(selected).forEach(entry => {
                if (entry[0] === productName) {
                    entry[1].forEach(selectedEntry => {
                        if (selectedEntry === JSON.stringify(offer)) {
                            isSelectedOffer = true;
                        }
                    });
                }
            });
        }

        return (
            <div className="govuk-checkboxes__item" key={`checkbox-item-${name}`}>
                <input
                    className="govuk-checkboxes__input"
                    id={`${productNameIds}-checkbox-${index}`}
                    name={productName}
                    type="checkbox"
                    value={JSON.stringify(offer)}
                    defaultChecked={isSelectedOffer}
                />
                <label className="govuk-label govuk-checkboxes__label" htmlFor={`${productNameIds}-checkbox-${index}`}>
                    {checkboxTitles}
                </label>
            </div>
        );
    });
};

const createSalesOffer = (
    salesOfferPackagesList: SalesOfferPackage[],
    productNames: string[],
    selected?: { [key: string]: string[] },
    errors: ErrorInfo[] = [],
): ReactElement[] =>
    productNames.map(productName => (
        <div className="sop-option">
            <FormGroupWrapper errorId={`${[removeAllWhiteSpace(productName)]}-checkbox-0`} errors={errors}>
                <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{`Select sales offer packages for ${productName}`}</legend>
                    <FormElementWrapper
                        errors={errors}
                        errorId={`${removeAllWhiteSpace(productName)}-checkbox-0`}
                        errorClass=""
                    >
                        <div className="govuk-checkboxes">
                            {generateCheckbox(salesOfferPackagesList, productName, selected)}
                            <input type="hidden" name={productName} />
                        </div>
                    </FormElementWrapper>
                </fieldset>
            </FormGroupWrapper>
        </div>
    ));

const SelectSalesOfferPackage = ({
    selected,
    productNamesList,
    salesOfferPackagesList,
    csrfToken,
    errors,
}: SelectSalesOfferPackageProps & CustomAppProps): ReactElement => {
    return (
        <FullColumnLayout title={pageTitle} description={pageDescription}>
            <CsrfForm action="/api/selectSalesOfferPackage" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-l" id="select-sales-offer-package-page-heading">
                        How are the tickets sold?
                    </h1>
                    <div>
                        <p className="govuk-body">To create NeTEx for your fare it needs to contain the following:</p>
                        <ol className="govuk-list govuk-list--number">
                            <li>Where a ticket can be bought</li>
                            <li>What payment method it can be bought with</li>
                            <li>What format the ticket is provided to the passenger in</li>
                        </ol>
                        <p className="govuk-body">
                            This combination of information is called a <strong>sales offer package</strong>. You can
                            choose from one you have already setup or create a new one for these products.
                        </p>
                    </div>
                    {createSalesOffer(salesOfferPackagesList, productNamesList, selected, errors)}
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                    <a
                        href="/salesOfferPackages"
                        role="button"
                        draggable="false"
                        className="govuk-button govuk-button--secondary create-new-sop-button"
                        data-module="govuk-button"
                        id="create-new-button"
                    >
                        Create New Sales Offer Package
                    </a>
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: SelectSalesOfferPackageProps }> => {
    const nocCode = getAndValidateNoc(ctx);

    if (!nocCode) {
        throw new Error('Necessary nocCode from ID Token cookie not found to show selectSalesOfferPackageProps page');
    }

    const salesOfferPackagesList = await getSalesOfferPackagesByNocCode(nocCode);
    salesOfferPackagesList.unshift(
        defaultSalesOfferPackageOne,
        defaultSalesOfferPackageTwo,
        defaultSalesOfferPackageThree,
        defaultSalesOfferPackageFour,
    );

    const multipleProductAttribute = getSessionAttribute(ctx.req, MULTIPLE_PRODUCT_ATTRIBUTE);
    const singleProductAttribute = getSessionAttribute(ctx.req, PRODUCT_DETAILS_ATTRIBUTE);
    const fareTypeAttribute = getSessionAttribute(ctx.req, FARE_TYPE_ATTRIBUTE);

    let productNames: string[] = ['product'];

    if (isFareType(fareTypeAttribute)) {
        if (
            (fareTypeAttribute.fareType === 'period' || fareTypeAttribute.fareType === 'multiOperator') &&
            multipleProductAttribute
        ) {
            const multiProducts: Product[] = multipleProductAttribute.products;
            productNames = multiProducts.map((product: ProductInfo) => product.productName);
        } else if (singleProductAttribute) {
            if (fareTypeAttribute.fareType === 'flatFare' && isProductData(singleProductAttribute)) {
                productNames = [singleProductAttribute.products[0].productName];
            } else if (
                (fareTypeAttribute.fareType === 'period' || fareTypeAttribute.fareType === 'multiOperator') &&
                isProductInfo(singleProductAttribute)
            ) {
                productNames = [singleProductAttribute.productName];
            }
        }
    }

    const salesOfferPackageAttribute = getSessionAttribute(ctx.req, SALES_OFFER_PACKAGES_ATTRIBUTE);

    if (
        salesOfferPackageAttribute &&
        isSalesOfferPackageWithErrors(salesOfferPackageAttribute) &&
        salesOfferPackageAttribute.errors
    ) {
        return {
            props: {
                selected: salesOfferPackageAttribute.selected || '',
                productNamesList: productNames,
                salesOfferPackagesList,
                errors: salesOfferPackageAttribute.errors,
            },
        };
    }

    return {
        props: {
            productNamesList: productNames,
            salesOfferPackagesList,
            errors: [],
        },
    };
};

export default SelectSalesOfferPackage;
