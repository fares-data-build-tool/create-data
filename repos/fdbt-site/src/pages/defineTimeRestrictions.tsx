import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput, { RadioConditionalInputFieldset } from '../components/RadioConditionalInput';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession, TimeRestriction } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../constants';
import { TimeRestrictionsDefinitionWithErrors } from './api/defineTimeRestrictions';
import { getErrorsByIds } from '../utils';

const title = 'Define Time Restrictions - Fares Data Build Tool';
const description = 'Define Time Restrictions page of the Fares Data Build Tool';

export interface DefineTimeRestrictionsProps {
    errors: ErrorInfo[];
    fieldsets: RadioConditionalInputFieldset[];
}

export const getFieldsets = (errors: ErrorInfo[]): RadioConditionalInputFieldset[] => {
    const timeRestrictionsFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'define-time-restrictions',
            content: 'Is there a start time or an end time to this ticket?',
        },
        radios: [
            {
                id: 'time-restriction-required',
                name: 'timeRestriction',
                value: 'Yes',
                dataAriaControls: 'time-restriction-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-time-restriction-hint',
                    content: 'Enter a time in 24 hour format. Example 0900 or 2300',
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'start-time',
                        name: 'startTime',
                        label: 'Start Time (required)',
                    },
                    {
                        id: 'end-time',
                        name: 'endTime',
                        label: 'End Time (required)',
                    },
                ],
                inputErrors: getErrorsByIds(['start-time', 'end-time'], errors),
            },
            {
                id: 'time-restriction-not-required',
                name: 'timeRestriction',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['define-time-restrictions'], errors),
    };

    const validDaysFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'define-valid-days',
            content: 'Is this ticket only valid on certain days?',
        },
        radios: [
            {
                id: 'valid-days-required',
                name: 'validDaysSelected',
                value: 'Yes',
                dataAriaControls: 'valid-days-required-conditional',
                label: 'Yes',
                hint: {
                    id: 'define-valid-days-hint',
                    content: 'Select the days of the week the ticket is valid for',
                },
                inputType: 'checkbox',
                inputs: [
                    {
                        id: 'monday',
                        name: 'validDays',
                        label: 'Monday',
                    },
                    {
                        id: 'tuesday',
                        name: 'validDays',
                        label: 'Tuesday',
                    },
                    {
                        id: 'wednesday',
                        name: 'validDays',
                        label: 'Wednesday',
                    },
                    {
                        id: 'thursday',
                        name: 'validDays',
                        label: 'Thursday',
                    },
                    {
                        id: 'friday',
                        name: 'validDays',
                        label: 'Friday',
                    },
                    {
                        id: 'saturday',
                        name: 'validDays',
                        label: 'Saturday',
                    },
                    {
                        id: 'sunday',
                        name: 'validDays',
                        label: 'Sunday',
                    },
                ],
                inputErrors: getErrorsByIds(['valid-days-required'], errors),
            },
            {
                id: 'valid-days-not-required',
                name: 'validDaysSelected',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['define-valid-days'], errors),
    };
    return [timeRestrictionsFieldset, validDaysFieldset];
};

export const isTimeRestrictionsDefinitionWithErrors = (
    timeRestrictionsDefinition: TimeRestriction | TimeRestrictionsDefinitionWithErrors,
): timeRestrictionsDefinition is TimeRestrictionsDefinitionWithErrors =>
    (timeRestrictionsDefinition as TimeRestrictionsDefinitionWithErrors).errors !== undefined;

const DefineTimeRestrictions = ({
    errors = [],
    fieldsets,
    csrfToken,
}: DefineTimeRestrictionsProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/defineTimeRestrictions" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div>
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading" id="define-time-restrictions-page-heading">
                            Tell us more about the time restrictions
                        </h1>
                    </legend>
                    <span className="govuk-hint" id="define-time-restrictions-hint">
                        The following two questions will provide us with all the information we need for time
                        restrictions
                    </span>
                    <br />
                    <br />
                    {fieldsets.map(fieldset => {
                        return <RadioConditionalInput key={fieldset.heading.id} fieldset={fieldset} />;
                    })}
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: DefineTimeRestrictionsProps } => {
    const timeRestrictionsDefinition = getSessionAttribute(ctx.req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    let errors: ErrorInfo[] = [];
    if (timeRestrictionsDefinition && isTimeRestrictionsDefinitionWithErrors(timeRestrictionsDefinition)) {
        errors = timeRestrictionsDefinition.errors;
    }

    const fieldsets: RadioConditionalInputFieldset[] = getFieldsets(errors);
    return { props: { errors, fieldsets } };
};

export default DefineTimeRestrictions;
