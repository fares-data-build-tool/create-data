import React, { ReactElement } from 'react';

const Navigation = (): ReactElement => (
    <nav className="app-navigation govuk-clearfix">
        <ul className="app-navigation__list app-width-container">
            <li className="app-navigation__list-item app-navigation__list-item--current">
                <a
                    className="govuk-link govuk-link--no-visited-state govuk-link--no-underline app-navigation__link"
                    href="/globalSettings"
                    data-topnav="Operator settings"
                >
                    Operator settings
                </a>
            </li>
        </ul>
    </nav>
);

export default Navigation;
