import React, { ReactElement } from 'react';
import { getSessionAttribute } from '../utils/sessions';
import { TIME_RESTRICTIONS_ATTRIBUTE } from '../constants';
import TwoThirdsLayout from '../layout/Layout';
import { CustomAppProps, NextPageContextWithSession, ErrorInfo } from '../interfaces';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { TimeRestrictionsAttributeWithErrors, TimeRestrictionsAttribute } from './api/timeRestrictions';

const title = 'Time Restrictions - Create Fares Data Service';
const description = 'Time Restrictions selection page of the Create Fares Data Service';

export const timeRestrictionsErrorId = 'time-restrictions-yes';

export interface TimeRestrictionsProps {
    errors: ErrorInfo[];
}

const isTimeRestrictionsAttributeWithErrors = (
    timeRestrictionsInfo: TimeRestrictionsAttribute | TimeRestrictionsAttributeWithErrors,
): timeRestrictionsInfo is TimeRestrictionsAttributeWithErrors =>
    (timeRestrictionsInfo as TimeRestrictionsAttributeWithErrors).errors !== undefined;

const TimeRestrictions = ({ errors, csrfToken }: TimeRestrictionsProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/timeRestrictions" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="time-restrictions-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="time-restrictions-page-heading">
                                Are there time restrictions on your ticket(s)?
                            </h1>
                        </legend>
                        <div className="govuk-hint" id="time-restrictions-page-example">
                            We need to know if your ticket(s) will have any time restrictions, for example select yes if
                            your ticket(s) can only be used on a certain day or during a certain time period
                        </div>
                        <FormElementWrapper
                            errors={errors}
                            errorId={timeRestrictionsErrorId}
                            errorClass="govuk-radios--errors"
                        >
                            <div className="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="time-restrictions-yes"
                                        name="timeRestrictions"
                                        type="radio"
                                        value="yes"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="time-restrictions-yes">
                                        Yes
                                    </label>
                                </div>
                                <div className="govuk-radios__item">
                                    <input
                                        className={`govuk-radios__input ${
                                            errors.length > 0 ? 'govuk-input--error' : ''
                                        } `}
                                        id="time-restrictions-no"
                                        name="timeRestrictions"
                                        type="radio"
                                        value="no"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="time-restrictions-no">
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: TimeRestrictionsProps } => {
    const timeRestrictionsInfo = getSessionAttribute(ctx.req, TIME_RESTRICTIONS_ATTRIBUTE);
    const errors: ErrorInfo[] =
        timeRestrictionsInfo && isTimeRestrictionsAttributeWithErrors(timeRestrictionsInfo)
            ? timeRestrictionsInfo.errors
            : [];

    return { props: { errors } };
};

export default TimeRestrictions;
