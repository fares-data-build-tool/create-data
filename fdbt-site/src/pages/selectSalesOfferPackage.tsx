import React, { ReactElement } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FullColumnLayout } from '../layout/Layout';
import { SALES_OFFER_PACKAGES_ATTRIBUTE } from '../constants';
import { getSalesOfferPackagesByNocCode } from '../data/auroradb';
import { SalesOfferPackage, CustomAppProps, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { getNocFromIdToken } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';

const pageTitle = 'Select Sales Offer Package - Fares Data Build Tool';
const pageDescription = 'Sales Offer Package selection page of the Fares Data Build Tool';
const errorId = 'sales-offer-package-error';

const defaultSalesOfferPackageOne: SalesOfferPackage = {
    name: 'Onboard (cash)',
    description: 'Purchasable on board the bus, with cash, as a paper ticket.',
    purchaseLocations: ['onBoard'],
    paymentMethods: ['cash'],
    ticketFormats: ['paperTicket'],
};

const defaultSalesOfferPackageTwo: SalesOfferPackage = {
    name: 'Onboard (contactless)',
    description: 'Purchasable on board the bus, with a contactless card or device, as a paper ticket.',
    purchaseLocations: ['onBoard,'],
    paymentMethods: ['contactlessPaymentCard'],
    ticketFormats: ['paperTicket'],
};

const defaultSalesOfferPackageThree: SalesOfferPackage = {
    name: 'Online (smart card)',
    description:
        'Purchasable online, with a debit/credit card or direct debit transaction, on a smart card or similar.',
    purchaseLocations: ['online,'],
    paymentMethods: ['directDebit', 'creditCard', 'debitCard'],
    ticketFormats: ['smartCard'],
};

const defaultSalesOfferPackageFour: SalesOfferPackage = {
    name: 'Mobile App',
    description:
        'Purchasable on a mobile device application, with a debit/credit card or direct debit transaction, stored on the mobile application.',
    purchaseLocations: ['mobileDevice,'],
    paymentMethods: ['debitCard', 'creditCard', 'mobilePhone', 'directDebit'],
    ticketFormats: ['mobileApp'],
};

export interface SelectSalesOfferPackageProps {
    salesOfferPackagesList: SalesOfferPackage[];
    error: ErrorInfo[];
}

const SelectSalesOfferPackage = ({
    salesOfferPackagesList,
    csrfToken,
    error,
}: SelectSalesOfferPackageProps & CustomAppProps): ReactElement => (
    <FullColumnLayout title={pageTitle} description={pageDescription}>
        <CsrfForm action="/api/selectSalesOfferPackage" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={error} />
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="select-sales-offer-package-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="select-sales-offer-package-page-heading">
                                How are the tickets sold?
                            </h1>
                        </legend>
                        <span id="radio-error" className="govuk-error-message">
                            <span className={error.length > 0 ? '' : 'govuk-visually-hidden'}>
                                {error[0] ? error[0].errorMessage : ''}
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
                                This combination of information is called a <strong>sales offer package</strong>. You
                                can choose from one you have already setup, a premade one, or create a new one for these
                                products.
                            </p>
                            <p className="govuk-body">Select a sales offer package, or create a new one:</p>
                            <p className="govuk-body govuk-!-font-weight-bold content-one-quarter">
                                Your sales offer packages
                            </p>
                        </div>
                    </fieldset>
                    <fieldset className="govuk-fieldset" aria-describedby="service-list-hint">
                        <FormElementWrapper errors={error} errorId={errorId} errorClass="govuk-form-group--error">
                            <div className="govuk-checkboxes">
                                {salesOfferPackagesList.map((salesOfferPackage: SalesOfferPackage, index) => {
                                    let { description } = salesOfferPackage;
                                    const { name } = salesOfferPackage;

                                    if (description.length > 140) {
                                        description = `${description.substr(0, description.length - 10)}...`;
                                    }

                                    return (
                                        <div className="govuk-checkboxes__item" key={`checkbox-item-${name}`}>
                                            <input
                                                className="govuk-checkboxes__input"
                                                id={`checkbox-${index}`}
                                                name={name}
                                                type="checkbox"
                                                value={JSON.stringify(salesOfferPackage)}
                                            />
                                            <label
                                                className="govuk-label govuk-checkboxes__label"
                                                htmlFor={`checkbox-${index}`}
                                            >
                                                <span className="govuk-!-font-weight-bold"> {name} </span> -{' '}
                                                {description}
                                            </label>
                                        </div>
                                    );
                                })}
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

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: SelectSalesOfferPackageProps }> => {
    const nocCode = getNocFromIdToken(ctx);

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
    const salesOfferPackageAttribute = getSessionAttribute(ctx.req, SALES_OFFER_PACKAGES_ATTRIBUTE);
    const error: ErrorInfo[] = [];
    if (salesOfferPackageAttribute && salesOfferPackageAttribute.errorMessage) {
        const errorInfo: ErrorInfo = { errorMessage: salesOfferPackageAttribute.errorMessage, id: errorId };
        error.push(errorInfo);
        return {
            props: {
                salesOfferPackagesList,
                error,
            },
        };
    }

    return {
        props: {
            salesOfferPackagesList,
            error: [],
        },
    };
};

export default SelectSalesOfferPackage;
