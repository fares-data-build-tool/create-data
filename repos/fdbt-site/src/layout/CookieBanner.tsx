import React, { FC } from 'react';

const CookieBanner: FC = () => (
    <div id="global-cookie-message" className="cookie-banner" role="region" aria-label="cookie banner">
        <div className="govuk-width-container">
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <div className="cookie-banner__message">
                        <h2 className="govuk-heading-m">Tell us whether you accept cookies</h2>
                        <p className="govuk-body">
                            We use{' '}
                            <a className="govuk-link" href="/cookieDetails">
                                cookies to collect information
                            </a>{' '}
                            about how you use the Create Fares Data Service. We use this information to make the website
                            work as well as possible and to improve the service.
                        </p>
                    </div>
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

export default CookieBanner;
