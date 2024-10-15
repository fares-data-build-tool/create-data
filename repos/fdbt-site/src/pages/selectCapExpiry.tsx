import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { CAP_EXPIRY_ATTRIBUTE } from '../constants/attributes';
import { ErrorInfo, NextPageContextWithSession, RadioConditionalInputFieldset } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { getAndValidateNoc, getCsrfToken, getErrorsByIds } from '../utils';
import RadioConditionalInput from '../components/RadioConditionalInput';
import { isCapExpiry } from '../interfaces/typeGuards';
import { getCapExpiry, getFareDayEnd } from '../data/auroradb';
import BackButton from '../components/BackButton';

const title = 'Cap Expiry - Create Fares Data Service';
const description = 'Cap Expiry selection page of the Create Fares Data Service';

export const expiryHintText: { [expiry: string]: string } = {
    endOfCalendarDay: 'The cap applies to journeys made before midnight',
    '24hr': 'The cap applies to journeys made within 24hrs of the first tap',
    fareDayEnd: "The cap applies to journeys made during the 'fare day' as defined by your business rules",
};

interface CapExpiryProps {
    errors: ErrorInfo[];
    fieldset: RadioConditionalInputFieldset;
    csrfToken: string;
}

export const getFieldset = (
    errors: ErrorInfo[],
    endOfFareDay?: string,
    capExpiry?: string,
): RadioConditionalInputFieldset => {
    const CapExpiryFieldSet: RadioConditionalInputFieldset = {
        heading: {
            id: 'cap-validity',
            content: 'Is this ticket only valid on certain days or times?',
            hidden: true,
        },
        radios: [
            {
                id: 'cap-end-calendar',
                name: 'capValid',
                value: 'endOfCalendarDay',
                label: 'At the end of a calendar day',
                radioButtonHint: {
                    id: 'cap-end-calendar-hint',
                    content: expiryHintText['endOfCalendarDay'],
                },
                defaultChecked: capExpiry === 'endOfCalendarDay',
            },
            {
                id: 'cap-twenty-four-hours',
                name: 'capValid',
                value: '24hr',
                label: 'At the end of a 24 hour period',
                radioButtonHint: {
                    id: 'cap-twenty-four-hours-hint',
                    content: expiryHintText['24hr'],
                },
                defaultChecked: capExpiry === '24hr',
            },
            {
                id: 'cap-end-of-service',
                disableAutoSelect: capExpiry !== 'fareDayEnd',
                name: 'capValid',
                value: 'fareDayEnd',
                dataAriaControls: 'cap-expiry-end-of-service-required-conditional',
                label: 'Fare day end',
                radioButtonHint: {
                    id: 'cap-end-of-service-hint',
                    content: expiryHintText['fareDayEnd'],
                },
                defaultChecked: capExpiry === 'fareDayEnd',
                inputHint: {
                    id: 'product-end-time-hint',
                    content: 'You can update your fare day end in operator settings',
                    hidden: true,
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'product-end-time',
                        name: 'productEndTime',
                        label: 'End time',
                        disabled: true,
                        defaultValue: endOfFareDay ?? '',
                    },
                ],
                inputErrors: getErrorsByIds(['product-end-time'], errors),
            },
        ],
        radioError: getErrorsByIds(['cap-end-calendar'], errors),
    };
    return CapExpiryFieldSet;
};

const CapExpiry = ({ errors = [], fieldset, csrfToken }: CapExpiryProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/capValidity" method="post" csrfToken={csrfToken}>
                <>
                    <BackButton href="/viewCaps" />
                    <ErrorSummary errors={errors}>
                        {errors.some((error) => error.id === 'product-end-time') && (
                            <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-top-4">
                                <span className="govuk-visually-hidden">Warning</span>
                                You can set your fare day end in{' '}
                                <a className="govuk-link" href="/manageFareDayEnd">
                                    operator settings.
                                </a>
                                <br />
                                Don&apos;t worry you can navigate back to this page when you are finished.
                            </p>
                        )}
                    </ErrorSummary>
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="cap-expiry-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="cap-expiry-page-heading">
                                    When does the cap expire?
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="cap-expiry-hint">
                                We need to know the time that this cap would be valid until
                            </span>
                            <RadioConditionalInput key={fieldset.heading.id} fieldset={fieldset} />
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: CapExpiryProps }> => {
    let errors: ErrorInfo[] = [];
    const csrfToken = getCsrfToken(ctx);
    const capExpiryAttribute = getSessionAttribute(ctx.req, CAP_EXPIRY_ATTRIBUTE);
    const noc = getAndValidateNoc(ctx);
    const endOfFareDay = await getFareDayEnd(noc);
    const dbCapExpiry = await getCapExpiry(noc);
    let capExpirySelected = dbCapExpiry ? JSON.parse(dbCapExpiry).productValidity : '';

    if (isCapExpiry(capExpiryAttribute)) {
        capExpirySelected = capExpiryAttribute.productValidity;
    }
    if (capExpiryAttribute && !isCapExpiry(capExpiryAttribute)) {
        errors = capExpiryAttribute.filter((err) => err.id !== 'product-end-time' || !endOfFareDay);
    }

    const fieldset: RadioConditionalInputFieldset = getFieldset(errors, endOfFareDay, capExpirySelected);

    return {
        props: {
            errors,
            fieldset,
            csrfToken,
        },
    };
};

export default CapExpiry;
