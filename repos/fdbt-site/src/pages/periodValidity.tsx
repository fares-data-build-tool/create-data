import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { PERIOD_EXPIRY_ATTRIBUTE } from '../constants';
import { ErrorInfo, CustomAppProps, NextPageContextWithSession, ProductData } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { PeriodExpiryWithErrors } from './api/periodValidity';

const title = 'Period Validity - Create Fares Data Service';
const description = 'Period Validity selection page of the Create Fares Data Service';

const errorId = 'period-end-calendar';

type PeriodValidityProps = {
    errors: ErrorInfo[];
};

const isPeriodExpiryWithErrors = (
    periodExpiryAttribute: ProductData | PeriodExpiryWithErrors,
): periodExpiryAttribute is PeriodExpiryWithErrors =>
    (periodExpiryAttribute as PeriodExpiryWithErrors)?.errorMessage !== undefined;

const PeriodValidity = ({ errors = [], csrfToken }: PeriodValidityProps & CustomAppProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/periodValidity" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="period-validity-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
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
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): {} => {
    const periodExpiryAttribute = getSessionAttribute(ctx.req, PERIOD_EXPIRY_ATTRIBUTE);

    if (periodExpiryAttribute && isPeriodExpiryWithErrors(periodExpiryAttribute)) {
        const { errorMessage } = periodExpiryAttribute;
        return { props: { errors: [{ errorMessage, id: errorId }] } };
    }
    return { props: {} };
};

export default PeriodValidity;
