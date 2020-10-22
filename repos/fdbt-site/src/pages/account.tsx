import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { ID_TOKEN_COOKIE } from '../constants';
import { getNocFromIdToken, getAttributeFromIdToken } from '../utils';

const title = 'Account Details - Create Fares Data Service';
const description = 'Account Details page of the Create Fares Data Service';

interface AccountDetailsProps {
    emailAddress: string;
    nocCode: string;
}

const AccountDetails = ({ emailAddress, nocCode }: AccountDetailsProps): ReactElement => {
    const passwordDots: ReactElement[] = [];
    for (let i = 0; i < 8; i += 1) {
        passwordDots.push(<span key={i} className="dot" />);
    }
    return (
        <TwoThirdsLayout title={title} description={description}>
            <div className="account-details-page">
                <h1 className="govuk-heading-xl">Account Details</h1>

                <div className="content-wrapper">
                    <p className="govuk-body govuk-!-font-weight-bold content-one-quarter">Email Address</p>
                    <p className="govuk-body email-content content-three-quarters">{emailAddress}</p>
                </div>
                <div className="content-wrapper">
                    <p className="govuk-body govuk-!-font-weight-bold content-one-quarter">Password</p>
                    <span className="password-dots">{passwordDots}</span>
                    <span className="change-password">
                        <a
                            href="/changePassword"
                            role="button"
                            draggable="false"
                            className="govuk-button"
                            data-module="govuk-button"
                            id="change-password-button"
                            aria-label="change password"
                        >
                            Change
                        </a>
                    </span>
                </div>
                <div className="content-wrapper">
                    <p className="govuk-body govuk-!-font-weight-bold content-one-quarter">Operator</p>
                    <p className="govuk-body content-three-quarters">{nocCode.replace('|', ', ')}</p>
                </div>
            </div>
            <a
                href="/home"
                role="button"
                draggable="false"
                className="govuk-button"
                data-module="govuk-button"
                id="home-button"
            >
                Home
            </a>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): { props: AccountDetailsProps } => {
    const cookies = parseCookies(ctx);
    if (!cookies[ID_TOKEN_COOKIE]) {
        throw new Error('Necessary cookies not found to show account details');
    }
    const noc = getNocFromIdToken(ctx);
    const email = getAttributeFromIdToken(ctx, 'email');

    if (!email || !noc) {
        throw new Error('Could not extract the user email address and/or noc code from their ID token');
    }
    return { props: { emailAddress: email, nocCode: noc } };
};

export default AccountDetails;
