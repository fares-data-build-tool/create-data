import React, { ReactElement } from 'react';
import { NextPage, NextPageContext } from 'next';
import { deleteCookieOnServerSide } from '../utils';
import TwoThirdsLayout from '../layout/Layout';
import { USER_COOKIE } from '../constants';

const title = 'Reset Password Link Expired - Fares Data Build Tool';
const description = 'Reset Password Link Expired page for the Fares Data Build Tool';

const ResetLinkExpired: NextPage = (): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <h1 className="govuk-heading-l">Reset Password Link Expired</h1>
        <p className="govuk-body-l">Your password link has expired.</p>
        <a
            href="/forgotPassword"
            role="button"
            draggable="false"
            className="govuk-button"
            data-module="govuk-button"
            id="forgot-password-button"
        >
            Forgotten Password
        </a>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    deleteCookieOnServerSide(ctx, USER_COOKIE);
    return { props: {} };
};

export default ResetLinkExpired;
