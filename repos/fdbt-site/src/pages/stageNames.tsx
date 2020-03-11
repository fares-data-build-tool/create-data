import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';

import Layout from '../layout/Layout';
import { FARE_STAGES_COOKIE, STAGE_NAMES_COOKIE, STAGE_NAME_VALIDATION_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';

const title = 'Stage Names - Fares data build tool';
const description = 'Stage Names page of the Fares data build tool';

export interface InputCheck {
    Error: string;
    Input: string;
}

type StageNameProps = {
    numberOfFareStages: number;
    inputChecks: InputCheck[];
};

export const renderInputField = (index: number, inputCheck: InputCheck): ReactElement => {
    return (
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
};

export const renderInputFields = (numberOfFareStages: number, inputChecks: InputCheck[]): ReactElement[] => {
    const elements: ReactElement[] = [];
    for (let i = 0; i < numberOfFareStages; i += 1) {
        elements.push(renderInputField(i, inputChecks[i]));
    }
    return elements;
};

const StageNames = ({ numberOfFareStages, inputChecks }: StageNameProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/stageNames" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="selection-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">
                                Please enter the names of your fare stages in order from first to last
                            </h1>
                            <p className="govuk-hint">Fare stage names are limited to 30 characters</p>
                        </legend>
                        <div>{renderInputFields(numberOfFareStages, inputChecks)}</div>
                    </fieldset>
                </div>
                <input
                    type="submit"
                    value="Continue"
                    id="continue-button"
                    className="govuk-button govuk-button--start"
                />
            </form>
        </main>
    </Layout>
);

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async (ctx: NextPageContext): Promise<{}> => {
    const cookies = parseCookies(ctx);
    const fareStagesCookie = cookies[FARE_STAGES_COOKIE];
    let inputChecks: InputCheck[] = [];
    if (cookies[STAGE_NAME_VALIDATION_COOKIE]) {
        const validationCookie = cookies[STAGE_NAME_VALIDATION_COOKIE];
        inputChecks = JSON.parse(validationCookie);
        // deleteCookieOnServerSide(ctx, STAGE_NAME_VALIDATION_COOKIE);
    }

    deleteCookieOnServerSide(ctx, STAGE_NAMES_COOKIE);

    if (fareStagesCookie) {
        const fareStagesObject = JSON.parse(fareStagesCookie);
        const numberOfFareStages = Number(fareStagesObject.fareStages);

        return { props: { numberOfFareStages, inputChecks } };
    }

    throw new Error('Failed to retrieve fareStageCookie info for Stage Names page.');
};

export default StageNames;
