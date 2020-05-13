import React, { ReactElement } from 'react';
import Layout from '../layout/Layout';
import { FEEDBACK_LINK } from '../constants';

const title = 'Page not found - Fares data build tool';
const description = 'Page not found page of the Fares data build tool';

const PageNotFound = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <div>
                        <h1 className="govuk-heading-xl">Page not found</h1>
                        <p className="govuk-body">If you typed the web address, check it is correct.</p>
                        <p className="govuk-body">
                            If you pasted the web address, check you copied the entire address.
                        </p>
                        <p className="govuk-body">
                            If the web address is correct or you selected a link or button,{' '}
                            <a className="govuk-link" id="feedback_link" href={FEEDBACK_LINK}>
                                contact
                            </a>{' '}
                            us about your fares data.
                        </p>
                    </div>
                    <br />
                    <a
                        href="/operator"
                        role="button"
                        draggable="false"
                        className="govuk-button"
                        data-module="govuk-button"
                    >
                        Start again
                    </a>
                </div>
            </div>
        </main>
    </Layout>
);

export default PageNotFound;
