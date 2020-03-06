import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = 'Period Type - Fares data build tool';
const description = 'Period Type selection page of the Fares data build tool';

const PeriodType: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/periodtype" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="periodtype-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="periodtype-page-heading">
                                What type of Period Ticket?
                            </h1>
                        </legend>
                        <div className="govuk-radios">
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="periodtype-geo-zone"
                                    name="periodGeoZone"
                                    type="radio"
                                    value="geozone"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="periodtype-geo-zone">
                                    A ticket within a geographical zone
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="periodtype-single-set-service"
                                    name="periodtypeSingle"
                                    type="radio"
                                    value="singleset"
                                    disabled
                                    aria-disabled="true"
                                />
                                <label
                                    className="govuk-label govuk-radios__label"
                                    htmlFor="periodtype-single-set-service"
                                >
                                    A ticket for a single or select set of services
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="periodtype-network"
                                    name="periodtypeNetwork"
                                    type="radio"
                                    value="network"
                                    disabled
                                    aria-disabled="true"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="periodtype-network">
                                    A ticket for your network of services
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

export default PeriodType;
