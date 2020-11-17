import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { TERM_TIME_ATTRIBUTE } from '../constants';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute } from '../utils/sessions';
import { getCsrfToken } from '../utils';
import { isTermTimeAttributeWithErrors } from '../interfaces/typeGuards';

const title = 'Term Time - Create Fares Data Service';
const description = 'Term Time selection page of the Create Fares Data Service';

export interface TermTimeAttributeWithErrors {
    errors: ErrorInfo[];
}

interface TermTimeProps {
    errors: ErrorInfo[];
    csrfToken: string;
}

const TermTime = ({ errors, csrfToken }: TermTimeProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/termTime" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="term-time-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading">Is this ticket only valid during term times?</h1>
                        </legend>
                        <span className="govuk-hint" id="term-time-hint">
                            Term dates should be specified in route and timetable data.
                        </span>
                        <FormElementWrapper errors={errors} errorId="term-time-yes" errorClass="govuk-radios--error">
                            <div className="govuk-radios" id="term-time-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="term-time-yes"
                                        name="termTime"
                                        type="radio"
                                        value="Yes"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="term-time-yes">
                                        Yes
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="term-time-no"
                                        name="termTime"
                                        type="radio"
                                        value="No"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="term-time-no">
                                        No
                                    </label>
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: TermTimeProps } => {
    const csrfToken = getCsrfToken(ctx);
    const termTimeAttribute = getSessionAttribute(ctx.req, TERM_TIME_ATTRIBUTE);
    const errors: ErrorInfo[] = isTermTimeAttributeWithErrors(termTimeAttribute) ? termTimeAttribute.errors : [];
    return { props: { errors, csrfToken } };
};

export default TermTime;
