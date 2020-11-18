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
                <fieldset className="govuk-fieldset flex-container time-restrictions-table" key={chosenDay}>
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s day-label govuk-grid-column-one-quarter">
                        {startCase(chosenDay)}
                    </legend>
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
                                        Start time <span className="govuk-visually-hidden">for {chosenDay}</span>
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
                                        End time <span className="govuk-visually-hidden">for {chosenDay}</span>
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
                </fieldset>
            ))}
        </>
    );
};

export default TimeRestrictionsTable;
