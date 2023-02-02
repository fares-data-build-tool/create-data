import React, { ReactElement } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { ErrorInfo } from '../interfaces';

const title = 'Caps - Create Fares Data Service';
const description = 'View and edit your caps.';

interface CapProps {
    viewCapErrors: ErrorInfo[];
}

const ViewCap = ({ viewCapErrors = [] }: CapProps): ReactElement => {
    return (
        <BaseLayout title={title} description={description} showNavigation>
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

                <div>
                    <h2 className="govuk-heading-l">Cap Expiry</h2>
                    {true ? (
                        <CapExpiry />
                    ) : (
                        <p className="govuk-body">
                            <em>You currently have not set up cap expiry.</em>
                        </p>
                    )}

                    <a className="govuk-button" data-module="govuk-button" href="/selectCapValidity">
                        Add cap expiry
                    </a>
                </div>
            </div>
        </BaseLayout>
    );
};

const CapExpiry = (): ReactElement => {
    return (
        <>
            <div>
                <p>At the end of a calendar day</p>
            </div>
        </>
    );
};

export const getServerSideProps = (): { props: CapProps } => {
    return {
        props: {
            viewCapErrors: [],
        },
    };
};

export default ViewCap;
