import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';

interface NavigationProps {
    exportEnabled: boolean;
}

const Navigation = ({ exportEnabled }: NavigationProps): ReactElement => (
    <nav className="app-navigation govuk-clearfix">
        <ul className="app-navigation__list app-width-container">
            <li
                className={`app-navigation__list-item ${
                    isActivePage(['products/services']) ? 'app-navigation__list-item--current' : ''
                }`}
            >
                <a
                    className="govuk-link govuk-link--no-visited-state govuk-link--no-underline app-navigation__link"
                    href="/products/services"
                    data-topnav="Services"
                >
                    Services
                </a>
            </li>

            <li
                className={`app-navigation__list-item ${
                    isActivePage(['products/otherProducts']) ? 'app-navigation__list-item--current' : ''
                }`}
            >
                <a
                    className="govuk-link govuk-link--no-visited-state govuk-link--no-underline app-navigation__link"
                    href="/products/otherProducts"
                    data-topnav="Other Products"
                >
                    Other products
                </a>
            </li>

            {exportEnabled && (
                <li
                    className={`app-navigation__list-item ${
                        isActivePage(['products/exports']) ? 'app-navigation__list-item--current' : ''
                    }`}
                >
                    <a
                        className="govuk-link govuk-link--no-visited-state govuk-link--no-underline app-navigation__link"
                        href="/products/exports"
                        data-topnav="Exports"
                    >
                        Export your data
                    </a>
                </li>
            )}

            <li
                className={`app-navigation__list-item ${
                    isActivePage([
                        'globalSettings',
                        'viewPassengerTypes',
                        'viewPurchaseMethods',
                        'viewTimeRestrictions',
                        'manageFareDayEnd',
                        'manageOperatorDetails',
                    ])
                        ? 'app-navigation__list-item--current'
                        : ''
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

const isActivePage = (pages: string[]): boolean => {
    const router = useRouter();
    const currentPath = router.pathname;

    const result = pages.filter((p) => {
        return currentPath.includes(p);
    });

    return result.length > 0;
};

export default Navigation;
