import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { deleteCookieOnServerSide } from '../utils';
import { USER_COOKIE } from '../constants';

const title = 'Password Updated - Fares Data Build Tool';
const description = 'Password Updated page of the Fares Data Build Tool';

interface PasswordUpdatedProps {
    redirectTo: string;
}

const PasswordUpdated = ({ redirectTo }: PasswordUpdatedProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <h1 className="govuk-heading-l">Password Updated</h1>
        <p className="govuk-body-l">Your password has been updated successfully</p>
        <a
            href={redirectTo}
            role="button"
            draggable="false"
            className="govuk-button"
            data-module="govuk-button"
            id="continue-button"
        >
            Continue
        </a>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const userCookie = cookies[USER_COOKIE];
    let redirectFrom = '';
    if (userCookie) {
        redirectFrom = JSON.parse(userCookie).redirectFrom;
    }
    const redirectTo = redirectFrom && redirectFrom === '/resetPassword' ? '/login' : '/account';
    deleteCookieOnServerSide(ctx, USER_COOKIE);
    return { props: { redirectTo } };
};

export default PasswordUpdated;
