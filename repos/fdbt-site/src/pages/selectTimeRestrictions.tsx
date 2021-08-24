import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, NextPageContextWithSession, PremadeTimeRestriction } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getTimeRestrictionByNocCode } from '../data/auroradb';
import { TimeRestriction } from './viewTimeRestrictions';

const title = 'Define Time Restrictions - Create Fares Data Service';
const description = 'Define Time Restrictions page of the Create Fares Data Service';

interface SelectTimeRestrictionsProps {
    csrfToken: string;
    errors: ErrorInfo[];
    timeRestrictions: PremadeTimeRestriction[];
}

const SelectTimeRestrictions = ({ csrfToken, errors, timeRestrictions }: SelectTimeRestrictionsProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <ErrorSummary errors={errors} />

            <CsrfForm action="/api/defineTimeRestrictions" method="post" csrfToken={csrfToken}>
                <>
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="contact-hint">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading">Are there time restrictions on your ticket?</h1>
                            </legend>

                            <div id="contact-hint" className="govuk-hint">
                                We need to know if your ticket(s) will have any time restrictions, for example select
                                yes if your ticket(s) can only be used on a certain day or during a certain time period.
                                If you have a premade time restriction, you can select it here.
                            </div>

                            <div className="govuk-warning-text">
                                <span className="govuk-warning-text__icon govuk-!-margin-top-1" aria-hidden="true">
                                    !
                                </span>
                                <strong className="govuk-warning-text__text">
                                    <span className="govuk-warning-text__assistive">Warning</span>
                                    You can create new time restrictions in your{' '}
                                    <a href="/viewTimeRestrictions">operator settings</a>.<br /> Don&apos;t worry you
                                    can navigate back to this page when you are finished.
                                </strong>
                            </div>

                            <div className="govuk-radios govuk-radios--conditional" data-module="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="yes-choice"
                                        name="timeRestrictionChoice"
                                        type="radio"
                                        value="Premade"
                                        data-aria-controls="conditional-time-restriction"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="yes-choice">
                                        Yes
                                    </label>
                                </div>

                                <div
                                    className="govuk-radios__conditional govuk-radios__conditional--hidden"
                                    id="conditional-time-restriction"
                                >
                                    <div className="govuk-form-group">
                                        {timeRestrictions.length ? (
                                            timeRestrictions.map((item) => (
                                                <TimeRestrictionCard key={item.id} timeRestriction={item} />
                                            ))
                                        ) : (
                                            <p className="govuk-body govuk-error-message">
                                                <a href="/viewTimeRestrictions">
                                                    Create a time restriction in operator settings.
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="no-choice"
                                        name="timeRestrictionChoice"
                                        type="radio"
                                        value="no"
                                        data-aria-controls="conditional-contact-2"
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="no-choice">
                                        No
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {!!timeRestrictions.length && (
                        <input
                            type="submit"
                            value="Continue"
                            id="continue-button"
                            className="govuk-button govuk-!-margin-right-2"
                        />
                    )}

                    <a className="govuk-button govuk-button--secondary" href="/viewTimeRestrictions">
                        Create new
                    </a>
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

const TimeRestrictionCard = ({ timeRestriction }: { timeRestriction: PremadeTimeRestriction }): ReactElement => {
    return (
        <div className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
            <div className="card">
                <div className="card__body time-restriction">
                    <div className="govuk-radios">
                        <div className="govuk-radios__item card__radio">
                            <input
                                className="govuk-radios__input"
                                id={`${timeRestriction.name}-radio`}
                                name="timeRestriction"
                                type="radio"
                                value={timeRestriction.name}
                                aria-label={timeRestriction.name}
                            />
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label className="govuk-label govuk-radios__label" />
                        </div>
                    </div>

                    <TimeRestriction entity={timeRestriction} />
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: SelectTimeRestrictionsProps }> => {
    const csrfToken = getCsrfToken(ctx);

    const errors: ErrorInfo[] = [];

    const nationalOperatorCode = getAndValidateNoc(ctx);

    const timeRestrictions = await getTimeRestrictionByNocCode(nationalOperatorCode);

    return { props: { csrfToken, errors, timeRestrictions } };
};

export default SelectTimeRestrictions;
