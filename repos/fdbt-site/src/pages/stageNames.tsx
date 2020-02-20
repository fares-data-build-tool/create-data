import '../design/Pages.scss';
import React from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = '';
const description = '';

const StageNames: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/matching" method="post" encType="multipart/form-data">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">Stage Names</h1>
                        </legend>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="submit-button" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

StageNames.getInitialProps = (): {} => {
    return {};
};

export default StageNames;
