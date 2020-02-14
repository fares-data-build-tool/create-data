import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import Layout from '../layout/Layout';

const title = 'Error - Fares data build tool';
const description = 'Error page of the Fares data build tool';

const Error = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <h1 className="govuk-heading-xl">Sorry, there is a problem with the service</h1>
            <p className="govuk-body">Try again later.</p>
            <p className="govuk-body">Your answers have not been saved, click continue to start again.</p>
            <p className="govuk-body">Contact us with the feedback button at the top of this page for assistance.</p>
            <br />
            <a
                href="operator"
                role="button"
                draggable="false"
                className="govuk-button govuk-button--start"
                data-module="govuk-button"
            >
                Continue
            </a>
        </main>
    </Layout>
);

Error.getInitialProps = (): {} => {
    return {};
};

export default Error;
