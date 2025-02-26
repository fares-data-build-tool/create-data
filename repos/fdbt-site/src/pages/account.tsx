import React, { ReactElement, useState } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { ID_TOKEN_COOKIE } from '../constants';
import { getNocFromIdToken, getAttributeFromIdToken, getCsrfToken } from '../utils';
import { ErrorInfo } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';

const title = 'Account Details - Create Fares Data Service';
const description = 'Account Details page of the Create Fares Data Service';

interface AccountDetailsProps {
    emailAddress: string;
    nocCode: string;
    csrfToken: string;
    multiOperatorEmailPreference: boolean;
}

const AccountDetails = ({
    emailAddress,
    nocCode,
    csrfToken,
    multiOperatorEmailPreference,
}: AccountDetailsProps): ReactElement => {
    const [multiOpEmailPreference, setMultiOpEmailPreference] = useState(multiOperatorEmailPreference);
    const [errors, setErrors] = useState<ErrorInfo[]>([]);
    const passwordDots: ReactElement[] = [];
    for (let i = 0; i < 8; i += 1) {
        passwordDots.push(<span key={i} className="dot" />);
    }

    const updateEmailPreference = async (emailPreference: boolean) => {
        setMultiOpEmailPreference(emailPreference);

        const url = new URL('/api/updateUserAttribute', window.location.origin);

        if (csrfToken) {
            url.searchParams.append('_csrf', csrfToken);
        }

        const res = await fetch(url.toString(), {
            method: 'POST',
            headers: csrfToken
                ? {
                      'Content-Type': 'application/json',
                      'X-CSRF-TOKEN': csrfToken,
                  }
                : { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                attributeName: 'custom:multiOpEmailEnabled',
                attributeValue: emailPreference ? 'true' : 'false',
            }),
        });
        if (!res.ok) {
            setMultiOpEmailPreference(!emailPreference);
            setErrors([
                {
                    id: 'multiOpEmailPref',
                    errorMessage: 'Retry changing email preferences later',
                },
            ]);
        } else {
            setErrors([]);
        }
    };

    return (
        <TwoThirdsLayout title={title} description={description}>
            <ErrorSummary errors={errors} />
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
                <div className="content-wrapper govuk-!-margin-bottom-8">
                    <p className="govuk-body govuk-!-font-weight-bold content-one-quarter">Operator</p>
                    <p className="govuk-body content-three-quarters">{nocCode.replace(/\|/g, ', ')}</p>
                </div>

                <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <p className="govuk-heading-m">Email notifications</p>
                        <p className="govuk-heading-s">Multi-operator fare alerts</p>
                    </legend>
                    <div className="govuk-radios govuk-radios--inline ml-auto" data-module="govuk-radios">
                        <div className="govuk-radios__item">
                            <input
                                className="govuk-radios__input"
                                id="multiOpEmailPref-on"
                                name="multiOpEmailPref"
                                type="radio"
                                value="on"
                                checked={multiOpEmailPreference}
                                onChange={async () => {
                                    await updateEmailPreference(true);
                                }}
                            />
                            <label className="govuk-label govuk-radios__label" htmlFor="multiOpEmailPref-on">
                                On
                            </label>
                        </div>
                        <div className="govuk-radios__item">
                            <input
                                className="govuk-radios__input"
                                id="multiOpEmailPref-off"
                                name="multiOpEmailPref"
                                type="radio"
                                checked={!multiOpEmailPreference}
                                value="off"
                                onChange={async () => {
                                    await updateEmailPreference(false);
                                }}
                            />
                            <label className="govuk-label govuk-radios__label" htmlFor="multiOpEmailPref-off">
                                Off
                            </label>
                        </div>
                    </div>
                </fieldset>
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
        throw new Error('Necessary attributes not found to show account details');
    }
    const noc = getNocFromIdToken(ctx);
    const email = getAttributeFromIdToken(ctx, 'email');
    const multiOperatorEmailPreference = getAttributeFromIdToken(ctx, 'custom:multiOpEmailPref');

    if (!email || !noc) {
        throw new Error('Could not extract the user email address and/or noc code from their ID token');
    }

    return {
        props: {
            emailAddress: email,
            nocCode: noc,
            csrfToken: getCsrfToken(ctx),
            multiOperatorEmailPreference: multiOperatorEmailPreference ?? false,
        },
    };
};

export default AccountDetails;
