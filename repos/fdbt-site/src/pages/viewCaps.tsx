import React, { ReactElement } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { extractGlobalSettingsReferer } from '../utils/globalSettings';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';

const title = 'Caps - Create Fares Data Service';
const description = 'View and edit your caps.';

interface CapProps {
    referer: string | null;
    viewCapErrors: ErrorInfo[];
}

const ViewCap = ({ referer, viewCapErrors = [] }: CapProps): ReactElement => {
    return (
        <BaseLayout title={title} description={description} showNavigation referer={referer}>
            <div>
                <ErrorSummary errors={viewCapErrors} />
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-quarter">
                    <SubNavigation />
                </div>

                <div className="govuk-grid-column-three-quarters">
                    <h1 className="govuk-heading-xl">Caps</h1>
                    <p className="govuk-body govuk-!-margin-bottom-8">
                        Define your different types of caps and their expiries
                    </p>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: CapProps } => {
    return {
        props: {
            referer: extractGlobalSettingsReferer(ctx),
            viewCapErrors: [],
        },
    };
};

export default ViewCap;
