import React, { ReactElement } from 'react';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import InformationSummary from '../components/InformationSummary';
// import FormElementWrapper from '../components/FormElementWrapper';
import { MANAGE_OPERATOR_GROUP_ERRORS_ATTRIBUTE } from '../constants/attributes';
import { getOperatorGroupByNocAndId } from '../data/auroradb';
import { NextPageContextWithSession, OperatorGroup } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import { getGlobalSettingsManageProps, GlobalSettingsManageProps } from '../utils/globalSettings';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Manage Operator Groups - Create Fares Data Service';
const description = 'Manage Operator Group page of the Create Fares Data Service';

const editingInformationText = 'Editing and saving new changes will be applied to all fares using this operator group.';

type ManageOperatorGroupsProps = GlobalSettingsManageProps<OperatorGroup>;

const ManageOperatorGroups = ({
    editMode,
    csrfToken,
    errors = [],
    inputs,
}: ManageOperatorGroupsProps): ReactElement => {
    const id = inputs?.id;
    // const name = inputs?.name;
    // const operators = inputs?.;

    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/manageOperatorGroup" method="post" csrfToken={csrfToken}>
                <>
                    {editMode && errors.length === 0 ? (
                        <InformationSummary informationText={editingInformationText} />
                    ) : null}
                    <ErrorSummary errors={errors} />

                    <input type="hidden" name="id" value={id} />

                    <h1 className="govuk-heading-l" id="define-operator-group-page-heading">
                        Provide operator group details
                    </h1>

                    <input
                        type="submit"
                        value={`${editMode ? 'Update' : 'Add'} operator group`}
                        id="continue-button"
                        className="govuk-button"
                        disabled
                    />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

// const hasError = (errors: ErrorInfo[], name: string) => {
//     if (errors.filter((e) => e.id === name).length > 0) {
//         return ' govuk-form-group--error';
//     }

//     return '';
// };

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: ManageOperatorGroupsProps }> => {
    const userInputsAndErrors = getSessionAttribute(ctx.req, MANAGE_OPERATOR_GROUP_ERRORS_ATTRIBUTE);

    return getGlobalSettingsManageProps(ctx, getOperatorGroupByNocAndId, userInputsAndErrors);
};

export default ManageOperatorGroups;
