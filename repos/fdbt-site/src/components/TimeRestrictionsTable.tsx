import React, { ReactElement } from 'react';
import startCase from 'lodash/startCase';
import FormElementWrapper, { FormGroupWrapper } from './FormElementWrapper';
import { ErrorInfo, TimeInput } from '../interfaces';

interface TimeRestrictionsTableProps {
    chosenDays: string[];
    errors: ErrorInfo[];
    startTimeInputs: TimeInput[];
    endTimeInputs: TimeInput[];
}

const findCorrectDefaultValue = (inputs: TimeInput[], chosenDay: string): string =>
    inputs.find(input => input.day === chosenDay && input.timeInput)?.timeInput ?? '';

const TimeRestrictionsTable = ({
    chosenDays,
    errors,
    startTimeInputs,
    endTimeInputs,
}: TimeRestrictionsTableProps): ReactElement => {
    return (
        <>
            {chosenDays.map((chosenDay, index) => (
                <div className="flex-container time-restrictions-table" key={chosenDay}>
                    <div className="day-label govuk-body govuk-grid-column-one-quarter">{startCase(chosenDay)}</div>
                    <div className="govuk-grid-column-one-quarter">
                        <FormGroupWrapper errors={errors} errorId={`start-time-${chosenDay}`}>
                            <FormElementWrapper
                                errors={errors}
                                errorId={`start-time-${chosenDay}`}
                                errorClass="govuk-input--error"
                            >
                                <>
                                    <label
                                        className={`govuk-label ${index === 0 ? '' : 'govuk-visually-hidden'}`}
                                        htmlFor={`start-time-${chosenDay}`}
                                    >
                                        Start time
                                    </label>
                                    <input
                                        className="govuk-input govuk-input--width-4"
                                        id={`start-time-${chosenDay}`}
                                        name={`startTime${chosenDay}`}
                                        aria-describedby="time-restrictions-hint"
                                        type="text"
                                        defaultValue={findCorrectDefaultValue(startTimeInputs, chosenDay)}
                                    />
                                </>
                            </FormElementWrapper>
                        </FormGroupWrapper>
                    </div>
                    <div className="govuk-grid-column-one-quarter">
                        <FormGroupWrapper errors={errors} errorId={`end-time-${chosenDay}`}>
                            <FormElementWrapper
                                errors={errors}
                                errorId={`end-time-${chosenDay}`}
                                errorClass="govuk-input--error"
                            >
                                <>
                                    <label
                                        className={`govuk-label ${index === 0 ? '' : 'govuk-visually-hidden'}`}
                                        htmlFor={`end-time-${chosenDay}`}
                                    >
                                        End time
                                    </label>
                                    <input
                                        className="govuk-input govuk-input--width-4"
                                        id={`end-time-${chosenDay}`}
                                        name={`endTime${chosenDay}`}
                                        aria-describedby="time-restrictions-hint"
                                        type="text"
                                        defaultValue={findCorrectDefaultValue(endTimeInputs, chosenDay)}
                                    />
                                </>
                            </FormElementWrapper>
                        </FormGroupWrapper>
                    </div>
                </div>
            ))}
        </>
    );
};

export default TimeRestrictionsTable;
