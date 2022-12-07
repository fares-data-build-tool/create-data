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
import { getFareDayEnd } from '../data/auroradb';

const title = 'Cap Validity - Create Fares Data Service';
const description = 'Cap Validity selection page of the Create Fares Data Service';

interface CapValidityProps {
    errors: ErrorInfo[];
    fieldset: RadioConditionalInputFieldset;
    csrfToken: string;
}

export const getFieldset = (errors: ErrorInfo[], endOfFareDay?: string): RadioConditionalInputFieldset => {
    const CapValidityFieldSet: RadioConditionalInputFieldset = {
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
                label: ' At the end of a calendar day',
                radioButtonHint: {
                    id: 'cap-end-calendar-hint',
                    content: 'The cap applies to journeys made before midnight',
                },
            },
            {
                id: 'cap-twenty-four-hours',
                name: 'capValid',
                value: '24hr',
                label: 'At the end of a 24 hour period',
                radioButtonHint: {
                    id: 'cap-twenty-four-hours-hint',
                    content: 'The cap applies to journeys made within 24hrs of the first tap',
                },
            },
            {
                id: 'cap-end-of-service',
                disableAutoSelect: true,
                name: 'capValid',
                value: 'fareDayEnd',
                dataAriaControls: 'cap-validity-end-of-service-required-conditional',
                label: 'Fare day end',
                radioButtonHint: {
                    id: 'cap-end-of-service-hint',
                    content: "The cap applies to journeys made during the 'fare day' as defined by your business rules",
                },
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
    return CapValidityFieldSet;
};

const CapValidity = ({ errors = [], fieldset, csrfToken }: CapValidityProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/capValidity" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors}>
                        {errors.some((error) => error.id === 'product-end-time') && (
                            <p className="govuk-body-m govuk-!-margin-bottom-0 govuk-!-margin-top-4">
                                <span className="govuk-warning-text__assistive">Warning</span>
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
                        <fieldset className="govuk-fieldset" aria-describedby="cap-validity-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="cap-validity-page-heading">
                                    When does the cap expire?
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="cap-validity-hint">
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

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: CapValidityProps }> => {
    let errors: ErrorInfo[] = [];
    const csrfToken = getCsrfToken(ctx);
    const capExpiryAttribute = getSessionAttribute(ctx.req, CAP_EXPIRY_ATTRIBUTE);
    const endOfFareDay = await getFareDayEnd(getAndValidateNoc(ctx));

    if (capExpiryAttribute && !isCapExpiry(capExpiryAttribute)) {
        errors = capExpiryAttribute.filter((err) => err.id !== 'product-end-time' || !endOfFareDay);
    }

    const fieldset: RadioConditionalInputFieldset = getFieldset(errors, endOfFareDay);

    return {
        props: {
            errors,
            fieldset,
            csrfToken,
        },
    };
};

export default CapValidity;