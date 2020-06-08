import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { ErrorInfo } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FORGOT_PASSWORD_COOKIE } from '../constants';

const title = 'Forgot Password - Fares data build tool';
const description = 'Forgot Password page of the Fares data build tool';
const id = 'email';

interface ForgotEmailProps {
    email: string;
    errors: ErrorInfo[];
}

const ForgotPassword = ({ email, errors = [] }: ForgotEmailProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={errors}>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <form action="/api/forgotPassword" method="post">
                    <ErrorSummary errors={errors} />
                    <div className="govuk-form-group">
                        <div className="govuk-fieldset" aria-describedby="forgot-password-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="forgot-password-heading">
                                    Forgot your Password?
                                </h1>
                            </legend>
                            <p className="govuk-hint hint-text" id="hint-text">
                                Enter your email address to reset your password
                            </p>
                            <label className="govuk-label govuk-visually-hidden" htmlFor="email">
                                Enter email address
                            </label>
                            <div className="govuk-form-group">
                                <FormElementWrapper errors={errors} errorId={id} errorClass="govuk-input--error">
                                    <input
                                        className="govuk-input"
                                        id="email"
                                        name="email"
                                        type="text"
                                        aria-describedby="hint-text"
                                        autoComplete="email"
                                        spellCheck="false"
                                        defaultValue={email}
                                    />
                                </FormElementWrapper>
                            </div>
                        </div>
                    </div>
                    <input
                        type="submit"
                        name="continue"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button"
                    />
                </form>
            </div>
            <div className="govuk-grid-column-one-third">
                <p>
                    <h1 className="govuk-heading-s">Don&#39;t have an account?</h1>
                    <a href="/register" className="govuk-link">
                        Request Access
                    </a>
                </p>
            </div>
        </div>
    </BaseLayout>
);

export const getServerSideProps = (ctx: NextPageContext): { props: ForgotEmailProps } => {
    const cookies = parseCookies(ctx);
    const forgotPasswordCookie = cookies[FORGOT_PASSWORD_COOKIE];

    if (forgotPasswordCookie) {
        const forgotPasswordInfo = JSON.parse(forgotPasswordCookie);

        const { error, email } = forgotPasswordInfo;

        if (error && email) {
            return { props: { errors: [{ errorMessage: error, id }], email } };
        }

        if (error) {
            return { props: { errors: [{ errorMessage: error, id }], email: '' } };
        }
    }

    return { props: { errors: [], email: '' } };
};

export default ForgotPassword;
