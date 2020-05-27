import React, { ReactElement } from 'react';
import Layout from '../layout/Layout';

const title = 'Choose Stages - Fares Data Build Tool';
const description = 'Choose Stages page of the Fares Data Build Tool';

const ChooseStages = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/chooseStages" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="choose-stages-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="choose-stages-page-heading">
                                How many fare stages does the service have?
                            </h1>
                        </legend>

                        <div className="govuk-form-group">
                            <label className="govuk-hint" htmlFor="width-2">
                                Enter the number of fare stages between 1 - 20 (for example 3)
                            </label>
                            <input
                                className="govuk-input govuk-input--width-2"
                                id="fareStages"
                                name="fareStageInput"
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

export const getServerSideProps = (): {} => {
    return { props: {} };
};

export default ChooseStages;
