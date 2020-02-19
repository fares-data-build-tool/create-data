import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import Layout from '../layout/Layout';

const title = 'Select number of fare stages - Fares data build tool';
const description = 'Number of fare stages selection page of the Fares data build tool';

const FareStages = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/chooseStages" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="page-heading">
                                How many fare stages are there in your fares triangle?
                            </h1>
                        </legend>

                        <div className="govuk-form-group">
                            <label className="govuk-label" htmlFor="width-2">
                                Number of fare stages
                            </label>
                            <input
                                className="govuk-input govuk-input--width-2"
                                id="width-2"
                                name="width-2"
                                type="text"
                                maxLength={2}
                            />
                        </div>
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

FareStages.getInitialProps = () => {
    return {};
};

export default FareStages;
