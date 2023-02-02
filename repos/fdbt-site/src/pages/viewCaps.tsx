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
            </div>
        </BaseLayout>
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
