import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
// import { parseCookies } from 'nookies';

import Layout from '../layout/Layout';
import { STAGE_NAMES_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import { redirectToError } from './api/apiUtils';

const title = 'Stage Names - Fares data build tool';
const description = 'Stage Names page of the Fares data build tool';

type StageNameProps = {
    numberOfFareStages: number;
};

const generateInputFields = (numberOfFareStages: number): ReactElement => {
    const elements = [];
    for (let i = 1; i < numberOfFareStages + 1; i += 1) {
        elements.push(
            <label className="govuk-label" htmlFor={`StageNameForFareStage${i}`}>
                Fare Stage {i}
            </label>,
            <input
                className="govuk-input"
                id={`StageNameForFareStage${i}`}
                name={`StageNameForFareStage${i}`}
                type="text"
                maxLength={20}
                required
                width={2}
            />,
        );
    }
    console.log(numberOfFareStages);
    return <div className="govuk-form-group">{elements}</div>;
};

const StageNames = ({ numberOfFareStages }: StageNameProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/stageNames" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="selection-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">
                                Please enter the names of your fare stages in order
                            </h1>
                        </legend>
                        {generateInputFields(numberOfFareStages)}
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
    // const cookies = parseCookies(ctx);
    const fareStagesCookie = 14;
    // const fareStagesCookie = cookies[FARE_STAGES_COOKIE];

    if (fareStagesCookie) {
        // const fareStagesObject = JSON.parse(fareStagesCookie);
        // const numberOfFareStages = fareStagesObject.fareStages;
        const numberOfFareStages = fareStagesCookie;

        return { numberOfFareStages };
    }

    if (ctx.res) {
        redirectToError(ctx.res);
    }

    return {};
};

export default StageNames;
