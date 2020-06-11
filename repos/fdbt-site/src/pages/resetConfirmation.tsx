import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import { FORGOT_PASSWORD_COOKIE } from '../constants';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps } from '../interfaces';

const title = 'Reset Email Confirmation - Fares data build tool';
const description = 'Reset Email Confirmation page of the Fares data build tool';

interface ResetConfirmationProps {
    email: string;
}

const ResetConfirmation = ({ email, csrfToken }: ResetConfirmationProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={[]}>
        <CsrfForm action="/api/forgotPassword" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={[]} />
                <div className="govuk-form-group">
                    <div className="govuk-fieldset" aria-describedby="reset-confirmation-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="reset-confirmation-page-heading">
                                Reset password link has been sent
                            </h1>
                        </legend>
                    </div>
                    <p className="govuk-body">
                        If this email address exists in our system, we will send a password reset email to
                        <b>{` ${email}`}</b>.
                    </p>
                    <p className="govuk-body">
                        Check your email and follow the link within 24 hours to reset your password.
                    </p>
                    <p className="govuk-body">
                        If you cannot find the email then look in your spam or junk email folder.
                    </p>
                </div>
                <a href="/operator" role="button" draggable="false" className="govuk-button" data-module="govuk-button">
                    Home
                </a>
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): { props: ResetConfirmationProps } => {
    const cookies = parseCookies(ctx);
    const forgotPasswordCookie = cookies[FORGOT_PASSWORD_COOKIE];

    // error in case user navigates to page manually or without cookie
    if (!forgotPasswordCookie) {
        throw new Error('No forgotPasswordCookie found.');
    }

    const forgotPasswordInfo = JSON.parse(forgotPasswordCookie);

    const { email } = forgotPasswordInfo;

    // error in case user navigates to page manually
    if (!email) {
        throw new Error('No email found.');
    }

    return { props: { email } };
};

export default ResetConfirmation;
