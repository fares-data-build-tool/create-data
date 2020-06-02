import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { PERIOD_EXPIRY_COOKIE } from '../constants';
import { ErrorInfo } from '../types';
import ErrorSummary from '../components/ErrorSummary';
import { buildTitle } from '../utils';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'Period Validity - Fares Data Build Tool';
const description = 'Period Validity selection page of the Fares Data Build Tool';

const errorId = 'period-validity-error';

type PeriodValidityProps = {
    errors: ErrorInfo[];
};

const PeriodValidity = ({ errors = [] }: PeriodValidityProps): ReactElement => {
    return (
        <Layout title={buildTitle(errors, title)} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/periodValidity" method="post">
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="period-validity-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="period-validity-page-heading">
                                    When does the product expire?
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="period-validity-hint">
                                We need to know the time that this product would be valid until
                            </span>
                            <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                                <div className="govuk-radios">
                                    <div className="govuk-radios__item">
                                        <input
                                            className={`govuk-radios__input ${
                                                errors.length > 0 ? 'govuk-input--error' : ''
                                            } `}
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
                                            For example, a ticket purchased at 3pm would be valid until midnight on its
                                            day of expiry
                                        </span>
                                    </div>
                                    <div className="govuk-radios__item">
                                        <input
                                            className={`govuk-radios__input ${
                                                errors.length > 0 ? 'govuk-input--error' : ''
                                            } `}
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
                                        <span
                                            className="govuk-hint govuk-radios__hint"
                                            id="period-twenty-four-hours-hint"
                                        >
                                            For example, a ticket purchased at 3pm will be valid until 3pm on its day of
                                            expiry
                                        </span>
                                    </div>
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </form>
            </main>
        </Layout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[PERIOD_EXPIRY_COOKIE]) {
        const periodValidityCookie = cookies[PERIOD_EXPIRY_COOKIE];
        const parsedPeriodValidityCookie = JSON.parse(periodValidityCookie);

        if (parsedPeriodValidityCookie.errorMessage) {
            const { errorMessage } = parsedPeriodValidityCookie;
            return { props: { errors: [{ errorMessage, id: errorId }] } };
        }
    }

    return { props: {} };
};

export default PeriodValidity;
