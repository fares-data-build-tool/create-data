import '../design/Pages.scss';
import React from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = 'Matching - Fares data build tool';
const description = 'Matching page of the Fares data build tool';

const Matching: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/matching" method="post" encType="multipart/form-data">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">Matching page</h1>
                        </legend>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="submit-button" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

Matching.getInitialProps = (): {} => {
    return {};
};

export default Matching;
