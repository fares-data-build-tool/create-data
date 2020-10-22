import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FORGOT_PASSWORD_COOKIE } from '../constants';
import CsrfForm from '../components/CsrfForm';

const title = 'Forgot Password - Create Fares Data Service';
const description = 'Forgot Password page of the Create Fares Data Service';
const id = 'email';

interface ForgotEmailProps {
    email: string;
    errors: ErrorInfo[];
}

const ForgotPassword = ({ email, errors = [], csrfToken }: ForgotEmailProps & CustomAppProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={errors}>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <CsrfForm action="/api/forgotPassword" method="post" csrfToken={csrfToken}>
                    <>
                        <ErrorSummary errors={errors} />
                        <div className="govuk-form-group">
                            <h1 className="govuk-heading-l" id="forgot-password-heading">
                                Forgot your Password?
                            </h1>
                            <p className="govuk-hint hint-text">
                                Enter your email address to reset your password. The link you will be emailed will only
                                be usable for one hour.
                            </p>
                            <label className="govuk-label" htmlFor="email">
                                Email address
                            </label>
                            <div className="govuk-form-group">
                                <FormElementWrapper errors={errors} errorId={id} errorClass="govuk-input--error">
                                    <input
                                        className="govuk-input"
                                        id="email"
                                        name="email"
                                        type="text"
                                        autoComplete="email"
                                        spellCheck="false"
                                        defaultValue={email}
                                    />
                                </FormElementWrapper>
                            </div>
                        </div>
                        <input
                            type="submit"
                            name="continue"
                            value="Continue"
                            id="continue-button"
                            className="govuk-button"
                        />
                    </>
                </CsrfForm>
            </div>
            <div className="govuk-grid-column-one-third">
                <p>
                    <h2 className="govuk-heading-s">Don&#39;t have an account?</h2>
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
