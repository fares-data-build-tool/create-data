import React, { ReactElement, useState } from 'react';
import { ErrorInfo, NextPageContextWithSession, PremadeTimeRestriction, TimeInput } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { GS_TIME_RESTRICTION_ATTRIBUTE } from '../constants/attributes';
import { getSessionAttribute } from '../utils/sessions';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'Manage Time Restrictions - Create Fares Data Service';
const description = 'Manage Time Restrictions page of the Create Fares Data Service';

const days = [
    {
        id: 'monday',
        label: 'Monday',
    },
    {
        id: 'tuesday',
        label: 'Tuesday',
    },
    {
        id: 'wednesday',
        label: 'Wednesday',
    },
    {
        id: 'thursday',
        label: 'Thursday',
    },
    {
        id: 'friday',
        label: 'Friday',
    },
    {
        id: 'saturday',
        label: 'Saturday',
    },
    {
        id: 'sunday',
        label: 'Sunday',
    },
    {
        id: 'bankHoliday',
        label: 'Bank holiday',
    },
];

interface ManageTimeRestrictionProps {
    csrfToken: string;
    errors: ErrorInfo[];
    inputs: PremadeTimeRestriction;
}

const findCorrectDayRestriction = (inputs: PremadeTimeRestriction, day: string) => {
    return inputs.contents.find((dayRestriction) => dayRestriction.day === day);
};

const findCorrectDefaultValue = (inputs: TimeInput[], day: string, inputIndex: number): string =>
    inputs.find((input, index) => input.day === day && input.timeInput && index === inputIndex)?.timeInput ?? '';

