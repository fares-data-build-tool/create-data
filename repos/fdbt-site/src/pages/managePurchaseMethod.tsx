import React, { ReactElement } from 'react';
import kebabCase from 'lodash/kebabCase';
import { BaseLayout } from '../layout/Layout';
import { NextPageContextWithSession } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { getSessionAttribute } from '../utils/sessions';
import { GS_PURCHASE_METHOD_ATTRIBUTE } from '../constants/attributes';
import FormElementWrapper, { FormGroupWrapper } from '../components/FormElementWrapper';
import { sentenceCaseString } from '../utils';
import { GlobalSettingsManageProps, getGlobalSettingsManageProps } from '../utils/globalSettings';
import { getSalesOfferPackageByIdAndNoc } from '../data/auroradb';
import InformationSummary from '../components/InformationSummary';
import { FromDb, SalesOfferPackage } from '../interfaces/matchingJsonTypes';

const title = 'Manage Purchase Methods - Create Fares Data Service';
const description = 'Manage Purchase Methods page of the Create Fares Data Service';

const editingInformationText =
    'Editing and saving new changes will be applied to all fares using this purchase method.';

// DistributionChannelType
export const purchaseLocationsList = {
    id: 'checkbox-0-on-board',
    method: ['onBoard', 'online', 'mobileDevice', 'postal', 'agency'],
};

// Payment Method
export const paymentMethodsList = {
    id: 'checkbox-0-cash',
    paymentMethods: [
        'cash',
        'debitCard',
        'creditCard',
        'mobilePhone',
        'cheque',
        'directDebit',
        'contactlessTravelCard',
    ],
};

// FulfilmentMethodType
export const ticketFormatsList = {
    id: 'checkbox-0-paper-ticket',
    ticketFormats: [
        { value: 'paperTicket', display: 'Paper ticket' },
        { value: 'mobileApp', display: 'Mobile app' },
        { value: 'smartCard', display: 'Smart card' },
        { value: 'electronic_document', display: 'Digital' },
    ],
};

export type ManagePurchaseMethodsProps = GlobalSettingsManageProps<FromDb<SalesOfferPackage>>;

export const valuesMap: { [key: string]: string } = {
    agency: 'Travel Shop',
    contactlessTravelCard: 'Contactless SmartCard (e.g Oyster)',
};

const ManagePurchaseMethod = ({ inputs, csrfToken, errors, editMode }: ManagePurchaseMethodsProps): ReactElement => {
    return (
        <BaseLayout title={title} description={description}>
            {editMode && errors.length === 0 ? <InformationSummary informationText={editingInformationText} /> : null}
            <ErrorSummary errors={errors} />

            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <CsrfForm action="/api/managePurchaseMethod" method="post" csrfToken={csrfToken}>
                        <>
                            <h1 className="govuk-heading-l">Provide purchase method details</h1>
                            <span id="service-list-hint" className="govuk-hint">
                                Select at least one from each section below
                            </span>
                            <input type="hidden" name="id" value={inputs?.id} />

                            <FormGroupWrapper errorIds={[purchaseLocationsList.id]} errors={errors}>
                                <fieldset className="govuk-fieldset" aria-describedby="sop-purchase-locations">
                                    <legend
                                        className="govuk-fieldset__legend govuk-fieldset__legend--s"
                                        id="sop-purchase-locations"
                                    >
                                        Where can tickets be sold?
                                    </legend>
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId={purchaseLocationsList.id}
                                        errorClass="govuk-form-group--error"
                                    >
                                        <>
                                            {purchaseLocationsList.method.map((purchaseLocation, index) => {
                                                const purchaseLocationId = kebabCase(purchaseLocation);
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
                                                            value={purchaseLocation}
                                                            defaultChecked={inputs?.purchaseLocations.includes(
                                                                purchaseLocation,
                                                            )}
                                                        />
                                                        <label
                                                            className="govuk-label govuk-checkboxes__label"
                                                            htmlFor={`checkbox-${index}-${purchaseLocationId}`}
                                                        >
                                                            {valuesMap[purchaseLocation] ||
                                                                sentenceCaseString(purchaseLocation)}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    </FormElementWrapper>
                                </fieldset>
                            </FormGroupWrapper>
                            <FormGroupWrapper errorIds={[paymentMethodsList.id]} errors={errors}>
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
                                            {paymentMethodsList.paymentMethods.map((paymentMethod, index) => {
                                                const paymentMethodId = kebabCase(paymentMethod);
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
                                                            value={paymentMethod}
                                                            defaultChecked={inputs?.paymentMethods.includes(
                                                                paymentMethod,
                                                            )}
                                                        />
                                                        <label
                                                            className="govuk-label govuk-checkboxes__label"
                                                            htmlFor={`checkbox-${index}-${paymentMethodId}`}
                                                        >
                                                            {valuesMap[paymentMethod] ||
                                                                sentenceCaseString(paymentMethod)}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    </FormElementWrapper>
                                </fieldset>
                            </FormGroupWrapper>
                            <FormGroupWrapper errorIds={[ticketFormatsList.id]} errors={errors}>
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
                                            {ticketFormatsList.ticketFormats.map((ticketFormat, index) => {
                                                const ticketFormatId = kebabCase(ticketFormat.value);
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
                                                            value={ticketFormat.value}
                                                            defaultChecked={inputs?.ticketFormats.includes(
                                                                ticketFormat.value,
                                                            )}
                                                        />
                                                        <label
                                                            className="govuk-label govuk-checkboxes__label"
                                                            htmlFor={`checkbox-${index}-${ticketFormatId}`}
                                                        >
                                                            {ticketFormat.display}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    </FormElementWrapper>
                                </fieldset>
                            </FormGroupWrapper>
                            <FormGroupWrapper errorIds={['purchase-method-name']} errors={errors}>
                                <div className={`govuk-form-group`}>
                                    <label htmlFor="purchase-method-name">
                                        <h1 className="govuk-fieldset__legend govuk-fieldset__legend--s">
                                            Provide a name for your purchase method
                                        </h1>
                                    </label>

                                    <p className="govuk-hint" id="group-name-hint">
                                        50 characters maximum
                                    </p>
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId="purchase-method-name"
                                        errorClass="govuk-input--error"
                                    >
                                        <input
                                            className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                                            id="purchase-method-name"
                                            name="name"
                                            type="text"
                                            maxLength={50}
                                            defaultValue={inputs?.name || ''}
                                        />
                                    </FormElementWrapper>
                                </div>
                            </FormGroupWrapper>
                            <input
                                type="submit"
                                value={`${editMode ? 'Update' : 'Add'} purchase method`}
                                id="continue-button"
                                className="govuk-button"
                            />
                        </>
                    </CsrfForm>
                </div>
                <div className="govuk-grid-column-one-third">
                    <h1 className="govuk-heading-s">What is a purchase method?</h1>
                    <p className="govuk-body">To create NeTEx for your fares, you need to provide the following:</p>
                    <ol className="govuk-body">
                        <li>Where a ticket can be bought</li>
                        <li>What payment methods can be used to buy a ticket</li>
                        <li>In what format a ticket will be used by passengers</li>
                    </ol>
                    <p className="govuk-body">
                        This combination of information is known as a <b>purchase method</b>.
                    </p>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: ManagePurchaseMethodsProps }> => {
    return await getGlobalSettingsManageProps<FromDb<SalesOfferPackage>>(
        ctx,
        getSalesOfferPackageByIdAndNoc,
        getSessionAttribute(ctx.req, GS_PURCHASE_METHOD_ATTRIBUTE),
    );
};

export default ManagePurchaseMethod;
