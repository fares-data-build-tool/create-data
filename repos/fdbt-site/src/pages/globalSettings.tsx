import React, { ReactElement } from 'react';
import { NextPageContextWithSession } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { checkIfMultipleOperators } from '../utils';

const title = 'Operator Settings';
const description = 'View and access your settings in one place.';

const Home = ({ multipleOperators }: HomeProps): ReactElement => (
    <BaseLayout title={title} description={description}>
        <h1 className="govuk-heading-l">Operator settings</h1>
        <p className="govuk-body">View and access your settings in one place.</p>
        <nav className="app-navigation govuk-clearfix">
            <ul className="app-navigation__list app-width-container">
                <li className="list-item">
                    <a href="/globalSettings" className="govuk-link govuk-!-font-size-19" id="created-link">
                        My Settings
                    </a>
                </li>
            </ul>
        </nav>
        <p>
            <a href="/settingsOverview" className="govuk-link govuk-!-font-size-19" id="created-link">
                Settings overview
            </a>
        </p>
        <p>
            <a href="/predefineSettings" className="govuk-link govuk-!-font-size-19" id="created-link">
                Define settings for ...
            </a>
        </p>
        <p>
            <a href="/predefinePassengerType" className="govuk-link govuk-!-font-size-19" id="created-link">
                Passenger types
            </a>
        </p>
        <p>
            <a href="/predefineServiceDay" className="govuk-link govuk-!-font-size-19" id="created-link">
                Service day end
            </a>
        </p>
        <p>
            <a href="/predefinePurchaseMethods" className="govuk-link govuk-!-font-size-19" id="created-link">
                Purchase methods
            </a>
        </p>
        <p>
            <a href="/predefineTimeRestrictions" className="govuk-link govuk-!-font-size-19" id="created-link">
                Time restrictions
            </a>
        </p>
        <p>
            <a href="/predefinePurchaseMethods" className="govuk-link govuk-!-font-size-19" id="created-link">
                Multi-operator groups
            </a>
        </p>
        <p>
            <a href="/predefineTravelZones" className="govuk-link govuk-!-font-size-19" id="created-link">
                Travel Zones
            </a>
        </p>
    </BaseLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: HomeProps } => ({
    props: { multipleOperators: checkIfMultipleOperators(ctx) },
});

export default Home;
