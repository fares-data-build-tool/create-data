import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { TwoThirdsLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { USER_COOKIE } from '../constants';
import { CustomAppProps, ErrorInfo } from '../interfaces';
import CsrfForm from '../components/CsrfForm';

const title = 'Change Password - Create Fares Data Service';
const description = 'Change Password page of the Create Fares Data Service';

interface ChangePasswordProps {
    errors: ErrorInfo[];
}

const ChangePassword = ({ errors, csrfToken }: ChangePasswordProps & CustomAppProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/changePassword" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="change-password-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="change-password-page-heading">
                                    Change your password
                                </h1>
                            </legend>
                            <p className="govuk-hint hint-text" id="change-password-page-hint">
                                Your password should be at least 8 characters long
                            </p>

                            <div className="govuk-form-group">
                                <label className="govuk-label" htmlFor="old-password">
                                    Old password
                                </label>
                                <FormElementWrapper
                                    errors={errors}
                                    errorId="old-password"
                                    errorClass="govuk-input--error"
                                >
                                    <input
                                        className="govuk-input"
                                        id="old-password"
                                        name="oldPassword"
                                        type="password"
                                        aria-describedby="change-password-page-hint"
                                        spellCheck="false"
                                    />
                                </FormElementWrapper>
                            </div>

                            <div className="govuk-form-group">
                                <label className="govuk-label" htmlFor="new-password">
                                    New password
                                </label>
                                <FormElementWrapper
                                    errors={errors}
                                    errorId="new-password"
                                    errorClass="govuk-input--error"
                                >
                                    <input
                                        className="govuk-input"
                                        id="new-password"
                                        name="newPassword"
                                        type="password"
                                        aria-describedby="change-password-page-hint"
                                        spellCheck="false"
                                    />
                                </FormElementWrapper>
                            </div>

                            <div className="govuk-form-group">
                                <label className="govuk-label" htmlFor="confirm-new-password">
                                    Confirm new password
                                </label>
                                <FormElementWrapper
                                    errors={errors}
                                    errorId="confirm-new-password"
                                    errorClass="govuk-input--error"
                                >
                                    <input
                                        className="govuk-input"
                                        id="confirm-new-password"
                                        name="confirmNewPassword"
                                        type="password"
                                        aria-describedby="change-password-page-hint"
                                        spellCheck="false"
                                    />
                                </FormElementWrapper>
                            </div>
                        </fieldset>
                    </div>
                    <input
                        type="submit"
                        name="changePassword"
                        value="Change Password"
                        id="change-password-button"
                        data-module="govuk-button"
                        className="govuk-button govuk-!-margin-right-1"
                    />
                    <a
                        href="/account"
                        role="button"
                        draggable="false"
                        className="govuk-button govuk-button--secondary"
                        data-module="govuk-button"
                        id="cancel-change-password-button"
                    >
                        Cancel
                    </a>
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): { props: ChangePasswordProps } => {
    const cookies = parseCookies(ctx);
    const userCookie = cookies[USER_COOKIE];
    const errors: ErrorInfo[] = [];
    if (userCookie) {
        const { inputChecks } = JSON.parse(userCookie);
        inputChecks.map((check: ErrorInfo) => {
            if (check.errorMessage) {
                errors.push({ id: check.id, errorMessage: check.errorMessage });
            }
            return errors;
        });
    }
    return { props: { errors } };
};

export default ChangePassword;
