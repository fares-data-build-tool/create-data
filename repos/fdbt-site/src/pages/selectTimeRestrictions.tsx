import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, NextPageContextWithSession, PremadeTimeRestriction, TimeBand } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getTimeRestrictionByNocCode } from '../data/auroradb';

const title = 'Define Time Restrictions - Create Fares Data Service';
const description = 'Define Time Restrictions page of the Create Fares Data Service';

const dayMappings = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
    bankHoliday: 'BH',
};

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
                                                Create a time restriction in operator settings.
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

                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
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

                    <h4 className="time-restriction-title govuk-heading-m govuk-!-padding-bottom-4">
                        {timeRestriction.name}
                    </h4>

                    <ul className="day-restrictions-list">
                        {Object.entries(dayMappings).map((dayMapping) => {
                            return (
                                <li key={dayMapping[0]} className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="day govuk-!-font-weight-bold">{dayMapping[1]}</span>{' '}
                                    {formatDayRestriction(timeRestriction, dayMapping[0])}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const formatTime = (time: string): string => (time ? `${time.substring(0, 2)}:${time.substring(2, 4)}` : '');

const formatTimeBand = (timeBand: TimeBand): string =>
    `${formatTime(timeBand.startTime)}–${formatTime(timeBand.endTime)}`;

const formatTimeBands = (timeBands: TimeBand[]): string =>
    timeBands.length > 0 ? timeBands.map((timeBand) => formatTimeBand(timeBand)).join(', ') : 'Valid all day';

const formatDayRestriction = (timeRestriction: PremadeTimeRestriction, day: string): JSX.Element => {
    const matchedDayRestriction = timeRestriction.contents.find((dayRestriction) => dayRestriction.day === day);
    return matchedDayRestriction ? (
        <span className="day-restriction">{formatTimeBands(matchedDayRestriction.timeBands)}</span>
    ) : (
        <span className="day-restriction not-valid">Not valid</span>
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
