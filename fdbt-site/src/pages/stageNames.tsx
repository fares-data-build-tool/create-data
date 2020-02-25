import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';

import Layout from '../layout/Layout';
import { FARE_STAGES_COOKIE, STAGE_NAMES_COOKIE, VALIDATION_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import { redirectToError } from './api/apiUtils';

const title = 'Stage Names - Fares data build tool';
const description = 'Stage Names page of the Fares data build tool';

export interface InputCheck {
    Valid: boolean;
    Error: string;
    Input: string;
}

type StageNameProps = {
    numberOfFareStages: string;
    validationObject: InputCheck[];
};

const generateInputFields = (numberOfFareStages: string, validationObject: InputCheck[]): ReactElement[] => {
    const iteratorLimit = Number(numberOfFareStages) + 1;
    const elements = [];
    if (validationObject === undefined || validationObject.length === 0) {
        for (let i = 1; i < iteratorLimit; i += 1) {
            elements.push(
                <React.Fragment key="i">
                    <label className="govuk-label" htmlFor={`fareStageName${i}`}>
                        Fare Stage {i}
                    </label>
                    <input
                        className="govuk-input govuk-input--width-30 stage-name-input-field"
                        id={`fareStageName${i}`}
                        name="stageNameInput"
                        type="text"
                        maxLength={30}
                    />
                </React.Fragment>,
            );
        }
    } else {
        for (let i = 1; i < iteratorLimit; i += 1) {
            if (validationObject[i - 1].Valid === false) {
                elements.push(
                    <React.Fragment key="i">
                        <div className="govuk-form-group--error">
                            <label className="govuk-label" htmlFor={`fareStageName${i}`}>
                                Fare Stage {i}
                            </label>
                            <span id={`fareStageName${i}-error`} className="govuk-error-message">
                                <span className="govuk-visually-hidden">Error:</span> {validationObject[i - 1].Error}
                            </span>
                            <input
                                className="govuk-input govuk-input--width-30 govuk-input--error stage-name-input-field"
                                id={`fareStageName${i}`}
                                name="stageNameInput"
                                type="text"
                                maxLength={30}
                                aria-describedby={`fareStageName${i}-error`}
                            />
                        </div>
                    </React.Fragment>,
                );
            } else {
                elements.push(
                    <React.Fragment key="i">
                        <label className="govuk-label" htmlFor={`fareStageName${i}`}>
                            Fare Stage {i}
                        </label>
                        <input
                            className="govuk-input govuk-input--width-30 stage-name-input-field"
                            id={`fareStageName${i}`}
                            name="stageNameInput"
                            type="text"
                            maxLength={30}
                            defaultValue={validationObject[i - 1].Input}
                        />
                    </React.Fragment>,
                );
            }
        }
    }
    return elements;
};

const StageNames = ({ numberOfFareStages, validationObject }: StageNameProps): ReactElement => (
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
                        <div className="govuk-form-group">
                            {generateInputFields(numberOfFareStages, validationObject)}
                        </div>
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

StageNames.getInitialProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const fareStagesCookie = cookies[FARE_STAGES_COOKIE];
    let validationObject: InputCheck[] = [];
    if (cookies[VALIDATION_COOKIE]) {
        const validationCookie = cookies[VALIDATION_COOKIE];
        validationObject = JSON.parse(validationCookie);
        deleteCookieOnServerSide(ctx, VALIDATION_COOKIE);
    }

    deleteCookieOnServerSide(ctx, STAGE_NAMES_COOKIE);

    if (fareStagesCookie && validationObject) {
        const fareStagesObject = JSON.parse(fareStagesCookie);
        const numberOfFareStages = fareStagesObject.fareStages;

        return { numberOfFareStages, validationObject };
    }

    if (ctx.res) {
        redirectToError(ctx.res);
    }

    return {};
};

export default StageNames;
