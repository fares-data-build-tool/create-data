import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { FARE_STAGES_COOKIE, STAGE_NAMES_COOKIE, STAGE_NAME_VALIDATION_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps, ErrorInfo } from '../interfaces';
import FormElementWrapper from '../components/FormElementWrapper';
import ErrorSummary from '../components/ErrorSummary';

const title = 'Stage Names - Fares Data Build Tool';
const description = 'Stage Names entry page of the Fares Data Build Tool';

export interface InputCheck {
    error: string;
    input: string;
    id: string;
}

type StageNameProps = {
    numberOfFareStages: number;
    inputChecks: InputCheck[];
    errors: ErrorInfo[];
};

export const renderInputField = (index: number, inputCheck: InputCheck, errors: ErrorInfo[] = []): ReactElement => (
    <div
        className={`govuk-form-group${inputCheck?.error ? ' govuk-form-group--error' : ''}`}
        key={`fare-stage-name-${index + 1}`}
    >
        <label className="govuk-label" htmlFor={`fare-stage-name-${index + 1}`}>
            Fare Stage {index + 1}
        </label>
        <FormElementWrapper
            errors={errors}
            errorClass="govuk-input--error"
            errorId={`fare-stage-name-${index + 1}-error`}
        >
            <input
                className="govuk-input govuk-input--width-30 stage-name-input-field"
                id={`fare-stage-name-${index + 1}`}
                name="stageNameInput"
                type="text"
                defaultValue={!inputCheck?.error ? inputCheck?.input : ''}
                aria-describedby={inputCheck?.error ? `fareStageName${index + 1}-error` : ''}
            />
        </FormElementWrapper>
    </div>
);

export const renderInputFields = (
    numberOfFareStages: number,
    inputChecks: InputCheck[],
    errors: ErrorInfo[],
): ReactElement[] => {
    const elements: ReactElement[] = [];
    for (let i = 0; i < numberOfFareStages; i += 1) {
        elements.push(renderInputField(i, inputChecks[i], errors));
    }

    return elements;
};

const StageNames = ({
    numberOfFareStages,
    inputChecks,
    csrfToken,
    errors = [],
}: StageNameProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <CsrfForm action="/api/stageNames" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <fieldset className="govuk-fieldset" aria-describedby="stage-names-input">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading">
                            Enter the names of the fare stages in order from first to last
                        </h1>
                        <p className="govuk-hint">Fare stage names are limited to 30 characters</p>
                    </legend>
                    <div>{renderInputFields(numberOfFareStages, inputChecks, errors)}</div>
                </fieldset>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    deleteCookieOnServerSide(ctx, STAGE_NAMES_COOKIE);
    const cookies = parseCookies(ctx);
    const fareStagesCookie = cookies[FARE_STAGES_COOKIE];

    if (!fareStagesCookie) {
        throw new Error('Necessary fare stage cookie not found to show stage names page');
    }

    const fareStagesObject = JSON.parse(fareStagesCookie);
    const numberOfFareStages = Number(fareStagesObject.fareStages);

    let inputChecks: InputCheck[] = [];
    if (cookies[STAGE_NAME_VALIDATION_COOKIE]) {
        const validationCookie = cookies[STAGE_NAME_VALIDATION_COOKIE];
        inputChecks = JSON.parse(validationCookie);
    }

    if (inputChecks.length > 0) {
        const errors: ErrorInfo[] = [];
        inputChecks.forEach(inputCheck => {
            if (inputCheck.error !== '') {
                errors.push({ errorMessage: inputCheck.error, id: inputCheck.id });
            }
        });
        return { props: { numberOfFareStages, inputChecks, errors } };
    }

    return { props: { numberOfFareStages, inputChecks, errors: [] } };
};

export default StageNames;
