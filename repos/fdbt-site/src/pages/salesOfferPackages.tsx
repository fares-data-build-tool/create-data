import React, { ReactElement } from 'react';
import kebabCase from 'lodash/kebabCase';
import startCase from 'lodash/startCase';
import { BaseLayout } from '../layout/Layout';
import { NextPageContextWithSession } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { getSessionAttribute } from '../utils/sessions';
import { SOP_INFO_ATTRIBUTE } from '../constants';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import { SalesOfferPackageInfo, SalesOfferPackageInfoWithErrors } from './api/salesOfferPackages';
import SalesOfferPackageExplanation from '../components/SalesOfferPackageExplanation';
import { getCsrfToken } from '../utils';

const title = 'Sales Offer Packages - Create Fares Data Service';
const description = 'Sales Offer Packages page for the Create Fares Data Service';

export const purchaseLocationsList = {
    id: 'checkbox-0-on-board',
    method: ['onBoard', 'online', 'mobileDevice'],
};

export const paymentMethodsList = {
    id: 'checkbox-0-cash',
    paymentMethods: ['cash', 'debitCard', 'creditCard', 'mobilePhone'],
};

export const ticketFormatsList = {
    id: 'checkbox-0-paper-ticket',
    ticketFormats: ['paperTicket', 'mobileApp', 'smartCard'],
};

export interface SalesOfferPackagesProps {
    salesOfferPackage: SalesOfferPackageInfo | SalesOfferPackageInfoWithErrors;
    csrfToken: string;
}

export const isSalesOfferPackageInfoWithErrors = (
    salesOfferPackage: SalesOfferPackageInfo | SalesOfferPackageInfoWithErrors,
): salesOfferPackage is SalesOfferPackageInfoWithErrors =>
    (salesOfferPackage as SalesOfferPackageInfoWithErrors).errors?.length > 0;

