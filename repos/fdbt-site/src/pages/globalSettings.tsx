import React, { ReactElement } from 'react';
import SettingOverview from '../components/SettingOverview';
import { NextPageContextWithSession, SettingsOverview } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { redirectTo } from './api/apiUtils';
import { getNocFromIdToken } from '../utils';
import { getPassengerTypesByNocCode } from '../data/auroradb';
import SubNavigation from '../layout/SubNavigation';

const title = 'Operator Settings - Create Fares Data Service';
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
                            <SubNavigation />
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
