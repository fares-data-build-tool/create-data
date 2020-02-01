import '../design/Pages.scss';
import React from 'react';
import { NextPageContext, NextPage } from 'next';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'Operator - Fares data build tool';
const description = 'Operator selection page of the Fares data build tool';

const Operator: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/operator" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">
                                Please select the bus operator that you are representing
                            </h1>
                        </legend>
                        <span id="changed-name-hint" className="govuk-hint">
                            Select an operator.
                        </span>
                        <div className="govuk-radios govuk-radios--inline">
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="changed-name"
                                    name="operator"
                                    type="radio"
                                    value="MCT"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="changed-name">
                                    MCT
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="changed-name-2"
                                    name="operator"
                                    type="radio"
                                    value="FirstBus"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="changed-name-2">
                                    FirstBus
                                </label>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" className="govuk-button govuk-button--start" />
            </form>
        </main>
    </Layout>
);

Operator.getInitialProps = async (ctx: NextPageContext) => {
    deleteCookieOnServerSide(ctx, OPERATOR_COOKIE);
    return {};
};

export default Operator;
