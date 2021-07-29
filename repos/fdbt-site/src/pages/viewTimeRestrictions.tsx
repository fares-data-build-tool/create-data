import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import { NextPageContextWithSession, PremadeTimeRestriction, TimeBand } from '../interfaces';
import { getAndValidateNoc, sentenceCaseString } from '../utils';
import { getTimeRestrictionByNocCode } from '../data/auroradb';
import SubNavigation from '../layout/SubNavigation';

const title = 'Time restrictions';
const description = 'View and edit your time restrictions.';

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

interface TimeRestrictionProps {
    timeRestrictions: PremadeTimeRestriction[];
}

const formatTime = (time: string): string => (time ? `${time.substring(0, 2)}:${time.substring(2, 4)}` : '');

const formatTimeBand = (timeBand: TimeBand): string =>
    `${formatTime(timeBand.startTime)}–${formatTime(timeBand.endTime)}`;

const formatTimeBands = (timeBands: TimeBand[]): string =>
    timeBands.length > 0
        ? timeBands
              .map((timeBand, index) => (index === 0 ? formatTimeBand(timeBand) : `, ${formatTimeBand(timeBand)}`))
              .join('')
        : 'Valid all day';

const formatDayRestriction = (timeRestriction: PremadeTimeRestriction, day: string): JSX.Element => {
    const matchedDayRestriction = timeRestriction.contents.find((dayRestriction) => dayRestriction.day === day);
    return matchedDayRestriction ? (
        <span className="day-restriction">{formatTimeBands(matchedDayRestriction.timeBands)}</span>
    ) : (
        <span className="day-restriction not-valid">Not valid</span>
    );
};

const ViewTimeRestrictions = ({ timeRestrictions }: TimeRestrictionProps): ReactElement => (
    <BaseLayout title={title} description={description} showNavigation={true}>
        <div className="govuk-width-container">
            <main className="govuk-main-wrapper">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-third">
                        <SubNavigation />
                    </div>

                    <div className="govuk-grid-column-two-thirds">
                        <h1 className="govuk-heading-xl">Time restrictions</h1>
                        <p className="govuk-body">
                            Define certain days and time periods that your tickets can be used within
                        </p>

                        {!timeRestrictions.length ? (
                            <NoTimeRestrictions />
                        ) : (
                            <TimeRestrictions timeRestrictions={timeRestrictions} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    </BaseLayout>
);

const NoTimeRestrictions = (): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <p className="govuk-body">
                <em>You currently have no time restrictions saved.</em>
            </p>
            <button className="govuk-button" data-module="govuk-button">
                Add a time restriction
            </button>
        </div>
    );
};

const TimeRestrictions = ({ timeRestrictions }: { timeRestrictions: PremadeTimeRestriction[] }): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h3>Individual</h3>

            <div className="govuk-grid-row">
                {timeRestrictions.map((timeRestriction) => (
                    <div key={timeRestriction.name} className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
                        <div className="card">
                            <div className="card__body">
                                <div className="card__actions">
                                    <ul className="actions__list">
                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                                href="/viewTimeRestrictions"
                                            >
                                                Edit
                                            </a>
                                        </li>

                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                                href="/viewTimeRestrictions"
                                            >
                                                Delete
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="time-restriction-title govuk-!-padding-bottom-4">
                                    {sentenceCaseString(timeRestriction.name)}
                                </h4>

                                <ul className="day-restrictions-list">
                                    {Object.entries(dayMappings).map((dayMapping) => {
                                        return (
                                            <li className="govuk-body-s govuk-!-margin-bottom-2">
                                                <span className="day govuk-!-font-weight-bold">{dayMapping[1]}</span>{' '}
                                                {formatDayRestriction(timeRestriction, dayMapping[0])}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="govuk-button" data-module="govuk-button">
                Add a time restriction
            </button>
        </div>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: TimeRestrictionProps }> => {
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const timeRestrictions = await getTimeRestrictionByNocCode(nationalOperatorCode);

    return { props: { timeRestrictions } };
};

export default ViewTimeRestrictions;