const SalesOfferPackages = ({ salesOfferPackage, csrfToken }: SalesOfferPackagesProps): ReactElement => {
    const errors = isSalesOfferPackageInfoWithErrors(salesOfferPackage) ? salesOfferPackage.errors : [];

    return (
        <BaseLayout title={title} description={description}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <CsrfForm action="/api/salesOfferPackages" method="post" csrfToken={csrfToken}>
                        <>
                            <ErrorSummary errors={errors} />
                            <h1 className="govuk-heading-xl">How are the tickets sold - sales offer package</h1>
                            <span id="service-list-hint" className="govuk-hint">
                                Select all that apply from the lists below
                            </span>

                            <FormGroupWrapper errorId={purchaseLocationsList.id} errors={errors}>
                                <fieldset className="govuk-fieldset" aria-describedby="sop-purchase-locations">
                                    <legend
                                        className="govuk-fieldset__legend govuk-fieldset__legend--s"
                                        id="sop-purchase-locations"
                                    >
                                        Where can tickets be purchased?
                                    </legend>
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId={purchaseLocationsList.id}
                                        errorClass="govuk-form-group--error"
                                    >
                                        <>
                                            {purchaseLocationsList.method.map((purchaseLocations, index) => {
                                                const purchaseLocationId = kebabCase(purchaseLocations);
                                                return (
                                                    <div
                                                        className="govuk-checkboxes__item"
                                                        key={`checkbox-item-${purchaseLocationId}`}
                                                    >
                                                        <input
                                                            className="govuk-checkboxes__input"
                                                            id={`checkbox-${index}-${purchaseLocationId}`}
                                                            name="purchaseLocations"
                                                            type="checkbox"
                                                            value={purchaseLocations}
                                                            defaultChecked={salesOfferPackage.purchaseLocations.includes(
                                                                purchaseLocations,
                                                            )}
                                                        />
                                                        <label
                                                            className="govuk-label govuk-checkboxes__label"
                                                            htmlFor={`checkbox-${index}-${purchaseLocationId}`}
                                                        >
                                                            {startCase(purchaseLocations)}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    </FormElementWrapper>
                                </fieldset>
                            </FormGroupWrapper>
                            <FormGroupWrapper errorId={paymentMethodsList.id} errors={errors}>
                                <fieldset className="govuk-fieldset" aria-describedby="sop-payment-methods">
                                    <legend
                                        className="govuk-fieldset__legend govuk-fieldset__legend--s"
                                        id="sop-payment-methods"
                                    >
                                        How can tickets be paid for?
                                    </legend>
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId={paymentMethodsList.id}
                                        errorClass="govuk-form-group--error"
                                    >
                                        <>
                                            {paymentMethodsList.paymentMethods.map((paymentMethods, index) => {
                                                const paymentMethodId = kebabCase(paymentMethods);
                                                return (
                                                    <div
                                                        className="govuk-checkboxes__item"
                                                        key={`checkbox-item-${paymentMethodId}`}
                                                    >
                                                        <input
                                                            className="govuk-checkboxes__input"
                                                            id={`checkbox-${index}-${paymentMethodId}`}
                                                            name="paymentMethods"
                                                            type="checkbox"
                                                            value={paymentMethods}
                                                            defaultChecked={salesOfferPackage.paymentMethods.includes(
                                                                paymentMethods,
                                                            )}
                                                        />
                                                        <label
                                                            className="govuk-label govuk-checkboxes__label"
                                                            htmlFor={`checkbox-${index}-${paymentMethodId}`}
                                                        >
                                                            {startCase(paymentMethods)}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    </FormElementWrapper>
                                </fieldset>
                            </FormGroupWrapper>
                            <FormGroupWrapper errorId={ticketFormatsList.id} errors={errors}>
                                <fieldset className="govuk-fieldset" aria-describedby="sop-ticket-formats">
                                    <legend
                                        className="govuk-fieldset__legend govuk-fieldset__legend--s"
                                        id="sop-ticket-formats"
                                    >
                                        What format do the tickets come in?
                                    </legend>
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId={ticketFormatsList.id}
                                        errorClass="govuk-form-group--error"
                                    >
                                        <>
                                            {ticketFormatsList.ticketFormats.map((ticketFormats, index) => {
                                                const ticketFormatId = kebabCase(ticketFormats);
                                                return (
                                                    <div
                                                        className="govuk-checkboxes__item"
                                                        key={`checkbox-item-${ticketFormatId}`}
                                                    >
                                                        <input
                                                            className="govuk-checkboxes__input"
                                                            id={`checkbox-${index}-${ticketFormatId}`}
                                                            name="ticketFormats"
                                                            type="checkbox"
                                                            value={ticketFormats}
                                                            defaultChecked={salesOfferPackage.ticketFormats.includes(
                                                                ticketFormats,
                                                            )}
                                                        />
                                                        <label
                                                            className="govuk-label govuk-checkboxes__label"
                                                            htmlFor={`checkbox-${index}-${ticketFormatId}`}
                                                        >
                                                            {startCase(ticketFormats)}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    </FormElementWrapper>
                                </fieldset>
                            </FormGroupWrapper>
                            <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                        </>
                    </CsrfForm>
                </div>
                <div className="govuk-grid-column-one-third">
                    <SalesOfferPackageExplanation />
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: SalesOfferPackagesProps } => {
    const csrfToken = getCsrfToken(ctx);
    const rawSalesOfferPackage = getSessionAttribute(ctx.req, SOP_INFO_ATTRIBUTE);

    const defaultSOP: SalesOfferPackageInfo = {
        purchaseLocations: [],
        paymentMethods: [],
        ticketFormats: [],
    };

    return {
        props: {
            salesOfferPackage:
                rawSalesOfferPackage && isSalesOfferPackageInfoWithErrors(rawSalesOfferPackage)
                    ? rawSalesOfferPackage
                    : defaultSOP,
            csrfToken,
        },
    };
};

export default SalesOfferPackages;
