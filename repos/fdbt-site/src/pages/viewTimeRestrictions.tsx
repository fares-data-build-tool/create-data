import React, { ReactElement, useState } from 'react';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';
import { getTimeRestrictionByNocCode } from '../data/auroradb';
import { NextPageContextWithSession, PremadeTimeRestriction, TimeBand } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { extractGlobalSettingsReferer } from '../utils/globalSettings';

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
    csrfToken: string;
    timeRestrictions: PremadeTimeRestriction[];
    referer: string | null;
}

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

const ViewTimeRestrictions = ({ timeRestrictions, referer, csrfToken }: TimeRestrictionProps): ReactElement => {
    const [popUpState, setPopUpState] = useState<{ timeRestrictionId: number; timeRestrictionName: string }>();

    const deleteActionHandler = (id: number, name: string): void => {
        setPopUpState({ timeRestrictionId: id, timeRestrictionName: name });
    };

    const cancelActionHandler = (): void => {
        setPopUpState(undefined);
    };

    const buildDeleteUrl = (idToDelete: number, csrfToken: string): string => {
        return `/api/deleteTimeRestriction?id=${idToDelete}&_csrf=${csrfToken}`;
    };

    return (
        <BaseLayout title={title} description={description} showNavigation referer={referer}>
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
                                <TimeRestrictions
                                    deleteActionHandler={deleteActionHandler}
                                    timeRestrictions={timeRestrictions}
                                />
                            )}

                            {popUpState && (
                                <DeleteConfirmationPopup
                                    entityType="time restriction"
                                    entityName={popUpState.timeRestrictionName}
                                    deleteUrl={buildDeleteUrl(popUpState.timeRestrictionId, csrfToken)}
                                    cancelActionHandler={cancelActionHandler}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </BaseLayout>
    );
};

const NoTimeRestrictions = (): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <p className="govuk-body">
                <em>You currently have no time restrictions saved.</em>
            </p>
            <a className="govuk-button" data-module="govuk-button" href="/manageTimeRestriction">
                Add a time restriction
            </a>
        </div>
    );
};

export const TimeRestrictions = ({
    timeRestrictions,
    deleteActionHandler,
}: {
    timeRestrictions: PremadeTimeRestriction[];
    deleteActionHandler: (id: number, name: string) => void;
}): ReactElement => (
    <div className="govuk-heading-m">
        <div className="govuk-grid-row">
            {timeRestrictions.map((timeRestriction) => (
                <div key={timeRestriction.name} className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
                    <div className="card">
                        <div className="card__body time-restriction">
                            <div className="card__actions">
                                <ul className="actions__list">
                                    <li className="actions__item">
                                        <a
                                            className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                            href={`/manageTimeRestriction?id=${timeRestriction.id}`}
                                        >
                                            Edit
                                        </a>
                                    </li>

                                    <li className="actions__item">
                                        <button
                                            className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                            onClick={() => {
                                                deleteActionHandler(timeRestriction.id, timeRestriction.name);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <h4 className="time-restriction-title govuk-!-padding-bottom-4">{timeRestriction.name}</h4>

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
            ))}
        </div>

        <a className="govuk-button" data-module="govuk-button" href="/manageTimeRestriction">
            Add a time restriction
        </a>
    </div>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: TimeRestrictionProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const timeRestrictions = await getTimeRestrictionByNocCode(nationalOperatorCode);

    return { props: { timeRestrictions, referer: extractGlobalSettingsReferer(ctx), csrfToken } };
};

export default ViewTimeRestrictions;
