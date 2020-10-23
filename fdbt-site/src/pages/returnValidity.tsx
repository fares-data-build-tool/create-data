import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput, { RadioConditionalInputFieldset } from '../components/RadioConditionalInput';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession, ReturnPeriodValidity } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { RETURN_VALIDITY_ATTRIBUTE } from '../constants';
import { getErrorsByIds } from '../utils';

export interface ReturnPeriodValidityWithErrors {
    amount?: string;
    typeOfDuration?: string;
    errors: ErrorInfo[];
}

const title = 'Return Validity - Create Fares Data Service';
const description = 'Return Validity page of the Create Fares Data Service';

export interface ReturnValidityProps {
    errors: ErrorInfo[];
    fieldset: RadioConditionalInputFieldset;
}

export const getFieldset = (errors: ErrorInfo[], amount: string, duration: string): RadioConditionalInputFieldset => ({
    heading: {
        id: 'define-return-validity',
        content: 'Is the return part of this ticket valid for more than one day?',
        hidden: true,
    },
    radios: [
        {
            id: 'return-validity-defined',
            name: 'validity',
            value: 'Yes',
            dataAriaControls: 'return-validity-defined-conditional',
            label: 'Yes',
            hint: {
                id: 'define-return-validity-hint',
                content: 'Enter a number and select a duration from the dropdown',
            },
            inputType: 'textWithUnits',
            inputs: [
                {
                    id: 'return-validity-amount',
                    name: 'amount',
                    label: 'Number',
                    defaultValue: amount,
                },
                {
                    id: 'return-validity-units',
                    name: 'duration',
                    label: 'Duration',
                    defaultValue: duration,
                    options: ['day', 'week', 'month', 'year'],
                },
            ],
            inputErrors: getErrorsByIds(['return-validity-amount', 'return-validity-units'], errors),
        },
        {
            id: 'return-validity-not-defined',
            name: 'validity',
            value: 'No',
            label: 'No',
        },
    ],
    radioError: getErrorsByIds(['return-validity-defined'], errors),
});

export const isReturnPeriodValidityWithErrors = (
    returnValidityDefinition: undefined | ReturnPeriodValidity | ReturnPeriodValidityWithErrors,
): returnValidityDefinition is ReturnPeriodValidityWithErrors =>
    returnValidityDefinition !== undefined &&
    (returnValidityDefinition as ReturnPeriodValidityWithErrors).errors !== undefined;

const ReturnValidity = ({ errors, fieldset, csrfToken }: ReturnValidityProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/returnValidity" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${fieldset.radioError.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <h1 className="govuk-heading-l" id="return-validity-page-heading">
                        {fieldset.heading.content}
                    </h1>
                    <span className="govuk-hint" id="return-validity-hint">
                        Select no if the return journey is only valid on the same day as the outbound journey
                    </span>
                    <RadioConditionalInput key={fieldset.heading.id} fieldset={fieldset} />
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ReturnValidityProps } => {
    const returnValidity = getSessionAttribute(ctx.req, RETURN_VALIDITY_ATTRIBUTE);

    const errors: ErrorInfo[] =
        returnValidity && isReturnPeriodValidityWithErrors(returnValidity) ? returnValidity.errors : [];
    const amount = (returnValidity && returnValidity.amount) || '';
    const duration = returnValidity && returnValidity.typeOfDuration !== undefined ? returnValidity.typeOfDuration : '';

    const fieldset: RadioConditionalInputFieldset = getFieldset(errors, amount, duration);
    return { props: { errors, fieldset } };
};

export default ReturnValidity;
