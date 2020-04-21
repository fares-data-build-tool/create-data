import React, { ReactElement } from 'react';
import Layout from '../layout/Layout';

const title = 'XXXXXXXX - Fares data build tool';
const description = 'XXXXXXXX page of the Fares data build tool';

const XXXXXXXXXXXX = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/XXXXXXXXX" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="page-heading">
                                XXXXXXXXXXXXXXXXX?
                            </h1>
                        </legend>

                        <div className="govuk-form-group">
                            <label className="govuk-hint" htmlFor="width-2">
                                XXXXXXXXXXXXXXXXXXXX
                            </label>
                            <input
                                className="govuk-input govuk-input--width-2"
                                id="XXXXXXXXXXXX"
                                name="XXXXXXXXXXXXXXXXXX"
                                type="number"
                                min="1"
                                max="20"
                                maxLength={2}
                                required
                                pattern="^[0-9]*$"
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

export default XXXXXXXXXXXX;
