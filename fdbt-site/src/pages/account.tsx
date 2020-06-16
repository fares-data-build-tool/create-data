import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { decode } from 'jsonwebtoken';
import TwoThirdsLayout from '../layout/Layout';
import { ID_TOKEN_COOKIE } from '../constants';
import { CognitoIdToken } from '../interfaces';

const title = 'Account Details - Fares Data Build Tool';
const description = 'Account Details page of the Fares Data Build Tool';

interface AccountDetailsProps {
    emailAddress: string;
    nocCode: string;
}

const AccountDetails = ({ emailAddress, nocCode }: AccountDetailsProps): ReactElement => {
    const passwordDots: ReactElement[] = [];
    for (let i = 0; i < 8; i += 1) {
        passwordDots.push(<span className="dot" />);
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
                        >
                            Change
                        </a>
                    </span>
                </div>
                <div className="content-wrapper">
                    <p className="govuk-body govuk-!-font-weight-bold content-one-quarter">Operator</p>
                    <p className="govuk-body content-three-quarters">{nocCode}</p>
                </div>
            </div>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): { props: AccountDetailsProps } => {
    const cookies = parseCookies(ctx);
    if (!cookies[ID_TOKEN_COOKIE]) {
        throw new Error('Necessary cookies not found to show account details');
    }
    const idToken = cookies[ID_TOKEN_COOKIE];
    const decodedIdToken = decode(idToken) as CognitoIdToken;
    if (!decodedIdToken.email || !decodedIdToken['custom:noc']) {
        throw new Error('Could not extract the user email address and/or noc code from their ID token');
    }
    return { props: { emailAddress: decodedIdToken.email, nocCode: decodedIdToken['custom:noc'] } };
};

export default AccountDetails;
