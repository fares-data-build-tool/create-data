import React, { ReactElement } from 'react';

interface NavigationProps {
    activePage: string;
}

const Navigation = ({ activePage }: NavigationProps): ReactElement => (
    <nav className="app-navigation govuk-clearfix">
        <ul className="app-navigation__list app-width-container">
            <li
                className={`app-navigation__list-item ${
                    activePage === 'services' ? 'app-navigation__list-item--current' : ''
                }`}
            >
                <a
                    className="govuk-link govuk-link--no-visited-state govuk-link--no-underline app-navigation__link"
                    href="/products/services"
                    data-topnav="Operator settings"
                >
                    Services
                </a>
            </li>

            <li
                className={`app-navigation__list-item ${
                    activePage === 'operatorSettings' ? 'app-navigation__list-item--current' : ''
                }`}
            >
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
