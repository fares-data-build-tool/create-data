import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { ErrorInfo, NextPageContextWithSession, RadioConditionalInputFieldset } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { getCsrfToken, getErrorsByIds } from '../utils';
import RadioConditionalInput from '../components/RadioConditionalInput';
import { SAVE_OPERATOR_GROUP_ATTRIBUTE } from '../constants/attributes';

const title = 'Save Operator Group - Create Fares Data Service';
const description = 'Save Operator Group selection page of the Create Fares Data Service';

interface SaveOperatorGroupProps {
    errors?: ErrorInfo[];
    fieldset: RadioConditionalInputFieldset;
    csrfToken: string;
}

export const getFieldset = (errors: ErrorInfo[]): RadioConditionalInputFieldset => {
    const periodValidityFieldSet: RadioConditionalInputFieldset = {
        heading: {
            id: 'save-operators-hidden-heading',
            content: 'Do you want to save your group of operators for later use?',
            hidden: true,
        },
        radios: [
            {
                id: 'yes-save',
                name: 'saveGroup',
                value: 'yes',
                dataAriaControls: 'save-operators-required-conditional',
                label: 'Yes',
                inputHint: {
                    id: 'save-group-name-hint',
                    content: 'Provide a name to remember your group of operators by',
                    hidden: true,
                },
                inputType: 'text',
                inputs: [
                    {
                        id: 'operator-group-name-input',
                        name: 'groupName',
                        label: 'Operator group name',
                        defaultValue: errors[0]?.userInput || '',
                    },
                ],
                inputErrors: getErrorsByIds(['operator-group-name-input'], errors),
            },
            {
                id: 'no-save',
                name: 'saveGroup',
                value: 'no',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['yes-save'], errors),
    };
    return periodValidityFieldSet;
};

const SaveOperatorGroup = ({ errors = [], fieldset, csrfToken }: SaveOperatorGroupProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/saveOperatorGroup" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="save-group-operator-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="save-group-operator-page-heading">
                                    Do you want to save this group of operators for later use?
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="save-group-operator-page-hint">
                                If you save the group, you can reuse them rather than searching next time
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: SaveOperatorGroupProps } => {
    const csrfToken = getCsrfToken(ctx);
    const errors: ErrorInfo[] = getSessionAttribute(ctx.req, SAVE_OPERATOR_GROUP_ATTRIBUTE) || [];
    const fieldset: RadioConditionalInputFieldset = getFieldset(errors);
    return { props: { errors, fieldset, csrfToken } };
};

export default SaveOperatorGroup;
