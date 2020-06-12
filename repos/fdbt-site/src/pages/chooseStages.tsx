import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps } from '../interfaces';

const title = 'Choose Stages - Fares Data Build Tool';
const description = 'Choose Stages page of the Fares Data Build Tool';

const ChooseStages = ({ csrfToken }: CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <CsrfForm action="/api/chooseStages" method="post" csrfToken={csrfToken}>
            <>
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="choose-stages-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="choose-stages-page-heading">
                                How many fare stages does the service have?
                            </h1>
                        </legend>

                        <div className="govuk-form-group">
                            <label className="govuk-hint" htmlFor="width-2">
                                Enter the number of fare stages between 1 - 20 (for example 3)
                            </label>
                            <input
                                className="govuk-input govuk-input--width-2"
                                id="fareStages"
                                name="fareStageInput"
                                type="number"
                                min="1"
                                max="20"
                                maxLength={2}
                                required
                                pattern="^[0-9]*$"
                            />
                        </div>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = (): {} => {
    return { props: {} };
};

export default ChooseStages;
