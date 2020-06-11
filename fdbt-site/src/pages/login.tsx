import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { BaseLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { OPERATOR_COOKIE } from '../constants';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import { deleteCookieOnServerSide } from '../utils/index';
import CsrfForm from '../components/CsrfForm';

const title = 'Login - Fares data build tool';
const description = 'Login page of the Fares data build tool';

interface LoginProps {
    errors: ErrorInfo[];
}

const Login = ({ errors = [], csrfToken }: LoginProps & CustomAppProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={errors}>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <CsrfForm action="/api/login" method="post" csrfToken={csrfToken}>
                    <>
                        <ErrorSummary errors={errors} />
                        <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                            <div className="govuk-fieldset" aria-describedby="register-page-heading">
                                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                    <h1 className="govuk-fieldset__heading" id="register-type-page-heading">
                                        Sign in
                                    </h1>
                                </legend>
                                <p className="govuk-hint hint-text">
                                    Enter Fares Data Build Tool account details to sign in
                                </p>
                                <div className="govuk-form-group">
                                    <label className="govuk-label" htmlFor="email">
                                        Email
                                    </label>
                                    <FormElementWrapper errors={errors} errorId="email" errorClass="govuk-input--error">
                                        <input
                                            className="govuk-input"
                                            id="email"
                                            name="email"
                                            type="text"
                                            aria-describedby="email-hint"
                                            autoComplete="email"
                                            spellCheck="false"
                                        />
                                    </FormElementWrapper>
                                </div>
                                <div className="govuk-form-group">
                                    <label className="govuk-label" htmlFor="password">
                                        Password
                                    </label>
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId="password"
                                        errorClass="govuk-input--error"
                                    >
                                        <input
                                            className="govuk-input"
                                            id="password"
                                            name="password"
                                            type="password"
                                            aria-describedby="password-hint"
                                            spellCheck="false"
                                            autoComplete="current-password"
                                        />
                                    </FormElementWrapper>
                                </div>
                            </div>
                        </div>
                        <input
                            type="submit"
                            name="signIn"
                            value="Sign in"
                            id="sign-in-button"
                            className="govuk-button"
                        />
                    </>
                </CsrfForm>
            </div>
            <div className="govuk-grid-column-one-third">
                <div>
                    <h1 className="govuk-heading-s">Forgot your Password?</h1>
                    <a href="/forgotPassword" className="govuk-link">
                        Reset your password
                    </a>
                </div>
                <br />
                <div>
                    <h1 className="govuk-heading-s">Don&apos;t have an account?</h1>
                    <a href="/register" className="govuk-link">
                        Request access
                    </a>
                </div>
            </div>
        </div>
    </BaseLayout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[OPERATOR_COOKIE]) {
        const operatorCookie = cookies[OPERATOR_COOKIE];
        const operatorCookieParsed = JSON.parse(operatorCookie);

        if (operatorCookieParsed.errors) {
            const { errors } = operatorCookieParsed;
            deleteCookieOnServerSide(ctx, OPERATOR_COOKIE);
            return { props: { errors } };
        }
    }

    return { props: {} };
};

export default Login;
