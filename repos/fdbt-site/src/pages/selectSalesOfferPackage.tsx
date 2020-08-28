import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { isArray } from 'lodash';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FullColumnLayout } from '../layout/Layout';
import { MULTIPLE_PRODUCT_COOKIE, SALES_OFFER_PACKAGES_ATTRIBUTE } from '../constants';
import { getSalesOfferPackagesByNocCode } from '../data/auroradb';
import { SalesOfferPackage, CustomAppProps, ErrorInfo, NextPageContextWithSession, ProductInfo } from '../interfaces';
import { getAndValidateNoc } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';

const pageTitle = 'Select Sales Offer Package - Fares Data Build Tool';
const pageDescription = 'Sales Offer Package selection page of the Fares Data Build Tool';
const errorId = 'sales-offer-package-error';

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
    selected?: { [key: string]: string };
    productNamesList: string[];
    salesOfferPackagesList: SalesOfferPackage[];
    errors: ErrorInfo[];
}

const generateCheckbox = (
    salesOfferPackagesList: SalesOfferPackage[],
    productIndex: number,
    productName?: string,
    selected?: { [key: string]: string },
): ReactElement[] => {
    return salesOfferPackagesList.map((offer, index) => {
        const { name, description } = offer;
        let checkboxTitles = `${name} - ${description}`;

        if (checkboxTitles.length > 110) {
            checkboxTitles = `${checkboxTitles.substr(0, checkboxTitles.length - 10)}...`;
        }

        let isSelectedOffer = false;

        if (selected) {
            Object.entries(selected).forEach(entry => {
                if (entry[0] === productName) {
                    const entrySelected = !isArray(entry[1]) ? [entry[1]] : (entry[1] as string[]);

                    entrySelected.forEach(selectedEntry => {
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
                    id={`product-${productIndex}-checkbox-${index}`}
                    name={productName || name}
                    type="checkbox"
                    value={JSON.stringify(offer)}
                    defaultChecked={isSelectedOffer}
                />
                <label
                    className="govuk-label govuk-checkboxes__label"
                    htmlFor={`product-${productIndex}-checkbox-${index}`}
                >
                    {checkboxTitles}
                </label>
            </div>
        );
    });
};

const createSalesOffer = (
    salesOfferPackagesList: SalesOfferPackage[],
    productNames: string[],
    selected?: { [key: string]: string },
): ReactElement[] => {
    if (productNames && productNames.length > 0) {
        return productNames.map((productName, index) => {
            return (
                <>
                    <p className="govuk-body govuk-!-font-weight-bold content-one-quarter">{productName}</p>
                    {generateCheckbox(salesOfferPackagesList, index, productName, selected)}
                </>
            );
        });
    }

    return generateCheckbox(salesOfferPackagesList, 0);
};

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
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="select-sales-offer-package-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="select-sales-offer-package-page-heading">
                                    How are the tickets sold?
                                </h1>
                            </legend>
                            <span id="radio-error" className="govuk-error-message">
                                <span className={errors.length > 0 ? '' : 'govuk-visually-hidden'}>
                                    {errors[0] ? errors[0].errorMessage : ''}
                                </span>
                            </span>
                            <div>
                                <p className="govuk-body">
                                    To create NeTEx for your fare it needs to contain the following:
                                </p>
                                <ol className="govuk-list govuk-list--number">
                                    <li>Where a ticket can be bought</li>
                                    <li>What payment method it can be bought with</li>
                                    <li>What format the ticket is provided to the passenger in</li>
                                </ol>
                                <p className="govuk-body">
                                    This combination of information is called a <strong>sales offer package</strong>.
                                    You can choose from one you have already setup or create a new one for these
                                    products.
                                </p>
                                <p className="govuk-body">
                                    Choose from your previously used sales offer packages or create a new one:
                                </p>
                                <p className="govuk-body govuk-!-font-weight-bold content-one-quarter">
                                    Your sales offer packages
                                </p>
                            </div>
                        </fieldset>
                        <fieldset className="govuk-fieldset" aria-describedby="service-list-hint">
                            <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-form-group--error">
                                <div className="govuk-checkboxes">
                                    <>{createSalesOffer(salesOfferPackagesList, productNamesList, selected)}</>
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button govuk-!-margin-right-8"
                    />
                    <a
                        href="/salesOfferPackages"
                        role="button"
                        draggable="false"
                        className="govuk-button govuk-button--secondary"
                        data-module="govuk-button"
                        id="create-new-button"
                    >
                        Create New
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

    const cookies = parseCookies(ctx);
    const multipleProductCookie = cookies[MULTIPLE_PRODUCT_COOKIE];

    let productNames: string[] = [];

    if (multipleProductCookie) {
        const parsedProductCookie = JSON.parse(multipleProductCookie);
        productNames = parsedProductCookie.map((product: ProductInfo) => product.productName);
    }

    const salesOfferPackageAttribute = getSessionAttribute(ctx.req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const errors: ErrorInfo[] = [];

    if (salesOfferPackageAttribute && salesOfferPackageAttribute.errorMessage) {
        const errorInfo: ErrorInfo = { errorMessage: salesOfferPackageAttribute.errorMessage, id: errorId };
        errors.push(errorInfo);
        return {
            props: {
                selected: salesOfferPackageAttribute.selected,
                productNamesList: productNames,
                salesOfferPackagesList,
                errors,
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
