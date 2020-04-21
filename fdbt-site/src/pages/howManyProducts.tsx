import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { NUMBER_OF_PRODUCTS_COOKIE } from '../constants';
import { deleteCookieOnServerSide, buildTitle } from '../utils';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo } from '../types';

const title = 'How Many Products - Fares data build tool';
const description = 'How many products page of the Fares data build tool';

export interface InputCheck {
    error?: string;
    numberOfProductsInput?: string;
}

interface HowManyProductProps {
    inputCheck: InputCheck;
    errors: ErrorInfo[];
}

const HowManyProducts = ({ inputCheck, errors }: HowManyProductProps): ReactElement => (
    <Layout title={buildTitle(errors, title)} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/howManyProducts" method="post">
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group${inputCheck?.error ? ' govuk-form-group--error input-error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="page-heading">
                                How many products do you have for this zone or selected services?
                            </h1>
                        </legend>
                        <label className="govuk-label" htmlFor="numberOfProducts">
                            Number of fare products (up to a maximum of 10)
                        </label>
                        {inputCheck?.error ? (
                            <span id="numberOfProducts-error" className="govuk-error-message">
                                <span className="govuk-visually-hidden">Error:</span> {inputCheck.error}
                            </span>
                        ) : null}
                        <input
                            className={`govuk-input govuk-input--width-2 ${
                                inputCheck?.error ? 'govuk-input--error' : ''
                            }`}
                            id="numberOfProducts"
                            name="numberOfProductsInput"
                            type="text"
                            defaultValue={!inputCheck?.error ? inputCheck?.numberOfProductsInput : ''}
                            aria-describedby={inputCheck?.error ? `numberOfProducts-error` : ''}
                        />
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

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    deleteCookieOnServerSide(ctx, NUMBER_OF_PRODUCTS_COOKIE);

    let inputCheck: InputCheck = {};
    let errors: ErrorInfo[] = [];
    if (cookies[NUMBER_OF_PRODUCTS_COOKIE]) {
        const numberOfProductsCookie = cookies[NUMBER_OF_PRODUCTS_COOKIE];
        inputCheck = JSON.parse(numberOfProductsCookie);
        errors = [{ errorMessage: inputCheck.error ? inputCheck.error : '', id: 'page-heading' }];
    }
    return { props: { inputCheck, errors } };
};

export default HowManyProducts;
