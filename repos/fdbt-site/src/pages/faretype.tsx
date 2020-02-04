import '../design/Pages.scss';
import React from 'react';
import { NextPage, NextPageContext } from 'next';
import Layout from '../layout/Layout';
import { FARETYPE_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'FareType - Fares data build tool';
const description = 'Fare Type selection page of the Fares data build tool';

const FareType: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/faretype" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">What type of fare?</h1>
                        </legend>
                        <div className="govuk-radios">
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="faretype"
                                    name="faretype"
                                    type="radio"
                                    value="single"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="faretype">
                                    Single
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="faretype-2"
                                    name="faretype"
                                    type="radio"
                                    value="return"
                                    disabled
                                    aria-disabled="true"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="faretype-2">
                                    Return
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="faretype-3"
                                    name="faretype"
                                    type="radio"
                                    value="period"
                                    disabled
                                    aria-disabled="true"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="faretype-3">
                                    Period Tickets
                                </label>
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

FareType.getInitialProps = async (ctx: NextPageContext) => {
    deleteCookieOnServerSide(ctx, FARETYPE_COOKIE);

    return {};
};

export default FareType;
