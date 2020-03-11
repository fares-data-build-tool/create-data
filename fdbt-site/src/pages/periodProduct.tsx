import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, PERIOD_PRODUCT } from '../constants';
import { PeriodProductType } from '../interfaces';

const title = 'FareType - Fares data build tool';
const description = 'Fare Type selection page of the Fares data build tool';

type PeriodProduct = {
    product: PeriodProductType;
    operator: string;
};

const PeriodProduct = ({ product, operator }: PeriodProduct): ReactElement => {
    const productName = product && product.productName;
    const productPrice = product && product.productPrice;
    const productNameError = product && product.productNameError;
    const productPriceError = product && product.productPriceError;

    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/periodProduct" method="post">
                    <fieldset className="govuk-fieldset" aria-describedby="period-product-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" id="period-product-page-heading">
                                Enter your product details
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="service-operator-hint">
                            {operator}
                        </span>
                    </fieldset>
                    <div className={`govuk-form-group ${productNameError ? 'govuk-form-group--error' : ''}`}>
                        <label className="govuk-label" htmlFor="periodProductName">
                            Product Name
                        </label>
                        <span id="product-price-error" className="govuk-error-message">
                            <span className={productNameError ? '' : 'govuk-visually-hidden'}>
                                Product name is a required field
                            </span>
                        </span>
                        <input
                            className={`govuk-input govuk-input--width-30 stage-name-input-field govuk-currency-input__inner__input ${
                                productNameError ? 'govuk-input--error' : ''
                            } `}
                            id="periodProductName"
                            name="periodProductNameInput"
                            type="text"
                            maxLength={30}
                            defaultValue={productName}
                        />
                    </div>
                    <div className={`govuk-form-group ${productPriceError ? 'govuk-form-group--error' : ''}`}>
                        <label className="govuk-label" htmlFor="periodProductName">
                            Product Price
                        </label>
                        <span className="govuk-hint" id="product-price-hint">
                            Please enter the price in pence for example £1.20 would be 120
                        </span>
                        <span id="product-price-error" className="govuk-error-message">
                            <span className={productPriceError ? '' : 'govuk-visually-hidden'}>
                                Product price is a required field
                            </span>
                        </span>
                        <input
                            className={`govuk-input govuk-input--width-10 govuk-currency-input__inner__input ${
                                productPriceError ? 'govuk-input--error' : ''
                            } `}
                            id="periodProductPrice"
                            name="periodProductPriceInput"
                            type="number"
                            defaultValue={productPrice}
                        />
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

PeriodProduct.getInitialProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const periodProductCookie = cookies[PERIOD_PRODUCT];
    const operatorCookie = cookies[OPERATOR_COOKIE];

    if (!operatorCookie) {
        throw new Error('Failed to retrieve fareStageCookie info for Stage Names page.');
    }

    if (!periodProductCookie) {
        return {};
    }

    const operatorObject = JSON.parse(operatorCookie);

    return {
        product: JSON.parse(periodProductCookie),
        operator: operatorObject.operator,
    };
};

export default PeriodProduct;
