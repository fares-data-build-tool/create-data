import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { PERIOD_EXPIRY_ATTRIBUTE } from '../constants';
import { ErrorInfo, NextPageContextWithSession, ProductData, WithErrors } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { getCsrfToken, getErrorsByIds } from '../utils';
import RadioConditionalInput, { RadioConditionalInputFieldset } from '../components/RadioConditionalInput';
import { isWithErrors } from '../interfaces/typeGuards';

const title = 'Period Validity - Create Fares Data Service';
const description = 'Period Validity selection page of the Create Fares Data Service';

type PeriodValidityProps = {
    errors?: ErrorInfo[];
    fieldset: RadioConditionalInputFieldset;
    csrfToken: string;
};

export const getFieldset = (
    errors: ErrorInfo[],
    periodExpiryAttribute?: ProductData | WithErrors<ProductData>,
): RadioConditionalInputFieldset => {
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
                name: 'periodValid',
                value: 'endOfServiceDay',
                dataAriaControls: 'period-validity-end-of-service-required-conditional',
                label: 'End of service day',
                radioButtonHint: {
                    id: 'period-end-of-service-hint',
                    content:
                        'For example, a ticket purchased at 3pm would be valid until the end of your service day on its day of expiry',
                },
                inputHint: {
                    id: 'product-end-time-hint',
                    content: 'Enter an end time for your service day',
                    hidden: true,
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'product-end-time',
                        name: 'productEndTime',
                        label: 'End time',
                        defaultValue: periodExpiryAttribute?.products[0].productEndTime || '',
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
                    <ErrorSummary errors={errors} />
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: PeriodValidityProps } => {
    let errors: ErrorInfo[] = [];
    const csrfToken = getCsrfToken(ctx);
    const periodExpiryAttribute = getSessionAttribute(ctx.req, PERIOD_EXPIRY_ATTRIBUTE);

    if (isWithErrors(periodExpiryAttribute)) {
        errors = periodExpiryAttribute.errors;
    }

    const fieldset: RadioConditionalInputFieldset = getFieldset(errors, periodExpiryAttribute);
    return { props: { errors, fieldset, csrfToken } };
};

export default PeriodValidity;
