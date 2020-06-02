import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { NUMBER_OF_PRODUCTS_COOKIE } from '../constants';
import { deleteCookieOnServerSide, buildTitle } from '../utils';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo } from '../types';
import FormElementWrapper from '../components/FormElementWrapper';

const title = 'How Many Products - Fares Data Build Tool';
const description = 'How Many Products entry page of the Fares Data Build Tool';

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
                <div className={`govuk-form-group${inputCheck?.error ? ' govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="page-heading">
                                How many period tickets do you have for the selected services?
                            </h1>
                        </legend>
                        <label className="govuk-hint" htmlFor="numberOfProducts">
                            Enter the number of period tickets below. Up to a maximum of 10 at once.
                        </label>
                        <FormElementWrapper
                            errors={errors}
                            errorId="how-many-products-error"
                            errorClass="govuk-input--error"
                        >
                            <input
                                className="govuk-input govuk-input--width-2"
                                id="numberOfProducts"
                                name="numberOfProductsInput"
                                type="text"
                                defaultValue={!inputCheck?.error ? inputCheck?.numberOfProductsInput : ''}
                                aria-describedby={inputCheck?.error ? `numberOfProducts-error` : ''}
                            />
                        </FormElementWrapper>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </form>
        </main>
    </Layout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    let inputCheck: InputCheck = {};
    let errors: ErrorInfo[] = [];

    if (cookies[NUMBER_OF_PRODUCTS_COOKIE]) {
        const numberOfProductsCookie = cookies[NUMBER_OF_PRODUCTS_COOKIE];
        inputCheck = JSON.parse(numberOfProductsCookie);
        errors = inputCheck.error ? [{ errorMessage: inputCheck.error, id: 'how-many-products-error' }] : [];
    }

    deleteCookieOnServerSide(ctx, NUMBER_OF_PRODUCTS_COOKIE);

    return { props: { inputCheck, errors } };
};

export default HowManyProducts;
