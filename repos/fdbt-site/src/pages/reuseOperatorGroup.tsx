import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import RadioConditionalInput from '../components/RadioConditionalInput';
import { ErrorInfo, NextPageContextWithSession, RadioConditionalInputFieldset } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { REUSE_OPERATOR_GROUP_ATTRIBUTE } from '../constants/attributes';
import { getAndValidateNoc, getCsrfToken, getErrorsByIds } from '../utils';
import { getOperatorGroupsByNoc } from '../data/auroradb';
import { redirectTo } from './api/apiUtils';

const title = 'Reuse Operator Group - Create Fares Data Service';
const description = 'Reuse Operator Group page of the Create Fares Data Service';

interface ReuseOperatorGroupProps {
    errors: ErrorInfo[];
    fieldset: RadioConditionalInputFieldset;
    csrfToken: string;
}

export const getFieldset = (errors: ErrorInfo[], operatorGroupNames: string[]): RadioConditionalInputFieldset => {
    const validDaysFieldset: RadioConditionalInputFieldset = {
        heading: {
            id: 'reuse-operator-group-heading',
            content: 'Do you want to reuse a saved operator group?',
            hidden: true,
        },
        radios: [
            {
                id: 'reuse-operator-group-yes',
                name: 'reuseGroupChoice',
                value: 'Yes',
                label: 'Yes',
                inputHint: {
                    id: 'choose-time-restriction-hint',
                    content: 'Select an operator group from the dropdown',
                    hidden: true,
                },
                inputType: 'dropdown',
                dataAriaControls: 'reuse-operator-group',
                inputs: operatorGroupNames.map((operatorGroupName, index) => ({
                    id: `operator-group-${index}`,
                    name: operatorGroupName,
                    label: operatorGroupName,
                })),
                inputErrors: getErrorsByIds(['premadeOperatorGroup'], errors),
                selectIdentifier: 'premadeOperatorGroup',
            },
            {
                id: 'reuse-operator-group-no',
                name: 'reuseGroupChoice',
                value: 'No',
                label: 'No',
            },
        ],
        radioError: getErrorsByIds(['conditional-form-group'], errors),
    };
    return validDaysFieldset;
};

const ReuseOperatorGroup = ({ errors = [], fieldset, csrfToken }: ReuseOperatorGroupProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/reuseOperatorGroup" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div>
                    <h1 className="govuk-heading-l" id="reuse-operator-group-page-heading">
                        Would you like to reuse a saved list of operators that this ticket covers?
                    </h1>
                    <span className="govuk-hint" id="reuse-operator-group-hint">
                        You can reuse a saved operator group to save yourself time searching for each operator
                        individually
                    </span>
                    <RadioConditionalInput key={fieldset.heading.id} fieldset={fieldset} />
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: ReuseOperatorGroupProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const noc = getAndValidateNoc(ctx);
    const savedOperatorGroups = await getOperatorGroupsByNoc(noc);

    if (savedOperatorGroups.length === 0) {
        if (ctx.res) {
            redirectTo(ctx.res, '/searchOperators');
        } else {
            throw new Error('User has arrived at reuse operator group page with incorrect information.');
        }
    }

    const errors = getSessionAttribute(ctx.req, REUSE_OPERATOR_GROUP_ATTRIBUTE) || [];
    const operatorGroupNames = savedOperatorGroups.map(operatorGroup => operatorGroup.name);
    const fieldset: RadioConditionalInputFieldset = getFieldset(errors, operatorGroupNames);
    return { props: { errors, fieldset, csrfToken } };
};

export default ReuseOperatorGroup;
