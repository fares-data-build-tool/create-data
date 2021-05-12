import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput from '../components/RadioConditionalInput';
import {
    ErrorInfo,
    NextPageContextWithSession,
    RadioConditionalInputFieldset,
    TimeRestriction,
    TimeRestrictionsDefinitionWithErrors,
} from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE } from '../constants/attributes';
import { getAndValidateNoc, getCsrfToken, getErrorsByIds } from '../utils';
import { getTimeRestrictionByNocCode } from '../data/auroradb';

const title = 'Define Time Restrictions - Create Fares Data Service';
const description = 'Define Time Restrictions page of the Create Fares Data Service';

interface DefineTimeRestrictionsProps {
    errors: ErrorInfo[];
    fieldsets: RadioConditionalInputFieldset[];
    csrfToken: string;
}

export const getFieldsets = (
    errors: ErrorInfo[],
    timeRestrictionNames: string[],
    timeRestrictionsDefinition?: TimeRestriction | TimeRestrictionsDefinitionWithErrors,
): RadioConditionalInputFieldset[] => {
    const validDaysFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'define-valid-days',
            content: 'Is this ticket only valid on certain days or times?',
            hidden: true,
        },
        radios: [
            {
                id: 'valid-days-required',
                name: 'timeRestrictionChoice',
                value: 'Yes',
                dataAriaControls: 'valid-days-required-conditional',
                label: `${timeRestrictionNames.length > 0 ? 'Yes - define new time restriction' : 'Yes'}`,
                inputHint: {
                    id: 'define-valid-days-inputHint',
                    content: 'Select the days of the week the ticket is valid for',
                },
                inputType: 'checkbox',
                inputs: [
                    {
                        id: 'monday',
                        name: 'validDays',
                        label: 'Monday',
                        defaultChecked: timeRestrictionsDefinition?.validDays?.includes('monday') || false,
                    },
                    {
                        id: 'tuesday',
                        name: 'validDays',
                        label: 'Tuesday',
                        defaultChecked: timeRestrictionsDefinition?.validDays?.includes('tuesday') || false,
                    },
                    {
                        id: 'wednesday',
                        name: 'validDays',
                        label: 'Wednesday',
                        defaultChecked: timeRestrictionsDefinition?.validDays?.includes('wednesday') || false,
                    },
                    {
                        id: 'thursday',
                        name: 'validDays',
                        label: 'Thursday',
                        defaultChecked: timeRestrictionsDefinition?.validDays?.includes('thursday') || false,
                    },
                    {
                        id: 'friday',
                        name: 'validDays',
                        label: 'Friday',
                        defaultChecked: timeRestrictionsDefinition?.validDays?.includes('friday') || false,
                    },
                    {
                        id: 'saturday',
                        name: 'validDays',
                        label: 'Saturday',
                        defaultChecked: timeRestrictionsDefinition?.validDays?.includes('saturday') || false,
                    },
                    {
                        id: 'sunday',
                        name: 'validDays',
                        label: 'Sunday',
                        defaultChecked: timeRestrictionsDefinition?.validDays?.includes('sunday') || false,
                    },
                    {
                        id: 'bankHoliday',
                        name: 'validDays',
                        label: 'Bank holiday',
                        defaultChecked: timeRestrictionsDefinition?.validDays?.includes('bankHoliday') || false,
                    },
                ],
                inputErrors: getErrorsByIds(['monday'], errors),
            },
            {
                id: 'valid-days-not-required',
                name: 'timeRestrictionChoice',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['valid-days-required'], errors),
    };
    if (timeRestrictionNames.length > 0) {
        validDaysFieldset.radios.splice(1, 0, {
            id: 'premade-time-restriction-yes',
            name: 'timeRestrictionChoice',
            value: 'Premade',
            label: 'Yes - reuse a saved time restriction',
            inputHint: {
                id: 'choose-time-restriction-hint',
                content: 'Select a saved time restriction to use',
            },
            inputType: 'dropdown',
            dataAriaControls: 'premade-time-restriction',
            inputs: timeRestrictionNames.map((timeRestrictionName, index) => ({
                id: `premade-time-restriction-${index}`,
                name: timeRestrictionName,
                label: timeRestrictionName,
            })),
            inputErrors: errors,
            selectIdentifier: 'timeRestriction',
        });
    }
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
                        your ticket(s) can only be used on a certain day or during a certain time period. If you have a
                        premade time restriction, you can select it here.
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

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: DefineTimeRestrictionsProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const timeRestrictionsDefinition = getSessionAttribute(ctx.req, TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE);
    const noc = getAndValidateNoc(ctx);
    const timeRestrictions = await getTimeRestrictionByNocCode(noc || '');

    let errors: ErrorInfo[] = [];
    if (timeRestrictionsDefinition && isTimeRestrictionsDefinitionWithErrors(timeRestrictionsDefinition)) {
        errors = timeRestrictionsDefinition.errors;
    }
    const timeRestrictionNames = timeRestrictions.map(timeRestriction => timeRestriction.name);
    const fieldsets: RadioConditionalInputFieldset[] = getFieldsets(
        errors,
        timeRestrictionNames,
        timeRestrictionsDefinition,
    );
    return { props: { errors, fieldsets, csrfToken } };
};

export default DefineTimeRestrictions;
