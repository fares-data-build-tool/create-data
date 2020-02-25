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

interface InputTags {
    outerDivFormGroupError: string;
    outerDivInputError: string;
    errorSpan: JSX.Element;
    inputFieldError: string;
    fareStageNameError: string;
    defaultValue: string;
}

type StageNameProps = {
    numberOfFareStages: string;
    validationObject: InputCheck[];
};

export const defineInputFields = (index: number, inputTags: InputTags): ReactElement => {
    return (
        <React.Fragment key={index}>
            <div className={`govuk-form-group ${inputTags.outerDivFormGroupError} ${inputTags.outerDivInputError}`}>
                <label className="govuk-label" htmlFor={`fareStageName${index}`}>
                    Fare Stage {index}
                </label>
                {inputTags.errorSpan}
                <input
                    className={`govuk-input govuk-input--width-30 ${inputTags.inputFieldError} stage-name-input-field`}
                    id={`fareStageName${index}`}
                    name="stageNameInput"
                    type="text"
                    maxLength={30}
                    defaultValue={inputTags.defaultValue}
                    aria-describedby={inputTags.fareStageNameError}
                />
            </div>
        </React.Fragment>
    );
};

export const generateInputFields = (numberOfFareStages: string, validationObject: InputCheck[]): ReactElement[] => {
    const iteratorLimit = Number(numberOfFareStages) + 1;
    const elements: ReactElement[] = [];
    if (validationObject === undefined || validationObject.length === 0) {
        for (let i = 1; i < iteratorLimit; i += 1) {
            const inputTags = {
                outerDivFormGroupError: '',
                outerDivInputError: '',
                errorSpan: <div />,
                inputFieldError: '',
                fareStageNameError: '',
                defaultValue: '',
            };
            elements.push(defineInputFields(i, inputTags));
        }
    } else {
        for (let i = 1; i < iteratorLimit; i += 1) {
            if (validationObject[i - 1].Valid === false) {
                const inputTags = {
                    outerDivFormGroupError: 'govuk-form-group--error',
                    outerDivInputError: 'input-error',
                    errorSpan: (
                        <span id={`fareStageName${i}-error`} className="govuk-error-message">
                            <span className="govuk-visually-hidden">Error:</span> {validationObject[i - 1].Error}
                        </span>
                    ),
                    inputFieldError: 'govuk-input--error',
                    fareStageNameError: `fareStageName${i}-error`,
                    defaultValue: '',
                };
                elements.push(defineInputFields(i, inputTags));
            } else {
                const inputTags = {
                    outerDivFormGroupError: '',
                    outerDivInputError: '',
                    errorSpan: <div />,
                    inputFieldError: '',
                    fareStageNameError: '',
                    defaultValue: `${validationObject[i - 1].Input}`,
                };
                elements.push(defineInputFields(i, inputTags));
            }
        }
    }
    return elements;
};

export const StageNames = ({ numberOfFareStages, validationObject }: StageNameProps): ReactElement => (
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
                        <div>{generateInputFields(numberOfFareStages, validationObject)}</div>
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
