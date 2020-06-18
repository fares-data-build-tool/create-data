import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';

const title = 'Request Access - Fares data build tool';
const description = 'Request Access page of the Fares data build tool';

const RequestAccess = (): ReactElement => (
    <BaseLayout title={title} description={description} errors={[]}>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <h1 className="govuk-heading-l" id="request-access-page-heading">
                    Request Access
                </h1>
                <p className="govuk-body">The Fares Data Build Tool is not open to public registration.</p>
                <p className="govuk-body">
                    Please contact{' '}
                    <a className="govuk-link" id="access_link" href="/contact">
                        Fares Data Build Support
                    </a>{' '}
                    to register.
                </p>
            </div>
            <div className="govuk-grid-column-one-third">
                <div>
                    <h1 className="govuk-heading-s">Already have an account?</h1>
                    <a href="/login" className="govuk-link">
                        Sign in
                    </a>
                </div>
            </div>
        </div>
    </BaseLayout>
);

export const getServerSideProps = (): {} => {
    return { props: {} };
};

export default RequestAccess;
