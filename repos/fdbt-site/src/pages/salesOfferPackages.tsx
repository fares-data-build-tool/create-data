import React, { ReactElement } from 'react';
import startCase from 'lodash/startCase';
import kebabCase from 'lodash/kebabCase';
import upperCase from 'lodash/upperCase';
import { BaseLayout } from '../layout/Layout';
import { CustomAppProps, NextPageContextWithSession } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { getSessionAttribute } from '../utils/sessions';
import { SOP_INFO_ATTRIBUTE } from '../constants';
import FormElementWrapper from '../components/FormElementWrapper';
import { SalesOfferPackageInfo, SalesOfferPackageInfoWithErrors } from './api/salesOfferPackages';
import SalesOfferPackageExplanation from '../components/SalesOfferPackageExplanation';

const title = 'Sales Offer Packages - Fares Data Build Tool';
const description = 'Sales Offer Packages page for the Fares Data Build Tool';

export const purchaseLocationsList = {
    id: 'purchaseLocations',
    method: ['onBoard', 'online', 'mobileDevice'],
};

export const paymentMethodsList = {
    id: 'paymentMethods',
    paymentMethods: ['cash', 'debitCard', 'creditCard', 'mobilePhone'],
};

export const ticketFormatsList = {
    id: 'ticketFormats',
    ticketFormats: ['paperTicket', 'mobileApp', 'smartCard'],
};

export interface SalesOfferPackagesProps {
    salesOfferPackage: SalesOfferPackageInfo | SalesOfferPackageInfoWithErrors;
}

export const isSalesOfferPackageInfoWithErrors = (
    salesOfferPackage: SalesOfferPackageInfo | SalesOfferPackageInfoWithErrors,
): salesOfferPackage is SalesOfferPackageInfoWithErrors =>
    (salesOfferPackage as SalesOfferPackageInfoWithErrors).errors?.length > 0;

const SalesOfferPackages = ({
    salesOfferPackage,
    csrfToken,
}: SalesOfferPackagesProps & CustomAppProps): ReactElement => {
    const errors = isSalesOfferPackageInfoWithErrors(salesOfferPackage) ? salesOfferPackage.errors : [];
    return (
        <BaseLayout title={title} description={description}>
            <CsrfForm action="/api/salesOfferPackages" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <h1 className="govuk-heading-xl">How are the tickets sold - sales offer package</h1>
                    <span id="service-list-hint" className="govuk-hint">
                        Select all that apply from the lists below
                    </span>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <FormElementWrapper
                                errors={errors}
                                errorId={purchaseLocationsList.id}
                                errorClass="govuk-form-group--error"
                            >
                                <div className="govuk-form-group">
                                    <fieldset className="govuk-fieldset" aria-describedby="sop-purchase-locations">
                                        <p className="govuk-body" id="sop-purchase-locations">
                                            Where can tickets be purchased?
                                        </p>
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
                                    </fieldset>
                                </div>
                            </FormElementWrapper>
                            <FormElementWrapper
                                errors={errors}
                                errorId={paymentMethodsList.id}
                                errorClass="govuk-form-group--error"
                            >
                                <div className="govuk-form-group">
                                    <fieldset className="govuk-fieldset" aria-describedby="sop-payment-methods">
                                        <p className="govuk-body" id="sop-payment-methods">
                                            How can tickets be paid for?
                                        </p>
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
                                                        {paymentMethods === 'sms'
                                                            ? upperCase(paymentMethods)
                                                            : startCase(paymentMethods)}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </fieldset>
                                </div>
                            </FormElementWrapper>
                            <FormElementWrapper
                                errors={errors}
                                errorId={ticketFormatsList.id}
                                errorClass="govuk-form-group--error"
                            >
                                <div className="govuk-form-group">
                                    <fieldset
                                        className="govuk-fieldset"
                                        aria-describedby="sales-offer-package-ticket-format"
                                    >
                                        <p className="govuk-body">What format do the tickets come in?</p>
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
                                    </fieldset>
                                </div>
                            </FormElementWrapper>
                        </div>
                        <div className="govuk-grid-column-one-third">
                            <SalesOfferPackageExplanation />
                        </div>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </BaseLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: SalesOfferPackagesProps } => {
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
        },
    };
};

export default SalesOfferPackages;
