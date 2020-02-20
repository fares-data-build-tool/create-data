import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';

import Layout from '../layout/Layout';
import { FARE_STAGES_COOKIE, STAGE_NAMES_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import { redirectToError } from './api/apiUtils';

const title = 'Stage Names - Fares data build tool';
const description = 'Stage Names page of the Fares data build tool';

type StageNameProps = {
    numberOfFareStages: string;
};

const generateInputFields = (numberOfFareStages: string): ReactElement[] => {
    const iteratorLimit = Number(numberOfFareStages) + 1;
    const elements = [];
    for (let i = 1; i < iteratorLimit; i += 1) {
        elements.push(
            <label className="govuk-hint" htmlFor={`fareStage${i}`}>
                Fare Stage {i}
            </label>,
            <input
                className="govuk-input govuk-input--width-30"
                id={`fareStage${i}`}
                name={`fareStage${i}`}
                type="text"
                maxLength={20}
                required
            />,
        );
    }
    return elements;
};

const StageNames = ({ numberOfFareStages }: StageNameProps): ReactElement => (
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
                        <div className="govuk-form-group">{generateInputFields(numberOfFareStages)}</div>
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
    deleteCookieOnServerSide(ctx, STAGE_NAMES_COOKIE);
    const cookies = parseCookies(ctx);
    const fareStagesCookie = cookies[FARE_STAGES_COOKIE];
    console.log({ cookies });

    if (fareStagesCookie) {
        const fareStagesObject = JSON.parse(fareStagesCookie);
        const numberOfFareStages = fareStagesObject.fareStages;

        return { numberOfFareStages };
    }

    if (ctx.res) {
        redirectToError(ctx.res);
    }

    return {};
};

export default StageNames;
