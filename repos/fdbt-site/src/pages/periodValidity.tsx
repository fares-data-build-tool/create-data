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
                        We need to know the time that this product would be valid until
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
                                <label
                                    className="govuk-label govuk-radios__label govuk-label--s"
                                    htmlFor="period-end-calendar"
                                >
                                    At the end of a calendar day
                                </label>
                                <span className="govuk-hint govuk-radios__hint" id="period-end-calendar-hint">
                                    For example, a ticket purchased at 3pm would be valid until midnight on its day of
                                    expiry
                                </span>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className="govuk-radios__input"
                                    id="period-twenty-four-hours"
                                    name="periodValid"
                                    type="radio"
                                    value="24hr"
                                />
                                <label
                                    className="govuk-label govuk-radios__label govuk-label--s"
                                    htmlFor="period-twenty-four-hours"
                                >
                                    At the end of a 24 hour period from purchase
                                </label>
                                <span className="govuk-hint govuk-radios__hint" id="period-twenty-four-hours-hint">
                                    For example, a ticket purchased at 3pm will be valid until 3pm on its day of expiry
                                </span>
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
