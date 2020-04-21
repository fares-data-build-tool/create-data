import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { ErrorInfo } from '../types';
import { INPUT_METHOD_COOKIE } from '../constants';
import { deleteCookieOnServerSide, buildTitle } from '../utils';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'Input Method - Fares data build tool';
const description = 'Input method selection page of the Fares data build tool';

const errorId = 'input-method-error';

type InputMethodProps = {
    errors: ErrorInfo[];
};

const InputMethod = ({ errors = [] }: InputMethodProps): ReactElement => {
    return (
        <Layout title={buildTitle(errors, title)} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/inputMethod" method="post">
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="input-method-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 id="input-method-heading" className="govuk-fieldset__heading">
                                    Please select your preferred input method
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
                                            Upload (.csv)
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
                                            Manual Fares Triangle input
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
                                        <label className="govuk-label govuk-radios__label" htmlFor="interactive-map">
                                            Interactive Map (Beta)
                                        </label>
                                    </div>
                                </div>
                            </FormElementWrapper>
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
};

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);

    if (cookies[INPUT_METHOD_COOKIE]) {
        const inputMethodCookie = unescape(decodeURI(cookies[INPUT_METHOD_COOKIE]));
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
