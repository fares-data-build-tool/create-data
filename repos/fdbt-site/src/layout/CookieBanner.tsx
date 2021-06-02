import Cookies, { CookieSetOptions } from 'universal-cookie';
import React, { ReactElement, useEffect, useState } from 'react';
import { COOKIES_POLICY_COOKIE, COOKIE_PREFERENCES_COOKIE, oneYearInSeconds } from '../constants';

interface CookieBannerMessageProps {
    handleClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const CookieBannerMessage = ({ handleClick }: CookieBannerMessageProps): ReactElement => (
    <div id="global-cookie-message" className="cookie-banner" role="region" aria-label="cookie banner">
        <div className="govuk-width-container">
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <div className="cookie-banner__message">
                        <h2 className="govuk-heading-m">Tell us whether you accept cookies</h2>
                        <p className="govuk-body">
                            We use&nbsp;
                            <a className="govuk-link" href="/cookieDetails">
                                cookies to collect information
                            </a>
                            &nbsp; about how you use the Create Fares Data Service. We use this information to make the
                            website work as well as possible and to improve the service.
                        </p>
                    </div>
                    {handleClick && (
                        <div className="cookie-banner__button cookie-banner__accept-all">
                            <button
                                className="govuk-button cookie-banner__button--inline"
                                id="accept-all-button"
                                type="button"
                                onClick={handleClick}
                            >
                                Accept All
                            </button>
                        </div>
                    )}

                    <div className="cookie-banner__button">
                        <a
                            id="set-cookie-preferences-link"
                            className="govuk-button cookie-banner__button--inline"
                            role="button"
                            href="/cookies"
                        >
                            Set cookie preferences
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CookieBanner = (): ReactElement | null => {
    const [cookiesAccepted, setCookiesAccepted] = useState(false);
    const [hideBanner, setHideBanner] = useState(true);

    useEffect(() => {
        const cookies = new Cookies();
        const cookiePreferences = cookies.get(COOKIE_PREFERENCES_COOKIE);

        if (!cookiePreferences || cookiePreferences === 'false') {
            setHideBanner(false);
        }
    });

    const handleAcceptAllClick = (): void => {
        const cookies = new Cookies();
        const cookieOptions: CookieSetOptions = {
            maxAge: oneYearInSeconds,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
            path: '/',
        };

        cookies.set(COOKIE_PREFERENCES_COOKIE, 'true', { ...cookieOptions });
        cookies.set(COOKIES_POLICY_COOKIE, JSON.stringify({ essential: true, usage: true }), {
            ...cookieOptions,
        });

        setCookiesAccepted(true);
    };

    const handleHideClick = (): void => {
        setHideBanner(true);
    };

    if (hideBanner) {
        return null;
    }

    if (cookiesAccepted) {
        return (
            <div id="cookies-accepted-message" className="cookie-banner" role="region" aria-label="cookie banner">
                <div className="govuk-width-container">
                    <p role="alert">
                        You’ve accepted all cookies. You can{' '}
                        <a className="govuk-link" href="/cookies">
                            change your cookie settings
                        </a>{' '}
                        at any time.
                    </p>
                    <button className="govuk-link cookie-banner__hide" type="button" onClick={handleHideClick}>
                        Hide
                    </button>
                </div>
            </div>
        );
    }

    return <CookieBannerMessage handleClick={handleAcceptAllClick} />;
};

export default CookieBanner;