const ManageTimeRestriction = ({ csrfToken, errors = [], inputs }: ManageTimeRestrictionProps): ReactElement => {
    const defaultState: { [key: string]: number } = {};

    days.forEach((day) => {
        defaultState[day.id] = 1;
    });

    const [dayRowCount, updateDayRowCount] = useState(defaultState);

    const addTimeRestrictionRow = (day: string): void => {
        const dayRowCountToUpdate = { ...dayRowCount };
        dayRowCountToUpdate[day] += 1;
        updateDayRowCount(dayRowCountToUpdate);
    };

    const deleteTimeRestrictionRow = (day: string): void => {
        if (dayRowCount?.[day] > 1) {
            const dayRowCountToUpdate = { ...dayRowCount };
            dayRowCountToUpdate[day] -= 1;
            updateDayRowCount(dayRowCountToUpdate);
        }
    };

    const getTimeRestrictionRows = (day: string, inputs: PremadeTimeRestriction): JSX.Element[] => {
        const rows = [];

        const startTimeInputs: TimeInput[] = [];
        const endTimeInputs: TimeInput[] = [];
        const dayCounters: {
            day: string;
            counter: number;
        }[] = [];

        const matchedInputTimeRestriction = inputs.contents.find(
            (fullTimeRestriction) => fullTimeRestriction.day === day,
        );

        if (matchedInputTimeRestriction) {
            matchedInputTimeRestriction.timeBands.forEach((timeBand) => {
                startTimeInputs.push({ timeInput: timeBand.startTime, day });
                endTimeInputs.push({ timeInput: timeBand.endTime, day });
            });

            dayCounters.push({
                day,
                counter:
                    matchedInputTimeRestriction.timeBands.length > 0 ? matchedInputTimeRestriction.timeBands.length : 1,
            });
        }

        dayCounters.forEach((dayCounter) => {
            defaultState[dayCounter.day] = dayCounter.counter;
        });

        for (let i = 0; i < dayRowCount[day]; i += 1) {
            const matchedError = errors.find((error) => error.id.includes(`-time-${day}-${i}`));

            rows.push(
                <div className="global-settings-time-restriction-row" key={i}>
                    {matchedError ? <p className="govuk-error-message">{matchedError.errorMessage}</p> : null}
                    <div className="govuk-form-group">
                        <div>
                            <>
                                <label className="govuk-label" htmlFor={`start-time-${day}-${i}`}>
                                    Start time <span className="govuk-visually-hidden">for {day}</span>
                                </label>
                                <input
                                    className={`govuk-input govuk-input--width-5 govuk-!-margin-right-4 ${
                                        matchedError?.id === `start-time-${day}-${i}` && `govuk-input--error`
                                    }`}
                                    id={`start-time-${day}-${i}`}
                                    name={`startTime${day}`}
                                    aria-describedby="time-restrictions-hint"
                                    type="text"
                                    defaultValue={findCorrectDefaultValue(startTimeInputs, day, i)}
                                />
                            </>
                        </div>
                        <div>
                            <>
                                <label className="govuk-label" htmlFor={`end-time-${day}-${i}`}>
                                    End time <span className="govuk-visually-hidden">for {day}</span>
                                </label>
                                <input
                                    className={`govuk-input govuk-input--width-5 ${
                                        matchedError?.id === `end-time-${day}-${i}` && `govuk-input--error`
                                    }`}
                                    id={`end-time-${day}-${i}`}
                                    name={`endTime${day}`}
                                    aria-describedby="time-restrictions-hint"
                                    type="text"
                                    defaultValue={findCorrectDefaultValue(endTimeInputs, day, i)}
                                />
                            </>
                        </div>
                    </div>
                </div>,
            );
        }

        return rows;
    };

    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/manageTimeRestriction" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />

                    <h1 className="govuk-heading-l" id="manage-time-restriction-page-heading">
                        Provide time restriction details
                    </h1>
                    <span className="govuk-hint" id="manage-time-restriction-hint">
                        Select the days of the week that the tickets are valid for. If applicable, enter the times at
                        which your tickets start and end. If they are valid at all times, select the day and leave the
                        time blank. You cannot enter an end time without a start time.
                    </span>
                    <div className="govuk-inset-text" id="manage-time-restriction-inset-hint">
                        Enter times in 24hr format. For example 0900 is 9am, 1730 is 5:30pm.
                    </div>

                    <div className={`govuk-form-group${hasError(errors, 'time-restriction-days')}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="time-restriction-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                <h1 className="govuk-fieldset__heading" id="time-restriction-heading">
                                    Select the days of the week that are applicable
                                </h1>
                            </legend>
                            <FormElementWrapper
                                errors={errors}
                                errorId="time-restriction-days"
                                errorClass="govuk-checkboxes--error"
                            >
                                <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                                    {days.map(
                                        (day, index): ReactElement => (
                                            <>
                                                <div className="govuk-checkboxes__item" key={day.id}>
                                                    <input
                                                        className="govuk-checkboxes__input"
                                                        id={`day-restriction-${index}`}
                                                        name="dayRestrictions"
                                                        type="checkbox"
                                                        value={day.id}
                                                        data-aria-controls={`conditional-input-${index}`}
                                                        defaultChecked={!!findCorrectDayRestriction(inputs, day.id)}
                                                    />
                                                    <label
                                                        className="govuk-label govuk-checkboxes__label"
                                                        htmlFor={`day-restriction-${index}`}
                                                    >
                                                        {day.label}
                                                    </label>
                                                </div>
                                                <div
                                                    className="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden"
                                                    id={`conditional-input-${index}`}
                                                >
                                                    <fieldset className="govuk-fieldset flex-container time-restrictions-table">
                                                        <div
                                                            className={`govuk-form-group ${
                                                                errors.some((error) =>
                                                                    error.id.includes(`-time-${day.id}-`),
                                                                ) && `govuk-form-group--error`
                                                            }`}
                                                        >
                                                            {getTimeRestrictionRows(day.id, inputs)}
                                                        </div>
                                                        <button
                                                            id={`add-another-button-${day.id}`}
                                                            type="button"
                                                            className="govuk-button govuk-button--secondary govuk-!-margin-left-3 time-restrictions-button-placement"
                                                            onClick={(): void => addTimeRestrictionRow(day.id)}
                                                        >
                                                            Add another
                                                        </button>
                                                        {dayRowCount[day.id] > 1 && (
                                                            <button
                                                                id={`add-another-button-${day.id}`}
                                                                type="button"
                                                                className="govuk-button govuk-button--warning govuk-!-margin-left-3 time-restrictions-button-placement"
                                                                onClick={(): void => deleteTimeRestrictionRow(day.id)}
                                                            >
                                                                Delete last row
                                                            </button>
                                                        )}
                                                    </fieldset>
                                                </div>
                                            </>
                                        ),
                                    )}
                                </div>
                            </FormElementWrapper>
                        </fieldset>
                    </div>

                    <div
                        className={`govuk-form-group${hasError(errors, 'time-restriction-name')}`}
                        id="time-restriction-name"
                    >
                        <label htmlFor="time-restriction-name">
                            <h1 className="govuk-heading-m" id="time-restriction-name-heading">
                                Provide a name for your time restriction
                            </h1>
                        </label>

                        <p className="govuk-hint" id="group-name-hint">
                            50 characters maximum
                        </p>
                        <FormElementWrapper
                            errors={errors}
                            errorId="time-restriction-name"
                            errorClass="govuk-input--error"
                        >
                            <input
                                className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                                id="time-restriction-name"
                                name="timeRestrictionName"
                                type="text"
                                maxLength={50}
                                defaultValue={inputs.name || ''}
                            />
                        </FormElementWrapper>
                    </div>

                    <input type="submit" value="Add time restriction" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

const hasError = (errors: ErrorInfo[], name: string) => {
    if (errors.filter((e) => e.id === name).length > 0) {
        return ' govuk-form-group--error';
    }

    return '';
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ManageTimeRestrictionProps } => {
    const csrfToken = getCsrfToken(ctx);

    const userInputsAndErrors = getSessionAttribute(ctx.req, GS_TIME_RESTRICTION_ATTRIBUTE);

    if (!userInputsAndErrors) {
        return {
            props: {
                csrfToken,
                errors: [],
                inputs: {
                    name: '',
                    contents: [],
                },
            },
        };
    }

    return {
        props: {
            csrfToken,
            errors: userInputsAndErrors.errors,
            inputs: userInputsAndErrors.inputs,
        },
    };
};

export default ManageTimeRestriction;
