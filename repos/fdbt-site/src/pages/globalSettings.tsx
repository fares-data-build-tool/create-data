import React, { ReactElement } from 'react';
import SettingOverview from '../components/SettingOverview';
import { GlobalSettingsCounts, NextPageContextWithSession } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { redirectTo } from './api/apiUtils';
import { getNocFromIdToken } from '../utils';
import {
    getGroupPassengerTypesFromGlobalSettings,
    getPassengerTypesByNocCode,
    getTimeRestrictionByNocCode,
} from '../data/auroradb';
import SubNavigation from '../layout/SubNavigation';
import { globalSettingsEnabled } from '../constants/featureFlag';

const title = 'Operator Settings - Create Fares Data Service';
const description = 'View and access your settings in one place.';

interface GlobalSettingsProps {
    globalSettingsCounts: GlobalSettingsCounts;
}

const GlobalSettings = ({ globalSettingsCounts }: GlobalSettingsProps): ReactElement => {
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
                                href="/viewPassengerTypes"
                                name="Passenger types"
                                description="Define age range and required proof documents of your passengers as well as passenger groups"
                                count={globalSettingsCounts.passengerTypesCount}
                            />
                            <SettingOverview
                                href="/viewTimeRestrictions"
                                name="Time restrictions"
                                description="Define certain days and time periods that your tickets can be used within"
                                count={globalSettingsCounts.timeRestrictionsCount}
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

    if (!globalSettingsEnabled && ctx.res) {
        redirectTo(ctx.res, '/home');
    }

    const savedPassengerTypes = await getPassengerTypesByNocCode(noc, 'single');
    const savedGroupPassengerTypes = await getGroupPassengerTypesFromGlobalSettings(noc);
    const passengerTypesCount = savedPassengerTypes.length + savedGroupPassengerTypes.length;

    const savedTimeRestrictions = await getTimeRestrictionByNocCode(noc);
    const timeRestrictionsCount = savedTimeRestrictions.length;

    const globalSettingsCounts: GlobalSettingsCounts = {
        passengerTypesCount,
        timeRestrictionsCount,
    };

    return { props: { globalSettingsCounts } };
};

export default GlobalSettings;
