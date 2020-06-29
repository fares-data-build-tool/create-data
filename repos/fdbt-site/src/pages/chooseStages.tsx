import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';
import { deleteCookieOnServerSide } from '../utils';
import { FARE_STAGES_COOKIE } from '../constants';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps, ErrorInfo } from '../interfaces';

const title = 'Choose Stages - Fares Data Build Tool';
const description = 'Choose Stages page of the Fares Data Build Tool';

export interface ChooseStagesInputCheck {
    error?: string;
    numberOfStagesInput?: string;
}

interface ChooseStagesProps {
    inputCheck: ChooseStagesInputCheck;
    errors: ErrorInfo[];
}

const ChooseStages = ({ inputCheck, errors, csrfToken }: ChooseStagesProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <CsrfForm action="/api/chooseStages" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group${inputCheck?.error ? ' govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="choose-stages-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="choose-stages-page-heading">
                                How many fare stages does the service have?
                            </h1>
                        </legend>

                        <label className="govuk-hint" htmlFor="fare-stages" id="fare-stage-hint">
                            Enter the number of fare stages between 2 - 20 (for example 3)
                        </label>
                        <FormElementWrapper
                            errors={errors}
                            errorId="how-many-stages-error"
                            errorClass="govuk-input--error"
                        >
                            <input
                                className="govuk-input govuk-input--width-2"
                                id="fare-stages"
                                name="fareStageInput"
                                type="text"
                                defaultValue={!inputCheck?.error ? inputCheck?.numberOfStagesInput : ''}
                                aria-describedby="fare-stage-hint"
                            />
                        </FormElementWrapper>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    let inputCheck: ChooseStagesInputCheck = {};
    let errors: ErrorInfo[] = [];

    if (cookies[FARE_STAGES_COOKIE]) {
        const numberOfFareStagesCookie = cookies[FARE_STAGES_COOKIE];
        inputCheck = JSON.parse(numberOfFareStagesCookie);
        errors = inputCheck.error ? [{ errorMessage: inputCheck.error, id: 'how-many-stages-error' }] : [];
    }

    deleteCookieOnServerSide(ctx, FARE_STAGES_COOKIE);

    return { props: { inputCheck, errors } };
};

export default ChooseStages;
