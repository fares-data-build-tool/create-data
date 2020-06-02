import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';

import TwoThirdsLayout from '../layout/Layout';
import { FARE_STAGES_COOKIE, STAGE_NAMES_COOKIE, STAGE_NAME_VALIDATION_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'Stage Names - Fares Data Build Tool';
const description = 'Stage Names entry page of the Fares Data Build Tool';

export interface InputCheck {
    Error: string;
    Input: string;
}

type StageNameProps = {
    numberOfFareStages: number;
    inputChecks: InputCheck[];
};

export const renderInputField = (index: number, inputCheck: InputCheck): ReactElement => (
    <div className={`govuk-form-group${inputCheck?.Error ? ' govuk-form-group--error input-error' : ''}`}>
        <label className="govuk-label" htmlFor={`fareStageName${index + 1}`}>
            Fare Stage {index + 1}
        </label>
        {inputCheck?.Error ? (
            <span id={`fareStageName${index + 1}-error`} className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span> {inputCheck.Error}
            </span>
        ) : null}
        <input
            className={`govuk-input govuk-input--width-30 ${
                inputCheck?.Error ? 'govuk-input--error' : ''
            } stage-name-input-field`}
            id={`fareStageName${index + 1}`}
            name="stageNameInput"
            type="text"
            maxLength={30}
            defaultValue={!inputCheck?.Error ? inputCheck?.Input : ''}
            aria-describedby={inputCheck?.Error ? `fareStageName${index + 1}-error` : ''}
        />
    </div>
);

export const renderInputFields = (numberOfFareStages: number, inputChecks: InputCheck[]): ReactElement[] => {
    const elements: ReactElement[] = [];

    for (let i = 0; i < numberOfFareStages; i += 1) {
        elements.push(renderInputField(i, inputChecks[i]));
    }

    return elements;
};

const StageNames = ({ numberOfFareStages, inputChecks }: StageNameProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <form action="/api/stageNames" method="post">
            <div className="govuk-form-group">
                <fieldset className="govuk-fieldset" aria-describedby="stage-names-input">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading">
                            Enter the names of the fare stages in order from first to last
                        </h1>
                        <p className="govuk-hint">Fare stage names are limited to 30 characters</p>
                    </legend>
                    <div>{renderInputFields(numberOfFareStages, inputChecks)}</div>
                </fieldset>
            </div>
            <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
        </form>
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

    return { props: { numberOfFareStages, inputChecks } };
};

export default StageNames;
