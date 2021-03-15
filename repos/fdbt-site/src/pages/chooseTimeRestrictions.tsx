import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, NextPageContextWithSession, TimeRestriction, TimeInput } from '../interfaces';
import TimeRestrictionsTable from '../components/TimeRestrictionsTable';
import { getCsrfToken } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE, FULL_TIME_RESTRICTIONS_ATTRIBUTE } from '../constants/attributes';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'Choose time restrictions - Create Fares Data Service ';
const description = 'Choose time restrictions page of the Create Fares Data Service';

interface ChooseTimeRestrictionsProps {
    chosenDays: string[];
    errors: ErrorInfo[];
    csrfToken: string;
    startTimeInputs: TimeInput[];
    endTimeInputs: TimeInput[];
    dayCounters: {
        day: string;
        counter: number;
    }[];
}

const ChooseTimeRestrictions = ({
    chosenDays,
    errors,
    startTimeInputs,
    endTimeInputs,
    dayCounters = [],
    csrfToken,
}: ChooseTimeRestrictionsProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={errors}>
            <CsrfForm action="/api/chooseTimeRestrictions" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />

                    <h1 className="govuk-heading-l">Tell us more about the time restrictions</h1>
                    <span className="govuk-hint">
                        Enter the times at which your ticket(s) start and end, if applicable. If they are valid at all
                        times, leave them blank. You can leave them all blank, if needed, but you cannot enter an end
                        time without a start time.
                    </span>
                    <div className="govuk-inset-text" id="time-restrictions-hint">
                        Enter times in 24hr format. For example 0900 is 9am, 1730 is 5:30pm.
                    </div>
                    <TimeRestrictionsTable
                        chosenDays={chosenDays}
                        errors={errors}
                        startTimeInputs={startTimeInputs}
                        endTimeInputs={endTimeInputs}
                        dayCounters={dayCounters}
                    />
                    <label id="save-time-restriction-label" className="govuk-label" htmlFor="time-restrictions-name">
                        <i>
                            Optional - if you want to save this time restriction for reuse on other products, provide a
                            name below
                        </i>
                    </label>
                    <FormElementWrapper errors={errors} errorId="product-details-name" errorClass="govuk-input--error">
                        <input
                            className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                            id="time-restrictions-name"
                            name="timeRestrictionName"
                            type="text"
                            maxLength={50}
                        />
                    </FormElementWrapper>

                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button continue-button-placement"
                    />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: ChooseTimeRestrictionsProps } => {
    const csrfToken = getCsrfToken(ctx);
    const chosenDaysAttribute: TimeRestriction = getSessionAttribute(
        ctx.req,
        TIME_RESTRICTIONS_DEFINITION_ATTRIBUTE,
    ) as TimeRestriction;
    const fullTimeRestrictionsAttribute = getSessionAttribute(ctx.req, FULL_TIME_RESTRICTIONS_ATTRIBUTE);

    if (!chosenDaysAttribute || !chosenDaysAttribute.validDays || chosenDaysAttribute.validDays.length === 0) {
        throw new Error('Necessary list of days not found to render page.');
    }
    const chosenDays = chosenDaysAttribute.validDays;

    const errors: ErrorInfo[] = [];
    const startTimeInputs: TimeInput[] = [];
    const endTimeInputs: TimeInput[] = [];
    const dayCounters: {
        day: string;
        counter: number;
    }[] = [];

    if (fullTimeRestrictionsAttribute) {
        if (fullTimeRestrictionsAttribute.errors.length > 0) {
            fullTimeRestrictionsAttribute.errors.forEach(error => errors.push(error));
        }

        if (fullTimeRestrictionsAttribute.fullTimeRestrictions.length > 0) {
            fullTimeRestrictionsAttribute.fullTimeRestrictions.forEach(fullTimeRestriction => {
                fullTimeRestriction.timeBands.forEach(timeBand => {
                    startTimeInputs.push({ timeInput: timeBand.startTime, day: fullTimeRestriction.day });
                    endTimeInputs.push({ timeInput: timeBand.endTime, day: fullTimeRestriction.day });
                });
                dayCounters.push({
                    day: fullTimeRestriction.day,
                    counter: fullTimeRestriction.timeBands.length > 0 ? fullTimeRestriction.timeBands.length : 1,
                });
            });
        }
    }
    return {
        props: { chosenDays, errors, csrfToken, startTimeInputs, endTimeInputs, dayCounters },
    };
};

export default ChooseTimeRestrictions;
