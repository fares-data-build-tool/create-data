import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { PERIOD_EXPIRY } from '../constants';

const title = 'Period Validity - Fares data build tool';
const description = 'Period Validity selection page of the Fares data build tool';

export interface PeriodValidityInterface {
    error: boolean;
}

const PeriodValidity = ({ error }: PeriodValidityInterface): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/periodValidity" method="post">
                <fieldset className="govuk-fieldset" aria-describedby="periodValidity-page-heading">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                        <h1 className="govuk-fieldset__heading" id="periodValidity-page-heading">
                            When does the product expire?
                        </h1>
                    </legend>
                    <span className="govuk-hint" id="heading-period-validity-hint">
                        We need to know the time this product would expire on its final day
                    </span>
                    <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
                        <span id="radio-error" className="govuk-error-message">
                            <span className={error ? '' : 'govuk-visually-hidden'}>Please select an option</span>
                        </span>
                        <div className="govuk-radios">
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="period-end-calendar"
                                    name="periodValid"
                                    type="radio"
                                    value="endOfCalendarDay"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="period-end-calendar">
                                    At the end of the calendar day
                                    <span className="govuk-hint" id="product-price-hint">
                                        For example on its last day the ticket would expire at midnight
                                    </span>
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="period-twenty-four-hours"
                                    name="periodValid"
                                    type="radio"
                                    value="twentyFoursHoursAfterPurchase"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="period-twenty-four-hours">
                                    24 hours after purchase
                                    <span className="govuk-hint" id="product-price-hint">
                                        For example if a ticket is bought at 3pm it will expire at 3pm on its final day
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
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

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async (ctx: NextPageContext): Promise<{}> => {
    const cookies = parseCookies(ctx);
    const periodExpiryCookie = cookies[PERIOD_EXPIRY];

    if (!periodExpiryCookie) {
        return {
            props: {},
        };
    }

    const { error } = JSON.parse(periodExpiryCookie);

    return {
        props: {
            error: !periodExpiryCookie ? {} : error,
        },
    };
};

export default PeriodValidity;
