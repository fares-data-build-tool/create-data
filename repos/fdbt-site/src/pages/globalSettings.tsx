import React, { ReactElement } from 'react';
import SettingOverview from '../components/SettingOverview';
import { NextPageContextWithSession, SettingsOverview } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { redirectTo } from './api/apiUtils';
import { getNocFromIdToken } from '../utils';
import { getPassengerTypesByNocCode } from '../data/auroradb';

const title = 'Operator Settings';
const description = 'View and access your settings in one place.';

interface GlobalSettingsProps {
    savedPassengerTypesDetails: SettingsOverview;
}

const GlobalSettings = ({ savedPassengerTypesDetails }: GlobalSettingsProps): ReactElement => {
    return (
        <BaseLayout title={title} description={description} showNavigation={true}>
            <div className="govuk-width-container">
                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-quarter">
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
                        <div className="govuk-grid-column-three-quarters">
                            <h1 className="govuk-heading-m">Settings overview</h1>
                            <p className="govuk-body-m">
                                Operators may customise the following definitions relevant to their fares or choose to
                                use default settings.
                            </p>
                            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible"></hr>
                            <SettingOverview
                                name={savedPassengerTypesDetails.name}
                                description={savedPassengerTypesDetails.description}
                                count={savedPassengerTypesDetails.count}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: GlobalSettingsProps }> => {
    const noc = getNocFromIdToken(ctx);

    if (!noc) {
        throw new Error('No NOC found for useer.');
    }

    if (process.env.STAGE === 'prod' && ctx.res) {
        redirectTo(ctx.res, '/home');
    }

    const buildPassengerTypesDetails = async (noc: string): Promise<SettingsOverview> => {
        const savedPassengerTypes = await getPassengerTypesByNocCode(noc, 'single');
        const savedGroupPassengerTypes = await getPassengerTypesByNocCode(noc, 'group');
        const totalNumberOfPassengerTypes = savedPassengerTypes.length + savedGroupPassengerTypes.length;
        return {
            name: 'Passenger types',
            description: 'Define age range and required proof documents of your passengers as well as passenger groups',
            count: totalNumberOfPassengerTypes,
        };
    };

    const savedPassengerTypesDetails = await buildPassengerTypesDetails(noc);

    return { props: { savedPassengerTypesDetails } };
};

export default GlobalSettings;
