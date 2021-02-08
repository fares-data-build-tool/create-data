import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { INPUT_METHOD_ATTRIBUTE } from '../constants';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import CsrfForm from '../components/CsrfForm';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { inputMethodErrorsExist } from '../interfaces/typeGuards';
import { getCsrfToken } from '../utils';

const title = 'Input Method - Create Fares Data Service';
const description = 'Input Method selection page of the Create Fares Data Service';

const errorId = 'csv-upload';

interface InputMethodProps {
    errors: ErrorInfo[];
    csrfToken: string;
}

const InputMethod = ({ errors = [], csrfToken }: InputMethodProps): ReactElement => (
    <BaseLayout title={title} description={description} errors={errors}>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <CsrfForm action="/api/inputMethod" method="post" csrfToken={csrfToken}>
                    <>
                        <ErrorSummary errors={errors} />
                        <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                            <fieldset className="govuk-fieldset" aria-describedby="input-method-heading">
                                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                    <h1 id="input-method-heading" className="govuk-fieldset__heading">
                                        Select an input method
                                    </h1>
                                </legend>
                                <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                                    <div className="govuk-radios" id="radio-buttons">
                                        <div className="govuk-radios__item">
                                            <input
                                                className={`govuk-radios__input ${
                                                    errors.length > 0 ? 'govuk-input--error' : ''
                                                } `}
                                                id="csv-upload"
                                                name="inputMethod"
                                                type="radio"
                                                value="csv"
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="csv-upload">
                                                Upload a fares triangle (CSV)
                                            </label>
                                        </div>
                                        <div className="govuk-radios__item">
                                            <input
                                                className={`govuk-radios__input ${
                                                    errors.length > 0 ? 'govuk-input--error' : ''
                                                } `}
                                                id="manual-entry"
                                                name="inputMethod"
                                                type="radio"
                                                value="manual"
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="manual-entry">
                                                Manual fares triangle input
                                            </label>
                                        </div>
                                        <div className="govuk-radios__item">
                                            <input
                                                className={`govuk-radios__input ${
                                                    errors.length > 0 ? 'govuk-input--error' : ''
                                                } `}
                                                id="interactive-map"
                                                name="inputMethod"
                                                type="radio"
                                                value="interactiveMap"
                                                disabled
                                                aria-disabled="true"
                                            />
                                            <label
                                                className="govuk-label govuk-radios__label"
                                                htmlFor="interactive-map"
                                            >
                                                Interactive Map (not yet available)
                                            </label>
                                        </div>
                                    </div>
                                </FormElementWrapper>
                            </fieldset>
                        </div>
                        <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                    </>
                </CsrfForm>
            </div>
            <div className="govuk-grid-column-one-third">
                <h3 className="govuk-heading-s">What is a CSV?</h3>
                <p className="govuk-body">
                    CSV stands for Comma Separated Values. A CSV file is a popular format for publishing data on the
                    web. They are plain text files which means they can contain numbers and letters only. Most
                    spreadsheet software (Microsoft Excel, Google Sheets etc.) will have a <b>.csv</b>, <b>.xlsx</b> or{' '}
                    <b>.xls</b> option when saving your data. This is the easiest way to turn your spreadsheet into a
                    CSV file.
                </p>
            </div>
        </div>
    </BaseLayout>
);

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: InputMethodProps } => {
    const csrfToken = getCsrfToken(ctx);
    const inputMethodInfo = getSessionAttribute(ctx.req, INPUT_METHOD_ATTRIBUTE);
    updateSessionAttribute(ctx.req, INPUT_METHOD_ATTRIBUTE, undefined);
    return {
        props: {
            errors: inputMethodInfo && inputMethodErrorsExist(inputMethodInfo) ? [inputMethodInfo] : [],
            csrfToken,
        },
    };
};

export default InputMethod;
