import '../design/Pages.scss';
import React from 'react';
import { NextPageContext, NextPage } from 'next';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'Input Method - Fares data build tool';
const description = 'Input method selection page of the Fares data build tool';

const inputMethod: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/operator" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">
                                Please select your preferred input method
                            </h1>
                        </legend>
                        <div className="govuk-radios">
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="manual-entry"
                                    name="operator"
                                    type="radio"
                                    value="MCT"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="manual-entry">
                                    Manual Table Entry
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="csv-upload"
                                    name="operator"
                                    type="radio"
                                    value="FirstBus"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="csv-upload">
                                    Upload (csv)
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="interactive-map"
                                    name="operator"
                                    type="radio"
                                    value="FirstBus"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="interactive-map">
                                    Interactive Map (Beta - requires JavaScript)
                                </label>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

inputMethod.getInitialProps = async (ctx: NextPageContext) => {
    deleteCookieOnServerSide(ctx, OPERATOR_COOKIE);
    return {};
};

export default inputMethod;
