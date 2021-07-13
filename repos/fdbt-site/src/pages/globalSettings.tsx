import React, { ReactElement } from 'react';
import { NextPageContextWithSession } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { redirectTo } from './api/apiUtils';

const title = 'Operator Settings';
const description = 'View and access your settings in one place.';

const GlobalSettings = (): ReactElement => (
    <BaseLayout title={title} description={description} showNavigation={true}>
        <div className="govuk-width-container">
            <main className="govuk-main-wrapper">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-third">
                        <div className="app-pane__subnav">
                            <nav className="app-subnav" aria-labelledby="app-subnav-heading">
                                <h2 className="govuk-visually-hidden" id="app-subnav-heading">
                                    Pages in this section
                                </h2>

                                <ul className="app-subnav__section">
                                    <li className="app-subnav__section-item app-subnav__section-item--current">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Settings overview
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Passenger types
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Service day end
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Purchase methods
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Time restrictions
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Multi-operator groups
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Travel Zones
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="govuk-grid-column-two-thirds">
                        <h1 className="govuk-heading-xl">Operator Settings</h1>
                        <p className="govuk-body">This is a paragraph inside a two-thirds wide column</p>
                    </div>
                </div>
            </main>
        </div>
    </BaseLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: {} } => {
    if (process.env.STAGE === 'prod' && ctx.res) {
        redirectTo(ctx.res, '/home');
    }

    return { props: {} };
};

export default GlobalSettings;
