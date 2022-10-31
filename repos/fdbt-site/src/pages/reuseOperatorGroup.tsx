import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, NextPageContextWithSession, OperatorGroup } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { REUSE_OPERATOR_GROUP_ATTRIBUTE } from '../constants/attributes';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getOperatorGroupsByNoc } from '../data/auroradb';
import OperatorGroupCard from '../components/OperatorGroupCard';

const title = 'Select Operator Group - Create Fares Data Service';
const description = 'Select Operator Group page of the Create Fares Data Service';

interface ReuseOperatorGroupProps {
    errors: ErrorInfo[];
    csrfToken: string;
    operatorGroups: OperatorGroup[];
}

const ReuseOperatorGroup = ({ errors = [], csrfToken, operatorGroups }: ReuseOperatorGroupProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/reuseOperatorGroup" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className="govuk-form-group ">
                    <fieldset className="govuk-fieldset" aria-describedby="operator-group-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="reuse-operator-group-page-heading">
                                Select a operator group
                            </h1>
                        </legend>
                        <div className="govuk-warning-text">
                            <span className="govuk-warning-text__icon govuk-!-margin-top-1" aria-hidden="true">
                                !
                            </span>
                            <strong className="govuk-warning-text__text">
                                <span className="govuk-warning-text__assistive">Warning</span>
                                You can create new operator group in your{' '}
                                <a className="govuk-link" href="/viewOperatorGroups">
                                    operator settings.
                                </a>{' '}
                                <br />
                                Don&apos;t worry you can navigate back to this page when you are finished.
                            </strong>
                        </div>
                    </fieldset>
                    {operatorGroups.length === 0 ? (
                        <>
                            <span className="govuk-body">
                                <i>You currently have no operator group</i>
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="card-row" id="individual-passengers">
                                {operatorGroups.map((operatorGroup, index) => (
                                    <OperatorGroupCard
                                        index={index}
                                        operatorGroup={operatorGroup}
                                        key={operatorGroup.id.toString()}
                                        defaultChecked={false}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                {!!operatorGroups.length && (
                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button govuk-!-margin-right-2"
                    />
                )}
                <a className="govuk-button govuk-button--secondary" href="/viewOperatorGroups">
                    Create new
                </a>
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: ReuseOperatorGroupProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const noc = getAndValidateNoc(ctx);
    const operatorGroups = await getOperatorGroupsByNoc(noc);

    const errors = getSessionAttribute(ctx.req, REUSE_OPERATOR_GROUP_ATTRIBUTE) || [];

    return { props: { errors, csrfToken, operatorGroups } };
};

export default ReuseOperatorGroup;
