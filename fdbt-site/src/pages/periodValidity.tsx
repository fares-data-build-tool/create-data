import React, { ReactElement } from 'react';
import Layout from '../layout/Layout';

const title = 'Select the rule for how long the ticket is valid for - Fares data build tool';
const description = 'Period ticket rule page of the Fares data build tool';

const PeriodValidity = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <div className="govuk-form-group">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                    <h1 className="govuk-fieldset__heading" id="page-heading">
                        Placeholder page for the validity rule
                    </h1>
                </legend>
            </div>
        </main>
    </Layout>
);

export default PeriodValidity;
