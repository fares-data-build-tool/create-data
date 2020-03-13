import React from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = 'How Many Fare Stages - Fares data build tool';
const description = 'How many fares stages page of the Fares data build tool';

const HowManyStages: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/howManyStages" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="selection-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">What is the size of your fares triangle?</h1>
                        </legend>
                        <span className="govuk-hint" id="selection-hint">
                            You&apos;ll need to upload a CSV if your fares triangle has more than 20 fares stages.
                        </span>
                        <div className="govuk-radios">
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="lessThan20FareStages"
                                    name="howManyStages"
                                    type="radio"
                                    value="lessThan20"
                                />
                                <label className="govuk-label govuk-radios__label govuk-label--s" htmlFor="selection">
                                    20 fare stages or less
                                </label>
                                <span id="selection-item-hint" className="govuk-hint govuk-radios__hint">
                                    You&apos;ll need to add the fare stages, prices and match the stops on your route to
                                    your fare stages.
                                </span>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="moreThan20FareStages"
                                    name="howManyStages"
                                    type="radio"
                                    value="moreThan20"
                                />
                                <label className="govuk-label govuk-radios__label govuk-label--s" htmlFor="selection-2">
                                    More than 20 fare stages
                                </label>
                                <span id="selection-2-item-hint" className="govuk-hint govuk-radios__hint">
                                    You&apos;ll need to upload a CSV fares triangle. A template will be provided for you
                                    to complete.
                                </span>
                            </div>
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

export default HowManyStages;
