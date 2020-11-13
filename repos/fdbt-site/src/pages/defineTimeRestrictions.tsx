import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput, { RadioConditionalInputFieldset } from '../components/RadioConditionalInput';
import { ErrorInfo, NextPageContextWithSession, TimeRestriction } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../constants';
import { TimeRestrictionsDefinitionWithErrors } from './api/defineTimeRestrictions';
import { getCsrfToken, getErrorsByIds } from '../utils';

const title = 'Define Time Restrictions - Create Fares Data Service';
const description = 'Define Time Restrictions page of the Create Fares Data Service';

export interface DefineTimeRestrictionsProps {
    errors: ErrorInfo[];
    fieldsets: RadioConditionalInputFieldset[];
    csrfToken: string;
}

export const getFieldsets = (errors: ErrorInfo[]): RadioConditionalInputFieldset[] => {
    const validDaysFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'define-valid-days',
            content: 'Is this ticket only valid on certain days or times?',
            hidden: true,
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
                    {
                        id: 'bankHoliday',
                        name: 'validDays',
                        label: 'Bank holiday',
                    },
                ],
                inputErrors: getErrorsByIds(['monday'], errors),
            },
            {
                id: 'valid-days-not-required',
                name: 'validDaysSelected',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['valid-days-required'], errors),
    };
    return [validDaysFieldset];
};

export const isTimeRestrictionsDefinitionWithErrors = (
    timeRestrictionsDefinition: TimeRestriction | TimeRestrictionsDefinitionWithErrors,
): timeRestrictionsDefinition is TimeRestrictionsDefinitionWithErrors =>
    (timeRestrictionsDefinition as TimeRestrictionsDefinitionWithErrors).errors !== undefined;

const DefineTimeRestrictions = ({ errors = [], fieldsets, csrfToken }: DefineTimeRestrictionsProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/defineTimeRestrictions" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div>
                    <h1 className="govuk-heading-l" id="define-time-restrictions-page-heading">
                        Are there time restrictions on your ticket?
                    </h1>
                    <span className="govuk-hint" id="define-time-restrictions-hint">
                        We need to know if your ticket(s) will have any time restrictions, for example select yes if
                        your ticket(s) can only be used on a certain day or during a certain time period
                    </span>
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
    const csrfToken = getCsrfToken(ctx);
    const timeRestrictionsDefinition = getSessionAttribute(ctx.req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);

    let errors: ErrorInfo[] = [];
    if (timeRestrictionsDefinition && isTimeRestrictionsDefinitionWithErrors(timeRestrictionsDefinition)) {
        errors = timeRestrictionsDefinition.errors;
    }

    const fieldsets: RadioConditionalInputFieldset[] = getFieldsets(errors);
    return { props: { errors, fieldsets, csrfToken } };
};

export default DefineTimeRestrictions;
