import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';

const SubNavigation = (): ReactElement => {
    return (
        <div className="app-pane__subnav">
            <nav className="app-subnav" aria-labelledby="app-subnav-heading">
                <h2 className="govuk-visually-hidden" id="app-subnav-heading">
                    Pages in this section
                </h2>

                <ul className="app-subnav__section">
                    <li className={getNavLinkCSS('/globalSettings')}>
                        <a
                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                            href="/globalSettings"
                        >
                            Settings overview
                        </a>
                    </li>

                    <li className={getNavLinkCSS('/viewPassengerTypes')}>
                        <a
                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                            href="/viewPassengerTypes"
                        >
                            Passenger types
                        </a>
                    </li>

                    {/*<li className="app-subnav__section-item">
                        <a
                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                            href="/globalSettings"
                        >
                            Service day end
                        </a>
                    </li>*/}

                    <li className="app-subnav__section-item">
                        <a
                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                            href="/viewPurchaseMethods"
                        >
                            Purchase methods
                        </a>
                    </li>

                    <li className={getNavLinkCSS('/viewTimeRestrictions')}>
                        <a
                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                            href="/viewTimeRestrictions"
                        >
                            Time restrictions
                        </a>
                    </li>

                    {/*<li className="app-subnav__section-item">
                        <a
                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                            href="/globalSettings"
                        >
                            Multi-operator groups
                        </a>
                    </li>*/}

                    {/*<li className="app-subnav__section-item">
                        <a
                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                            href="/globalSettings"
                        >
                            Travel Zones
                        </a>
                    </li>*/}
                </ul>
            </nav>
        </div>
    );
};

const getNavLinkCSS = (pageLink: string) => {
    let cssClasses = '';
    const router = useRouter();

    const cssClassesForNonActiveItem = 'app-subnav__section-item';
    const cssClassesForActiveItem = 'app-subnav__section-item app-subnav__section-item--current';

    cssClasses = router.pathname == pageLink ? cssClassesForActiveItem : cssClassesForNonActiveItem;

    return cssClasses;
};

export default SubNavigation;
