import React, { ReactElement } from 'react';
import { FARE_STAGES_ATTRIBUTE } from '../constants';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { isFareStageWithErrors } from '../interfaces/typeGuards';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { FareStagesAttribute } from './api/chooseStages';

const title = 'Choose Stages - Create Fares Data Service';
const description = 'Choose Stages page of the Create Fares Data Service';

interface ChooseStagesProps {
    fareStage: FareStagesAttribute;
    errors: ErrorInfo[];
}

const ChooseStages = ({ fareStage, errors, csrfToken }: ChooseStagesProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <CsrfForm action="/api/chooseStages" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group${errors.length > 0 ? ' govuk-form-group--error' : ''}`}>
                    <label htmlFor="fare-stages">
                        <h1 className="govuk-heading-l" id="choose-stages-page-heading">
                            How many fare stages does the service have?
                        </h1>
                    </label>

                    <div className="govuk-hint" id="fare-stage-hint">
                        Enter the number of fare stages between 2 - 20 (for example 3)
                    </div>
                    <FormElementWrapper errors={errors} errorId="fare-stages" errorClass="govuk-input--error">
                        <input
                            className="govuk-input govuk-input--width-2"
                            id="fare-stages"
                            name="fareStageInput"
                            type="text"
                            defaultValue={errors.length === 0 && fareStage ? fareStage.fareStages : ''}
                            aria-describedby="fare-stage-hint"
                        />
                    </FormElementWrapper>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): {} => {
    let errors: ErrorInfo[] = [];

    const fareStagesAttribute = getSessionAttribute(ctx.req, FARE_STAGES_ATTRIBUTE);

    if (isFareStageWithErrors(fareStagesAttribute)) {
        if (isFareStageWithErrors(fareStagesAttribute)) {
            errors = fareStagesAttribute.errors;
        }

        updateSessionAttribute(ctx.req, FARE_STAGES_ATTRIBUTE, undefined);
    }

    return { props: { fareStages: fareStagesAttribute || '', errors } };
};

export default ChooseStages;
