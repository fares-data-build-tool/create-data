import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { PERIOD_TYPE } from '../constants';

const title = 'Period Type - Fares data build tool';
const description = 'Period Type selection page of the Fares data build tool';

export interface PeriodTypeInterface {
    uuid: string;
    error: boolean;
    periodTypeName?: string;
}

const PeriodType = ({ error }: PeriodTypeInterface): ReactElement => {
    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/periodType" method="post">
                    <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="periodtype-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="periodtype-page-heading">
                                    What type of Period Ticket?
                                </h1>
                            </legend>
                            <span id="radio-error" className="govuk-error-message">
                                <span className={error ? '' : 'govuk-visually-hidden'}>Please select an option</span>
                            </span>
                            <div className="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="periodtype-geo-zone"
                                        name="periodType"
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
                                        name="periodType"
                                        type="radio"
                                        value="singleOperator"
                                    />
                                    <label
                                        className="govuk-label govuk-radios__label"
                                        htmlFor="periodtype-single-set-service"
                                    >
                                        A ticket for some or all of your network of services
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="periodtype-network"
                                        name="periodType"
                                        type="radio"
                                        value="network"
                                        disabled
                                        aria-disabled="true"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="periodtype-network">
                                        A ticket for services across multiple operators
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
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const periodTypeCookie = cookies[PERIOD_TYPE];

    if (!periodTypeCookie) {
        return {
            props: {},
        };
    }

    const { error } = JSON.parse(periodTypeCookie);

    return {
        props: {
            error: !periodTypeCookie ? {} : error,
        },
    };
};

export default PeriodType;
