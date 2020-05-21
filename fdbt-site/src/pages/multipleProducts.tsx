import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import {
    OPERATOR_COOKIE,
    NUMBER_OF_PRODUCTS_COOKIE,
    MULTIPLE_PRODUCT_COOKIE,
    PASSENGER_TYPE_COOKIE,
} from '../constants';
import ProductRow from '../components/ProductRow';
import { ErrorInfo } from '../types';
import ErrorSummary from '../components/ErrorSummary';
import { MultiProduct } from './api/multipleProducts';
import { unescapeAndDecodeCookieServerSide } from '../utils';

const title = 'Multiple Product - Fares Data Build Tool';
const description = 'Multiple Product entry page of the Fares Data Build Tool';

export interface MultipleProductProps {
    numberOfProductsToDisplay: string;
    nameOfOperator: string;
    passengerType: string;
    errors?: ErrorInfo[];
    userInput: MultiProduct[];
}

const MultipleProducts = ({
    numberOfProductsToDisplay,
    nameOfOperator,
    passengerType,
    errors = [],
    userInput = [],
}: MultipleProductProps): ReactElement => {
    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/multipleProducts" method="post">
                    <ErrorSummary errors={errors} />
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="multiple-product-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="multiple-product-page-heading">
                                    Enter your product details
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="service-operator-hint">
                                {nameOfOperator} - {numberOfProductsToDisplay} Products - {passengerType}
                            </span>
                        </fieldset>
                        <div className="govuk-inset-text">For example, Super Saver ticket - £4.95 - 2</div>
                    </div>
                    <div className="govuk-grid-row">
                        <ProductRow
                            numberOfProductsToDisplay={numberOfProductsToDisplay}
                            errors={errors}
                            userInput={userInput}
                        />
                    </div>
                </form>
            </main>
        </Layout>
    );
};

export const getServerSideProps = (ctx: NextPageContext): { props: MultipleProductProps } => {
    const cookies = parseCookies(ctx);

    if (!cookies[OPERATOR_COOKIE] || !cookies[NUMBER_OF_PRODUCTS_COOKIE] || !cookies[PASSENGER_TYPE_COOKIE]) {
        throw new Error('Necessary cookies not found to show multiple products page');
    }

    const operatorCookie = unescapeAndDecodeCookieServerSide(cookies, OPERATOR_COOKIE);
    const numberOfProductsCookie = unescapeAndDecodeCookieServerSide(cookies, NUMBER_OF_PRODUCTS_COOKIE);
    const passengerTypeInfo = JSON.parse(cookies[PASSENGER_TYPE_COOKIE]);

    const numberOfProductsToDisplay = JSON.parse(numberOfProductsCookie).numberOfProductsInput;
    const nameOfOperator: string = JSON.parse(operatorCookie).operator;

    if (cookies[MULTIPLE_PRODUCT_COOKIE]) {
        const multipleProductCookie = unescapeAndDecodeCookieServerSide(cookies, MULTIPLE_PRODUCT_COOKIE);
        const parsedMultipleProductCookie = JSON.parse(multipleProductCookie);
        const { errors } = parsedMultipleProductCookie;

        if (errors && errors.length > 0) {
            return {
                props: {
                    numberOfProductsToDisplay,
                    nameOfOperator,
                    passengerType: passengerTypeInfo.passengerType,
                    errors: parsedMultipleProductCookie.errors,
                    userInput: parsedMultipleProductCookie.userInput,
                },
            };
        }
    }

    return {
        props: {
            numberOfProductsToDisplay,
            nameOfOperator,
            passengerType: passengerTypeInfo.passengerType,
            userInput: [],
        },
    };
};

export default MultipleProducts;
