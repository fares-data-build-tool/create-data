import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { BaseLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { USER_COOKIE } from '../constants';
import { ErrorInfo } from '../interfaces';
import { redirectTo } from './api/apiUtils';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';

const title = 'Register - Create Fares Data Service';
const description = 'Register page of the Create Fares Data Service';

interface RegisterProps {
    errors: ErrorInfo[];
    regKey: string;
    csrfToken: string;
}

const Register = ({ errors, regKey, csrfToken }: RegisterProps): ReactElement => {
    let email = '';
    let nocCode = '';

    errors?.forEach((input: ErrorInfo) => {
        if (input.id === 'email') {
            email = input.userInput ?? '';
        } else if (input.id === 'nocCode') {
            nocCode = input.userInput ?? '';
        }
    });

    return (
        <BaseLayout title={title} description={description} errors={errors}>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <CsrfForm action="/api/register" method="post" csrfToken={csrfToken}>
                        <>
                            <ErrorSummary errors={errors} />
                            <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                                <fieldset className="govuk-fieldset" aria-describedby="register-page-heading">
                                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                        <h1 className="govuk-fieldset__heading" id="register-page-heading">
                                            Create an account
                                        </h1>
                                    </legend>
                                    <p className="govuk-hint hint-text">Enter your details to create an account</p>
                                    <div className="govuk-form-group">
                                        <label className="govuk-label" htmlFor="email" id="email-label">
                                            Enter email address
                                        </label>
                                        <FormElementWrapper
                                            errors={errors}
                                            errorId="email"
                                            errorClass="govuk-input--error"
                                        >
                                            <input
                                                className="govuk-input"
                                                id="email"
                                                name="email"
                                                type="text"
                                                aria-describedby="email-label"
                                                autoComplete="email"
                                                spellCheck="false"
                                                defaultValue={email}
                                            />
                                        </FormElementWrapper>
                                    </div>

                                    <div className="govuk-form-group">
                                        <label className="govuk-label" htmlFor="password">
                                            Create password
                                        </label>
                                        <span id="password-hint" className="govuk-hint">
                                            Your password should be at least 8 characters long.
                                        </span>
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
                                                autoComplete="new-password"
                                            />
                                        </FormElementWrapper>
                                    </div>

                                    <div className="govuk-form-group">
                                        <label
                                            className="govuk-label"
                                            htmlFor="confirm-password"
                                            id="confirm-password-label"
                                        >
                                            Confirm your password
                                        </label>
                                        <input
                                            className="govuk-input"
                                            id="confirm-password"
                                            name="confirmPassword"
                                            type="password"
                                            aria-describedby="confirm-password-label"
                                            spellCheck="false"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div className="govuk-form-group">
                                        <label className="govuk-label" htmlFor="noc-code" id="noc-code-label">
                                            Enter National Operator Code
                                        </label>
                                        <FormElementWrapper
                                            errors={errors}
                                            errorId="noc-code"
                                            errorClass="govuk-input--error"
                                        >
                                            <input
                                                className="govuk-input"
                                                id="noc-code"
                                                name="nocCode"
                                                type="text"
                                                aria-describedby="noc-code-label"
                                                spellCheck="false"
                                                defaultValue={nocCode}
                                            />
                                        </FormElementWrapper>
                                    </div>
                                    <p className="govuk-body govuk-!-margin-top-5">
                                        By using this website, you agree to the&nbsp;
                                        <a href="https://www.gov.uk/help/privacy-notice" className="govuk-link">
                                            Privacy
                                        </a>
                                        &nbsp;and&nbsp;
                                        <a href="https://www.gov.uk/help/cookies" className="govuk-link">
                                            Cookies
                                        </a>
                                        &nbsp;policies
                                    </p>
                                    <div className="govuk-checkboxes">
                                        <div className="govuk-checkboxes__item">
                                            <input
                                                className="govuk-checkboxes__input"
                                                id="checkbox-user-research"
                                                name="contactable"
                                                type="checkbox"
                                                value="yes"
                                                aria-describedby="checkbox-user-research-label"
                                            />
                                            <label
                                                id="checkbox-user-research-label"
                                                className="govuk-label govuk-checkboxes__label"
                                                htmlFor="checkbox-user-research"
                                            >
                                                If you are willing to be contacted as part of user research, please tick
                                                this box.
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <input
                                type="submit"
                                name="createAccount"
                                value="Create account"
                                id="create-account-button"
                                className="govuk-button"
                            />
                            <input value={regKey} type="hidden" name="regKey" />
                        </>
                    </CsrfForm>
                </div>
                <div className="govuk-grid-column-one-thirds">
                    <h2 className="govuk-heading-m">Already have an account?</h2>
                    <a href="/login" className="govuk-link">
                        Sign in
                    </a>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): { props: RegisterProps } => {
    const csrfToken = getCsrfToken(ctx);
    const cookies = parseCookies(ctx);
    const userCookie = cookies[USER_COOKIE];

    const errors: ErrorInfo[] = [];

    const { key } = ctx.query;

    if (!key && ctx.res) {
        redirectTo(ctx.res, '/requestAccess');
    }

    if (userCookie) {
        const userCookieParsed = JSON.parse(userCookie);
        const { inputChecks } = userCookieParsed;

        return { props: { errors: inputChecks, regKey: key as string, csrfToken } };
    }

    return { props: { errors, regKey: key as string, csrfToken } };
};

export default Register;
