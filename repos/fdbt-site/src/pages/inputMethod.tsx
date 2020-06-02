import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import TwoThirdsLayout from '../layout/Layout';
import { ErrorInfo } from '../types';
import { INPUT_METHOD_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'Input Method - Fares Data Build Tool';
const description = 'Input Method selection page of the Fares Data Build Tool';

const errorId = 'input-method-error';

type InputMethodProps = {
    errors: ErrorInfo[];
};

const InputMethod = ({ errors = [] }: InputMethodProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <form action="/api/inputMethod" method="post">
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
                                    className={`govuk-radios__input ${errors.length > 0 ? 'govuk-input--error' : ''} `}
                                    id="csv-upload"
                                    name="inputMethod"
                                    type="radio"
                                    value="csv"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="csv-upload">
                                    Upload (.csv)
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className={`govuk-radios__input ${errors.length > 0 ? 'govuk-input--error' : ''} `}
                                    id="manual-entry"
                                    name="inputMethod"
                                    type="radio"
                                    value="manual"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="manual-entry">
                                    Manual Fares Triangle input
                                </label>
                            </div>
                            <div className="govuk-radios__item">
                                <input
                                    className={`govuk-radios__input ${errors.length > 0 ? 'govuk-input--error' : ''} `}
                                    id="interactive-map"
                                    name="inputMethod"
                                    type="radio"
                                    value="interactiveMap"
                                    disabled
                                    aria-disabled="true"
                                />
                                <label className="govuk-label govuk-radios__label" htmlFor="interactive-map">
                                    Interactive Map (not yet available)
                                </label>
                            </div>
                        </div>
                    </FormElementWrapper>
                </fieldset>
            </div>
            <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
        </form>
    </TwoThirdsLayout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[INPUT_METHOD_COOKIE]) {
        const inputMethodCookie = cookies[INPUT_METHOD_COOKIE];
        const parsedInputMethodCookie = JSON.parse(inputMethodCookie);

        if (parsedInputMethodCookie.errorMessage) {
            const { errorMessage } = parsedInputMethodCookie;
            deleteCookieOnServerSide(ctx, INPUT_METHOD_COOKIE);
            return { props: { errors: [{ errorMessage, id: errorId }] } };
        }
    }

    return { props: {} };
};

export default InputMethod;
