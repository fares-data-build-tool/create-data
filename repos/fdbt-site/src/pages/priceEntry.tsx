import '../design/Pages.scss';
import React, { ReactElement } from 'react';

import Layout from '../layout/Layout';

const title = 'Price Entry - Fares data build tool';
const description = 'Price entry page of the Fares data build tool';

const PriceEntry = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/stageNames" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="selection-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">Please enter the prices of your fare stages</h1>
                        </legend>
                    </fieldset>
                </div>
                <input
                    type="submit"
                    value="Continue"
                    id="continue-button"
                    className="govuk-button govuk-button--start"
                />
            </form>
        </main>
    </Layout>
);

PriceEntry.getInitialProps = (): {} => {
    return {};
};

export default PriceEntry;
