import React, { ReactElement } from 'react';
import SettingOverview from '../components/SettingOverview';
import {
    getGroupPassengerTypesFromGlobalSettings,
    getPassengerTypesByNocCode,
    getSalesOfferPackagesByNocCode,
    getTimeRestrictionByNocCode,
} from '../data/auroradb';
import { GlobalSettingsCounts, NextPageContextWithSession } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { globalSettingsEnabled } from '../constants/featureFlag';
import { getNocFromIdToken } from '../utils';
import { extractGlobalSettingsReferer } from '../utils/globalSettings';
import { redirectTo } from './api/apiUtils';

const title = 'Operator Settings - Create Fares Data Service';
const description = 'View and access your settings in one place.';

interface GlobalSettingsProps {
    globalSettingsCounts: GlobalSettingsCounts;
    referer: string | null;
}

const GlobalSettings = ({ globalSettingsCounts, referer }: GlobalSettingsProps): ReactElement => {
    return (
        <>
            <BaseLayout title={title} description={description} showNavigation referer={referer}>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-quarter">
                        <SubNavigation />
                    </div>

                    <div className="govuk-grid-column-three-quarters">
                        <h1 className="govuk-heading-m">Settings overview</h1>
                        <p className="govuk-body-m">
                            Operators may customise the following definitions relevant to their fares or choose to use
                            default settings.
                        </p>
                        <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible"></hr>
                        <SettingOverview
                            href="/viewPassengerTypes"
                            name="Passenger types"
                            description="Define age range and required proof documents of your passengers as well as passenger groups"
                            count={globalSettingsCounts.passengerTypesCount}
                        />
                        <SettingOverview
                            href="/viewPurchaseMethods"
                            name="Purchase Methods"
                            description="Define the way your tickets are sold, including where they are bought, the payment method and format"
                            count={globalSettingsCounts.purchaseMethodsCount}
                        />
                        <SettingOverview
                            href="/viewTimeRestrictions"
                            name="Time restrictions"
                            description="Define certain days and time periods that your tickets can be used within"
                            count={globalSettingsCounts.timeRestrictionsCount}
                        />
                    </div>
                </div>
            </BaseLayout>
        </>
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

    const referer = extractGlobalSettingsReferer(ctx);

    const savedPassengerTypes = await getPassengerTypesByNocCode(noc, 'single');
    const savedGroupPassengerTypes = await getGroupPassengerTypesFromGlobalSettings(noc);
    const savedTimeRestrictions = await getTimeRestrictionByNocCode(noc);
    const purchaseMethodsCount = await getSalesOfferPackagesByNocCode(noc);

    const globalSettingsCounts: GlobalSettingsCounts = {
        passengerTypesCount: savedPassengerTypes.length + savedGroupPassengerTypes.length,
        timeRestrictionsCount: savedTimeRestrictions.length,
        purchaseMethodsCount: purchaseMethodsCount.length,
    };

    return { props: { globalSettingsCounts, referer } };
};

export default GlobalSettings;
