import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { PERIOD_EXPIRY_ATTRIBUTE } from '../constants/attributes';
import { ErrorInfo, NextPageContextWithSession, RadioConditionalInputFieldset } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { getAndValidateNoc, getCsrfToken, getErrorsByIds } from '../utils';
import RadioConditionalInput from '../components/RadioConditionalInput';
import { isPeriodExpiry } from '../interfaces/typeGuards';
import { getFareDayEnd } from '../data/auroradb';

const title = 'Period Validity - Create Fares Data Service';
const description = 'Period Validity selection page of the Create Fares Data Service';

interface PeriodValidityProps {
    errors: ErrorInfo[];
    fieldset: RadioConditionalInputFieldset;
    csrfToken: string;
}

export const getFieldset = (errors: ErrorInfo[], endOfFareDay?: string): RadioConditionalInputFieldset => {
    const periodValidityFieldSet: RadioConditionalInputFieldset = {
        heading: {
            id: 'period-validity',
            content: 'Is this ticket only valid on certain days or times?',
            hidden: true,
        },
        radios: [
            {
                id: 'period-end-calendar',
                name: 'periodValid',
                value: 'endOfCalendarDay',
                label: ' At the end of a calendar day',
                radioButtonHint: {
                    id: 'period-end-calendar-hint',
                    content:
                        'For example, a ticket purchased at 3pm would be valid until midnight on its day of expiry',
                },
            },
            {
                id: 'period-twenty-four-hours',
                name: 'periodValid',
                value: '24hr',
                label: 'At the end of a 24 hour period from purchase',
                radioButtonHint: {
                    id: 'period-twenty-four-hours-hint',
                    content: 'For example, a ticket purchased at 3pm will be valid until 3pm on its day of expiry',
                },
            },
            {
                id: 'period-end-of-service',
                disableAutoSelect: true,
                name: 'periodValid',
                value: 'fareDayEnd',
                dataAriaControls: 'period-validity-end-of-service-required-conditional',
                label: 'Fare day end',
                radioButtonHint: {
                    id: 'period-end-of-service-hint',
                    content:
                        'For example, a ticket purchased at 3pm would be valid until the end of your service day on its day of expiry',
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
        radioError: getErrorsByIds(['period-end-calendar'], errors),
    };
    return periodValidityFieldSet;
};

const PeriodValidity = ({ errors = [], fieldset, csrfToken }: PeriodValidityProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/periodValidity" method="post" csrfToken={csrfToken}>
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
                        <fieldset className="govuk-fieldset" aria-describedby="period-validity-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="period-validity-page-heading">
                                    When does the product expire?
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="period-validity-hint">
                                We need to know the time that this product would be valid until
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

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: PeriodValidityProps }> => {
    let errors: ErrorInfo[] = [];
    const csrfToken = getCsrfToken(ctx);
    const periodExpiryAttribute = getSessionAttribute(ctx.req, PERIOD_EXPIRY_ATTRIBUTE);
    const endOfFareDay = await getFareDayEnd(getAndValidateNoc(ctx));

    if (periodExpiryAttribute && !isPeriodExpiry(periodExpiryAttribute)) {
        errors = periodExpiryAttribute.filter((err) => err.id !== 'product-end-time' || !endOfFareDay);
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

export default PeriodValidity;
